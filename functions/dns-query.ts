const DNS_MIME = "application/dns-message";
const UPSTREAM_DOH_ENDPOINT = "https://freedns.controld.com/family";
const DNS_PATH = "/dns-query";

export default {
  async fetch(request: Request, _env: unknown, ctx: ExecutionContext): Promise<Response> {
    const { method } = request;
    const parsedUrl = new URL(request.url);

    if (parsedUrl.pathname !== DNS_PATH) {
      return new Response(`DoH Proxy is active. Route queries through: ${parsedUrl.origin}${DNS_PATH}`, {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (method !== "GET" && method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const isGet = method === "GET";
    const cache = caches.default;
    if (isGet) {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) return cachedResponse;
    }

    try {
      const upstreamResponse = await fetch(UPSTREAM_DOH_ENDPOINT + parsedUrl.search, {
        method,
        headers: {
          Accept: DNS_MIME,
          "Content-Type": DNS_MIME,
          "User-Agent": "DoH-Edge/3.0",
        },
        body: isGet ? undefined : request.body,
      });

      const responseHeaders = new Headers(upstreamResponse.headers);
      responseHeaders.set("Access-Control-Allow-Origin", "*");
      if (isGet && upstreamResponse.ok) responseHeaders.set("Cache-Control", "public, max-age=60");

      const response = new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        headers: responseHeaders,
      });

      if (isGet && upstreamResponse.ok) ctx.waitUntil(cache.put(request, response.clone()));
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown upstream error";
      return new Response(`DNS Bridge Error: ${message}`, { status: 502 });
    }
  },
};
