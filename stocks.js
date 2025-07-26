export default async function handler(req, res) {
  /**
   * Stock handler
   *
   * This endpoint returns basic price information for a handful of well‑known
   * symbols. It first queries the FinancialModelingPrep demo API for a
   * quick price lookup. If that call fails or doesn't include a price
   * value, it falls back to Alpha Vantage. The response includes an
   * array of objects with just a `symbol` and `price` property so the
   * frontend can display the quote directly.
   */
  const symbols = ['AAPL', 'MSFT', 'GOOGL'];
  const results = [];

  for (const symbol of symbols) {
    try {
      // try to get a price from FinancialModelingPrep (FMP)
      let price = null;
      try {
        const fmpRes = await fetch(
          `https://financialmodelingprep.com/api/v3/quote-short/${symbol}?apikey=demo`
        );
        const fmpData = await fmpRes.json();
        if (Array.isArray(fmpData) && fmpData[0] && fmpData[0].price != null) {
          price = fmpData[0].price;
        }
      } catch (err) {
        // ignore FMP errors and fall back to Alpha Vantage
      }

      // if no price found from FMP, use Alpha Vantage
      if (price == null) {
        try {
          const alphaRes = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=7G0SE75620MX4XO3`
          );
          const alphaData = await alphaRes.json();
          const global = alphaData['Global Quote'] || alphaData;
          const alphaPrice = parseFloat(global['05. price']);
          if (!Number.isNaN(alphaPrice)) {
            price = alphaPrice;
          }
        } catch (err) {
          // ignore errors; price will remain null
        }
      }

      results.push({ symbol, price });
    } catch (error) {
      console.error(`Stock API error for ${symbol}:`, error);
      results.push({ symbol, price: null });
    }
  }
  // return simple array of symbol/price objects
  res.status(200).json(results);
}