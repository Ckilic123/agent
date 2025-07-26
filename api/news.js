export default async function handler(req, res) {
  /**
   * News handler
   *
   * This endpoint fetches technology headlines from multiple free
   * sources. It calls the Hacker News Algolia search API and the
   * NewsAPI service. Hacker News requires no key, while NewsAPI uses a
   * free API key. The results are normalised into a single array of
   * articles containing titles and URLs.
   */
  const hnUrl = 'https://hn.algolia.com/api/v1/search?query=technology&tags=story&hitsPerPage=5';
  const newsApiUrl = 'https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=5&apiKey=0b1c75c9a73f40a19e9fc4b2ffdb8c8c';
  const articles = [];
  try {
    const [hnRes, newsRes] = await Promise.all([
      fetch(hnUrl),
      fetch(newsApiUrl),
    ]);
    const hnData = await hnRes.json();
    if (Array.isArray(hnData.hits)) {
      hnData.hits.forEach(hit => {
        articles.push({
          title: hit.title || hit.story_title,
          url: hit.url || hit.story_url,
          source: 'Hacker News',
        });
      });
    }
    const newsData = await newsRes.json();
    if (Array.isArray(newsData.articles)) {
      newsData.articles.forEach(item => {
        articles.push({
          title: item.title,
          url: item.url,
          source: item.source?.name || 'NewsAPI',
        });
      });
    }
  } catch (error) {
    console.error('News API error:', error);
  }
  res.status(200).json({ articles });
}