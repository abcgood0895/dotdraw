
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body.prompt;
  const apiKey = process.env.HUGGINGFACE_API_TOKEN;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Hugging Face API token.' });
  }

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const result = await response.json();

    if (result.error) {
      return res.status(400).json({ error: "API response error: " + result.error });
    }

    const imageUrl = result[0]?.url || "生成失敗";
    return res.status(200).json({ image: imageUrl });
  } catch (error) {
    return res.status(500).json({ error: "API 呼叫失敗：" + error.message });
  }
}
