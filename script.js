async function generateImage() {
    const prompt = document.getElementById("promptInput").value;
    const status = document.getElementById("status");
    const preview = document.getElementById("imagePreview");

    if (!prompt) {
        alert("請先輸入提示詞！");
        return;
    }

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
        } else {
            status.textContent = "圖片生成完成！";
            preview.innerHTML = `<img src="${data.image}" alt="生成圖片">`;
        }
    } catch (err) {
        status.textContent = "請求失敗：" + err.message;
    }
}

function clearImage() {
    document.getElementById("imagePreview").innerHTML = "";
    document.getElementById("status").textContent = "";
}

function regenerateImage() {
    generateImage();
}