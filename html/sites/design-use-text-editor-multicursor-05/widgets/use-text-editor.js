env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-multicursor-05',
  name: 'design',
  split: 'train',
  scenarios: ['multicursor'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    maxLineHeight: 28,
    maxFontSize: 19,
    placeGap: 0,
    placeInset: 0,
    fontRatio: 0.72,
    codePadding: 13,
    parts: {
      appearance(base) {
        return (ctx, look) => {
          const sampled = base(ctx, look);
          return { ...sampled, minimap: true };
        };
      },
      findStrip(base, S) {
        return ctx => {
          const controls = base(ctx);
          controls.findBtn.title = 'Find and replace';
          controls.findBtn.setAttribute('aria-label', 'Find and replace');
          controls.findBtn.replaceChildren(S.P.el('span', '', '⌕'));
          return controls;
        };
      },
      metrics(base, S) {
        return (ctx, box, controls) => {
          const metrics = base(ctx, { ...box, h: box.h + 68 }, controls);
          const gutterW = Math.max(40, Math.round(box.w * 0.072));
          const miniW = Math.max(62, Math.min(114, box.w * 0.116));
          const codeW = box.w - gutterW - miniW;
          const original = ctx.spec.base.split('\n');
          const target = ctx.spec.target.split('\n');
          const edited = target.flatMap((line, index) => line !== original[index] ? [line.length, (original[index] || '').length] : []);
          const longest = Math.max(1, ...edited) + 1;
          const fs = Math.floor(Math.min(metrics.fs, box.w / 982 * 20,
            (codeW - metrics.PAD * 2 - 4) / (longest * metrics.cw / metrics.fs)) * 10) / 10;
          const lh = Math.max(12, Math.min(metrics.lh, Math.round(box.w * 28 / 982)));
          const font = `${fs}px/${lh}px ${S.D.fontFamily}`;
          const bodyH = box.h - Math.max(44, Math.min(54, box.w / 982 * 54));
          controls.gutter.style.width = `${gutterW}px`;
          controls.gutter.style.font = font;
          controls.code.style.font = font;
          controls.code.style.height = `${bodyH}px`;
          controls.body.style.height = `${bodyH}px`;
          controls.mini.style.flex = `0 0 ${miniW}px`;
          return { ...metrics, fs, lh, cw: metrics.cw * fs / metrics.fs, codeW, bodyH };
        };
      },
      status(base) {
        return (ctx, status, model, lines, line, col) => {
          base(ctx, status, model, lines, line, col);
          const dock = document.querySelector('.editor-live-status');
          if (dock) {
            const nodes = Array.from(status.children);
            dock.replaceChildren(...nodes.filter(node => !node.classList.contains('sp') && !/^\d+ lines$/.test(node.textContent)).map(node => node.cloneNode(true)));
          }
        };
      },
      minimap(base, S) {
        return (ctx, mini, lines, bodyH) => {
          base(ctx, mini, lines, bodyH);
          mini.replaceChildren();
          const viewport = S.P.el('div', 'view');
          viewport.style.height = `${Math.min(bodyH, bodyH * 0.45)}px`;
          mini.append(viewport);
          const text = S.P.el('div', 'riso-map-code');
          for (const line of lines) {
            const row = S.P.el('div');
            for (const [value, cls] of S.P.tokens(line, ctx.spec)) {
              for (const run of value.split(/(\s+)/).filter(Boolean)) {
                const ink = S.P.el('span', cls || '');
                ink.style.cssText = `display:inline-block;width:${run.length * 0.85}px;height:1.5px;${run.trim() ? 'background:currentColor;' : ''}`;
                row.append(ink);
              }
            }
            text.append(row);
          }
          mini.append(text);
        };
      },
      shown(base, S) {
        return (ctx, controls, model) => {
          base(ctx, controls, model);
          if (controls.findBtn.parentNode !== controls.tabs) controls.tabs.append(controls.findBtn);
          const open = !!(model.find && model.find.open);
          controls.strip.classList.toggle('is-open', open);
          controls.strip.style.display = open ? 'block' : 'none';
        };
      },
    },
  },
});
