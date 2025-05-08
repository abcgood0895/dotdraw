
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const prompt = req.body.prompt;
  const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

  if (!HF_API_TOKEN) {
    return res.status(500).json({ error: 'Missing Hugging Face API token.' });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/prompthero/openjourney", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_API_TOKEN}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64Image}`;

    res.status(200).json({ image: imageUrl });
  } catch (error) {
    res.status(500).json({ error: "API 呼叫失敗：" + error.message });
  }
}
