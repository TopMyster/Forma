async function submition() {
  let result
  document.getElementById('loading').style.display = 'flex'
  let transcript = document.getElementById('usertext').value

  const prompt = `

  Objective & Output:
You are a senior front‑end designer and developer. Generate a production‑quality, modern website from the provided transcript. Return only a single, valid HTML document with embedded CSS and JavaScript—no explanations and no markdown fences. Derive palette, typography, layout, and tone from the transcript (infer when unspecified). Load high‑quality Google Fonts with display=swap; pair a distinctive heading font with a clean sans for body; do not use Times New Roman. Implement smooth, tasteful animations and microinteractions that respect prefers‑reduced‑motion. Provide light/dark mode with automatic text color ensuring AA contrast. Add an HTML comment at the very top: “Made in Forma”. At the very bottom (not fixed), include this banner using the chosen accent color and Instrument Serif from Google Fonts:
<a href="https://formasite.vercel.app/" style="text-decoration: none; padding: 8px 100vw; background-color: ACCENT_COLOR; color: white; border-radius: 8px; font-family: 'Instrument Serif', serif">Made in Forma</a>

Design & Functional Standards:
- Semantic HTML5 (header, nav, main, section, footer); logical heading hierarchy; mobile‑first responsive layout; consistent spacing via CSS variables and a clear scale. Strong visual hierarchy, balanced white space, consistent accent color applied to buttons/links/highlights with sufficient contrast. Smooth animations on hover/focus/entrance; no janky motion.
- Components (all must work):
  • Responsive, accessible navigation with a mobile menu (ARIA, keyboard navigable, visible focus states).
  • One interactive module (tabs, accordion, or gallery) with progressive enhancement and ARIA.
  • Theme toggle (light/dark) with localStorage persistence.
  • Contact form with client‑side validation and submit handler; show success/error; if backend implied, use fetch to a placeholder endpoint.
  • Images: never blank—use relevant Unsplash stock or specific target images when mentioned; set width/height, loading="lazy", decoding="async", and meaningful alt text.
- Copy: Clear, human‑sounding; no lorem ipsum unless the transcript is empty (then create tasteful placeholder copy).
- Sections: Hero, Services/What I Do, Portfolio/Showcase, About, Testimonials or Social Proof (if implied), Contact/CTA, Footer.

Performance, Accessibility & Self‑Check (before returning):
- Performance: Inline critical CSS; defer/async scripts; avoid blocking; optimize assets where possible; use prefers‑color‑scheme and data‑theme.
- Accessibility: AA contrast (≥4.5:1 body; ≥3:1 large text), logical tab order, visible focus on interactive elements, descriptive alt text, helpful ARIA (aria‑expanded/controls where needed).
- Validation checklist:
  • Document starts with <!DOCTYPE html>, includes <html lang>, <meta charset>, viewport, and meta description.
  • No unused CSS/JS; no console errors; no undefined variables.
  • Buttons use <button> (not <div>); ARIA attributes correctly wired.
  • Navigation works on mobile; interactive module functions; form validates and provides user feedback.
  • “Made in Forma” top comment present and bottom banner uses the chosen ACCENT_COLOR and 'Instrument Serif'.
Return the full HTML code only.

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
        temperature: 0.5,
        max_tokens: 6000,
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