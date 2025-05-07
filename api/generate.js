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
        const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Token ${apiKey}
            },
            body: JSON.stringify({
                version: "a9758cb5caa5e57692d5951c8fb96b364a765f9d75038c73c58aa0f10c6c78b0",
                input: { prompt }
            })
        });

        const result = await replicateResponse.json().catch(async () => {
            const text = await replicateResponse.text();
            throw new Error("非 JSON 錯誤回應：" + text);
        });

        if (replicateResponse.status !== 201) {
            return res.status(500).json({ error: result.detail || '圖片生成失敗' });
        }

        res.status(200).json({ image: result.output[0] });
    } catch (err) {
        res.status(500).json({ error: "API 錯誤：" + err.message });
    }
}