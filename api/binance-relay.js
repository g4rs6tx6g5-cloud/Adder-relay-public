import fetch from 'node-fetch';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { symbol = 'BTCUSDT', limit = 100 } = req.query;
    
    if (!/^[A-Z]+$/.test(symbol)) {
      return res.status(400).json({ error: 'Invalid symbol' });
    }
    
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 5000) {
      return res.status(400).json({ error: 'Invalid limit (1-5000)' });
    }

    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
    
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
    const binanceUrl = `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${parsedLimit}`;
    
    const response = await fetch(binanceUrl, {
      headers: {
        'User-Agent': randomUA,
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Binance API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    
    const relayedData = {
      ...data,
      _relay: {
        timestamp: new Date().toISOString(),
        source: 'vercel-edge',
        symbol,
        limit: parsedLimit
      }
    };

    res.status(200).json(relayedData);
    
  } catch (error) {
    console.error('Relay error:', error);
    res.status(500).json({
      error: 'Relay server error',
      message: error.message
    });
  }
};