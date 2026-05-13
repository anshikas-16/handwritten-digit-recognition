const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

ctx.strokeStyle = 'white';
ctx.lineWidth = 18;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

canvas.addEventListener('mousedown', (e) => { isDrawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
canvas.addEventListener('mousemove', (e) => { if (!isDrawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); });
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);

// Touch support
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); isDrawing = true; const t = e.touches[0]; const r = canvas.getBoundingClientRect(); ctx.beginPath(); ctx.moveTo(t.clientX - r.left, t.clientY - r.top); });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); if (!isDrawing) return; const t = e.touches[0]; const r = canvas.getBoundingClientRect(); ctx.lineTo(t.clientX - r.left, t.clientY - r.top); ctx.stroke(); });
canvas.addEventListener('touchend', () => isDrawing = false);

document.getElementById('clearBtn').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('result').style.display = 'none';
});

document.getElementById('predictBtn').addEventListener('click', async () => {
  const imageData = canvas.toDataURL('image/png');
  const response = await fetch('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageData })
  });
  const data = await response.json();
  document.getElementById('digit').textContent = data.digit;
  document.getElementById('confidence').textContent = data.confidence;
  document.getElementById('confidenceFill').style.width = data.confidence + '%';
  document.getElementById('result').style.display = 'block';
});