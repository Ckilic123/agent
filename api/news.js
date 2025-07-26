export default async function handler(req, res) {
  /**
   * News handler
   *
   * This endpoint fetches a handful of the most recent technology stories
   * from the Hacker News Algolia API. It uses the `search_by_date` endpoint
   * to sort stories by date and limit the result set to the latest 5 hits.
   * For each article we attach a random placeholder image URL. Using the
   * picsum.photos service avoids the reliability issues encountered with
   * the Unsplash-based URLs and still provides visually appealing
   * illustrations for each news item. If the API call fails, an empty
   * array is returned.
   */
  // Fetch the five most recent technology stories from Hacker News
  const hnUrl =
    'https://hn.algolia.com/api/v1/search_by_date?query=technology&tags=story&hitsPerPage=5';
  let articles = [];
  try {
    const hnRes = await fetch(hnUrl);
    const hnData = await hnRes.json();
    if (Array.isArray(hnData.hits)) {
      articles = hnData.hits.map((hit, idx) => ({
        title: hit.title || hit.story_title,
        url: hit.url || hit.story_url,
        source: 'Hacker News',
        /*
         * Provide a random placeholder image for each article. Using
         * the picsum.photos service avoids the reliability issues
         * encountered with the previous Unsplash-based image URLs (which
         * returned an application error on deployment). A unique seed
         * based on the current timestamp and article index ensures each
         * news item gets a distinct image while still being cacheable.
         */
        image: `https://picsum.photos/seed/${Date.now() + idx}/600/300`,
      }));
    }
  } catch (error) {
    console.error('News API error:', error);
  }
  // Respond with a consistent articles array. Even on error this will be empty.
  res.status(200).json({ articles });
}