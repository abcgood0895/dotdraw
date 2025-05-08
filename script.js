async function generate() {
  const prompt = document.getElementById("prompt").value;
  const resultDiv = document.getElementById("result");
  document.getElementById("status").innerText = "生成中...";
  resultDiv.innerHTML = "";

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  if (data.image) {
    const img = document.createElement("img");
    img.src = data.image;
    img.alt = "生成的圖片";
    img.style.maxWidth = "100%";
    img.onerror = () => {
      resultDiv.innerHTML = "圖片載入失敗，請稍候重試或檢查網址：" + data.image;
    };
    resultDiv.appendChild(img);
    document.getElementById("status").innerText = "圖片生成完成！";
  } else {
    document.getElementById("status").innerText = "錯誤：" + data.error;
  }
}

function clearImage() {
  document.getElementById("result").innerHTML = "";
  document.getElementById("status").innerText = "";
}

function retry() {
  generate();
}