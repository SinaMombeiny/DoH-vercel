# DoH Worker

A minimal DNS-over-HTTPS proxy for Cloudflare Workers. It forwards DNS queries to Control D DNS over HTTPS and exposes the worker at `/dns-query`.

## Deploy

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

The deployed endpoint is:

```text
https://<your-worker>.<your-subdomain>.workers.dev/dns-query
```

## Configuration

Edit `functions/dns-query.ts` to change the upstream DoH provider or request path. The default upstream is `https://family.dns.mullvad.net/dns-query`.

Supports standard DoH `GET`, `POST`, and CORS preflight `OPTIONS` requests.
