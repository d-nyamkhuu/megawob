// Design on the use-slides/office template; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-align-03',
  name: 'design',
  split: 'train',
  scenarios: ['align'],
  template: 'use-slides/office',
  design: {
    uiFont: '"Segoe UI", Arial, sans-serif',
    parts: {
      alignTools(base, S) {
        return function (tools) {
          base(tools);
          const buttons = [...tools.querySelectorAll('button.as-tool')];
          const [select, top, middle, bottom, distribute] = buttons;
          select.hidden = false;
          select.classList.add('as-select-all');
          select.textContent = '▣';
          select.setAttribute('aria-label', 'Select all shapes');
          select.title = 'Select all shapes';
          const make = (source, label, key, action) => {
            const b = source.cloneNode(true);
            b.classList.add('as-align-button'); b.classList.remove('as-optional');
            b.setAttribute('aria-label', label); b.title = label;
            b.textContent = label;
            b.addEventListener('click', action || (() => source.click()));
            return S.P.register(b, key);
          };
          const heading = document.createElement('div'); heading.className = 'as-sub'; heading.textContent = 'Align to Slide';
          heading.append(select);
          const grid = document.createElement('div'); grid.className = 'as-align-grid';
          const alignX = (x) => () => {
            const model = S.ctx.model;
            S.P.commit({ positions: model.positions.map((p, i) => model.selected.includes(i) ? { ...p, x } : p) });
          };
          const h = [
            make(top, 'Align Left', 'tool:left', alignX(0)),
            make(middle, 'Align Centre', 'tool:centerX', alignX(305)),
            make(bottom, 'Align Right', 'tool:right', alignX(610)),
          ];
          const v = [top, middle, bottom];
          [...h, ...v].forEach((b, i) => { b.classList.add('as-align-button'); b.textContent = ['Align Left', 'Align Centre', 'Align Right', 'Align Top', 'Align Middle', 'Align Bottom'][i]; grid.append(b); });
          const distributeHeading = document.createElement('div'); distributeHeading.className = 'as-sub'; distributeHeading.textContent = 'Distribute';
          const dist = document.createElement('div'); dist.className = 'as-distribute-grid'; dist.append(distribute);
          const vertical = make(distribute, 'Distribute Vertically', 'tool:distributeVertical', () => {
            const model = S.ctx.model;
            const selected = model.selected.slice().sort((a, b) => model.positions[a].y - model.positions[b].y);
            if (selected.length < 2) return;
            const lo = model.positions[selected[0]].y, hi = model.positions[selected[selected.length - 1]].y;
            S.P.commit({ positions: model.positions.map((p, i) => selected.includes(i)
              ? { ...p, y: lo + (hi - lo) * selected.indexOf(i) / (selected.length - 1) } : p) });
          });
          dist.append(vertical);
          tools.replaceChildren(heading, grid, distributeHeading, dist);
        };
      },
    },
  },
});
