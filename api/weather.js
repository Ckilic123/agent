export default async function handler(req, res) {
  /**
   * Weather handler
   *
   * This endpoint gathers weather data from the free open‑source
   * Open‑Meteo API. To avoid any paid services, we query two different
   * endpoints: one for the current conditions and another for an hourly
   * forecast. Both endpoints are free and require no API key. The
   * responses are normalised into a simple shape consumed by the
   * front‑end.
   */
  const latitude = 48.13743; // Munich
  const longitude = 11.57549;
  try {
    // Request current conditions and a 5‑day daily forecast in one call.
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=5&timezone=Europe%2FBerlin`
    );
    const weatherData = await weatherRes.json();
    const response = {
      city: 'Munich',
      current: weatherData.current_weather || weatherData.current || {
        temperature: null,
        windspeed: null,
        wind_direction: null,
        weathercode: null,
      },
      daily: weatherData.daily || { time: [], temperature_2m_max: [], temperature_2m_min: [], weathercode: [] },
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
}