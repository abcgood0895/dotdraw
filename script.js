async function generate() {
  const prompt = document.getElementById("prompt").value;
  document.getElementById("status").innerText = "生成中...";
  document.getElementById("result").style.display = "none";

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  if (data.image) {
    document.getElementById("status").innerText = "圖片生成完成！";
    document.getElementById("result").src = data.image;
    document.getElementById("result").style.display = "block";
  } else {
    document.getElementById("status").innerText = "錯誤：" + data.error;
  }
}

function clearImage() {
  document.getElementById("result").src = "";
  document.getElementById("result").style.display = "none";
  document.getElementById("status").innerText = "";
}

function retry() {
  generate();
}