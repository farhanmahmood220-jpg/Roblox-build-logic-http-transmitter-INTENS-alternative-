const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory store for messages linked to SIDs
const messages = {};

// 1. Web Form to Type Messages
app.get('/typewriter/edit', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>My Typewriter</title>
      <style>
        body { font-family: sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
        input, textarea, button { width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box; }
      </style>
    </head>
    <body>
      <h2>Typewriter Control</h2>
      <form action="/typewriter/edit" method="POST">
        <label>Secret SID:</label>
        <input type="text" name="sid" placeholder="Your secret SID key" required />
        <label>Message:</label>
        <textarea name="text" placeholder="Type message here..." required></textarea>
        <button type="submit">Send to Roblox</button>
      </form>
    </body>
    </html>
  `);
});

// Handle form submission
app.post('/typewriter/edit', (req, res) => {
  const { sid, text } = req.body;
  if (sid) {
    messages[sid] = text || "";
    res.send("<h3>Message sent! Your typewriter in Build Logic will fetch this.</h3><a href='/typewriter/edit'>Send another</a>");
  } else {
    res.send("Missing SID");
  }
});

// 2. Read Endpoint for Build Logic
app.get('/typewriter/read', (req, res) => {
  const sid = req.query.sid;
  const message = messages[sid] || "";
  res.send(message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
