# DNS over HTTPS (DoH) for Vercel

A lightweight, high-performance DNS-over-HTTPS proxy running on **Vercel Edge Functions**.

## Features

- ✅ Fully compliant with **RFC 8484**
- ✅ Supports both **GET** and **POST** methods
- ✅ Wireformat (`application/dns-message`) and JSON API support
- ✅ CORS enabled (works directly in browsers)
- ✅ Ultra-low latency thanks to Vercel's global Edge Network
- ✅ Zero configuration deployment
- ✅ Easy to use with custom domains

## Quick Start

1. Fork or clone this repository
2. Deploy to Vercel (one-click or via Git)
3. Your DoH resolver will be live at:  
   `https://your-project.vercel.app/api/dns-query`

## Usage Examples

### Browser Configuration

- **Chrome / Edge**: Settings → Privacy and security → Use secure DNS → Custom provider
- **Firefox**: Settings → Network Settings → Enable DNS over HTTPS → Custom

Enter your URL: `https://your-project.vercel.app/api/dns-query`

### Mobile Apps
- **Android**: Intra, Nebulo, etc.
- **iOS**: DNSCloak

### Test with curl
```bash
curl -H "accept: application/dns-json" \
  "https://your-project.vercel.app/api/dns-query?name=example.com&type=A"
```

### Test with dig
```bash
dig @your-project.vercel.app example.com +https
```

## Configuration

You can change the upstream DNS provider in `app/api/dns-query/route.ts`:

```ts
const DOH_UPSTREAM = 'https://security.cloudflare-dns.com/dns-query';
```

Popular options:
- Cloudflare (`security.cloudflare-dns.com`)
- Google (`dns.google`)
- Quad9 (`dns.quad9.net`)
- NextDNS, etc.

## Why This Project?

- Improve privacy by hiding DNS queries from your ISP
- Bypass DNS-based censorship
- Use your own domain for better trust & privacy
- Fast global performance (Edge Network)
- Completely free for personal use

## License

**0BSD** — Free for any purpose, no restrictions.
