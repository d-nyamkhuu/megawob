// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-urgency-03',
  name: 'design',
  split: 'train',
  scenarios: ['urgency'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '14px/1.4 Arial, "Segoe UI", sans-serif',
    windowRadius: '0px',
    windowShadow: 'none',
    colors: { '--b': '#ff510a', '--bs': '#fff0e8', '--bfg': '#fff' },
    parts: {
      fit: (base) => (ctx) => {
        const geo = base(ctx); // Keep the template's seeded draws.
        const left = ctx.size.width < 950 ? 20 : 40;
        const width = ctx.size.width - left - (ctx.size.width < 950 ? 16 : 28);
        return { ...geo, sampled: geo, M: 0, fullW: width, fullH: ctx.size.height - 10,
          winW: width, winH: ctx.size.height - 10 };
      },
      appearance: (base, S) => (ctx) => {
        const fitted = S.geo;
        S.geo = fitted.sampled;
        base(ctx); // Preserve the original conditional sidebar draw, too.
        S.geo = fitted;
      },
      tabs: (base, S) => (ctx) => {
        base(ctx); // Keep tab sampling, without adding a second app toolbar.
        S.tabTitle.closest('.sd-tabs').remove();
      },
      addressBar: (base, S) => (ctx) => {
        const el = ctx.util.el;
        S.bar = el('div', 'cadence-heading', S.win);
        el('h1', 'cadence-title', S.bar, 'Choose your plan');
        el('p', 'cadence-subtitle', S.bar, 'Listen without limits. Cancel anytime.');
        S.hostEl = document.createElement('span');
        S.pathEl = document.createElement('span');
        Object.assign(S.bar.style, { flex: 'none', padding: S.geo.winH < 600 ? '16px 0 14px' : '30px 0 28px' });
      },
      header: () => () => {},
      frame: (base, S) => (ctx) => {
        const win = base(ctx);
        win.style.border = '0';
        win.style.left = ctx.size.width < 950 ? '20px' : '40px';
        return win;
      },
      screenBody: (base, S) => (sc, parent, m) => {
        const body = base(sc, parent, m);
        Object.assign(body.style, { flexDirection: 'column', padding: '0', gap: '10px' });
        return body;
      },
      main: (base) => (sc, body, m) => {
        const main = base(sc, body, m);
        main.style.minHeight = '0';
        return main;
      },
      side: (base) => (sc, body, m) => {
        const side = base(sc, body, m);
        Object.assign(side.style, { width: '100%', flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', overflow: 'visible', flexShrink: '0' });
        return side;
      },
      options: (base, S) => (b, parent, m) => {
        base(b, parent, m);
        Object.assign(parent.lastElementChild.style, { display: 'grid',
          gridTemplateColumns: `repeat(${b.ctls.length}, minmax(0, 1fr))`,
          gap: S.geo.winW < 800 ? '10px' : '22px', flex: '1 1 0', minHeight: '120px' });
      },
      option: (base, S) => (id, box, m) => {
        base(id, box, m);
        const card = box.lastElementChild;
        const small = S.geo.winW < 800 || S.geo.winH < 600;
        Object.assign(card.style, { position: 'relative', display: 'flex', flexDirection: 'column',
          alignItems: 'stretch', minWidth: '0', padding: small ? '12px 10px 38px' : '26px 22px 60px', gap: small ? '4px' : '10px' });
        const [radio, text] = card.children;
        Object.assign(radio.style, { position: 'absolute', bottom: small ? '9px' : '17px', left: 'calc(50% - 12px)',
          width: '24px', height: '24px' });
        text.style.flex = 'none';
        text.style.fontSize = small ? '15px' : '20px';
        text.firstElementChild.style.fontSize = small ? '22px' : '36px';
        const price = card.querySelector('.pr');
        if (price) Object.assign(price.style, { marginTop: 'auto', paddingTop: '14px',
          borderTop: '1px solid #e1e5ed', fontSize: small ? '23px' : '34px', whiteSpace: 'normal' });
      },
    },
  },
});
