export default async function handler(req, res) {
  /**
   * News handler
   *
   * This endpoint fetches a handful of the most recent technology stories
   * from the Hacker News Algolia API. It uses the `search_by_date` endpoint
   * to sort stories by date and limit the result set to the latest 5 hits.
   * For each article we include a random image URL from Unsplash to
   * provide a visual preview in the frontend. If the API call fails,
   * an empty array is returned.
   */
  // Fetch the five most recent technology stories from Hacker News
  const hnUrl =
    'https://hn.algolia.com/api/v1/search_by_date?query=technology&tags=story&hitsPerPage=5';
  let articles = [];
  try {
    const hnRes = await fetch(hnUrl);
    const hnData = await hnRes.json();
    if (Array.isArray(hnData.hits)) {
      articles = hnData.hits.map((hit) => ({
        title: hit.title || hit.story_title,
        url: hit.url || hit.story_url,
        source: 'Hacker News',
        // Provide a generic technology image from Unsplash for each article
        image: 'https://source.unsplash.com/featured/400x200?technology,news',
      }));
    }
  } catch (error) {
    console.error('News API error:', error);
  }
  // Respond with a consistent articles array. Even on error this will be empty.
  res.status(200).json({ articles });
}