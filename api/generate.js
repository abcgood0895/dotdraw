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
                version: "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",
                input: { prompt: prompt }
            })
        });

        const text = await response.text();

        try {
            const result = JSON.parse(text);
            if (result.error || result.detail) {
                return res.status(400).json({ error: result.error || result.detail });
            }
            const imageUrl = result.output?.[0] || "生成失敗";
            return res.status(200).json({ image: imageUrl });
        } catch (e) {
            return res.status(500).json({ error: "伺服器回傳格式錯誤：" + text });
        }

    } catch (error) {
        res.status(500).json({ error: "API 請求失敗：" + error.message });
    }
}