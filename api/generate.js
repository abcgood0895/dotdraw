export default async function handler(req, res) {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    const { prompt } = req.body;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${REPLICATE_API_TOKEN}`
        },
        body: JSON.stringify({
            version: "db21e45e0e38f8350f11c3cfd707e37cf6d05d6e83b5f6c3ba4c1660bdf0b10c",
            input: { prompt: prompt }
        })
    });

    const prediction = await response.json();
    const getUrl = prediction?.urls?.get;

    if (!getUrl) {
        return res.status(500).json({ error: "API 啟動失敗" });
    }

    const poll = async () => {
        while (true) {
            const result = await fetch(getUrl, {
                headers: { "Authorization": `Token ${REPLICATE_API_TOKEN}` }
            });
            const status = await result.json();
            if (status.status === "succeeded") return status.output[0];
            if (status.status === "failed") throw new Error("生成失敗");
            await new Promise(r => setTimeout(r, 2000));
        }
    };

    try {
        const image = await poll();
        res.status(200).json({ image });
    } catch {
        res.status(500).json({ error: "圖片生成失敗" });
    }
}
