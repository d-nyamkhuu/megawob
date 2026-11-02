// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-multi-04',
  name: 'design',
  split: 'train',
  scenarios: ['multi'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'ICONS': (base, S) => ({
        pen: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14.5L13.8 3.7a1.8 1.8 0 012.5 0l.8.8a1.8 1.8 0 010 2.5L6.3 17.8 2.5 18.5z"/><path d="M11.8 5.7l3 3M2.5 18.5l1-4"/></svg>',
        line: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 16L16 4"/><circle cx="4" cy="16" r="1.6" fill="currentColor"/><circle cx="16" cy="4" r="1.6" fill="currentColor"/></svg>',
        rect: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="13" height="10" rx="1"/></svg>',
        ellipse: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="10" cy="10" rx="7" ry="5"/></svg>',
        eraser: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M8 16l-4-4 8-8 5 5-7 7z"/><path d="M8 16h9"/><path d="M6.5 9.5l5 5"/></svg>',
        undo: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5L3 9l4 4"/><path d="M3 9h9a5 5 0 010 10H9"/></svg>',
        clear: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11"/></svg>',
        polygon: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 7l6-4 6 5-2 8H6z"/></svg>',
      }),
      'buildMulti': (base, S) => function buildMulti(B) {
        const { button, dot, drawGrid, env, fmtPx, label, unit } = S;
        const { ctx, svg, px, W, H } = B;
        const { util, rng, spec } = ctx;
        drawGrid(util, rng, svg, W, H);
        const g = util.svg('g', {}, svg);
        const endpointColors = ['#174dc1', '#18a532', '#ee2424'];
        for (const [ti, t] of spec.targets.entries()) {
          if (t.type === 'line') {
            const color = endpointColors[ti % endpointColors.length];
            for (const p of [t.a, t.b]) {
              const [x, y] = px(p);
              util.svg('circle', { cx: x, cy: y, r: Math.max(42, B.scale * 0.068), fill: 'none', stroke: color, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, g);
            }
            dot(util, g, px, t.a);
            dot(util, g, px, t.b);
            label(util, g, px, W, H, t.a, unit(t.b, t.a), t.labels[0], 'dw-label', 47);
            label(util, g, px, W, H, t.b, unit(t.a, t.b), t.labels[1], 'dw-label', 47);
          } else {
            const [x, y] = px(t.c);
            util.svg('circle', { cx: x, cy: y, r: t.r * B.scale, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 2, 'stroke-dasharray': '8 7', opacity: 0.8 }, g);
            dot(util, g, px, t.c);
          }
        }
        const inkG = util.svg('g', {}, svg);
        let ink = rng.pick(['var(--accent)', '#1c63d6', '#c2255c']);
        let width = rng.pick([3, 3.5, 4]);
        let lineStyle = 'solid';
        const redrawInk = (strokes) => {
          inkG.replaceChildren();
          for (const s of strokes) util.svg('polyline', { points: fmtPx(s, px), fill: 'none', stroke: ink, 'stroke-width': width, 'stroke-dasharray': lineStyle === 'dashed' ? '9 6' : 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, inkG);
        };
        const stroke = env.ui.stroke(svg, {
          ...B.frame,
          strokes: ctx.model.strokes,
          render: (points, strokes) => redrawInk(strokes),
          onStroke: (points, strokes) => ctx.update({ strokes }),
          onChange: (strokes) => B.up({ strokes }),
          label: 'pen',
        });
        const penLabel = button(util, B.bar, 'pen', 'Pen', { role: 'tool' });
        penLabel.setAttribute('aria-pressed', 'true');
        util.el('span', 'sep', B.bar);
        const undoBtn = button(util, B.bar, 'undo', 'Undo', { role: 'control' });
        const clearBtn = button(util, B.bar, 'clear', rng.pick(['Clear', 'Clear all']), { role: 'control' });
        const settings = util.el('div', 'dw-settings', B.bar);
        const lineBtn = util.el('button', 'dw-setting dw-line-style', settings, '━━━━━━━━');
        lineBtn.type = 'button'; lineBtn.title = 'Line style'; lineBtn.setAttribute('aria-label', 'Line style: solid');
        const lineCaption = util.el('span', 'dw-setting-caption', settings, 'Line:');
        settings.insertBefore(lineCaption, lineBtn);
        lineBtn.addEventListener('click', () => { lineStyle = lineStyle === 'solid' ? 'dashed' : 'solid'; lineBtn.textContent = lineStyle === 'solid' ? '━━━━━━━━' : '┅ ┅ ┅ ┅'; lineBtn.setAttribute('aria-label', `Line style: ${lineStyle}`); redrawInk(ctx.model.strokes); });
        const widthGroup = util.el('div', 'dw-width-control', settings);
        util.el('span', 'dw-setting-caption', widthGroup, 'Width:');
        const widthVal = util.el('span', 'dw-width-value', widthGroup, '2');
        const widthBtns = util.el('div', 'dw-width-buttons', widthGroup);
        for (const [sign, delta] of [['▲', .5], ['▼', -.5]]) { const b = util.el('button', 'dw-setting dw-width-step', widthBtns, sign); b.type = 'button'; b.setAttribute('aria-label', delta > 0 ? 'Increase line width' : 'Decrease line width'); b.addEventListener('click', () => { width = Math.min(8, Math.max(1, width + delta)); widthVal.textContent = String(width); redrawInk(ctx.model.strokes); }); }
        const colorGroup = util.el('div', 'dw-color-control', settings);
        util.el('span', 'dw-setting-caption', colorGroup, 'Color:');
        const colors = ['#111111', '#174dc1', '#18a532', '#ee2424']; let colorIndex = 0;
        const colorBtn = util.el('button', 'dw-setting dw-color-swatch', colorGroup); colorBtn.type = 'button'; colorBtn.setAttribute('aria-label', 'Change drawing color'); colorBtn.style.setProperty('--ink-color', colors[colorIndex]);
        colorBtn.addEventListener('click', () => { colorIndex = (colorIndex + 1) % colors.length; ink = colors[colorIndex]; colorBtn.style.setProperty('--ink-color', colors[colorIndex]); redrawInk(ctx.model.strokes); });
        undoBtn.addEventListener('click', () => { if (ctx.model.strokes.length) B.up({ strokes: ctx.model.strokes.slice(0, -1) }); });
        clearBtn.addEventListener('click', () => { if (ctx.model.strokes.length) B.up({ strokes: [] }); });
        B.hint(rng.pick(['Every stroke stays on the board and counts. Undo removes the last one.', 'Draw each shape with its own stroke; Undo or Clear to fix mistakes.']));
        return {
          sync(m) { stroke.set(m.strokes); undoBtn.disabled = clearBtn.disabled = !m.strokes.length; },
          locate(t) {
            if (t.point) return stroke.locate(t.point);
            if (t.control === 'undo') return env.util.center(undoBtn);
            if (t.control === 'clear') return env.util.center(clearBtn);
            return null;
          },
        };
      },
    },
  },
});
