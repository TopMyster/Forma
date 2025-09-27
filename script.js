async function submition() {
  let result
  document.getElementById('loading').style.display = 'flex'
  let transcript = document.getElementById('usertext').value

  const prompt = `
You are a senior front-end designer and developer. Generate a production-quality, modern website from the provided transcript. Your output must be a single, valid HTML file with embedded CSS and JavaScript. Do not include any explanation—return only code.

Requirements:
 • Professional, visually refined, and human-looking design with strong hierarchy, white space, and consistent spacing.
 • Accessible and responsive layout (mobile-first), supporting dark and light modes if appropriate.
 • Smooth animations, and microinteractions (no janky motion).
 • Use high-quality, appropriate web fonts via Google Fonts; match typography to the site’s theme (pairing for headings and body).
 • Clean, semantic HTML5 structure; organized CSS (utility classes allowed); modular JS without clutter.
 • No bugs, no unused code, no lorem-ipsum unless the transcript is empty. Avoid inline styles except for the “Made in Forma” badge.
 • Use stock images (e.g., Unsplash or royalty-free placeholders). If a specific character/person/item is mentioned, use a direct image of that target if available; otherwise use a relevant stock image.
 • Include a html comment at the very top: “Made in Forma”.
 • Do not wrap the code in triple backticks.
 • You may use APIs if neccessary (EXAMPLES: sending message forms; music player;)
 • Every part of the website must actually work
 • Don't leave out anything and keep work clean looking

Content generation:
 • Build a complete site based on ${transcript}. Derive color palette, typography, layout sections, and tone from the transcript if stated, otherwise use infrensing to deside those things based on the type of site and from users given description.
 • Use an accent color consistently (buttons, links, highlights). Derive accent from transcript context; ensure sufficient contrast.
 • Include a minimal banner at the very bottom of the page that is not fixed-position. It must read “Made in Forma” and use this code snippet, setting the background-color to the site’s accent and teh font on the banner should be Instrument Serif from Google fonts:

<a href="https://formasite.vercel.app/" style="text-decoration: none; padding: 8px 15px; background-color: ACCENT_COLOR; color: white; border-radius: 8px; font-family: INSTRUMENT_SERIF_FONT">Made in Forma</a>

Output rules:
 • Return only the full HTML document code (  <!DOCTYPE html> …), nothing else.
 • Ensure performance best practices: compressed assets where possible, async/defer for scripts, optimized images, CSS variables for theme.
 • Validate with semantic landmarks (header, main, section, footer), ARIA where needed, alt text on images, keyboard focus states.
 • Keep the design elegant, modern, and creative while maintaining polish.
 • Double check website has everything and is working.
 `

  try {
    const response = await fetch("/api/chat", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
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
        temperature: 1,
        max_tokens: 4000,
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