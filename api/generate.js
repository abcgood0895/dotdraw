
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body.prompt;
  const apiToken = process.env.HUGGINGFACE_API_TOKEN;

  if (!apiToken) {
    return res.status(500).json({ error: 'Missing Hugging Face API token.' });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: "API response error: " + errorText });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.status(200).json({ image: imageUrl });
  } catch (err) {
    res.status(500).json({ error: "API 呼叫失敗：" + err.message });
  }
}
