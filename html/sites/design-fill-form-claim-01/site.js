(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#080808', muted: '#414657', line: '#dfe3e8' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const header = _c.util.el('header', 'claim-header', document.body);
      _c.util.el('strong', 'claim-title', header, 'Insurance Claims');
      _c.header = header;
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'claim-body', document.body);
      const stage = u.el('main', 'claim-stage', body);
      const related = u.el('aside', 'claim-related', body);
      Object.assign(_c, { body, stage, related });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.related;
      base(_c);
      _c.body = body;
      const { util: u, ctx, related } = _c;
      const rh = u.el('div', 'claim-related-heading', related);
      u.el('b', 'claim-number', rh, '03');
      u.el('strong', '', rh, 'Related Claims');
      u.el('div', 'claim-rule', related);
      const list = u.el('div', 'claim-list', related);
      const rr = ctx.rng.fork('chrome/related');
      const dates = [
        'Apr 12, 2016', 'Mar 3, 2016', 'Feb 18, 2016', 'Jan 27, 2016', 'Jan 14, 2016',
        'Dec 30, 2015', 'Dec 12, 2015', 'Nov 28, 2015', 'Nov 7, 2015', 'Oct 21, 2015',
      ];
      const records = dates.map((date, i) => {
        const p = ctx.content.personName(rr, { csplit: ctx.spec.csplit });
        return [`CLM-${10027 - i}`, `${p.first} ${p.last}`, date, i ? 'Closed' : 'Open'];
      });
      records.forEach((x, i) => {
        const row = u.el('div', 'claim-row' + (!i ? ' selected' : ''), list);
        const top = u.el('div', 'claim-row-top', row);
        u.el('strong', '', top, x[0]);
        u.el('span', '', top, x[2]);
        const low = u.el('div', 'claim-row-bottom', row);
        u.el('span', '', low, x[1]);
        u.el('span', 'claim-badge ' + (!i ? 'open' : 'closed'), low, x[3]);
      });
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) document.body.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('claim-footer');
      foot.classList.toggle('has-end', _c.placement === 'footer' || _c.placement === 'link');
      if (!foot.classList.contains('has-end')) {
        const tools = foot.querySelector('.ref-tools');
        while (tools.firstChild) _c.headerTools.appendChild(tools.firstChild);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.header.appendChild(dock);
      document.body.style.setProperty('--claim-header-h', _c.header.getBoundingClientRect().height + 'px');
      document.body.style.setProperty('--claim-footer-h', _c.foot.getBoundingClientRect().height + 'px');
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const close = () => {
        const backdrop = document.querySelector('.claim-overlay-backdrop');
        if (backdrop) backdrop.remove();
        ctx.dismiss('close');
      };
      if (ctx.kind === 'promo') u.el('div', 'claim-overlay-backdrop', document.body);
      const el = u.el('section', 'claim-overlay claim-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'banner') document.body.insertBefore(el, document.querySelector('.claim-body'));
      const symbol = u.el('span', 'claim-overlay-symbol', el);
      const copy = u.el('div', 'claim-overlay-copy', el);
      if (ctx.kind === 'cookie') {
        symbol.innerHTML =
          '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="#e9bd7b"/><g fill="#82613f"><circle cx="10" cy="9" r="2.4"/><circle cx="21" cy="10" r="2"/><circle cx="16" cy="17" r="2.5"/><circle cx="8" cy="21" r="1.7"/><circle cx="22" cy="23" r="2.2"/></g></svg>';
        u.el(
          'span',
          '',
          copy,
          'We use cookies to improve your experience, analyze site usage, and assist in our marketing efforts.',
        );
        u.el('a', 'claim-learn-more', el, 'Learn more');
      } else if (ctx.kind === 'promo') {
        symbol.innerHTML =
          '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M10 50L60 13L110 50V111H10Z" fill="#ffb522"/><path d="M27 26H94V86H27Z" fill="#e9f2ff"/><path d="M35 39H85M35 49H85M35 59H78" stroke="#2474e4" stroke-width="4"/><path d="M10 50L60 83L110 50V111H10Z" fill="#ffc133"/><path d="M10 111L60 73L110 111" fill="#ffa91b"/><path d="M60 5V0M25 16L19 10M96 16L103 9" stroke="#ffbf00" stroke-width="5"/></svg>';
        u.el('strong', '', copy, 'Stay in the loop');
        u.el('p', '', copy, 'Get the latest product updates, tips, and insurance insights delivered to your inbox.');
        const email = u.el('input', 'claim-promo-email', el);
        email.type = 'text';
        email.placeholder = 'Enter your email address';
        email.setAttribute('aria-label', 'Newsletter email address');
        const actions = u.el('div', 'claim-promo-actions', el);
        const subscribe = u.el('button', '', actions, 'Subscribe');
        subscribe.type = 'button';
        const later = u.el('button', '', actions, 'Maybe later');
        later.type = 'button';
        later.addEventListener('click', close);
      } else if (ctx.kind === 'banner') {
        symbol.innerHTML =
          '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 12H12L27 6V25L12 20H5Z" fill="#0055d9"/><path d="M11 20L14 29H8L6 20" fill="#0055d9"/><path d="M29 12V19M13 12V20" stroke="#6aa4f2" stroke-width="2"/></svg>';
        u.el('strong', '', copy, 'Scheduled maintenance');
        u.el('p', '', copy, 'Some features may be unavailable during scheduled maintenance.');
      } else if (ctx.kind === 'chat') {
        symbol.textContent = '?';
        u.el('strong', '', copy, 'How can we help?');
        u.el('p', '', copy, 'Send us a message. Our team is here to help.');
      } else {
        symbol.textContent = '✓';
        u.el('span', '', copy, 'Changes saved.');
      }
      const dismiss = u.el(
        'button',
        'claim-overlay-dismiss',
        el,
        ['cookie', 'banner'].includes(ctx.kind) ? 'Dismiss' : '×',
      );
      dismiss.type = 'button';
      dismiss.setAttribute('aria-label', 'Close');
      dismiss.addEventListener('click', close);
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-fill-form-claim-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-claim-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ec1714'],
      LOW_ACCENTS: ['#ec1714'],
      parts,
    },
  });
})();
