// Leather-bound Relayboard desk; the shared editor retains task behavior and targets.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-place-03',
  name: 'design',
  split: 'train',
  scenarios: ['place'],
  template: 'use-workflow-editor/editor',
  design: {
      fontFamily: 'Georgia,"Times New Roman",serif',
      frameInset: 0,
      frameRadius: 5,
      compactWidth: 0,
      paletteTitle: 'Steps',
      canvasHint: '',
      paletteHint: '',
      initialZoom: .75,
    parts: {
      curve: () => (a, b) => {
        if (Math.abs(a[1] - b[1]) < 2) return `M${a[0]},${a[1]} H${b[0]}`;
        const x = (a[0] + b[0]) / 2, direction = Math.sign(b[1] - a[1]);
        const radius = Math.min(12, Math.abs(b[0] - a[0]) / 4, Math.abs(b[1] - a[1]) / 3);
        return `M${a[0]},${a[1]} H${x-radius} Q${x},${a[1]} ${x},${a[1]+radius*direction} V${b[1]-radius*direction} Q${x},${b[1]} ${x+radius},${b[1]} H${b[0]}`;
      },
      icon: (base, S) => (parent, name) => {
        const paths = {
          bolt: 'M7 4 21 12 7 20Z',
          filter: '',
          code: 'm10 2 4 0 1 3 3-1 3 3-2 3 3 1v4l-3 1 1 3-3 2-3-1-1 3h-4l-1-3-3 1-3-3 2-3-3-1v-4l3-1-1-3 3-2 3 1z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
          send: 'M2 4h20v16H2z M2 5l10 9L22 5 M2 20l7-8m13 8-7-8',
          record: 'M5 2h10l5 5v15H5z M15 2v6h5 M8 11h9m-9 4h9m-9 4h6',
          clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18 M12 6v7h6',
        };
        if (!(name in paths)) return base(parent, name);
        const svg = S.ctx.util.svg('svg', { class:'af-icon', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.5, 'stroke-linejoin':'round', 'aria-hidden':'true' }, parent);
        S.ctx.util.svg('path', { d:paths[name], fill: name === 'bolt' ? '#f8fff0' : 'none', 'fill-rule':'evenodd' }, svg);
        return svg;
      },
      frame: (base, S) => (ctx) => {
        const app = base(ctx);
        const right = Math.max(245, ctx.size.width * .228);
        const left = Math.max(155, ctx.size.width * .148);
        const extent = Math.max(...ctx.model.nodes.map(n => n.x + 180));
        S.zoom = Math.min(.95, (ctx.size.width - right - left - 40) / extent);
        return app;
      },
      top: (base) => (ctx) => { base(ctx); },
      navigation: () => () => {},
      paletteFrame: (base, S) => (ctx) => {
        base(ctx);
        S.els.palette.classList.add('desk-palette');
      },
      component: (base) => (ctx, list, type, i) => {
        const tile = base(ctx, list, type, i);
        tile.dataset.kind = i;
        return tile;
      },
      node: (base, S) => (ctx, layer, n) => {
        const card = base(ctx, layer, n);
        card.dataset.kind = Object.keys(S.els.paletteEls).indexOf(n.type);
        if (n.label.length > 14) card.style.setProperty('--desk-node-font', '20px');
        return card;
      },
      references: (base, S) => (ctx) => {
        base(ctx);
        S.els.references.hidden = true;
      },
      edges: (base, S) => (model) => {
        base(model);
        for (const path of S.els.wires.querySelectorAll(':scope > path')) path.remove();
      },
      canvas: (base, S) => (ctx) => {
        base(ctx);
        const P = S.P;
        const controls = P.el('section', 'desk-controls', S.els.workspace);
        P.el('strong', 'desk-controls-title', controls, 'Canvas Controls');
        const row = P.el('div', 'desk-controls-row', controls);
        const hand = P.button(row, '', () => {}, 'desk-hand');
        hand.setAttribute('aria-label', 'Pan canvas');
        hand.innerHTML = '<svg viewBox="0 0 32 32"><path d="m9 17-3-6q0-3 3-2l3 6-1-11q1-3 3-1l2 12V3q2-2 3 0l1 12 1-10q3-1 3 2l-1 11 3-5q3-1 3 2l-4 10-3 5H13L7 20q-2-5 2-3z" fill="#e5ecf0" stroke="#41505e" stroke-width="1.5"/></svg>';
        P.button(row, '⬚', () => {}, 'desk-select');
        const magnify = P.iconButton(row, 'Zoom in', 'plus', () => P.setZoom(S.zoom + .1), 'desk-magnify');
        magnify.innerHTML = '<svg viewBox="0 0 34 34"><circle cx="13" cy="12" r="9" fill="#f9ffff" stroke="#516d81" stroke-width="2.5"/><path d="m20 20 10 10" stroke="#384652" stroke-width="5"/><path d="M7 12h12m-6-6v12" stroke="#386e99" stroke-width="2"/></svg>';
        const spacer = P.el('div', 'desk-controls-spacer', row);
        P.el('span', '', row, 'Zoom');
        const slider = P.el('input', 'desk-zoom-slider', row);
        slider.type = 'range'; slider.min = '60'; slider.max = '140'; slider.value = String(S.zoom * 100);
        slider.setAttribute('aria-label', 'Canvas zoom');
        slider.addEventListener('input', () => P.setZoom(Number(slider.value) / 100));
        row.appendChild(S.els.zoomLabel);
        controls.appendChild(S.els.bar);
      },
      overview: (base, S) => (ctx) => {
        base(ctx);
        const P = S.P, panel = S.els.body.lastElementChild;
        panel.classList.add('desk-inspector');
        panel.firstElementChild.textContent = 'Workflow';
        const content = P.el('div', 'desk-properties', panel);
        const heading = text => P.el('h3', '', content, text);
        const row = (label, value, cls = '') => {
          const line = P.el('div', 'desk-property ' + cls, content);
          P.el('span', 'desk-property-label', line, label);
          return P.el('div', 'desk-value', line, value);
        };
        heading('General');
        row('Name', S.spec.title, 'desk-name');
        row('Description', 'Automated workflow for ' + S.spec.owner + '.', 'desk-description');
        const taskCard = document.querySelector('.ref-panel');
        if (taskCard) content.appendChild(taskCard);
        heading('Settings');
        row('Theme', 'Standard     ▾', 'desk-dropdown');
        const grid = row('Grid', '', 'desk-checkbox');
        P.el('span', 'desk-check', grid, '✓'); P.el('span', '', grid, 'Show grid');
        P.el('span', 'desk-check', row('Snap to grid', '', 'desk-checkbox'), '✓');
        row('Grid size', '20 px     ▾', 'desk-dropdown desk-grid-size');
        heading('History');
        row('Created', 'Apr 12, 2010  10:24 AM', 'desk-history');
        row('Last modified', 'Apr 12, 2010   3:17 PM', 'desk-history');
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const toolbar = document.querySelector('.os-toolbar');
        const oldUndo = toolbar.querySelector('[data-tool="Undo"]');
        if (oldUndo) { S.els.undo.replaceChildren(...oldUndo.childNodes); oldUndo.replaceWith(S.els.undo); }
        const bar = S.els.bar;
        const zoomButtons = bar.querySelectorAll('button');
        const tools = [['Zoom out', 'Zoom Out'], ['Zoom in', 'Zoom In'], ['Reset view', 'Fit']];
        for (const [title, label] of tools) {
          const button = Array.from(zoomButtons).find(b => b.title === title || b.getAttribute('aria-label') === title);
          const placeholder = toolbar.querySelector('[data-tool="' + label + '"]');
          if (button && placeholder) { button.replaceChildren(...placeholder.childNodes); placeholder.replaceWith(button); }
        }
        const test = Array.from(zoomButtons).find(b => b.textContent.trim() === 'Test');
        const run = toolbar.querySelector('[data-tool="Run"]');
        if (test && run) { test.replaceChildren(...run.childNodes); test.classList.remove('af-primary'); run.replaceWith(test); }
      },
    },
  },
});
