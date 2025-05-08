export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const prompt = req.body.prompt;
  const apiKey = process.env.HUGGINGFACE_API_TOKEN;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing Hugging Face API token." });
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/prompthero/openjourney", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      return res.status(500).json({ error: "API response error: " + JSON.stringify(result) });
    } else {
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const imageUrl = `data:image/png;base64,${base64}`;
      return res.status(200).json({ image: imageUrl });
    }
  } catch (error) {
    return res.status(500).json({ error: "API 呼叫失敗：" + error.message });
  }
}