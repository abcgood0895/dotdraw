async function generate() {
    const prompt = document.getElementById('prompt').value;
    document.getElementById('status').innerText = '圖片生成中...';
    document.getElementById('output').style.display = 'none';

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        if (data.image) {
            document.getElementById('output').src = data.image;
            document.getElementById('output').style.display = 'block';
            document.getElementById('status').innerText = '圖片生成完成！';
        } else {
            document.getElementById('status').innerText = '錯誤：' + (data.error || '未知錯誤');
        }
    } catch (err) {
        document.getElementById('status').innerText = '請求失敗：' + err.message;
    }
}

function clearImage() {
    document.getElementById('prompt').value = '';
    document.getElementById('output').src = '';
    document.getElementById('output').style.display = 'none';
    document.getElementById('status').innerText = '';
}