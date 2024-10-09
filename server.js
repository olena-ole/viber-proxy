const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Proxy route to validate Viber token
app.get('/validate-viber-token', async (req, res) => {
  const token = req.query.token; // Token passed in query parameter

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const response = await axios.post('https://chatapi.viber.com/pa/get_account_info', {}, {
      headers: {
        'X-Viber-Auth-Token': token
      }
    });

    if (response.data.status === 0) {
      res.json({ message: 'Token is valid', data: response.data });
    } else {
      res.status(400).json({ message: 'Invalid token', data: response.data });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error validating token', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
