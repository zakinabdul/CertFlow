import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedSpreadsheet {
  columns: string[];
  rows: Record<string, string>[];
  suggestedColumn: string;
  totalCount: number;
}

/**
 * Heuristics to find the best matching name column
 */
function findSuggestedNameColumn(headers: string[]): string {
  if (!headers.length) return '';
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  // Priority name patterns
  const patterns = ['name', 'full name', 'fullname', 'participant', 'recipient', 'student name', 'candidate', 'person'];
  for (const pattern of patterns) {
    const idx = lowerHeaders.findIndex((h) => h.includes(pattern));
    if (idx !== -1) return headers[idx];
  }

  // Default to first column
  return headers[0];
}

/**
 * Parses CSV or TSV file text
 */
export function parseCSVFile(file: File): Promise<ParsedSpreadsheet> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const columns = results.meta.fields || [];
        const rows = (results.data as Record<string, string>[]).filter((row) =>
          Object.values(row).some((val) => val && val.toString().trim().length > 0)
        );

        if (!columns.length && rows.length > 0) {
          const sample = rows[0];
          const detectedCols = Object.keys(sample);
          resolve({
            columns: detectedCols,
            rows,
            suggestedColumn: findSuggestedNameColumn(detectedCols),
            totalCount: rows.length
          });
          return;
        }

        resolve({
          columns,
          rows,
          suggestedColumn: findSuggestedNameColumn(columns),
          totalCount: rows.length
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Parses XLSX/XLS file using SheetJS
 */
export async function parseXLSXFile(file: File): Promise<ParsedSpreadsheet> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet, { header: 1 }) as unknown as string[][];

  if (!jsonData || jsonData.length === 0) {
    return { columns: [], rows: [], suggestedColumn: '', totalCount: 0 };
  }

  const rawHeaders = jsonData[0] || [];
  const columns = rawHeaders.map((h, i) => (h ? h.toString().trim() : `Column ${i + 1}`));
  
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < jsonData.length; i++) {
    const rowArray = jsonData[i];
    if (!rowArray || !rowArray.length) continue;

    const rowObj: Record<string, string> = {};
    let hasValue = false;

    columns.forEach((colName, colIdx) => {
      const cellVal = rowArray[colIdx] !== undefined ? String(rowArray[colIdx]).trim() : '';
      rowObj[colName] = cellVal;
      if (cellVal) hasValue = true;
    });

    if (hasValue) {
      rows.push(rowObj);
    }
  }

  return {
    columns,
    rows,
    suggestedColumn: findSuggestedNameColumn(columns),
    totalCount: rows.length
  };
}

/**
 * Sanitizes list of names: trims, removes empty lines, optionally dedupes
 */
export function sanitizeNamesList(rawText: string, removeDuplicates = false): string[] {
  if (!rawText) return [];
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (removeDuplicates) {
    return Array.from(new Set(lines));
  }
  return lines;
}
