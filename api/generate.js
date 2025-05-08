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
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({
        version: "f1786f20b8005bfa721bdfb47dc4b578e3c83dbf3c0c68f5bc231ce1c4c80348",
        input: { prompt }
      }),
    });

    const result = await response.json();
    if (result.error || result.detail) {
      return res.status(400).json({ error: result.error || result.detail });
    }

    const predictionURL = result.urls.get;
    const getRes = await fetch(predictionURL, {
      headers: { Authorization: `Token ${apiKey}` },
    });

    const getResult = await getRes.json();
    const imageUrl = getResult.output?.[0] || null;

    res.status(200).json({ image: imageUrl });
  } catch (err) {
    res.status(500).json({ error: "伺服器錯誤：" + err.message });
  }
}
