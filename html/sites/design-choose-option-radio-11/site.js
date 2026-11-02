(function () {
  'use strict';
  const C = { site: 'design-choose-option-radio-11', brand: 'Pinecrest Solutions', sub: 'Client Workspace' };
  const PLANS = [
    ['Feature', 'Starter', 'Professional', 'Business', 'Enterprise'],
    ['Monthly price', '$19', '$49', '$99', '$199'],
    ['Users', 'Up to 5', 'Up to 25', 'Up to 100', 'Unlimited'],
    ['Storage', '10 GB', '100 GB', '500 GB', '1 TB'],
    ['Priority support', '—', 'Email', 'Email + Chat', '24/7 Phone'],
    ['Advanced reports', '—', '—', '✓', '✓'],
  ];
  function announcementRibbon(u) {
    const rib = u.el('section', 'nb-ribbon nb-overlay-ribbon', document.body);
    rib.dataset.role = 'overlay';
    const ic = u.el('div', 'nb-ribicon', rib);
    ic.innerHTML =
      '<svg viewBox="0 0 110 90" width="100%" height="100%"><g transform="rotate(-7 48 48)" fill="#205340"><path d="M8 32q0-5 5-5h14v29H13q-5 0-5-5zM31 27Q49 23 69 8q6-4 6 2v62q0 5-6 1Q49 58 31 56z"/><rect x="16" y="56" width="12" height="27" rx="4"/></g><path d="M86 23q15 18 0 36M96 13q24 27 0 54" fill="none" stroke="#205340" stroke-width="4"/></svg>';
    const rt = u.el('div', 'nb-ribtext', rib);
    u.el('h2', '', rt, 'System Maintenance This Weekend');
    const announcement = u.el(
      'p',
      '',
      rt,
      'Our services will be temporarily unavailable on Sat, Apr 26 from 10:00 PM to Sun, Apr 27 at 6:00 AM (ET).',
    );
    u.el('br', '', announcement);
    u.el('span', '', announcement, 'Please save your work before then.');
    const col = u.el('button', 'nb-collapse', rib, 'Collapse announcement');
    col.type = 'button';
    u.el('span', 'nb-tri', col, '▲');
    return { el: rib, dismiss: col };
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'nb-top', document.body);
      const b = u.el('div', 'nb-brand', top);
      u.el('strong', '', b, C.brand);
      u.el('span', 'nb-sep', b, '|');
      u.el('span', '', b, C.sub);
      const nav = u.el('nav', 'nb-nav', top);
      ['Project', 'Reports', 'Help'].forEach((t, i) => {
        if (i) u.el('i', '', nav, '|');
        const a = u.el('a', '', nav, t);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { label: t });
        });
      });
      u.el('span', 'nb-avatar', nav, 'JS');
      const book = u.el('div', 'nb-book', document.body);
      const tabs = u.el('div', 'nb-tabs', book);
      for (let i = 1; i <= 8; i++) u.el('div', 'nb-tab' + (i === 1 ? ' on' : ''), tabs, '0' + i);
      const rings = u.el('div', 'nb-rings', book);
      for (let i = 0; i < 16; i++) u.el('i', '', rings);
      const page = u.el('main', 'nb-page', book);
      const hd = u.el('div', 'nb-head', page);
      const hl = u.el('div', '', hd);
      u.el('h1', '', hl, 'New Account Setup');
      u.el('p', '', hl, 'Step 1 of 4  –  Plan Selection');
      const hr = u.el('div', 'nb-meta', hd);
      u.el('div', '', hr, 'Client: Acme Supply Co.');
      const toolbar = u.el('div', 'nb-meta-actions', hr);
      u.el('span', '', toolbar, 'Date: Apr 24, 2025');
      const sec = u.el('section', 'nb-sec nb-sub', page);
      u.el('div', 'nb-bar', sec, 'Subscription Details');
      const row = u.el('div', 'nb-row', sec);
      const left = u.el('div', 'nb-left', row);
      Object.assign(_c, { page, row, left, toolbar, header: left });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const right = u.el('div', 'nb-right', _c.row);
      u.el('div', 'nb-bar2', right, 'Plan Comparison');
      const tb = u.el('table', 'nb-table', right);
      PLANS.forEach((r, i) => {
        const tr = u.el('tr', '', tb);
        r.forEach((c) => u.el(i ? 'td' : 'th', '', tr, c));
      });
      const pref = u.el('section', 'nb-sec nb-pref', _c.page);
      u.el('div', 'nb-bar', pref, 'Account Preferences');
      const pr = u.el('div', 'nb-prow', pref);
      [
        ['Billing cycle', 'Monthly'],
        ['Team size (approx.)', '1–5'],
        ['Primary use case', 'Select an option'],
      ].forEach((p) => {
        const f = u.el('div', 'nb-pf', pr);
        u.el('label', '', f, p[0]);
        const s = u.el('div', 'nb-fake', f);
        u.el('span', '', s, p[1]);
        u.el('b', '', s, '⌄');
      });
      _c.body = _c.left;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'ds-stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.left.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.page.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.textContent = 'Client Workspace · Plan Selection';
      text.hidden = !(_c.ctx.finish || _c.placement === 'header' || _c.placement === 'icon' || _c.placement === 'floating');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.kind === 'banner') {
        const ribbon = announcementRibbon(u);
        ribbon.dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return ribbon;
      }
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  const palette = { bg: '#204d3e', panel: '#f0f5eb', fg: '#102c27', muted: '#527261', line: '#8aaf9b' };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-choose-option-radio-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1f4d3a'],
      LOW_ACCENTS: ['#1f4d3a'],
      parts,
    },
  });
})();
