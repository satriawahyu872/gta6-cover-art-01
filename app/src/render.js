// Midnight Boulevard — the poster renderer. Draws the seven-panel cast
// poster onto a canvas at the export size, with the chosen look's grade.

function fitFont(ctx, text, maxWidth, startPx, family, weight) {
  let px = startPx;
  const set = (s) => { ctx.font = `${weight ? weight + ' ' : ''}${s}px ${family}`; };
  set(px);
  while (px > 8 && ctx.measureText(text).width > maxWidth) {
    px -= 1;
    set(px);
  }
  return px;
}

function drawPhotoCover(ctx, img, x, y, w, h, zoom, fx, fy) {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.max(w / iw, h / ih) * zoom;
  const dw = iw * scale, dh = ih * scale;
  const dx = x + (w - dw) * fx;
  const dy = y + (h - dh) * fy;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function panelGeometry(W, H) {
  const m = Math.round(W * 0.018);
  const th = Math.round(H * 0.15);
  const bh = Math.round(H * 0.115);
  const y0 = th, y1 = H - bh, ph = y1 - y0;
  const wide = W > H;
  const heroW = Math.round((W - 3 * m) * (wide ? 0.40 : 0.54));
  const hero = { x: m, y: y0, w: heroW, h: ph };
  const gx = hero.x + hero.w + m;
  const gw = W - gx - m;
  const cols = wide ? 3 : 2, rows = wide ? 2 : 3;
  const cw = (gw - (cols - 1) * m) / cols;
  const ch = (ph - (rows - 1) * m) / rows;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: gx + c * (cw + m), y: y0 + r * (ch + m), w: cw, h: ch });
    }
  }
  return { m, th, bh, y0, y1, ph, hero, cells, wide };
}

function drawRoleChip(ctx, box, panel, look, hero) {
  const pad = Math.max(8, box.w * 0.03);
  const chipH = hero ? box.h * 0.20 : box.h * 0.26;
  const cy = box.y + box.h - chipH;
  ctx.fillStyle = look.chip;
  ctx.fillRect(box.x, cy, box.w, chipH);
  ctx.fillStyle = look.accent;
  ctx.fillRect(box.x, cy, Math.max(4, box.w * 0.015), chipH);
  const tx = box.x + pad + Math.max(4, box.w * 0.015);
  const tw = box.w - (tx - box.x) - pad;
  const rolePx = fitFont(ctx, panel.role, tw, hero ? box.w * 0.075 : box.w * 0.085, '"Alfa Slab One", serif', '');
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(panel.role, tx, cy + chipH * (hero ? 0.32 : 0.34));
  const capPx = Math.max(9, rolePx * 0.42);
  ctx.font = `${capPx}px system-ui, sans-serif`;
  ctx.fillStyle = '#d6d9ec';
  const cap = panel.cap.length > 26 ? panel.cap.slice(0, 25) + '…' : panel.cap;
  ctx.fillText(cap, tx, cy + chipH * (hero ? 0.74 : 0.76));
}

function drawBarcode(ctx, x, y, w, h) {
  const bars = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2];
  let bx = x;
  const unit = w / 42;
  ctx.fillStyle = '#ffffff';
  for (const b of bars) {
    const bw = b * unit;
    if (bx + bw <= x + w) ctx.fillRect(bx, y, bw * 0.62, h);
    bx += bw;
  }
}

