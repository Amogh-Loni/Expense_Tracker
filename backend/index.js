const express = require('express');
const cors = require('cors');
const minimizeTransactions = require('./settlement');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Expense Splitter API running');
});

// Settlement API
app.post('/settle', (req, res) => {
  /*
    Expected input:
    {
      "balances": {
        "Aman": 1000,
        "Rahul": -700,
        "Neha": -300
      }
    }
  */

  const { balances } = req.body;

  if (!balances || typeof balances !== 'object') {
    return res.status(400).json({ error: 'Invalid balances input' });
  }

  const result = minimizeTransactions(balances);
  res.json({ settlements: result });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
