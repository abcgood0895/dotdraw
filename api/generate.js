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
                'Authorization': Token ${apiKey}
            },
            body: JSON.stringify({
                version: "a9758cb5caa5e57692d5951c8fb96b364a765f9d75038c73c58aa0f10c6c78b0", // Stable Diffusion v1.5
                input: { prompt }
            })
        });

        const result = await response.json();

        if (!result.output || !Array.isArray(result.output)) {
            return res.status(500).json({ error: '圖片生成失敗或格式錯誤' });
        }

        const imageUrl = result.output[0];
        res.status(200).json({ image: imageUrl });
    } catch (error) {
        res.status(500).json({ error: "API 錯誤：" + error.message });
    }
}