function drawSeal(ctx, cx, cy, r, look) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.22);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = look.accent;
  ctx.fill();
  ctx.lineWidth = Math.max(2, r * 0.08);
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${Math.round(r * 0.34)}px "Alfa Slab One", serif`;
  ctx.fillText('BEST', 0, -r * 0.22);
  ctx.fillText('CAST', 0, r * 0.22);
  ctx.font = `${Math.round(r * 0.3)}px system-ui, sans-serif`;
  ctx.fillText('★', 0, -r * 0.58);
  ctx.fillText('★', 0, r * 0.58);
  ctx.restore();
  ctx.textAlign = 'left';
}

function drawPoster(canvas, state, photos) {
  const look = LOOKS[state.look];
  const size = SIZES[state.size];
  const W = size.w, H = size.h;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const g = panelGeometry(W, H);
  const u = W / 1080;

  ctx.fillStyle = look.bg;
  ctx.fillRect(0, 0, W, H);

  // Title band: dark neon gradient, big slab title, volume number.
  const grad = ctx.createLinearGradient(0, 0, 0, g.th);
  grad.addColorStop(0, look.bandTop);
  grad.addColorStop(1, look.bandBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, g.th);
  ctx.fillStyle = look.accent2;
  ctx.font = `${Math.round(15 * u)}px system-ui, sans-serif`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('T H E   C I T Y   N E V E R   S L E E P S', g.m * 1.4, g.th * 0.26);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = `${Math.round(17 * u)}px "Alfa Slab One", serif`;
  ctx.fillText('VOL. VIII', W - g.m * 1.4, g.th * 0.27);
  ctx.textAlign = 'left';
  const titlePx = fitFont(ctx, state.title, W - g.m * 2.8, Math.round(92 * u), '"Alfa Slab One", serif', '');
  ctx.fillStyle = '#ffffff';
  ctx.fillText(state.title, g.m * 1.4, g.th * 0.82);
  ctx.fillStyle = look.accent;
  ctx.fillRect(g.m * 1.4, g.th * 0.9, Math.min(W * 0.42, ctx.measureText(state.title).width), Math.max(3, 6 * u));
  // A thin neon line closes the title band.
  ctx.fillStyle = look.accent2;
  ctx.fillRect(0, g.th - Math.max(2, 3 * u), W, Math.max(2, 3 * u));

  // Panels: hero on the left, six crew cells on the right.
  const boxes = [g.hero, ...g.cells];
  state.panels.forEach((panel, i) => {
    const box = boxes[i];
    if (!box) return;
    const img = panel.img || photos[panel.photo];
    if (img) drawPhotoCover(ctx, img, box.x, box.y, box.w, box.h, panel.zoom, panel.fx, panel.fy);
    ctx.globalCompositeOperation = look.tintMode;
    ctx.fillStyle = look.tint;
    ctx.fillRect(box.x, box.y, box.w, box.h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = Math.max(2, 3 * u);
    ctx.strokeStyle = 'rgba(255,255,255,0.92)';
    ctx.strokeRect(box.x, box.y, box.w, box.h);
    drawRoleChip(ctx, box, panel, look, i === 0);
  });

  // BEST CAST seal overlapping the hero's top-right corner.
  drawSeal(ctx, g.hero.x + g.hero.w - 6 * u, g.hero.y + 6 * u, Math.round(52 * u), look);

  // Bottom strip: quote ribbon, credits, barcode, coming soon.
  const by = H - g.bh;
  ctx.save();
  ctx.translate(W / 2, by + g.bh * 0.30);
  ctx.rotate(-0.015);
  ctx.fillStyle = look.accent;
  ctx.fillRect(-W / 2, -g.bh * 0.17, W, g.bh * 0.34);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const qPx = fitFont(ctx, '“' + state.quote + '”', W * 0.86, Math.round(30 * u), '"Permanent Marker", cursive', '');
  ctx.fillText('“' + state.quote + '”', 0, 0);
  ctx.restore();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8d93b5';
  ctx.font = `${Math.round(13 * u)}px system-ui, sans-serif`;
  ctx.fillText(state.credits || CREDITS, W / 2, by + g.bh * 0.62);
  ctx.textAlign = 'left';
  ctx.fillStyle = look.accent2;
  ctx.font = `${Math.round(19 * u)}px "Alfa Slab One", serif`;
  ctx.fillText('COMING SOON', g.m * 1.4, by + g.bh * 0.88);
  drawBarcode(ctx, W - g.m * 1.4 - 150 * u, by + g.bh * 0.70, 150 * u, g.bh * 0.24);
  ctx.textAlign = 'left';
}
