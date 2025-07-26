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
    // Query current weather and hourly forecast in parallel
    const [currentRes, hourlyRes] = await Promise.all([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe%2FBerlin`
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m&timezone=Europe%2FBerlin`
      ),
    ]);
    const currentData = await currentRes.json();
    const hourlyData = await hourlyRes.json();
    const response = {
      current:
        currentData.current_weather || currentData.current || {
          temperature: null,
          windspeed: null,
          wind_direction: null,
          weathercode: null,
        },
      hourly: hourlyData.hourly || hourlyData,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Unable to fetch weather data' });
  }
}