// Midnight Boulevard — the editor: loads photos and fonts, builds the
// control panel, re-renders the poster on every change, and exports PNGs.
// ?shot=cover|editor|cover2|square renders the four screenshot scenes.

const state = defaultState();
const photos = {};
const canvas = document.getElementById('poster');

function loadPhoto(name) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = 'samples/' + name;
  });
}

async function loadAll() {
  const names = [...new Set(state.panels.map((p) => p.photo))];
  const loaded = await Promise.all(names.map(loadPhoto));
  names.forEach((n, i) => { if (loaded[i]) photos[n] = loaded[i]; });
  try { await document.fonts.ready; } catch (e) { /* fonts fall back */ }
}

function render() {
  const size = SIZES[state.size];
  canvas.classList.toggle('wide', state.size === 'wide');
  drawPoster(canvas, state, photos);
}

function choiceRow(el, items, current, onPick) {
  el.innerHTML = '';
  items.forEach(([key, label]) => {
    const b = document.createElement('button');
    b.className = 'choice' + (key === current ? ' active' : '');
    b.textContent = label;
    b.onclick = () => { onPick(key); };
    el.appendChild(b);
  });
}

function buildControls() {
  choiceRow(
    document.getElementById('look-row'),
    Object.entries(LOOKS).map(([k, v]) => [k, v.name]),
    state.look,
    (k) => { state.look = k; buildControls(); render(); },
  );
  choiceRow(
    document.getElementById('size-row'),
    Object.entries(SIZES).map(([k, v]) => [k, v.label]),
    state.size,
    (k) => { state.size = k; buildControls(); render(); },
  );

  document.getElementById('in-title').oninput = (e) => { state.title = e.target.value.toUpperCase(); render(); };
  document.getElementById('in-tagline').oninput = (e) => { state.tagline = e.target.value.toUpperCase(); render(); };
  document.getElementById('in-quote').oninput = (e) => { state.quote = e.target.value; render(); };

  const list = document.getElementById('panel-list');
  list.innerHTML = '';
  state.panels.forEach((panel, idx) => {
    const card = document.createElement('div');
    card.className = 'panel-card';
    card.innerHTML = `<h3>${idx === 0 ? '★ HERO — ' : ''}${panel.role}</h3>`;
    const grid = document.createElement('div');
    grid.className = 'grid2';

    const mkField = (label, input) => {
      const lab = document.createElement('label');
      lab.className = 'field';
      lab.textContent = label;
      const wrap = document.createElement('div');
      wrap.appendChild(lab);
      wrap.appendChild(input);
      return wrap;
    };
    const mkRange = (val, min, max, step, fn) => {
      const r = document.createElement('input');
      r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = val;
      r.oninput = () => fn(Number(r.value));
      return r;
    };
    const mkText = (val, max, fn) => {
      const t = document.createElement('input');
      t.type = 'text'; t.value = val; t.maxLength = max;
      t.oninput = () => fn(t.value);
      return t;
    };

    const file = document.createElement('input');
    file.type = 'file';
    file.accept = 'image/*';
    file.onchange = () => {
      const f = file.files && file.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => { panel.img = img; render(); };
        img.src = reader.result;
      };
      reader.readAsDataURL(f);
    };

    grid.appendChild(mkField('Your photo', file));
    grid.appendChild(mkField('Role label', mkText(panel.role, 16, (v) => { panel.role = v.toUpperCase(); render(); })));
    grid.appendChild(mkField('Caption', mkText(panel.cap, 28, (v) => { panel.cap = v; render(); })));
    grid.appendChild(mkField('Zoom', mkRange(panel.zoom, 1, 2.2, 0.05, (v) => { panel.zoom = v; render(); })));
    grid.appendChild(mkField('Focus left–right', mkRange(panel.fx, 0, 1, 0.01, (v) => { panel.fx = v; render(); })));
    grid.appendChild(mkField('Focus up–down', mkRange(panel.fy, 0, 1, 0.01, (v) => { panel.fy = v; render(); })));
    card.appendChild(grid);
    list.appendChild(card);
  });

  document.getElementById('btn-export').onclick = exportPng;
}

function exportPng() {
  const size = SIZES[state.size];
  const off = document.createElement('canvas');
  drawPoster(off, state, photos);
  off.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `midnight-boulevard-${state.look}-${state.size}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }, 'image/png');
}

function applyShot() {
  const shot = new URLSearchParams(location.search).get('shot');
  if (!shot) return;
  // Only the cover scenes hide the editor chrome; 'editor' keeps the
  // full editor visible so the screenshot shows the app at work.
  if (shot === 'cover') { document.body.classList.add('shot'); state.look = 'midnight'; state.size = 'portrait'; }
  if (shot === 'cover2') { document.body.classList.add('shot'); state.look = 'electric'; state.size = 'portrait'; }
  if (shot === 'square') { document.body.classList.add('shot'); state.look = 'crimson'; state.size = 'square'; }
}

async function boot() {
  applyShot();
  await loadAll();
  buildControls();
  render();
  document.title = 'ready';
  // A handle for the finalist review and for debugging in the console.
  window.__midnight = { state, render, exportPng };
}

boot();
