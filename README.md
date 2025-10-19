# Binance API Relay
Serverless relay to bypass Binance geo-restrictions.
## Deploy
1. Import to Vercel: https://vercel.com/new
2. Use endpoint: `https://your-app.vercel.app/api/binance-relay`
## Test
```bash
curl "https://your-app.vercel.app/api/binance-relay?symbol=BTCUSDT&limit=20"
## Files
- `api/binance-relay.js` - Main relay function
- `vercel.json` - Deployment config  
- `package.json` - Dependencies
- `.gitignore` - Node.js template