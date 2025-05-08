let lastPrompt = "";

async function generateImage() {
    const promptInput = document.getElementById("promptInput");
    const prompt = promptInput.value;
    const status = document.getElementById("status");
    const preview = document.getElementById("imagePreview");

    if (!prompt) {
        alert("請先輸入提示詞！");
        return;
    }

    lastPrompt = prompt;
    status.textContent = "圖片生成中，請稍候...";
    preview.innerHTML = "";

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        if (data.error) {
            status.textContent = "錯誤：" + data.error;
            return;
        }

        status.textContent = "圖片生成完成，點圖可下載";
        preview.innerHTML = `<a href="${data.image}" download><img src="${data.image}" alt="生成圖片"></a>`;
    } catch (err) {
        status.textContent = "請求失敗：" + err.message;
    }
}

function clearResult() {
    document.getElementById("promptInput").value = "";
    document.getElementById("status").textContent = "";
    document.getElementById("imagePreview").innerHTML = "";
    lastPrompt = "";
}

function regenerateImage() {
    if (lastPrompt) {
        document.getElementById("promptInput").value = lastPrompt;
        generateImage();
    } else {
        alert("請先生成一張圖片！");
    }
}