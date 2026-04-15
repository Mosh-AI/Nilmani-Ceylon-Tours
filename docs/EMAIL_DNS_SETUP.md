# Email DNS Setup for Nilmani Ceylon Tours

Step-by-step guide to configure SPF, DKIM, and DMARC records for transactional email via **Resend**, managed through **Cloudflare DNS**.

## Prerequisites

- Domain: `nilmaniceylontours.com` (or your production domain)
- Cloudflare account with the domain added
- Resend account at https://resend.com

---

## Step 1: Verify Your Domain in Resend

1. Log in to [Resend Dashboard](https://resend.com/domains)
2. Click **Add Domain**
3. Enter `nilmaniceylontours.com`
4. Resend will display the DNS records you need to add (covered below)

---

## Step 2: Add SPF Record

SPF (Sender Policy Framework) tells receiving mail servers which servers are allowed to send email on behalf of your domain.

| Field    | Value                                              |
|----------|----------------------------------------------------|
| Type     | `TXT`                                              |
| Name     | `@`                                                |
| Content  | `v=spf1 include:send.resend.com ~all`              |
| TTL      | Auto                                               |
| Proxy    | DNS only (grey cloud)                              |

**In Cloudflare:**
1. Go to DNS > Records > Add Record
2. Select Type: TXT
3. Name: `@`
4. Content: `v=spf1 include:send.resend.com ~all`
5. Click Save

> **Note:** If you already have an SPF record (e.g., for Google Workspace), merge them into one record:
> `v=spf1 include:_spf.google.com include:send.resend.com ~all`

---

## Step 3: Add DKIM Records

DKIM (DomainKeys Identified Mail) adds a cryptographic signature to outgoing emails. Resend provides the specific DKIM records when you add your domain.

Resend typically provides 3 CNAME records:

| Field    | Value                                                         |
|----------|---------------------------------------------------------------|
| Type     | `CNAME`                                                       |
| Name     | `resend._domainkey`                                           |
| Target   | *(Copy from Resend dashboard)*                                |
| TTL      | Auto                                                          |
| Proxy    | DNS only (grey cloud)                                         |

**In Cloudflare:**
1. Add each CNAME record exactly as shown in the Resend dashboard
2. Make sure **Proxy status** is set to **DNS only** (grey cloud icon) for all DKIM records
3. CNAME flattening must be off for these records

> **Important:** Do NOT enable Cloudflare proxy (orange cloud) for DKIM records. Email DNS records must not be proxied.

---

## Step 4: Add DMARC Record

DMARC (Domain-based Message Authentication, Reporting, and Conformance) tells receiving servers what to do when SPF/DKIM checks fail.

| Field    | Value                                                              |
|----------|--------------------------------------------------------------------|
| Type     | `TXT`                                                              |
| Name     | `_dmarc`                                                           |
| Content  | `v=DMARC1; p=quarantine; rua=mailto:dmarc@nilmaniceylontours.com`  |
| TTL      | Auto                                                               |

**Policy options:**
- `p=none` — Monitor only (start here if unsure)
- `p=quarantine` — Mark failures as spam (recommended after monitoring)
- `p=reject` — Block failures entirely (strictest)

**Recommended rollout:**
1. Start with `p=none` for 2-4 weeks to collect reports
2. Move to `p=quarantine` once you confirm legitimate mail passes
3. Optionally move to `p=reject` for maximum protection

---

## Step 5: Verify in Resend Dashboard

1. Go to [Resend Domains](https://resend.com/domains)
2. Click on your domain
3. Click **Verify DNS Records**
4. All three checks (SPF, DKIM, DMARC) should show green checkmarks
5. DNS propagation can take up to 48 hours, but usually completes within minutes on Cloudflare

---

## Step 6: Add Return-Path (Bounce Handling)

Resend may also require a return-path CNAME for bounce handling:

| Field    | Value                                              |
|----------|----------------------------------------------------|
| Type     | `CNAME`                                            |
| Name     | `bounces`                                          |
| Target   | `feedback-smtp.resend.com`                         |
| TTL      | Auto                                               |
| Proxy    | DNS only (grey cloud)                              |

---

## Environment Variables

Add to your `.env` (never commit this file):

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=hello@nilmaniceylontours.com
```

---

## Troubleshooting

### Records not verifying

- **Wait:** DNS propagation can take up to 48 hours (usually faster on Cloudflare)
- **Check proxy status:** All email-related DNS records must be **DNS only** (grey cloud), not proxied (orange cloud)
- **Check for duplicate SPF:** You can only have ONE SPF TXT record per domain. Merge multiple `include:` directives into a single record
- **CNAME conflicts:** If the root domain already has a CNAME, you cannot add another. This should not be an issue since DKIM uses subdomains

### Emails going to spam

1. Verify all 3 records (SPF, DKIM, DMARC) are green in Resend
2. Check your DMARC policy is not `p=none` (upgrade to `p=quarantine`)
3. Ensure your sending address matches the verified domain
4. Avoid spam trigger words in email subject/body
5. Use a custom FROM address (e.g., `hello@nilmaniceylontours.com`) not a generic one

### Testing email delivery

- Use [Mail Tester](https://www.mail-tester.com/) to check your email score
- Use [MXToolbox](https://mxtoolbox.com/SuperTool.aspx) to verify DNS records
- Send a test email from Resend dashboard to verify end-to-end

### Common Cloudflare pitfalls

- **Do NOT** enable "Proxied" (orange cloud) for any email DNS record
- If using Cloudflare Email Routing, ensure it does not conflict with Resend's records
- CNAME flattening at the apex can interfere with DKIM — keep DKIM on subdomains (which is the default)
