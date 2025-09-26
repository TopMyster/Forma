async function submition() {
  let result
  document.getElementById('loading').style.display = 'flex'
  let transcript = document.getElementById('usertext').value

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
            content: `Build a professional website based on ${transcript}. Make it as professional and nice looking. Give only the code as your response nothing else. Make there a banner at thethat is the accent colour of the website that says Made in Forma (Must be minimal and at the bottom of the page). Rid the site of bugs and clutter ness. The site must look very human as well. The site must be beautiful as well. Also add a comment in the beginning of the code, "Made in Forma".`,
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
      const doc = document.getElementById('preview').contentWindow.document;
      doc.open();
      doc.write(reply);
      doc.close();
    } else {
      console.error("Unexpected response format:", data)
    }
  } catch (err) {
    console.error("Error during fetch:", err)
    console.log(err)
  }
}

