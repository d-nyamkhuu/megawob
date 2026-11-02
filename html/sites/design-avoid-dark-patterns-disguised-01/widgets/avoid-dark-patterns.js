// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-disguised-01',
  name: 'design',
  split: 'train',
  scenarios: ['disguised'],
  template: 'avoid-dark-patterns/browser',
  design: {
    colors: { '--ad': '#fa4f58' },
    geometry: { margin: 0, minWidth: 0, minHeight: 0, widthBreakpoint: 0, widthMin: 0,
      widthMax: 0, widthScale: [1, 1], heightBreakpoint: 0, heightMin: 0, heightMax: 0,
      heightScale: [1, 1], sideBreakpoint: 0, sideNarrow: 0, sideRange: [0, 0] },
    parts: {
      fit: (base) => (ctx) => {
        const g = base(ctx);
        return { ...g, M: 0, winW: g.fullW, winH: g.fullH, ax: 'left' };
      },
      tabs: (base, S) => (ctx) => {
        base(ctx); // Preserve the optional-tab random draws.
        S.tabTitle.closest('.sd-tabs').remove();
      },
      addressBar: (_base, S) => (ctx) => {
        S.bar = ctx.util.el('div', 'fn-window-caption', S.win);
        S.hostEl = ctx.util.el('span', '', S.bar);
        S.pathEl = ctx.util.el('span', '', S.bar);
      },
      ctlBtn: (base, S) => (id, parent, extra = '') => {
        const button = base(id, parent, extra);
        if (button && parent.closest('.fn-task-panel')) {
          button.classList.add('fn-action');
          const compact = S.ctx.size.height < 700 || S.ctx.size.width < 1000;
          const link = /\b(link|plain|shame)\b/.test(button.className);
          button.style.minHeight = link ? '24px' : compact ? '40px' : '74px';
          button.style.padding = link ? '2px 0' : compact ? '8px 12px' : '13px 24px';
          button.style.fontSize = link ? '13px' : compact ? '16px' : '25px';
          if (!link && parent.classList.contains('button')) button.style.width = '100%';
        }
        return button;
      },
      btns: (_base, S) => (b, parent) => {
        const box = S.ctx.util.el('div', 'fn-actions', parent);
        for (const id of b.ctls) S.P.ctlBtn(id, box);
        return null;
      },
      pageFor: (_base, S) => (sid, parent, m) => {
        const sc = S.spec.screens[sid];
        const el = S.ctx.util.el;
        const compact = S.ctx.size.height < 700 || S.ctx.size.width < 1000;
        const panel = el('section', `fn-task-panel${compact ? ' fn-compact' : ''}`, parent);
        const left = el('div', 'fn-details', panel);
        const divider = el('div', 'fn-divider', panel);
        const right = el('div', 'fn-offers', panel);
        const domain = sc.domain || S.app.domain;
        // File screens already supply their own title and metadata. Do not duplicate
        // that content above their system choices and recovery controls.
        const hasFile = [...(sc.blocks || []), ...(sc.side || [])].some(b => b.t === 'file');
        if (!hasFile) {
        const fileHead = el('div', 'fn-file-head', left);
        el('div', 'fn-link-icon', fileHead, '↗');
        const fileTitle = el('div', 'fn-file-title', fileHead);
        el('strong', '', fileTitle, domain);
        el('span', '', fileTitle, '1 KB · Shared Apr 8, 2017');
        el('div', 'fn-link-label', left, '↗　 Original link');
        const realLink = el('a', 'fn-real-link', left, `http://${domain}`);
        realLink.href = '#';
        realLink.addEventListener('click', (e) => e.preventDefault());
        const facts = el('div', 'fn-facts', left);
        for (const [k, v] of [['Type', 'Web link'], ['Size', '1 KB'], ['Shared', 'Apr 8, 2017'], ['Downloads', '1,482']]) {
          el('span', '', facts, k); el('b', '', facts, v);
        }
        }
        const leftBlocks = [], rightBlocks = [];
        for (const b of sc.blocks || []) {
          if (['ad', 'btns', 'banner', 'notice'].includes(b.t)) rightBlocks.push(b);
          else leftBlocks.push(b);
        }
        for (const b of sc.side || []) leftBlocks.push(b);
        S.P.blocks(leftBlocks, left, m);
        S.P.blocks(rightBlocks, right, m);
      },
    },
  },
});
