"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Globe, Zap, Lock } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [copied, setCopied] = useState(false)
  const endpoint = typeof window !== "undefined" ? `${window.location.origin}/api/dns-query` : "/api/dns-query"

  const copyToClipboard = async () => {
    try {
      const url = typeof window !== "undefined" ? `${window.location.origin}/api/dns-query` : "/api/dns-query"
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      const textArea = document.createElement("textarea")
      textArea.value = typeof window !== "undefined" ? `${window.location.origin}/api/dns-query` : "/api/dns-query"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance text-zinc-50">DNS over HTTPS</h1>
            <p className="text-xl text-zinc-400 text-balance max-w-2xl mx-auto">
              {"A privacy-focused DNS resolver powered by Vercel Edge Functions"}
            </p>
          </div>

          {/* Endpoint Card */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">{"Your DoH Endpoint"}</CardTitle>
              <CardDescription className="text-zinc-400">
                {"Use this endpoint in any DoH-compatible client"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-sm break-all text-zinc-300">
                {endpoint}
              </div>
              <Button onClick={copyToClipboard} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                {copied ? "Copied!" : "Copy Endpoint"}
              </Button>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <Globe className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-lg text-zinc-50">{"Edge Network"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  {"Deployed on Vercel Edge for low-latency DNS resolution from Dubai"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <Lock className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-lg text-zinc-50">{"Encrypted"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  {"All DNS queries are encrypted over HTTPS, protecting your privacy"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <Zap className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-lg text-zinc-50">{"Fast & Free"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">{"Optimized for speed with zero configuration required"}</p>
              </CardContent>
            </Card>
          </div>

          {/* Usage Instructions */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">{"How to Use"}</CardTitle>
              <CardDescription className="text-zinc-400">
                {"Configure your devices or applications to use this DoH endpoint"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-zinc-50">{"Supported Methods"}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
                  <li>{"GET requests with ?dns= parameter (RFC 8484 wireformat)"}</li>
                  <li>{"POST requests with DNS message body (RFC 8484)"}</li>
                  <li>{"JSON API via Accept: application/dns-json header"}</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-zinc-50">{"Compatible With"}</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400">
                  <li>{"Web browsers (Chrome, Firefox, Edge secure DNS settings)"}</li>
                  <li>{"Mobile apps (Intra, Nebulo, DNSCloak)"}</li>
                  <li>{"Desktop applications (YogaDNS, AdGuard)"}</li>
                  <li>{"System-wide DNS configuration"}</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-zinc-50">{"Upstream Provider"}</h3>
                <p className="text-sm text-zinc-400">
                  {"Currently using Mullvad Family DNS for content filtering and privacy protection"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Info */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">{"Technical Details"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">{"Runtime"}</span>
                <span className="font-mono text-zinc-300">{"Vercel Edge Functions"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">{"Protocol"}</span>
                <span className="font-mono text-zinc-300">{"RFC 8484 (DoH)"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">{"Response Format"}</span>
                <span className="font-mono text-zinc-300">{"Wireformat / JSON"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-400">{"CORS"}</span>
                <span className="font-mono text-zinc-300">{"Enabled"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-zinc-800 mt-16 bg-black">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-zinc-400">
          <p>{"DNS over HTTPS proxy powered by Vercel Edge Functions"}</p>
        </div>
      </footer>
    </div>
  )
}
