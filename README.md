# DoH-CFW

A lightweight DNS-over-HTTPS proxy for Cloudflare Workers. It forwards RFC 8484 GET and POST requests to Mullvad Privacy DNS by default.

## Project structure

```text
functions/dns-query.ts  # Cloudflare Worker entry point
wrangler.toml           # Wrangler configuration
```

## Deploy

Install Wrangler, authenticate with Cloudflare, then deploy:

```bash
npx wrangler login
npx wrangler deploy
```

The endpoint is available at `/dns-query` on the deployed Worker URL.

## Configure clients

Use your Worker URL as a custom DoH endpoint, for example:

```text
https://your-worker.workers.dev/dns-query
```

The worker accepts:

- `GET /dns-query?dns=<base64url-encoded-query>` with `Accept: application/dns-message`
- `POST /dns-query` with `Content-Type: application/dns-message`
- `OPTIONS /dns-query` for CORS preflight

## Change the upstream

Edit `UPSTREAM_DOH_ENDPOINT` in `functions/dns-query.ts` to use another compatible DoH provider.
