// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-urgency-01',
  name: 'design',
  split: 'train',
  scenarios: ['urgency'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: "15px/1.42 Arial, 'Segoe UI', sans-serif",
    windowRadius: '12px',
    windowShadow: 'none',
    colors: { '--b': '#55ad10', '--bs': '#eff9e7', '--bfg': '#fff', '--bad': '#d71920', '--warn': '#df9f00', '--good': '#329c12' },
    geometry: {
      margin: 0, minWidth: 360, minHeight: 360,
      widthBreakpoint: 900, widthMin: 0, widthMax: 1500, widthScale: [1, 1],
      heightBreakpoint: 560, heightMin: 0, heightMax: 900, heightScale: [1, 1],
      sideBreakpoint: 900, sideNarrow: 220, sideRange: [250, 290],
    },
    alignments: ['left'],
    parts: {
      // The page frame supplies the app navigation. Keep the template's tab
      // draws, and a stable, visible address anchor within the stage.
      tabs: (base, S) => () => {
        S.tabTitle = S.ctx.util.el('span', '');
        if (S.ctx.rng.bool(0.55)) S.ctx.rng.pick(S.D.extraTabs);
      },
      addressBar: (base, S) => () => {
        S.bar = S.ctx.util.el('div', 'aero-address', S.win);
        S.hostEl = S.ctx.util.el('span', '', S.bar);
        S.pathEl = S.ctx.util.el('span', '', S.bar);
      },
      header: () => () => {},
      screenBody: (base, S) => (sc, parent, m) => {
        const body = base(sc, parent, m);
        body.style.cssText = 'flex-direction:column;padding:12px 20px;gap:8px;';
        const main = body.firstElementChild;
        const plans = Array.from(main.children).find((node) => node.classList.contains('aero-plan-grid'));
        if (plans) {
          const overflow = Math.max(0, main.scrollHeight - main.clientHeight);
          for (const option of plans.firstElementChild.children) {
            option.style.height = `${Math.max(110, option.offsetHeight - overflow - 2)}px`;
          }
        }
        return body;
      },
      side: (base, S) => (sc, body, m) => {
        const side = S.ctx.util.el('div', 'aero-actions', body);
        S.P.blocks(sc.side, side, m);
        return side;
      },
      option: (base, S) => (id, box, m) => {
        base(id, box, m);
        const option = box.lastElementChild;
        option.style.height = `${Math.max(130, Math.min(470, S.ctx.size.height - 220))}px`;
      },
      main: (base, S) => (sc, body, m) => {
        const P = S.P;
        const main = S.ctx.util.el('div', 'sd-main aero-plans', body);
        let checks = [];
        const optionCtls = [];
        const urgency = [];
        const flushChecks = () => {
          if (!checks.length) return;
          const extras = S.ctx.util.el('section', 'aero-extras', main);
          S.ctx.util.el('h2', '', extras, 'Add extras (optional)');
          const group = S.ctx.util.el('div', 'aero-extra-options', extras);
          P.blocks(checks, group, m);
          checks = [];
        };
        for (const b of sc.blocks || []) {
          if (b.t === 'check') { checks.push(b); continue; }
          flushChecks();
          if (b.t === 'opts' || b.t === 'radios') optionCtls.push(...(b.ctls || []));
          else if (b.t === 'badge') urgency.push(b);
          else P.block(b, main, m);
        }
        flushChecks();
        if (optionCtls.length) {
          const plans = S.ctx.util.el('section', 'aero-plan-grid', main);
          P.block({ t: 'opts', ctls: optionCtls }, plans, m);
        }
        if (urgency.length) {
          const badges = S.ctx.util.el('div', 'aero-urgency', main);
          for (const b of urgency) P.block(b, badges, m);
        }
        return main;
      },
    },
  },
});
