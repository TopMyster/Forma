import React from "react"
import './App.css'

export default function App() {
  return (
     <>
     <div id="logo">
        <h1 style={{ fontSize: 100, fontWeight: 100, fontStyle: 'italic' }}>Forma</h1>
        <h1 style={{fontWeight: 200}}>Create a website for <u>YOU</u></h1>
        <div id="gradient"></div>
    </div>
    <div id="userinput">
        <textarea id="usertext" placeholder="Describe your website"></textarea>
        <button onClick={submition}>Create</button>
    </div>
    <div id="privacy">
      <main>
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last updated: February 8, 2026</p>
    
        <p>
          Thank you for using [Your Company Name] (“we”, “us”, or “our”). We respect your privacy.
          This Privacy Policy explains how we handle information when you use our AI site generator
          and related services (the “Service”).
        </p>
    
        <p>
          By using our Service, you agree to this Privacy Policy.
        </p>
    
        <hr />
    
        <h2>1. Information We Collect</h2>
    
        <p>
          We designed our Service so that we do <strong>not</strong> collect personal information from you.
        </p>
    
        <ul>
          <li>We do not require you to create an account.</li>
          <li>We do not store your prompts, website content, or files you enter into the Service.</li>
          <li>We do not track your activity across sites for advertising purposes.</li>
        </ul>
    
        <p>
          Any information you enter is processed only to generate your site and is not stored by us in a
          way that can identify you.
        </p>
    
        <hr />
    
        <h2>2. Cookies and Tracking</h2>
    
        <p>
          We do not use cookies or similar tracking technologies for analytics, advertising, or profiling.
        </p>
    
        <p>
          Our hosting provider or infrastructure services may automatically log basic technical data
          (such as IP address and browser type) for security and operational reasons, but we do not use
          this information to identify you or build a profile.
        </p>
    
        <hr />
    
        <h2>3. How We Use Your Information</h2>
    
        <p>
          Because we do not collect personal information, we only use temporary, non-identifying data as
          needed to:
        </p>
    
        <ul>
          <li>Run the AI site generator and display results to you,</li>
          <li>Maintain security and prevent abuse, and</li>
          <li>Ensure the Service is functioning correctly.</li>
        </ul>
    
        <p>
          We do not sell, rent, or trade your information.
        </p>
      </main>
    </div>
    <div id="loading">
        <h1 id="loadtext">Creating...</h1>
    </div>
    <div id="result">
        <iframe id="preview"></iframe>
        <div className="text">
            <h1>One more step...</h1>
            <ol>
                <li>Download the index.html</li>
                <li>Go to <u><a href="https://tiiny.host/host-html-file/">Tiiny</a></u></li>
                <li>Upload the index.html of your project to Tiiny</li>
                <li>Follow the instructions on the page</li>
                <li>(Optional) Buy a domain and connect it to site</li>
                <li>You're Done! 🎉</li>
            </ol>
        </div>
        <a id="downloadbtn">Download</a>
        <button style={{position: "fixed", bottom: 5, left: 5,}} onClick={newChat}>+ Regenerate</button>
    </div>
    <a style={{position: "absolute", left: 25, bottom: 25, fontSize: 16, color: "black", textDecoration: "none",}} href="https://github.com/TopMyster" target="_blank">©2025 TopMyster</a>
    <a style={{position: "absolute", right: 25, bottom: 25, fontSize: 16, color: "black", textDecoration: "none",}} onClick={privacy} id="privacy-policy">Privacy Policy</a>
     </>
  )
}

async function submition() {
  let result
  document.getElementById('loading').style.display = 'flex'
  let transcript = document.getElementById('usertext').value

  const prompt = `
    You are a Senior Frontend Engineer + Senior UX/UI Designer.

    Build a modern, clean, professional website based entirely on **${transcript}**.
    
    Hard Rules
    - Output ONE self-contained HTML file
    - Use React via CDN + Babel
    - All React logic/components must be inside the HTML
    - Output ONLY raw code (no explanations, no markdown, no backticks)
    - Add this exact comment at the very top:
    <!-- Made in Forma -->
    
    If information is missing
    - Output one short sentence only
    - Use the Instrument Serif font
    - This is the only exception to the code-only rule
    
    Design & Quality
    - Minimal, Modern, polished, senior-level UI
    - Excellent typography, spacing, hierarchy
    - Smooth, natural animations only
    - Font must match the site’s theme. Default fallback:
    system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif
    - Inspired by CodyHouse, Shoelace, SiteInspire, Cosmos, Pinterest 
    
    Images
    - Use high-quality stock images
    - If a specific person/object is mentioned, use a relevant real image
    - NO empty images, placeholders, or missing src
    
    Functionality
    - Everything must fully work
    - No fake buttons, empty links, or broken features
    - If the request is complex (apps, games, editors, translators), build it fully
    - Advanced JavaScript and APIs are allowed
    
    Mandatory Bottom Banner
    - At the very bottom (not fixed but is at the very bottom)
    - Text: Made in Forma
    - Font: Instrument Serif
    - Uses the site’s accent color
    - Must use this base structure (styles may adapt):
    <a href="https://formasite.vercel.app/" style="width:100vw; box-sizing:border-box; text-decoration:none; padding:12px 16px; background-color: (website's accent color); color: white (depends on website's accent color); font-family:'Instrument Serif', serif; text-align:center; font-weight: 600; position:absolute; left:0;">Made in Forma</a>
    
    Final Check
    - No unstyled elements
    - No bugs or console errors
    - No empty content
    - Everything meets the requirements exactly
    - Result must feel production-ready and intentional
    
    Do exactly what the user asks.
  `

  try {
    const response = await fetch("/api/chat", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
            content: transcript
          }
        ],
        temperature: 0.6,
        max_tokens: 10100,
        top_p: 0.9,
        stream: false
      }),
    });

    const data = await response.json()

    if (data.choices && data.choices.length > 0) {
      document.getElementById('loading').style.display = 'none'
      document.getElementById('result').style.display = 'flex'
      const reply =
        data.choices[0].message?.content ||
        data.choices[0].text?.content ||
        "Sorry, the website isn't working right now."
      result = reply
      const doc = document.getElementById('preview').contentWindow.document
      doc.open()
      doc.write(reply)
      doc.close()

      const a = document.getElementById('downloadbtn')
      let blob = new Blob([ result ], {type: "text/html"})
      let href = URL.createObjectURL(blob)
      a.onclick = function() {
        Object.assign(this, {
          href,
          download: "index.html"
        })
      }
    } else {
      console.error("Unexpected response format:", data)
    }
  } catch (err) {
    console.error("Error during fetch:", err)
    console.log(err)
  }
}

function newChat() {
  document.getElementById('result').style.display = 'none'
}

function privacy() {
    if (document.getElementById('privacy').style.display == 'none') {
      document.getElementById('privacy').style.display == 'block'
    } else {
      document.getElementById('privacy').style.display == 'none'
      
    }
}
