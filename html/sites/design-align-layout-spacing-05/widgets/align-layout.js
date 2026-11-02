// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-spacing-05',
  name: 'design',
  split: 'train',
  scenarios: ['spacing'],
  template: 'align-layout/canvas',
  design: {
    titles: { spacing: ['Project board', 'Studio projects', 'Campaigns'] },
    tools: [], canvasCaption: '', zoom: '',
    panel: '#f8f7f4', line: '#c4c6c3', accent: '#c4fa61',
    fg: '#080a09', muted: '#80817d',
    gridSize: 1, itemRadius: 0, itemSize: 16,
    cardPadding: '0px', cardGap: 0, rulerWidth: 0, rulerHeight: 0,
    parts: {
      item: (base, S) => (ctx, canvas, item, index, locked) => {
        const el = base(ctx, canvas, item, index, locked);
        el.replaceChildren();
        const photos = ['beach', 'city', 'mountains', 'tulips'];
        const captions = ['Save on beach destinations', 'Explore top cities', 'Hike, bike and more', 'Fresh looks for the season'];
        const photo = ctx.util.el('img', 'campaign-photo', el);
        photo.src = 'sites/design-align-layout-spacing-05/assets/' + photos[index % 4] + '.png';
        photo.alt = '';
        photo.draggable = false;
        const text = ctx.util.el('div', 'campaign-copy', el);
        ctx.util.el('div', 'campaign-name', text, item.label);
        ctx.util.el('div', 'campaign-caption', text, captions[index % 4]);
        ctx.util.el('span', 'campaign-link', text, 'Learn More');
        if (locked) {
          const badge = ctx.util.el('span', 'campaign-lock', el);
          badge.innerHTML = '<svg viewBox="0 0 20 24" fill="currentColor"><path d="M5 9V6a5 5 0 0110 0v3h1a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V11a2 2 0 012-2zm3 0h4V6a2 2 0 00-4 0zm2 4a2 2 0 00-1 3.73V19h2v-2.27A2 2 0 0010 13z"/></svg>';
        }
        return el;
      },
      // Keep model coordinates intact while presenting the spacing axis as a wide campaign row.
      place: (base, S) => (ctx, card) => {
        base(ctx, card); // Includes the template's original placement draws.
        const w = ctx.stage.clientWidth;
        const h = ctx.stage.clientHeight;
        const pad = w < 700 ? 14 : 22;
        const top = w < 700 ? 58 : 70;
        const cw = Math.max(100, w - 2 * pad);
        const ch = Math.max(100, h - top - (w < 700 ? 30 : 58));
        Object.assign(card.style, { left: pad + 'px', top: top + 'px', width: cw + 'px', height: ch + 'px' });
        Object.assign(S.canvas.style, { width: cw + 'px', height: ch + 'px' });
        const vertical = ctx.spec.axis === 'y';
        const rects = ctx.model.r;
        const start = Math.min(...rects.map(r => vertical ? r.y : r.x));
        const end = Math.max(...rects.map(r => vertical ? r.y + r.h : r.x + r.w));
        const edge = cw * .02;
        const scale = (cw - 2 * edge) / (end - start);
        S.st.view = { vertical, scale, offset: edge - start * scale, height: Math.min(ch * (ch < 400 ? .68 : .575), cw * .3), ch };
        S.P.paint();
      },
      moved: (base, S) => (ctx, el, index) => {
        base(ctx, el, index);
        const v = S.st.view;
        if (!v) return;
        const r = ctx.model.r[index];
        const cross = v.vertical ? r.x : r.y;
        const crossCenter = (v.vertical ? ctx.spec.W : ctx.spec.H) / 2;
        const crossSize = v.vertical ? r.w : r.h;
        const offset = (cross + crossSize / 2 - crossCenter);
        Object.assign(el.style, {
          left: ((v.vertical ? r.y : r.x) * v.scale + v.offset) + 'px',
          top: ((v.ch - v.height) / 2 + offset) + 'px',
          width: ((v.vertical ? r.h : r.w) * v.scale) + 'px',
          height: v.height + 'px',
        });
      },
      bindItem: (base, S) => (ctx, el, index, locked) => {
        let start;
        env.ui.track(el, {
          start() {
            if (locked) return false;
            start = { ...ctx.model.r[index] };
            S.P.raise(index);
            el.classList.add('dragging');
          },
          move(p) {
            const v = S.st.view;
            const dx = v.vertical ? p.dy : p.dx / v.scale;
            const dy = v.vertical ? p.dx / v.scale : p.dy;
            S.P.setRect(index, env.taskDef.helpers.moveRect(ctx.spec, start, dx, dy));
          },
          end() { el.classList.remove('dragging'); },
        }, 'layout-card');
      },
      locate: (base, S) => (target) => {
        const point = base({ ...target, dx: 0, dy: 0 });
        const v = S.st.view;
        const dx = target.dx || 0, dy = target.dy || 0;
        return [point[0] + Math.round(v.vertical ? dy * v.scale : dx * v.scale),
          point[1] + Math.round(v.vertical ? dx : dy)];
      },
    },
  },
});
