const generateButton = document.getElementById("generateBtn");
const clearButton = document.getElementById("clearBtn");
const regenerateButton = document.getElementById("regenerateBtn");
const result = document.getElementById("result");

generateButton.addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value;
    result.innerHTML = "生成中...";
    const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if (data.image) {
        if (data.image.startsWith("data:image") || data.image.startsWith("http")) {
            const img = document.createElement("img");
            img.src = data.image;
            result.innerHTML = "圖片生成完成！";
            result.appendChild(img);
        } else {
            result.innerHTML = "圖片載入失敗，請稍候重試或檢查網址：" + data.image;
        }
    } else {
        result.innerHTML = "錯誤：" + data.error;
    }
});

clearButton.addEventListener("click", () => {
    document.getElementById("prompt").value = "";
    result.innerHTML = "";
});

regenerateButton.addEventListener("click", () => {
    generateButton.click();
});
