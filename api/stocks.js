export default async function handler(req, res) {
  /**
   * Stock handler
   *
   * This endpoint returns the latest price and percentage change for a
   * handful of well‑known symbols. It first queries the free
   * FinancialModelingPrep demo API for a quick price lookup. Then it
   * queries the Alpha Vantage Global Quote endpoint to capture the
   * change percentage. If FMP fails to provide a price the Alpha Vantage
   * price is used as a fallback. The response includes an array of
   * objects with `symbol`, `price` and `changePercent` so the frontend
   * can show both the absolute value and performance.
   */
  const symbols = ['AAPL', 'MSFT', 'GOOGL'];
  const results = [];
  for (const symbol of symbols) {
    try {
      let price = null;
      // attempt to fetch a quick price from FMP
      try {
        const fmpRes = await fetch(
          `https://financialmodelingprep.com/api/v3/quote-short/${symbol}?apikey=demo`
        );
        const fmpData = await fmpRes.json();
        if (Array.isArray(fmpData) && fmpData[0] && fmpData[0].price != null) {
          price = fmpData[0].price;
        }
      } catch (err) {
        // ignore FMP errors
      }

      // always query Alpha Vantage for change percentage and fallback price
      let changePercent = null;
      try {
        const alphaRes = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=7G0SE75620MX4XO3`
        );
        const alphaData = await alphaRes.json();
        const global = alphaData['Global Quote'] || alphaData;
        // extract price from Alpha if FMP didn't provide one
        const alphaPrice = parseFloat(global['05. price']);
        if (price == null && !Number.isNaN(alphaPrice)) {
          price = alphaPrice;
        }
        // parse change percent; remove trailing percent sign
        const rawPercent = global['10. change percent'] || global['10. change percent'.toUpperCase()] || null;
        if (rawPercent && typeof rawPercent === 'string') {
          const numeric = parseFloat(rawPercent.replace('%', '').trim());
          if (!Number.isNaN(numeric)) {
            changePercent = numeric;
          }
        }
      } catch (err) {
        // ignore Alpha errors; changePercent will remain null
      }

      results.push({ symbol, price, changePercent });
    } catch (error) {
      console.error(`Stock API error for ${symbol}:`, error);
      results.push({ symbol, price: null, changePercent: null });
    }
  }
  res.status(200).json(results);
}