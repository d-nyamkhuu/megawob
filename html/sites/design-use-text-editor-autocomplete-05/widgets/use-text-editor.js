env.widget({
  task: 'use-text-editor',
  site: 'design-use-text-editor-autocomplete-05',
  name: 'design',
  split: 'train',
  scenarios: ['autocomplete'],
  traits: { doc: 'code' },
  template: 'use-text-editor/classic',
  design: {
    minWidth: 1672,
    parts: {
      metrics: (base) => (ctx, box, controls) => {
        const metrics = base(ctx, box, controls);
        const chromeH = controls.tabs.offsetHeight + controls.strip.offsetHeight + controls.status.offsetHeight + 2;
        metrics.bodyH = Math.max(60, box.h - chromeH - 12);
        const desiredLh = box.w >= 1150 ? 25 : 21;
        const lh = Math.max(8, Math.min(desiredLh, Math.floor((metrics.bodyH - 8) / 27)));
        const fs = Math.max(8, Math.min(18, lh - 1));
        const font = '"DejaVu Sans Mono", "Liberation Mono", Menlo, Consolas, monospace';
        const measure = document.createElement('canvas').getContext('2d');
        measure.font = `${fs}px ${font}`;
        metrics.fs = fs;
        metrics.lh = lh;
        metrics.cw = measure.measureText('M').width;
        const gutterW = box.w >= 1150 ? 76 : 54;
        controls.gutter.style.width = `${gutterW}px`;
        controls.gutter.style.font = `${fs - 2}px/${lh}px ${font}`;
        controls.code.style.font = `${fs}px/${lh}px ${font}`;
        const miniW = box.w >= 1150 ? 134 : 78;
        controls.body.style.setProperty('--acme-mini-width', `${miniW}px`);
        if (controls.mini) controls.mini.style.width = `${miniW}px`;
        metrics.codeW = Math.max(100, controls.card.clientWidth - gutterW - miniW - 2);
        controls.code.style.width = `${metrics.codeW}px`;
        controls.body.style.height = `${metrics.bodyH}px`;
        controls.code.style.height = `${metrics.bodyH}px`;
        return metrics;
      },
      build: (base) => (...args) => {
        const result = base(...args);
        const body = document.querySelector('.tc-body');
        if (body) {
          const source = body.querySelector('.tc-lines');
          const mini = document.createElement('div');
          mini.className = 'legacy-minimap'; mini.setAttribute('aria-hidden', 'true');
          body.appendChild(mini);
          if (source) {
            const update = () => {
              for (const token of source.querySelectorAll('span')) {
                const color = token.classList.contains('k') ? '#0000ff' : token.classList.contains('s') ? '#e00000' : token.classList.contains('c') ? '#008000' : '#111111';
                token.style.setProperty('color', color, 'important');
              }
              mini.replaceChildren(source.cloneNode(true));
            };
            update();
            new MutationObserver(update).observe(source, { childList:true, subtree:true, characterData:true });
          }
        }
        return result;
      },
    },
  },
});
