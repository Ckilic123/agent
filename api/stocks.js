export default async function handler(req, res) {
  /**
   * Stock handler
   *
   * This endpoint aggregates stock quotes from multiple free sources. It
   * uses FinancialModelingPrep's demo API for quick price lookups and
   * Alpha Vantage for more detailed quote information. Both services
   * offer free tiers when using the demo or personal keys. The result
   * combines data from these providers keyed by the stock symbol.
   */
  const symbols = ['AAPL', 'MSFT', 'GOOGL'];
  const results = [];

  for (const symbol of symbols) {
    try {
      const [fmpRes, alphaRes] = await Promise.all([
        fetch(
          `https://financialmodelingprep.com/api/v3/quote-short/${symbol}?apikey=demo`
        ),
        fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=7G0SE75620MX4XO3`
        ),
      ]);
      const fmpData = await fmpRes.json();
      const alphaData = await alphaRes.json();
      results.push({
        symbol,
        fmp: Array.isArray(fmpData) ? fmpData[0] : null,
        alpha: alphaData['Global Quote'] || alphaData,
      });
    } catch (error) {
      console.error(`Stock API error for ${symbol}:`, error);
      results.push({ symbol, fmp: null, alpha: null, error: 'Error fetching stock data' });
    }
  }
  res.status(200).json(results);
}