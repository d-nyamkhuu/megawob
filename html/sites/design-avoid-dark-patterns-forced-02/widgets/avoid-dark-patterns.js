// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-forced-02',
  name: 'design',
  split: 'train',
  scenarios: ['forced'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '18px/1.4 Arial, sans-serif',
    windowRadius: '0px',
    windowShadow: 'none',
    colors: { '--b': '#07596a', '--bs': '#e7eeee', '--bfg': '#fff', '--fg': '#10243a', '--muted': '#626773', '--line': '#ded5c9' },
    parts: {
      frame: (base, S) => ctx => {
        const win = base(ctx);
        Object.assign(win.style, { left: '0px', top: '0px', width: `${ctx.size.width}px`, height: `${ctx.size.height}px` });
        return win;
      },
      tabs: (base, S) => ctx => {
        // Keep the template's optional-tab draws even though this is an in-app page.
        S.tabTitle = ctx.util.el('h1', 'cadence-heading');
        if (ctx.rng.bool(0.55)) ctx.rng.pick(S.D.extraTabs);
      },
      addressBar: (base, S) => ctx => {
        // The editorial title area is the stable, visible anchor for this design.
        S.bar = ctx.util.el('div', 'cadence-title-area', S.win);
        S.bar.appendChild(S.tabTitle);
        S.hostEl = S.tabTitle;
        S.pathEl = ctx.util.el('p', 'cadence-intro', S.bar);
      },
      pageFor: (base, S) => (sid, parent, m) => S.P.screenBody(S.spec.screens[sid], parent, m),
      screenBody: (base, S) => (sc, parent, m) => {
        const el = S.ctx.util.el;
        if (S.bar.cadenceActions) S.bar.cadenceActions.remove();
        const body = el('div', 'cadence-page', parent);
        const all = [...(sc.blocks || []), ...(sc.side || [])];
        const landing = all.some(b => b.t === 'hero');
        body.classList.toggle('cadence-form-page', !landing);
        const checkBlock = Object.values(S.spec.screens).flatMap(s => [...(s.blocks || []), ...(s.side || [])]).find(b => b.t === 'check' && b.ctl);
        const savedCtl = checkBlock && S.spec.ctls[checkBlock.ctl];
        const days = JSON.stringify(all).match(/(\d+)[ -]days?/i);
        S.tabTitle.textContent = `Start Your${days ? ' ' + days[1] + '-Day' : ''} Free Trial`;
        S.pathEl.textContent = 'Get unlimited, ad-free music on all your devices. Change or cancel anytime.';
        const grid = el('div', 'cadence-columns', body);
        const plans = el('section', 'cadence-plans', grid);
        const selected = el('div', 'cadence-plan selected', plans);
        el('span', 'cadence-radio', selected);
        const detail = el('div', 'cadence-plan-detail', selected);
        const actions = el('div', 'cadence-actions');
        // Keep every model-backed block and control; only their presentation and parent change.
        for (const b of sc.blocks || []) {
          const dest = ['hero', 'plan', 'h', 'kv', 'cards', 'cards2'].includes(b.t) ? detail : actions;
          S.P.blocks([b], dest, m);
        }
        if (!detail.children.length) el('h2', '', detail, 'Your trial plan');
        el('p', 'cadence-plan-description', detail, 'Ad-free listening, offline downloads, and the full catalogue.');
        for (const [name, desc, price, sub] of [
          ['Plus', 'Ad-free listening on web and mobile.', '£4.99 / month', '30 days free'],
          ['Free', 'Listen with ads. No downloads.', '£0', 'Always free']
        ]) {
          const row = el('div', 'cadence-plan', plans);
          el('span', 'cadence-radio', row);
          const tx = el('div', 'cadence-plan-detail', row);
          el('h2', '', tx, name); el('p', '', tx, desc);
          const pr = el('div', 'cadence-price', row);
          el('b', '', pr, price); el('span', '', pr, sub);
        }
        const benefits = el('div', 'cadence-benefits', plans);
        const art = {
          music: '<path d="M12 31V9l21-5v23M12 14l21-5"/><ellipse cx="7" cy="31" rx="5" ry="4"/><ellipse cx="28" cy="27" rx="5" ry="4"/>',
          download: '<path d="M20 3v23m-8-8 8 8 8-8M5 26v10h30V26"/>',
          devices: '<path d="M22 28H5V5h27v8M2 31h17"/><rect x="24" y="18" width="13" height="21" rx="1"/>'
        };
        for (const [icon, title, text] of [
          ['music', 'Millions of tracks', 'Play what you love, discover what’s next.'],
          ['download', 'Listen offline', 'Save albums and playlists to your device.'],
          ['devices', 'All your devices', 'Phone, tablet, computer and more.']
        ]) {
          const row = el('div', 'cadence-benefit', benefits);
          el('span', 'cadence-feature-icon', row).innerHTML = `<svg viewBox="0 0 42 42" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${art[icon]}</svg>`;
          const tx = el('div', '', row); el('h3', '', tx, title); el('p', '', tx, text);
        }
        const terms = el('section', 'cadence-terms', grid);
        const heading = (icon, text) => {
          const h = el('h2', 'cadence-section-heading', terms);
          el('span', '', h).innerHTML = `<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">${icon}</svg>`;
          el('span', '', h, text);
        };
        heading('<rect x="8" y="4" width="21" height="28" rx="1"/><path d="M13 11h11m-11 6h11m-11 6h7"/>', 'Trial terms');
        const list = el('ul', 'cadence-term-list', terms);
        const hero = all.find(b => b.t === 'hero');
        const rate = hero && hero.text && hero.text.match(/[^\s]+\/month/);
        for (const text of [days ? `${days[1]} days free${rate ? ', then ' + rate[0].replace(/\.$/, '') : ''}` : 'Free trial', 'No ads during your trial', 'Full access to our music catalogue', `Cancel anytime before ${days ? days[1] + ' days' : 'your trial ends'} and you won’t be charged`]) el('li', '', list, text);
        el('hr', '', terms);
        heading('<rect x="3" y="7" width="30" height="23" rx="2"/><path d="M3 14h30m-8 9h4"/>', 'Payment and renewal');
        S.P.blocks(sc.side || [], actions, m);
        if (!landing) terms.appendChild(actions);
        const payment = el('div', 'cadence-payment', terms);
        el('span', 'cadence-mastercard', payment).innerHTML = '<i></i><i></i>';
        const card = el('div', '', payment);
        const cardLabel = savedCtl && savedCtl.label.match(/(?:Visa|Amex|Mastercard)[^)]*/i);
        el('div', '', card, cardLabel ? cardLabel[0] : 'Saved payment method');
        el('small', '', card, 'Payment details on your account');
        el('p', 'cadence-payment-note', terms, 'A payment method is required to start your free trial. Your card won’t be charged until the trial ends.');
        if (landing && savedCtl) {
          const renewal = el('div', 'cadence-renewal-preview', terms);
          el('h3', '', renewal, 'Auto-renewal');
          // A read-only overview of the seeded saved-card preference; the actual
          // preference control remains on its original step in the trial flow.
          S.P.check({ label: savedCtl.label, sub: savedCtl.sub, on: !!m.vals[savedCtl.key], locked: !!savedCtl.locked || !!checkBlock.locked, sw: true }, renewal, m);
        }
        if (landing) {
          S.bar.appendChild(actions);
          S.bar.cadenceActions = actions;
        }
        el('div', 'cadence-billing', terms, 'More about trial terms and billing　 ›');
        return body;
      },
      hero: (base, S) => (b, parent, m) => {
        const el = S.ctx.util.el;
        const row = el('div', 'cadence-seeded-hero', parent);
        const split = b.title.split(/:\s*/);
        el('h3', '', row, split[0]);
        const price = el('div', 'cadence-price', row);
        const rate = b.text && b.text.match(/[^\s]+\/month/);
        el('b', '', price, rate ? rate[0].replace(/\.$/, '') : '');
        el('span', '', price, split.slice(1).join(': '));
      },
    },
  },
});
