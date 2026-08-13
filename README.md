# DNS over HTTPS (DoH) for Vercel

A minimalist DNS-over-HTTPS proxy running on Vercel Edge Functions.

## Features

- ✅ RFC 8484 compliant DNS-over-HTTPS implementation
- ✅ Supports both GET and POST methods
- ✅ Wireformat and JSON API support
- ✅ CORS enabled for cross-origin requests
- ✅ Deployed on Vercel Edge for global low-latency
- ✅ Zero configuration required

## Deployment

1. **Deploy to Vercel:**
   - Click the Deploy button or push to your connected Git repository
   - Your DoH endpoint will be available at: `https://your-domain.vercel.app/api/dns-query`

2. **Use Your Custom Domain (Optional):**
   - Add a custom domain in your Vercel project settings
   - Your DoH endpoint will be: `https://your-domain.com/api/dns-query`

## Usage

### In Web Browsers

**Chrome/Edge/OpenWRT:**
1. Go to Settings → Privacy and security → Security
2. Enable "Use secure DNS"
3. Select "With custom provider"
4. Enter: `https://your-domain.vercel.app/api/dns-query`

**Firefox:**
1. Go to Settings → General → Network Settings
2. Enable "Enable DNS over HTTPS"
3. Select "Custom" and enter: `https://your-domain.vercel.app/api/dns-query`

### In Mobile Apps

- **Android (Intra, Nebulo):** Add custom DoH URL
- **iOS (DNSCloak):** Add custom DoH resolver


# Test with curl (GET method)
curl -H "accept: application/dns-json" \
  "https://your-domain.vercel.app/api/dns-query?name=example.com&type=A"

# Test with dig (POST method)
dig @1.1.1.1 example.com +https=your-domain.vercel.app/api/dns-query
\`\`\`

## Configuration

The upstream DNS provider can be changed in `app/api/dns-query/route.ts`:

\`\`\`typescript
// Change these URLs to use a different DoH provider:
const DOH_PROVIDER = 'https://security.cloudflare-dns.com/dns-query'
const DOH_JSON_PROVIDER = 'https://security.cloudflare-dns.com/dns-query'
\`\`\`

**Popular DoH Providers:**
- Cloudflare: `https://cloudflare-dns.com/dns-query`
- Google: `https://dns.google/dns-query`
- Quad9: `https://dns.quad9.net/dns-query`
- NextDNS: `https://dns.nextdns.io/YOUR_ID`

## API Endpoints

### GET Request (Wireformat)
\`\`\`
GET /api/dns-query?dns={base64url-encoded-dns-query}
Accept: application/dns-message
\`\`\`

### POST Request (Wireformat)
\`\`\`
POST /api/dns-query
Content-Type: application/dns-message
Body: {binary-dns-query}
\`\`\`

### GET Request (JSON API)
\`\`\`
GET /api/dns-query?name=example.com&type=A
Accept: application/dns-json
\`\`\`

## Why Use This?

- **Privacy:** Encrypt your DNS queries to prevent ISP tracking
- **Bypass Censorship:** If your ISP blocks known DoH providers, use your own
- **Custom Domain:** Use your own domain name for added privacy
- **Free Tier:** Vercel's free tier is generous for personal use
- **Global Edge Network:** Fast DNS resolution from anywhere in the world

## Technical Details

- **Runtime:** Vercel Edge Functions
- **Response Time:** ~50-200ms (depending on location)
- **Supported Standards:** RFC 8484 (DNS Queries over HTTPS)
- **CORS:** Enabled for browser compatibility
