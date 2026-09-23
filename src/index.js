const express = require('express');
const app = express();
const PORT = 3000;

// A basic route nyaaa
app.get('/', (req, res) => {
  res.send('Hello, World! Express is working.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});