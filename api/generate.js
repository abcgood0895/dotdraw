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
                version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
                input: {
                    prompt: prompt,
                    scheduler: "K_EULER"
                }
            })
        });

        const result = await response.json();

        if (result.detail) {
            return res.status(400).json({ error: result.detail });
        }

        const getOutput = async (url) => {
            let statusResult;
            while (true) {
                const res = await fetch(url, {
                    headers: {
                        'Authorization': Token ${apiKey}
                    }
                });
                statusResult = await res.json();
                if (statusResult.status === 'succeeded') break;
                if (statusResult.status === 'failed') throw new Error('生成失敗');
                await new Promise(r => setTimeout(r, 1000));
            }
            return statusResult.output?.[0];
        };

        const imageUrl = await getOutput(result.urls.get);
        res.status(200).json({ image: imageUrl });

    } catch (error) {
        res.status(500).json({ error: "API 啟動失敗：" + error.message });
    }
}