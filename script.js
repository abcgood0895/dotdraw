
async function generateImage() {
  const prompt = document.getElementById("prompt").value;
  const status = document.getElementById("status");
  const image = document.getElementById("resultImage");
  status.innerText = "生成中...";
  image.src = "";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    if (data.image) {
      status.innerText = "圖片生成完成！";
      image.src = data.image;
    } else {
      status.innerText = "錯誤：" + data.error;
    }
  } catch (err) {
    status.innerText = "請求失敗：" + err.message;
  }
}

function clearImage() {
  document.getElementById("status").innerText = "";
  document.getElementById("resultImage").src = "";
  document.getElementById("prompt").value = "";
}

function regenerateImage() {
  generateImage();
}
