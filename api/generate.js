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
        const response = await fetch('https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ inputs: prompt })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(500).json({ error: errorText });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer).toString('base64');
        const imageUrl = `data:image/png;base64,${buffer}`;

        res.status(200).json({ image: imageUrl });
    } catch (error) {
        res.status(500).json({ error: "API 呼叫失敗：" + error.message });
    }
}
