export default async function handler(req, res) {
  /**
   * Events handler
   *
   * This endpoint returns a curated list of upcoming weekend events in
   * Munich. The suggestions are based on highlights from Rausgegangen’s
   * weekend tips, focusing on concerts, festivals and food events. No
   * external API calls are made here to keep the endpoint fast and
   * reliable.
   */
  const events = [
    {
      title: 'THEATRON MUSIKSOMMER 2025: Ellie Benn & Band + JUNIT',
      date: 'Fri, 1 Aug',
      venue: 'Theatron im Olympiapark',
      description: 'Free open‑air concert with Ellie Benn & Band and JUNIT',
    },
    {
      title: 'Wannda Circus Open Air',
      date: 'Sat, 2 Aug',
      venue: 'Wannda Circus',
      description: 'Festival & circus atmosphere with music, art and performances',
    },
    {
      title: 'Street Food Festival – Pineapple Park',
      date: 'Sun, 3 Aug',
      venue: 'Pineapple Park',
      description: 'Try delicious street food from around the world',
    },
  ];
  res.status(200).json({ events });
}