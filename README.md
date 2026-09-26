# CertFlow — Auto-Email Certificates Feature Version-2

## What it does
Instead of only generating certificates in bulk and letting users download a ZIP, CertFlow automatically emails each certificate directly to its recipient's email address.

## How it works
1. **Input**: Add an email column to the existing bulk input (CSV/form) alongside name and other fields.
2. **Generate**: Certificate generation logic stays the same — one file per row.
3. **Send**: For each recipient, call an email API to send their certificate (as an attachment or a download link).
4. **Email provider**: Use a transactional email service (not personal Gmail/Outlook) — e.g. **Brevo**.
5. **Track status**: Store sent/failed/bounced status per recipient (e.g. in Supabase) so failures can be identified and resent.
6. **Queue for scale**: For large batches, send emails via a background queue instead of one long synchronous loop, to avoid timeouts and rate limits.

## Why you can't just use your own email account
Gmail/Outlook block bulk automated sending from personal accounts (anti-spam protection). The actual flow is:

**Your App → Brevo's servers → Recipient's inbox**

Your personal email is never connected or used directly.

## Setup with Brevo
1. Create a Brevo account (separate from personal email).
2. Verify a **sender identity**:
   - Single email address (quick, but more likely flagged as spam), or
   - Full domain (e.g. `zabios.in`) via DNS records (SPF/DKIM) — better deliverability, recommended for production.
3. Call Brevo's API/SMTP relay from the FastAPI backend to send each certificate.

## Cost (as of 2026)
| Provider | Free tier | Paid |
|---|---|---|
| **Brevo** | 300 emails/day, permanent free | Paid tiers for higher volume |
| Resend | 3,000/month (100/day cap) | $20/month for 50,000 |
| Amazon SES | $200 AWS credit for new accounts (6 months) | $0.10 per 1,000 emails — cheapest at scale |
| SendGrid | No permanent free tier; 60-day trial only | $19.95–$89.95/month |

Brevo's free tier is likely enough for moderate use (event batches, agency clients with smaller volumes).

## Is it needed?
**Pros:**
- Removes manual distribution step — more "platform" feel, less script-like
- Recipients get only their own certificate, not a shared ZIP
- Differentiator vs. free tools that only export a ZIP

**Cons / added complexity:**
- Domain verification (SPF/DKIM/DMARC) needed for good deliverability
- Need to handle bounces/typo'd emails
- Slightly more moving parts than a simple ZIP download

**Verdict:** Worth adding if CertFlow is meant to be used by others (event organizers, colleges, agency clients) rather than just personal one-off use — it's the difference between a utility script and a real product feature.