// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-restyle-05',
  name: 'design',
  split: 'train',
  scenarios: ['restyle'],
  template: 'use-slides/office',
  design: {
    uiFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    documentFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    brand: 'Nature & You',
    editorLabel: 'Nature & You presentation editor',
    frameInset: 0,
    compactAt: 1050,
    tightAt: 720,
    inspectorAt: 1600,
    railWidth: 242,
    compactRailWidth: 158,
    thumbnailPitch: 112,
    thumbnailHeight: 104,
    canvasInsetX: 16,
    canvasInsetY: 20,
    maxScale: 2,
    parts: {
      locate: (base, S) => (target) => {
        const result = base(target);
        const picker = S.root.querySelector('.glass-color-picker');
        if (target.color && picker && !picker.classList.contains('open')) {
          const rect = picker.querySelector('.glass-color-toggle').getBoundingClientRect();
          return [rect.left + rect.width / 2, rect.top + rect.height / 2];
        }
        return result;
      },
      sync: (base, S) => (...args) => {
        const result = base(...args);
        const canvas = S.root.querySelector('.as-canvas');
        const wrap = S.root.querySelector('.as-slidewrap');
        if (canvas && wrap && S.scale > 0) {
          const rect = wrap.getBoundingClientRect();
          if (rect.width && rect.height) {
            canvas.style.setProperty('width', `${rect.width / S.scale}px`, 'important');
            canvas.style.setProperty('height', `${rect.height / S.scale}px`, 'important');
          }
        }
        const shapes = Array.from(S.root.querySelectorAll('.as-shape'));
        shapes.forEach((shape, index) => {
          shape.dataset.glassFeature = String(index);
          shape.style.setProperty('left', `${35 + index * 115}px`, 'important');
          shape.style.setProperty('top', '258px', 'important');
        });
        const selected = S.root.querySelector('.as-shape.selected') || shapes[0];
        const toggle = S.root.querySelector('.glass-color-toggle');
        if (toggle && selected) toggle.style.setProperty('--selected-color', selected.style.color || '#0c4936');
        return result;
      },
      slideHeading: (base, S) => (canvas) => {
        base(canvas);
        const ridge = document.createElement('div'); ridge.className = 'glass-distant-ridge'; ridge.setAttribute('aria-hidden', 'true'); canvas.prepend(ridge);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 720 400');
        svg.setAttribute('class', 'sunrise-slide-art');
        svg.setAttribute('aria-hidden', 'true');
        svg.innerHTML = '<defs><linearGradient id="lake" x2="0" y2="1"><stop stop-color="#a8bedb"/><stop offset=".55" stop-color="#49677d"/><stop offset="1" stop-color="#172f46"/></linearGradient><linearGradient id="mount" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".45" stop-color="#8799a4"/><stop offset="1" stop-color="#293b49"/></linearGradient></defs><rect x="28" y="16" width="92" height="366" fill="#aeb9e8" opacity=".82"/><path d="M140 45H560" stroke="#5269cf" stroke-width="3"/><rect x="575" y="24" width="38" height="42" fill="#799b8d"/><rect x="620" y="24" width="38" height="42" fill="#367ec5"/><rect x="665" y="24" width="38" height="42" fill="#aa97df"/><path d="M165 220H690" stroke="#27805f" stroke-width="4"/><rect x="48" y="275" width="300" height="112" fill="#bec9d1"/><path d="M54 343 102 287l40 37 48-62 39 41 40-48 74 69v58H54z" fill="url(#mount)"/><path d="m95 296 7-9 8 10m82-31 6-8 8 9m62-25 8-9 8 12" fill="none" stroke="#fff" stroke-width="5" opacity=".9"/><path d="M54 344 103 333l39 3 48-24 39 13 40-18 74 34v46H54z" fill="url(#lake)"/><path d="M55 362q45-12 92 0t91 0 108 0" fill="none" stroke="#d9e5e7" stroke-width="3" opacity=".7"/><g fill="#173b36" opacity=".96"><path d="m57 350 9-19 9 19h-5l8 12H54l8-12zm25-2 8-17 8 17h-5l7 11H79l7-11zm25 5 10-21 10 21h-6l8 13h-24l8-13zm28-1 8-18 9 18h-5l7 11h-21l7-11zm23 3 9-20 9 20h-5l8 12h-24l8-12zm26-5 8-17 9 17h-5l7 11h-21l7-11zm24 6 10-21 10 21h-6l8 13h-24l8-13zm29-3 8-18 9 18h-5l7 11h-21l7-11zm24 4 9-20 9 20h-5l8 12h-24l8-12zm27-3 8-17 9 17h-5l7 11h-21l7-11zm24 5 10-21 10 21h-6l8 13h-24l8-13zm26-5 8-17 9 17h-5l7 11h-21l7-11z"/></g><path d="M58 377h286" stroke="#162d31" stroke-width="7" opacity=".8"/>';
        canvas.prepend(svg);
      },
      styleTools: (base, S) => (tools) => {
        base(tools);
        const icon = (paths) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
        const task = document.createElement('div'); task.className = 'sunrise-tools-value sunrise-font-family';
        task.innerHTML = '<span>SF Pro</span><span>⌄</span>'; tools.insertBefore(task, tools.firstChild);
        const undo = document.createElement('div'); undo.className = 'glass-history'; undo.innerHTML = '<span>' + icon('<path d="m9 3-6 5 6 5M3 8h10a7 7 0 0 1 0 14"/>') + '</span><span>' + icon('<path d="m15 3 6 5-6 5m6-5H11a7 7 0 0 0 0 14"/>') + '</span>'; tools.insertBefore(undo, task);
        const emphasis = document.createElement('div'); emphasis.className = 'sunrise-emphasis-row';
        const bold = tools.querySelector('button[title="B"]'), italic = tools.querySelector('button[title="I"]');
        if (bold && italic) {
          const underline = document.createElement('span'); underline.className = 'sunrise-tools-key sunrise-underline'; underline.textContent = 'U';
          underline.style.textDecoration = 'underline';
          tools.insertBefore(emphasis, bold); emphasis.append(bold, italic, underline);
        }
        const colorLabel = Array.from(tools.querySelectorAll('.as-sub')).find((el) => /colour/i.test(el.textContent));
        if (colorLabel) {
          const picker = document.createElement('div'); picker.className = 'glass-color-picker';
          colorLabel.after(picker);
          const toggle = document.createElement('button'); toggle.className = 'glass-color-toggle'; toggle.type = 'button';
          toggle.title = 'Text colour'; toggle.setAttribute('aria-label', 'Text colour'); toggle.setAttribute('aria-expanded', 'false');
          toggle.innerHTML = '<i></i><span>⌄</span>'; picker.appendChild(toggle);
          const swatches = document.createElement('div'); swatches.className = 'sunrise-color-row';
          picker.appendChild(swatches);
          for (const color of Array.from(tools.querySelectorAll('.as-color'))) swatches.appendChild(color);
          const close = () => { picker.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
          toggle.addEventListener('click', () => { const open = picker.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
          swatches.addEventListener('click', (event) => { if (event.target.closest('.as-color')) close(); });
          S.root.addEventListener('pointerdown', (event) => { if (!picker.contains(event.target)) close(); });
          picker.addEventListener('keydown', (event) => { if (event.key === 'Escape') { close(); toggle.focus(); } });
        }
        const group = (title, symbols) => {
          const box = document.createElement('div'); box.className = 'sunrise-tools-group';
          const head = document.createElement('div'); head.className = 'sunrise-tools-label'; head.textContent = title; box.appendChild(head);
          const row = document.createElement('div'); row.className = 'sunrise-tools-row';
          for (const symbol of symbols) { const key = document.createElement('span'); key.className = 'sunrise-tools-key'; key.innerHTML = icon(symbol); row.appendChild(key); }
          box.appendChild(row); tools.appendChild(box);
        };
        group('Alignment:', ['<path d="M3 5h18M3 10h12M3 15h18M3 20h12"/>', '<path d="M3 5h18M6 10h12M3 15h18M6 20h12"/>', '<path d="M3 5h18M9 10h12M3 15h18M9 20h12"/>']);
        group('Bullets:', ['<path d="M8 5h13M8 12h13M8 19h13"/><circle cx="3" cy="5" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="19" r="1"/>']);
        const spacing = document.createElement('div'); spacing.className = 'sunrise-tools-group';
        const label = document.createElement('div'); label.className = 'sunrise-tools-label'; label.textContent = 'Line Spacing:'; spacing.appendChild(label);
        const value = document.createElement('div'); value.className = 'sunrise-tools-value'; value.textContent = '1.0　▾'; spacing.appendChild(value); tools.appendChild(spacing);
        const textTools = document.createElement('div'); textTools.className = 'glass-text-tools';
        textTools.innerHTML = '<span><u>A</u>⌄</span><span>' + icon('<path d="M8 5h13M8 12h13M8 19h13"/><path d="m2 4 1-1v4M2 10h2l-2 4h2M2 17h2v4H2"/>') + '⌄</span>'; tools.appendChild(textTools);
        const insert = document.createElement('div'); insert.className = 'glass-insert';
        insert.innerHTML = '<span>' + icon('<rect x="2" y="3" width="13" height="14" rx="3"/><rect x="9" y="9" width="13" height="13" rx="3"/>') + 'Shapes</span><span>' + icon('<rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m3 18 6-7 5 5 3-3 5 5"/>') + 'Picture</span><span>' + icon('<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 8h10m-5 0v10"/>') + 'Text Box</span><span class="glass-arrange">Arrange⌄</span>'; tools.appendChild(insert);
      },
    },
  },
});
