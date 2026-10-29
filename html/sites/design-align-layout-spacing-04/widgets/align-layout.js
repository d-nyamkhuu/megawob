// Design of this site on the layout/canvas template (templates/align-layout/canvas.js).
env.widget({
  task: 'align-layout',
  site: 'design-align-layout-spacing-04',
  name: 'design',
  split: 'train',
  scenarios: ['spacing'],
  template: 'align-layout/canvas',
  design: {
    titles: { spacing: ['Landing Page Layout'] },
    tools: ['component', 'tune', 'more'],
    icons: {
      lock: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 7V5a3 3 0 016 0v2h1.2c.5 0 .8.4.8.9v6.2c0 .5-.3.9-.8.9H3.8c-.5 0-.8-.4-.8-.9V7.9c0-.5.3-.9.8-.9H5zm1.5 0h3V5a1.5 1.5 0 00-3 0v2z"/></svg>',
      component: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="7" height="7" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/><rect x="3" y="15" width="7" height="5" rx="1"/></svg>',
      tune: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2" fill="white"/><circle cx="15" cy="12" r="2" fill="white"/><circle cx="8" cy="18" r="2" fill="white"/></svg>',
      more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>',
    },
    canvasCaption: '', zoom: '100%', cardGap: 0,
    parts: {
      toolbar: (base, S) => (ctx, card) => {
        const bar = base(ctx, card);
        if (document.body.dataset.studioInstruction === 'header') {
          ctx.util.el('div', 'ref-instruction', bar, document.body.dataset.studioTaskNote);
          bar.classList.add('studio-document-note');
        }
        return bar;
      },
      canvas: (base, S) => (ctx, frame) => {
        const canvas = base(ctx, frame);
        canvas.classList.add(ctx.spec.axis === 'y' ? 'studio-vertical' : 'studio-horizontal');
        return canvas;
      },
      item: (base, S) => (ctx, canvas, item, index, locked) => {
        const el = base(ctx, canvas, item, index, locked);
        const palettes = [ ['#e8dffc', '#7150bc'], ['#dff3df', '#4f8051'], ['#ffe8d6', '#d4690b'], ['#d2e6ff', '#2c72c5'] ];
        const palette = palettes[index % palettes.length];
        el.style.setProperty('--feature-fill', palette[0]);
        el.style.setProperty('--feature-accent', palette[1]);
        const artwork = [
          '<path d="M34 5C11 4 2 16 7 30c15 5 28-9 27-25Z"/><path d="M7 34c5-10 11-17 22-23" fill="none" stroke="var(--feature-accent)" stroke-width="2.5"/>',
          '<rect x="7" y="22" width="5" height="9" rx="2"/><rect x="16" y="15" width="5" height="16" rx="2"/><rect x="25" y="7" width="5" height="24" rx="2"/>',
          '<circle cx="14" cy="13" r="5"/><circle cx="26" cy="13" r="4.5"/><path d="M4 30v-3c0-8 20-8 20 0v3H4zm21 0v-4c0-3-1-5-3-6 10-1 13 4 13 7v3H25Z"/>',
          '<path d="m22 4-15 19h11l-2 12 15-20H20z"/>'
        ];
        const icon = ctx.util.el('div', 'studio-feature-icon', el);
        icon.innerHTML = `<svg viewBox="0 0 38 38" fill="white">${artwork[index % artwork.length]}</svg>`;
        const title = el.querySelector('span');
        title.classList.add('studio-feature-title');
        el.appendChild(title);
        const descriptions = ['Build your audience with engaging content.', 'Turn data into clear insights.', 'Work together across teams.', 'Bring your ideas to life faster.'];
        ctx.util.el('div', 'studio-feature-description', el, descriptions[index % descriptions.length]);
        return el;
      },
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const fit = () => {
        const rects = ctx.model.r;
        const vertical = ctx.spec.axis === 'y';
        const availableHeight = S.body.clientHeight - (document.body.dataset.studioInstruction === 'toast' ? 110 : 0);
        S.card.classList.toggle('studio-compact', S.body.clientWidth < 800 || availableHeight < 340);
        const x0 = Math.min(...rects.map(r => r.x));
        const y0 = Math.min(...rects.map(r => r.y));
        const x1 = Math.max(...rects.map(r => r.x + r.w));
        const y1 = Math.max(...rects.map(r => r.y + r.h));
        const margin = S.body.clientWidth < 700 ? 40 : 72;
        const scale = Math.max(.35, Math.min(4, vertical
          ? (availableHeight - 100) / (y1 - y0)
          : (S.body.clientWidth - margin) / (x1 - x0)));
        S.st.viewScale = scale;
        S.card.style.setProperty('--studio-scale', scale);
        S.st.els.forEach((el, i) => el.style.setProperty('--studio-item-height', `${rects[i].h * scale}px`));
        S.canvas.style.transform = `scale(${scale})`;
        const visualWidth = Math.max(...rects.map((r, i) => (r.x - x0 + S.st.els[i].offsetWidth) * scale));
        const visualHeight = Math.max(...rects.map((r, i) => (r.y - y0 + S.st.els[i].offsetHeight) * scale));
        S.canvas.style.left = `${(S.body.clientWidth - visualWidth) / 2 - x0 * scale}px`;
        S.canvas.style.top = `${Math.max(16, (availableHeight - visualHeight) / 2 - (vertical ? 0 : 24)) - y0 * scale}px`;
        };
        fit();
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
            const scale = S.st.viewScale || 1;
            S.P.setRect(index, env.taskDef.helpers.moveRect(ctx.spec, start, p.dx / scale, p.dy / scale));
          },
          end() { el.classList.remove('dragging'); },
        }, 'layout-card');
      },
      locate: (base, S) => (target) => {
        const point = base({ ...target, dx: 0, dy: 0 });
        const scale = S.st.viewScale || 1;
        return [point[0] + Math.round((target.dx || 0) * scale), point[1] + Math.round((target.dy || 0) * scale)];
      },
    },
  },
});
