async function generateImage() {
    const prompt = document.getElementById("promptInput").value;
    document.getElementById("status").innerText = "圖片生成中...";
    const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (res.ok) {
        document.getElementById("status").innerText = "圖片生成完成！";
        document.getElementById("imagePreview").innerHTML = `<img src="${data.image}" alt="生成圖片">`;
    } else {
        document.getElementById("status").innerText = "錯誤：" + data.error;
        document.getElementById("imagePreview").innerHTML = "";
    }
}

function clearImage() {
    document.getElementById("promptInput").value = "";
    document.getElementById("imagePreview").innerHTML = "";
    document.getElementById("status").innerText = "";
}

function regenerateImage() {
    generateImage();
}
