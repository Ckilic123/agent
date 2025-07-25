export default async function handler(req, res) {
  /**
   * Chat handler
   *
   * Uses the Groq AI chat completion API to generate a response. The API
   * key may be provided via the GROQ_API_KEY environment variable. If
   * no key is available or the request fails, the handler falls back
   * to a simple echo response to ensure the endpoint always returns
   * something. Keeping a hard‑coded key in source is generally bad
   * practice; however, it's included here as a fallback so the demo
   * works out of the box. For production use, define
   * GROQ_API_KEY in your Vercel project settings.
   */
  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ reply: 'No message provided' });
  }
  const apiKey = process.env.GROQ_API_KEY || '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';
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          { role: 'system', content: 'You are a helpful AI dashboard assistant.' },
          { role: 'user', content: message },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || null;
    if (reply) {
      return res.status(200).json({ reply });
    }
    // fall through to echo if no reply
  } catch (error) {
    console.error('Chat API error:', error);
  }
  // Fallback echo response
  return res.status(200).json({ reply: `You said: ${message}` });
}
