// DNS over HTTPS (DoH) Proxy for Vercel - Mullvad Only

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
    const response = await fetch(`${MULLVAD_DOH}?dns=${dnsParam}`, {
      method: "GET",
      headers: {
        Accept: DNS_MESSAGE_TYPE,
      },
    })

    if (!response.ok) {
      console.log("[v0] Mullvad GET failed:", response.status, response.statusText)
      return new Response(`Mullvad error: ${response.status}`, { status: response.status })
    }

    const data = await response.arrayBuffer()
    return new Response(data, {
      status: 200,
      headers: getResponseHeaders(),
    })
  } catch (error) {
    console.log("[v0] Mullvad GET error:", error)
    return new Response(`Error: ${error}`, { status: 500 })
  }
}

// Handle POST requests
export async function POST(request: Request) {
  const body = await request.arrayBuffer()

  try {
    const response = await fetch(MULLVAD_DOH, {
      method: "POST",
      headers: {
        Accept: DNS_MESSAGE_TYPE,
        "Content-Type": DNS_MESSAGE_TYPE,
      },
      body: body,
    })

    if (!response.ok) {
      console.log("[v0] Mullvad POST failed:", response.status, response.statusText)
      return new Response(`Mullvad error: ${response.status}`, { status: response.status })
    }

    const data = await response.arrayBuffer()
    return new Response(data, {
      status: 200,
      headers: getResponseHeaders(),
    })
  } catch (error) {
    console.log("[v0] Mullvad POST error:", error)
    return new Response(`Error: ${error}`, { status: 500 })
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
