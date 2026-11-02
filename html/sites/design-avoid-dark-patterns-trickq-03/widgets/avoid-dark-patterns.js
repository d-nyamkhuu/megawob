// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-trickq-03',
  name: 'design',
  split: 'train',
  scenarios: ['trickq'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '16px/1.4 Arial, "Segoe UI", sans-serif',
    windowRadius: '3px',
    windowShadow: '0 2px 8px rgba(0,0,0,.12)',
    geometry: { margin: 4, minWidth: 360, minHeight: 360, widthBreakpoint: 900, widthMin: 880,
      widthMax: 1080, widthScale: [0.86, 1], heightBreakpoint: 560, heightMin: 540, heightMax: 660,
      heightScale: [0.9, 1], sideBreakpoint: 900, sideNarrow: 240, sideRange: [255, 290] },
    parts: {
      fit: (base, S) => (ctx) => {
        const sampled = base(ctx);
        return { ...sampled, sampled, M: 0, fullW: ctx.size.width, fullH: ctx.size.height,
          winW: ctx.size.width, winH: ctx.size.height, ax: 'left' };
      },
      appearance: (base, S) => (ctx) => {
        const fitted = S.geo;
        // Width controls a random sidebar draw; sample against the original geometry.
        S.geo = fitted.sampled;
        base(ctx);
        S.geo = fitted;
      },
      tabs: (base, S) => (ctx) => {
        // Retain the template's decorative draws without browser frame.
        if (ctx.rng.bool(0.55)) ctx.rng.pick(S.D.extraTabs);
        S.tabTitle = document.createElement('span');
      },
      addressBar: (base, S) => (ctx) => {
        const el = ctx.util.el;
        const compact = ctx.size.height < 500;
        const bar = el('div', 'br-form-heading', S.win);
        bar.style.cssText = `flex:none;padding:${compact ? '8px 20px 4px' : '25px 36px 15px'};`;
        el('h1', 'br-form-title', bar, 'Guest Checkout');
        const intro = el('p', 'br-form-intro', bar, "We'll send your order confirmation to this email.");
        if (compact) intro.style.cssText = 'font-size:13px;margin:0;';
        S.bar = bar;
        S.hostEl = document.createElement('span');
        S.pathEl = document.createElement('span');
      },
      pageFor: (base, S) => (sid, parent, m) => {
        S.P.screenBody(S.spec.screens[sid], parent, m);
      },
      screenBody: (base, S) => (sc, parent, m) => {
        const body = S.ctx.util.el('div', 'br-form-body', parent);
        body.style.cssText = 'flex:1;min-height:0;display:flex;';
        S.P.main(sc, body, m);
        if (sc.side) S.P.side(sc, body, m);
        return body;
      },
      check: (base, S) => (b, parent, m) => {
        const box = base(b, parent, m);
        const compact = S.ctx.size.height < 500;
        box.style.cssText = `display:grid;grid-template-columns:1fr 1fr;gap:${compact ? 5 : 8}px 24px;`;
        const row = box.lastElementChild;
        row.style.cssText = `min-height:${compact ? 30 : 64}px;align-items:flex-start;gap:14px;padding:${compact ? 2 : 4}px 0;`;
        row.firstElementChild.style.cssText = `flex:none;width:${compact ? 22 : 28}px;height:${compact ? 22 : 28}px;border-radius:3px;`;
        if (compact) row.children[1].style.cssText = 'font-size:12px;line-height:1.2;';
        const last = S.spec.screens[m.screen].blocks.filter(x => x.t === 'check').at(-1);
        if (b === last) row.style.cssText += 'grid-column:1/-1;border-top:1px solid #d2d5da;padding-top:10px;';
        return box;
      },
      kv: (base, S) => (b, parent, m) => {
        const el = S.ctx.util.el;
        const compact = S.ctx.size.height < 500;
        const fields = el('div', 'br-fields', parent);
        fields.style.cssText = 'flex:none;margin:0;gap:6px 34px;';
        for (const [label, value] of b.rows) {
          const field = el('div', 'br-field', fields);
          el('span', '', field, label);
          const input = el('div', 'br-input', field, S.P.fill(m, value));
          input.style.cssText = `height:${compact ? 28 : 47}px;padding:${compact ? '4px 10px' : '9px 16px'};`;
        }
      },
      main: (base, S) => (sc, body, m) => {
        const el = S.ctx.util.el;
        const main = el('section', 'sd-main br-form', body);
        const compact = S.ctx.size.height < 500;
        main.style.cssText = `position:relative;display:flex;flex-direction:column;flex:1;min-height:0;min-width:0;gap:8px;padding:0 ${compact ? 20 : 36}px 14px;overflow:hidden;`;
        const blocks = el('div', 'br-preferences', main);
        blocks.style.cssText = `display:flex;flex-direction:column;gap:${compact ? 4 : 7}px;min-height:0;`;
        S.P.blocks(sc.blocks, blocks, m);
        return main;
      },
    },
  },
});
