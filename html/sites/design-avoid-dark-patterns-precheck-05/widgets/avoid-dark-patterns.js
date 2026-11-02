// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-precheck-05',
  name: 'design',
  split: 'train',
  scenarios: ['precheck'],
  template: 'avoid-dark-patterns/browser',
  design: {
    geometry: { margin: 0, minWidth: 0, minHeight: 0, widthBreakpoint: 900, widthMin: 0, widthMax: 2000, widthScale: [1, 1], heightBreakpoint: 560, heightMin: 0, heightMax: 2000, heightScale: [1, 1], sideBreakpoint: 900, sideNarrow: 240, sideRange: [255, 290] },
    parts: {
      tabs: (base, S) => ctx => {
        const el = ctx.util.el;
        const context = el('div', 'bf-checkout-context', S.win);
        S.tabTitle = el('span', 'bf-context-title', context, S.app.name);
        if (ctx.rng.bool(0.55)) el('small', 'bf-context-secondary', context, ctx.rng.pick(S.D.extraTabs));
      },
      addressBar: (base, S) => ctx => {
        const context = S.tabTitle.parentElement;
        const domain = ctx.util.el('span', 'bf-context-domain', context);
        S.hostEl = ctx.util.el('span', 'bf-context-host', domain);
        S.pathEl = ctx.util.el('span', 'bf-context-path', domain);
        S.bar = context;
      },
      screenBody: (base, S) => (sc, parent, m) => {
        const el = S.ctx.util.el;
        const body = el('div', 'sd-body bf-checkout-grid', parent);
        if (S.ctx.size.height < 440) body.classList.add('bf-compact-checkout');
        const cards = [
          el('section', 'sd-card bf-checkout-card bf-items-card', body),
          el('section', 'sd-card bf-checkout-card bf-extras-card', body),
          el('div', 'bf-summary-column', body),
        ];
        el('h2', 'bf-card-title', cards[0], 'Your items');
        el('h2', 'bf-card-title', cards[1], 'Add-ons & extras');
        const extras = el('div', 'sd-checks bf-extras-list', cards[1]);
        const commTitle = el('h3', 'bf-comm-title', cards[1], 'Communications & offers');
        const comm = el('div', 'sd-checks bf-comm-list', cards[1]);
        const summary = el('div', 'bf-summary-card', cards[2]);
        const actions = el('div', 'bf-checkout-actions', cards[0]);
        const help = el('section', 'sd-card bf-help-card', cards[2]);
        el('h2', 'bf-card-title', help, 'Need help?');
        for (const [icon, title, sub] of [['◌', 'Chat with us', 'Available 24/7'], ['▤', 'Delivery information', 'See options and times'], ['↶', 'Returns & refunds', 'Our 30-day policy'], ['ⓘ', 'FAQs', 'Find quick answers']]) {
          const row = el('div', 'bf-help-row', help);
          el('span', 'bf-help-icon', row, icon);
          const words = el('span', 'bf-help-words', row);
          el('b', '', words, title);
          el('small', '', words, sub);
        }
        const all = sc.blocks || [];
        let sawLine = false;
        const route = (b, fromSide = false) => {
          if (b.t === 'sum') S.P.block(b, summary, m);
          else if (b.t === 'btns' || b.t === 'button') S.P.block(b, actions, m);
          else if (b.t === 'line' || (!sawLine && !fromSide && (b.t === 'h' || b.t === 'p' || b.t === 'note'))) {
            if (b.t === 'line') sawLine = true;
            S.P.block(b, cards[0], m);
          } else if (b.t === 'check') {
            const target = /newsletter|partner|offer|email|marketing|updates|share|subscription|trial/i.test(`${b.label || ''} ${b.sub || ''}`) ? comm : extras;
            S.P.block(b, target, m);
          } else if (b.t === 'h2' && !commTitle.dataset.used) {
            commTitle.dataset.used = '1';
            // Keep the task's own section title and use it for the consent group.
            commTitle.textContent = b.text || 'Communications & offers';
          } else S.P.block(b, cards[0], m);
        };
        for (const b of all) route(b);
        for (const b of sc.side || []) route(b, true);
        return body;
      },
    },
  },
});
