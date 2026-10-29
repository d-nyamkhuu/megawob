// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-restyle-01',
  name: 'design',
  split: 'train',
  scenarios: ['restyle'],
  template: 'use-slides/office',
  design: {
    uiFont: 'Georgia, "Times New Roman", serif',
    documentFont: 'Georgia, "Times New Roman", serif',
    brand: 'Sunrise Office Suite',
    editorLabel: 'Sunrise Office Suite presentation editor',
    frameInset: 0,
    compactAt: 1050,
    tightAt: 720,
    inspectorAt: 1600,
    railWidth: 194,
    compactRailWidth: 160,
    thumbnailPitch: 132,
    thumbnailHeight: 112,
    canvasInsetX: 20,
    canvasInsetY: 24,
    maxScale: 1.35,
    parts: {
      slideHeading: (base, S) => (canvas) => {
        base(canvas);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 720 400');
        svg.setAttribute('class', 'sunrise-slide-art');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = '<defs><linearGradient id="lake" x2="0" y2="1"><stop stop-color="#a8bedb"/><stop offset=".55" stop-color="#49677d"/><stop offset="1" stop-color="#172f46"/></linearGradient><linearGradient id="mount" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".45" stop-color="#8799a4"/><stop offset="1" stop-color="#293b49"/></linearGradient></defs><rect x="28" y="16" width="92" height="366" fill="#aeb9e8" opacity=".82"/><path d="M140 45H560" stroke="#5269cf" stroke-width="3"/><rect x="575" y="24" width="38" height="42" fill="#799b8d"/><rect x="620" y="24" width="38" height="42" fill="#367ec5"/><rect x="665" y="24" width="38" height="42" fill="#aa97df"/><path d="M165 220H690" stroke="#27805f" stroke-width="4"/><rect x="48" y="275" width="300" height="112" fill="#bec9d1"/><path d="M54 343 102 287l40 37 48-62 39 41 40-48 74 69v58H54z" fill="url(#mount)"/><path d="m95 296 7-9 8 10m82-31 6-8 8 9m62-25 8-9 8 12" fill="none" stroke="#fff" stroke-width="5" opacity=".9"/><path d="M54 344 103 333l39 3 48-24 39 13 40-18 74 34v46H54z" fill="url(#lake)"/><path d="M55 362q45-12 92 0t91 0 108 0" fill="none" stroke="#d9e5e7" stroke-width="3" opacity=".7"/><g fill="#173b36" opacity=".96"><path d="m57 350 9-19 9 19h-5l8 12H54l8-12zm25-2 8-17 8 17h-5l7 11H79l7-11zm25 5 10-21 10 21h-6l8 13h-24l8-13zm28-1 8-18 9 18h-5l7 11h-21l7-11zm23 3 9-20 9 20h-5l8 12h-24l8-12zm26-5 8-17 9 17h-5l7 11h-21l7-11zm24 6 10-21 10 21h-6l8 13h-24l8-13zm29-3 8-18 9 18h-5l7 11h-21l7-11zm24 4 9-20 9 20h-5l8 12h-24l8-12zm27-3 8-17 9 17h-5l7 11h-21l7-11zm24 5 10-21 10 21h-6l8 13h-24l8-13zm26-5 8-17 9 17h-5l7 11h-21l7-11z"/></g><path d="M58 377h286" stroke="#162d31" stroke-width="7" opacity=".8"/>';
        canvas.prepend(svg);
      },
      styleTools: (base, S) => (tools) => {
        base(tools);
        const task = document.createElement('div'); task.className = 'sunrise-tools-value sunrise-font-family';
        task.textContent = 'Times New Roman　▾'; tools.insertBefore(task, tools.firstChild);
        const emphasis = document.createElement('div'); emphasis.className = 'sunrise-emphasis-row';
        const bold = tools.querySelector('button[title="B"]'), italic = tools.querySelector('button[title="I"]');
        if (bold && italic) {
          const underline = document.createElement('span'); underline.className = 'sunrise-tools-key sunrise-underline'; underline.textContent = 'U';
          underline.style.textDecoration = 'underline';
          tools.insertBefore(emphasis, bold); emphasis.append(bold, italic, underline);
        }
        const colorLabel = Array.from(tools.querySelectorAll('.as-sub')).find((el) => /colour/i.test(el.textContent));
        if (colorLabel) {
          const swatches = document.createElement('div'); swatches.className = 'sunrise-color-row';
          colorLabel.after(swatches);
          for (const color of Array.from(tools.querySelectorAll('.as-color'))) swatches.appendChild(color);
        }
        const group = (title, symbols) => {
          const box = document.createElement('div'); box.className = 'sunrise-tools-group';
          const head = document.createElement('div'); head.className = 'sunrise-tools-label'; head.textContent = title; box.appendChild(head);
          const row = document.createElement('div'); row.className = 'sunrise-tools-row';
          for (const symbol of symbols) { const key = document.createElement('span'); key.className = 'sunrise-tools-key'; key.textContent = symbol; row.appendChild(key); }
          box.appendChild(row); tools.appendChild(box);
        };
        group('Alignment:', ['☰', '≡', '☷']);
        group('Bullets:', ['• ☰', '1. ☰']);
        const spacing = document.createElement('div'); spacing.className = 'sunrise-tools-group';
        const label = document.createElement('div'); label.className = 'sunrise-tools-label'; label.textContent = 'Line Spacing:'; spacing.appendChild(label);
        const value = document.createElement('div'); value.className = 'sunrise-tools-value'; value.textContent = '1.0　▾'; spacing.appendChild(value); tools.appendChild(spacing);
      },
    },
  },
});
