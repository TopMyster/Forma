async function submition() {
  let result
  document.getElementById('loading').style.display = 'flex'
  let transcript = document.getElementById('usertext').value

  const prompt = `

  You are a senior front-end designer and developer. Generate a production-quality, modern website from the provided transcript. Output MUST be a single, valid HTML file with embedded CSS and JavaScript. Return ONLY code. No explanations. No markdown fences.

Quality standard:
- Commercial-builder polish (Wix-level): no visual or functional defects.
- Mobile-first, responsive, accessible (WCAG AA contrast), keyboard navigable, clear headings, alt text, helpful ARIA.
- Clean semantic HTML5 (header, nav, main, section, article, aside, footer). No unused code.
- Organized CSS with variables and spacing scale: --space-1:4px, --space-2:8px, --space-3:12px, --space-4:16px, --space-5:24px, --space-6:32px, --space-7:48px, --space-8:64px.
- Google Fonts loaded with display=swap. Pair a display/serif for headings with a humanist sans for body. No Times New Roman.
- Smooth, subtle animations (respect prefers-reduced-motion). No janky motion.
- Light/dark mode with automatic text color maintaining AA contrast.
- Consistent accent color derived from transcript; apply to buttons, links, highlights.

Functional requirements:
- Everything must work:
  - Responsive, accessible nav with mobile menu and visible focus states.
  - One interactive component (tabs, accordion, or gallery) with ARIA and progressive enhancement.
  - Contact form with client-side validation and submit handler; show success/error. If backend implied, use fetch to a placeholder endpoint.
  - Theme toggle (light/dark) saving preference via localStorage.
  - Images never blank: use relevant Unsplash stock or direct images if a specific person/item is named.
- No lorem ipsum unless transcript is empty.

Performance:
- Inline critical CSS; use CSS variables for theme.
- Defer/async scripts; avoid blocking.
- Optimize images (width/height, loading="lazy", decoding="async").
- Use prefers-color-scheme and data-theme.

Branding:
- Add HTML comment at the very top: “Made in Forma”.
- Include a minimal banner at the very bottom (not fixed) reading “Made in Forma” using:
  <a href="https://formasite.vercel.app/" style="text-decoration: none; padding: 8px 15px; background-color: ACCENT_COLOR; color: white; border-radius: 8px; font-family: INSTRUMENT_SERIF_FONT">Made in Forma</a>
  Replace ACCENT_COLOR with the chosen accent and INSTRUMENT_SERIF_FONT with 'Instrument Serif', serif from Google Fonts.

Content generation:
- Build a complete site based on the transcript: palette, typography, layout, voice. If not specified, infer appropriately.
- Sections: Hero, Features/Services, About, Testimonials or Social Proof (if implied), Gallery/Media, Contact/CTA, Footer.
- Copy must be clear and human.

Validation & self-check (MANDATORY before returning):
- Document starts with <!DOCTYPE html>, includes <html lang>, <meta charset>, viewport, and description.
- No broken links or missing images; accessible alt text.
- Contrast ≥ AA (4.5:1 body, 3:1 large text).
- Logical keyboard focus; visible focus for all interactive elements.
- No console errors; no undefined variables; correct aria-controls/expanded; interactive elements are <button>.
- If transcript is empty, output a tasteful minimal template with placeholder copy (no lorem ipsum).

Input:
- Transcript: ${transcript}

Output rules:
- Return only the full HTML document code (<!DOCTYPE html> …), nothing else.
- Keep the design elegant, modern, and professional with tuned spacing, margins, and sizes.


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