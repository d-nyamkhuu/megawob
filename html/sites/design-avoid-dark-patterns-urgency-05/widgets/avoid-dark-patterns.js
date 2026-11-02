// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-urgency-05',
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
        body.style.cssText = 'flex-direction:column;padding:0;gap:0;';
        return body;
      },
      side: (base, S) => (sc, body, m) => {
        const host = document.querySelector('.ref-help') || body;
        const old = host.querySelector('.aero-actions');
        if (old) old.remove();
        const side = S.ctx.util.el('div', 'aero-actions', host);
        S.P.blocks(sc.side, side, m);
        return side;
      },
      option: (base, S) => (id, box, m) => {
        base(id, box, m);
        const option = box.lastElementChild;
        const name = option.querySelector('.tx>div:first-child');
        if (name) S.ctx.util.el('span', 'iron-select', option, `Select ${name.textContent}`);
        if (Array.from(box.children).indexOf(option) === 1) S.ctx.util.el('div', 'iron-bonus', option, '🎁  Includes 2 bonus games for a limited time!');
      },
      main: (base, S) => (sc, body, m) => {
        const P = S.P;
        const main = S.ctx.util.el('div', 'sd-main aero-plans', body);
        const hero = S.ctx.util.el('div', 'iron-hero', main);
        S.ctx.util.el('h1', '', hero, 'Ironwood Games Pass');
        S.ctx.util.el('p', '', hero, 'More Games. A Bigger World.');
        const tabs = S.ctx.util.el('nav', 'iron-tabs', main);
        for (const label of ['Choose a Plan', 'Compare Plans', 'Game Library', 'Member Benefits']) {
          S.ctx.util.el('span', '', tabs, label);
        }
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
        const title = main.querySelector('.sd-h');
        if (title) {
          title.title = title.textContent;
          title.textContent = 'Select Your Plan';
        }
        S.ctx.util.el('p', 'iron-intro', main, 'Get instant access to a growing library of PC games, exclusive content and member discounts.');
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
