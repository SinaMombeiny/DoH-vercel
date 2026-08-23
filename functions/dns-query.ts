const DNS_MIME = "application/dns-message";
const UPSTREAM_DOH_ENDPOINT = "https://family.dns.mullvad.net/dns-query";
const DNS_PATH = "/dns-query";

type WorkerContext = ExecutionContext;

export default {
  async fetch(request: Request, _env: unknown, ctx: WorkerContext): Promise<Response> {
    const parsedUrl = new URL(request.url);

    if (parsedUrl.pathname !== DNS_PATH) {
      return new Response(`DoH proxy is active. Route queries through: ${parsedUrl.origin}${DNS_PATH}`, {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "GET" && request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET, POST, OPTIONS" },
      });
    }

    const isGet = request.method === "GET";
    const cache = caches.default;

    if (isGet) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;
    }

    try {
      const upstreamResponse = await fetch(UPSTREAM_DOH_ENDPOINT + parsedUrl.search, {
        method: request.method,
        headers: {
          Accept: DNS_MIME,
          "Content-Type": DNS_MIME,
          "User-Agent": "DoH-CFW/1.0",
        },
        body: isGet ? undefined : request.body,
      });

      const responseHeaders = new Headers(upstreamResponse.headers);
      responseHeaders.set("Access-Control-Allow-Origin", "*");
      responseHeaders.set("Access-Control-Expose-Headers", "Content-Type, Content-Length");

      if (isGet && upstreamResponse.ok) {
        responseHeaders.set("Cache-Control", "public, max-age=60");
      }

      const response = new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        headers: responseHeaders,
      });

      if (isGet && upstreamResponse.ok) {
        ctx.waitUntil(cache.put(request, response.clone()));
      }

      return response;
    } catch {
      return new Response("Upstream DNS provider unavailable", { status: 502 });
    }
  },
};
