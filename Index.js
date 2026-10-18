const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory store for messages linked to SIDs
const messages = {};

// Middleware to log IP addresses and requests
app.use((req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`[LOG] Time: ${new Date().toISOString()} | IP: ${clientIp} | Path: ${req.path}`);
  next();
});

// 1. Web Form to Type Messages
app.get('/typewriter/edit', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>My Typewriter Control</title>
      <style>
        body { font-family: sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; background: #111; color: #fff; }
        input, textarea, button { width: 100%; margin-bottom: 15px; padding: 12px; box-sizing: border-box; background: #222; border: 1px solid #444; color: #fff; border-radius: 5px; }
        button { background: #00ffcc; color: #000; border: none; font-weight: bold; cursor: pointer; }
      </style>
    </head>
    <body>
      <h2>Typewriter Control</h2>
      <form action="/typewriter/edit" method="POST">
        <label>Secret SID Key:</label>
        <input type="text" name="sid" placeholder="Your secret SID key" required />
        <label>Message:</label>
        <textarea name="text" rows="4" placeholder="Type message here..." required></textarea>
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
    res.send("<h3 style='color:#00ffcc;'>Message sent successfully!</h3><a href='/typewriter/edit'>Send another</a>");
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
app.listen(PORT, () => console.log(`Typewriter server running on port ${PORT}`));
