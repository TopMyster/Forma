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
    <div id="loading">
        <h1 id="loadtext">Creating...</h1>
    </div>
    <div id="result">
        <iframe id="preview" src="preview.html"></iframe>
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
     </>
  )
}

async function submition() {
  let result
  document.getElementById('loading').style.display = 'flex'
  let transcript = document.getElementById('usertext').value

  const prompt = `

  Build a clean, professional website based on ${transcript} in one React file running in an html file using CDN + Babel.

  Requirements:
  * Font must be based on what type of site it is and the theme of it but by default it should be the system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif.
  * Output only the code (no explanations or extra text) only.  If the user doesnt have enough info tell them what they need to tell you in one short sentance using the Intrument Serif font (Only exception).
  * Add an html comment at the very beginning of the code: "Made in Forma".
  * The site must be visually appealing, professional, and easy to navigate (Senior UX Designer quality).
  * Use smooth, seamless animations and fonts that best match the overall style of the website.
  * Use stock images where appropriate. If the request is for a very specific character, person, or object, use a relevant image of that subject.
  * Eliminate bugs, errors, and unnecessary clutter."
  * Include a banner link at the very bottom of the page (not fixed) that uses the accent color of the site and reads **Made in Forma** It must also be in the Instrument Serif font.
  * Make the website's UI Design look really nice
  * Don't wrap the code in triple backticks
  * If you need, use very advanced Javascript to make the project work
  * If they ask for a complex project make it and it has to work. You can use APIs for them too .(Examples: A game; a text editor; A note taking website; A translating site)
  * Do exactly what the user asks and make it so whatever they ask works
  * Do not leave empty images at all they must have some sort of image there not just an alt
  * Check current website trends in platforms like Cosmos and Pinterest, make it modern, sleek and professional.
  * All the website's features have to be fully functional and usable. No empty images and empty links
  * Search https://codyhouse.co/ and https://shoelace.style/ and https://www.siteinspire.com/ for design and code inspiration for the website

    * Banner code:
      <a href="https://formasite.vercel.app/" style="width: 100vw; box-sizing: border-box; text-decoration: none; padding: 12px 16px; background-color: blue; color: white; font-family: ; text-align: center; font-weight: 600; position: absolute; left: 0px">Made in Forma</a>

  Goals:

  * The website should look polished and professional.
  * The design must be minimal, clean, and modern.
  * All animations should feel smooth and natural.
  * The final result should resemble the quality of a Senior-Fontend Engineer-built site, but without bugs or clunky structure.
  * Double check the website doesn't have anything not styled and that doesn't meet the requirements
  * Make sure banner is at the bottom with the Instument Serif font
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
            role: "user",
            content: prompt,
          },
          {
            role: "user",
            content: transcript
          }
        ],
        temperature: 0.5,
        max_tokens: 10000,
        top_p: 1,
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
      console.log(result)
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