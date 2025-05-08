export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body.prompt;
  const apiKey = process.env.REPLICATE_API_TOKEN;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Replicate API token.' });
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`
      },
      body: JSON.stringify({
        version: "tstramer/material-diffusion",
        input: { prompt }
      })
    });

    const text = await response.text();

    try {
      const result = JSON.parse(text);
      if (result.detail) {
        return res.status(400).json({ error: result.detail });
      }

      const imageUrl = result.output?.[0] || "生成失敗";
      return res.status(200).json({ image: imageUrl });
    } catch (e) {
      return res.status(500).json({ error: "伺服器回傳格式錯誤：" + text });
    }
  } catch (error) {
    res.status(500).json({ error: "API 呼叫失敗：" + error.message });
  }
}