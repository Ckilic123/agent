export default async function handler(req, res) {
  /**
   * News handler
   *
   * This endpoint fetches a handful of recent technology stories from the
   * Hacker News Algolia API. Using this free service avoids the need for
   * API keys and simplifies the response structure. The results are
   * normalised into a single array containing article titles, URLs and
   * a source label.
   */
  const hnUrl =
    'https://hn.algolia.com/api/v1/search?query=technology&tags=story&hitsPerPage=10';
  const articles = [];
  try {
    const hnRes = await fetch(hnUrl);
    const hnData = await hnRes.json();
    if (Array.isArray(hnData.hits)) {
      hnData.hits.forEach((hit) => {
        articles.push({
          title: hit.title || hit.story_title,
          url: hit.url || hit.story_url,
          source: 'Hacker News',
        });
      });
    }
  } catch (error) {
    console.error('News API error:', error);
  }
  // Respond with a consistent articles array. Even on error this will be empty.
  res.status(200).json({ articles });
}