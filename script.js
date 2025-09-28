async function submition() {
  let result
  document.getElementById('loading').style.display = 'flex'
  let transcript = document.getElementById('usertext').value

  const prompt = `

  Build a clean, professional website based on **${transcript}**.

  Requirements:

  * Output **only the code** (no explanations or extra text).
  * Add a comment at the very beginning of the code: "Made in Forma".
  * The site must be visually appealing, professional, and easy to navigate (Senior UX Designer quality).
  * Use smooth, seamless animations and fonts that best match the overall style of the website.
  * Use stock images where appropriate. If the request is for a very specific character, person, or object, use a relevant image of that subject.
  * Eliminate bugs, errors, and unnecessary clutter."
  * Include a banner link at the very bottom of the page (not fixed) that uses the accent color of the site and reads **Made in Forma** It must also be in the Instrument Serif font.
  * Make the website's UI Design look really nice
  * Don't wrap the code in triple backticks
  * If you need, use advanced Javascript

    * Banner code:
      <a href="https://formasite.vercel.app/" style="width: 100vw; box-sizing: border-box; text-decoration: none; padding: 12px 16px; background-color: blue; color: white; font-family: ; text-align: center; font-weight: 600; position: absolute; left: 0px">Made in Forma</a>

  Goals:

  * The website should look polished and professional.
  * The design must be minimal, clean, and modern.
  * All animations should feel smooth and natural.
  * The final result should resemble the quality of a Senior-Fontend Engineer-built site, but without bugs or clunky structure.

  
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
        temperature: 0.6,
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