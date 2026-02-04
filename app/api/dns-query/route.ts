// DNS over HTTPS (DoH) Proxy for Vercel - Mullvad Family DNS
// Based on working Cloudflare Workers implementation

const MULLVAD_DOH = "https://family.dns.mullvad.net/dns-query"
const DNS_MESSAGE_TYPE = "application/dns-message"

export const runtime = "edge"
export const preferredRegion = ["dxb1", "fra1", "cdg1", "arn1"]

function getResponseHeaders(): HeadersInit {
  return {
    "Content-Type": DNS_MESSAGE_TYPE,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Cache-Control": "public, max-age=300",
    "X-Content-Type-Options": "nosniff",
  }
}

// Handle GET requests
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dnsParam = searchParams.get("dns")

  if (!dnsParam) {
    return new Response("Missing dns parameter", { status: 400 })
  }

  try {
    const response = await fetch(`${MULLVAD_DOH}?dns=${encodeURIComponent(dnsParam)}`, {
      method: "GET",
      headers: {
        Accept: DNS_MESSAGE_TYPE,
        "User-Agent": "DoH-Proxy/2.0", // Add User-Agent like CF version
      },
    })

    if (!response.ok) {
      return new Response(`DNS error: ${response.status}`, { status: response.status })
    }

    return new Response(response.body, {
      status: 200,
      headers: getResponseHeaders(),
    })
  } catch (error) {
    return new Response(`Error: ${error}`, { status: 502 })
  }
}

// Handle POST requests
export async function POST(request: Request) {
  try {
    const response = await fetch(MULLVAD_DOH, {
      method: "POST",
      headers: {
        Accept: DNS_MESSAGE_TYPE,
        "Content-Type": DNS_MESSAGE_TYPE,
        "User-Agent": "DoH-Proxy/2.0", // Add User-Agent
      },
      body: request.body, // Stream directly, don't buffer with arrayBuffer()
    })

    if (!response.ok) {
      return new Response(`DNS error: ${response.status}`, { status: response.status })
    }

    return new Response(response.body, {
      status: 200,
      headers: getResponseHeaders(),
    })
  } catch (error) {
    return new Response(`Error: ${error}`, { status: 502 })
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "86400",
    },
  })
}
