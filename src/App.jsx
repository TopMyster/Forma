import React, { useState } from "react"

function App() {
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  async function handleGenerate(event) {
    event.preventDefault()

    const form = event.target
    const transcript = form.elements["transcript"]?.value || ""

    const prompt = `
You are an AI site generator. Follow these rules strictly:

- Everything meets the requirements exactly
- Result must feel production-ready and intentional
- Do exactly what the user asks.
    `.trim()

    try {
      setIsLoading(true)
      setShowResult(false)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content: prompt,
            },
            {
              role: "user",
              content: transcript,
            },
          ],
          temperature: 0.6,
          max_tokens: 10100,
          top_p: 0.9,
          stream: false,
        }),
      })

      const data = await response.json()

      if (data.choices && data.choices.length > 0) {
        const reply =
          data.choices[0].message?.content ||
          data.choices[0].text?.content ||
          "Sorry, the website isn't working right now."

        setResult(reply)
        setShowResult(true)
      } else {
        console.error("Unexpected response format:", data)
      }
    } catch (err) {
      console.error("Error during fetch:", err)
    } finally {
      setIsLoading(false)
    }
  }

  function newChat() {
    setShowResult(false)
    setResult("")
  }

  function privacy() {
    setShowPrivacy((prev) => !prev)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#040404", color: "white" }}>
      <button
        type="button"
        onClick={privacy}
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 50,
          padding: "6px 10px",
          fontSize: 12,
          borderRadius: 6,
          background: "#1f2937",
          color: "white",
          border: "1px solid #4b5563",
          cursor: "pointer",
        }}
      >
        {showPrivacy ? "Back to generator" : "Privacy Policy"}
      </button>

      {!showPrivacy && (
        <>
          <div id="app">
            <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
              <h1 style={{ marginBottom: 16 }}>Forma – AI Site Generator</h1>
              <form onSubmit={handleGenerate}>
                <textarea
                  name="transcript"
                  placeholder="Describe the site you want..."
                  style={{
                    width: "100%",
                    minHeight: 120,
                    marginBottom: 12,
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #374151",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: "none",
                    background: "#10b981",
                    color: "#020617",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Generate Site
                </button>
              </form>
            </main>
          </div>

          {isLoading && (
            <div id="loading" style={{ padding: 24, textAlign: "center" }}>
              <h1 id="loadtext">Creating...</h1>
            </div>
          )}

          {showResult && (
            <div
              id="result"
              style={{
                display: "flex",
                gap: 16,
                padding: 24,
                alignItems: "flex-start",
              }}
            >
              <iframe
                id="preview"
                title="Preview"
                style={{
                  flex: 1,
                  border: "1px solid #4b5563",
                  minHeight: "70vh",
                  background: "white",
                }}
                srcDoc={result}
              />
              <div
                className="text"
                style={{ padding: 16, maxWidth: 400, background: "#020617" }}
              >
                <h1>One more step...</h1>
                <ol>
                  <li>Download the index.html</li>
                  <li>
                    Go to{" "}
                    <u>
                      <a
                        href="https://tiiny.host/host-html-file/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Tiiny
                      </a>
                    </u>
                  </li>
                  <li>Upload the index.html of your project to Tiiny</li>
                  <li>Follow the instructions on the page</li>
                  <li>(Optional) Buy a domain and connect it to site</li>
                  <li>You're Done! 🎉</li>
                </ol>
              </div>
              <a
                id="downloadbtn"
                href={URL.createObjectURL(
                  new Blob([result], { type: "text/html" })
                )}
                download="index.html"
                style={{
                  alignSelf: "flex-start",
                  padding: "8px 12px",
                  background: "#10b981",
                  color: "black",
                  textDecoration: "none",
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                Download
              </a>
              <button
                style={{
                  position: "fixed",
                  bottom: 5,
                  left: 5,
                }}
                onClick={newChat}
              >
                + Regenerate
              </button>
            </div>
          )}
        </>
      )}

      {showPrivacy && (
        <div
          id="privacy"
          style={{
            maxWidth: 760,
            margin: "0 auto",
            padding: "2rem 1.5rem 3rem",
            color: "#111827",
            background: "#ffffff",
            borderRadius: 8,
          }}
        >
          <main>
            <h1>Privacy Policy</h1>
            <p style={{ fontSize: "0.95rem", color: "#6b7280" }}>
              Last updated: February 8, 2026
            </p>

            <p>
              Thank you for using [Your Company Name] (“we”, “us”, or “our”). We
              respect your privacy. This Privacy Policy explains how we handle
              information when you use our AI site generator and related
              services (the “Service”).
            </p>

            <p>By using our Service, you agree to this Privacy Policy.</p>

            <hr />

            <h2>1. Information We Collect</h2>

            <p>
              We designed our Service so that we do{" "}
              <strong>not</strong> collect personal information from you.
            </p>

            <ul>
              <li>We do not require you to create an account.</li>
              <li>
                We do not store your prompts, website content, or files you
                enter into the Service.
              </li>
              <li>
                We do not track your activity across sites for advertising
                purposes.
              </li>
            </ul>

            <p>
              Any information you enter is processed only to generate your site
              and is not stored by us in a way that can identify you.
            </p>

            <hr />

            <h2>2. Cookies and Tracking</h2>

            <p>
              We do not use cookies or similar tracking technologies for
              analytics, advertising, or profiling.
            </p>

            <p>
              Our hosting provider or infrastructure services may automatically
              log basic technical data (such as IP address and browser type) for
              security and operational reasons, but we do not use this
              information to identify you or build a profile.
            </p>

            <hr />

            <h2>3. How We Use Your Information</h2>

            <p>
              Because we do not collect personal information, we only use
              temporary, non-identifying data as needed to:
            </p>

            <ul>
              <li>Run the AI site generator and display results to you,</li>
              <li>Maintain security and prevent abuse, and</li>
              <li>Ensure the Service is functioning correctly.</li>
            </ul>

            <p>We do not sell, rent, or trade your information.</p>
          </main>
        </div>
      )}
    </div>
  )
}

export default App
