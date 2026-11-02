(function () {
  'use strict';
  const palette = { bg: '#eae7fe', panel: '#fdfaf5', fg: '#060b2b', muted: '#5d6180', line: '#c8c2ee' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const over = u.el('header', 'ds-over', document.body);
      over.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
      });
      u.el('i', 'ds-blob ds-blob-l', over);
      u.el('i', 'ds-blob ds-blob-c', over);
      u.el('i', 'ds-blob ds-blob-t', over);
      u.el('i', 'ds-dots ds-dots-t', over);
      u.el('h1', 'ds-order-title', over, 'Your Order');
      const pic = u.el('div', 'ds-pic', over);
      pic.innerHTML =
        '<svg viewBox="0 0 100 100"><path d="M36 30c0-18 28-18 28 0" fill="none" stroke="#1d2a2a" stroke-width="5"/><rect x="22" y="26" width="56" height="66" rx="22" fill="#6fb09a"/><rect x="30" y="58" width="40" height="26" rx="8" fill="#5c9c88" stroke="#3f7766" stroke-width="2"/><rect x="42" y="38" width="14" height="10" rx="2" fill="#8a5a3a"/><rect x="14" y="40" width="8" height="40" rx="4" fill="#26323a"/><rect x="78" y="40" width="8" height="40" rx="4" fill="#26323a"/></svg>';
      const prod = u.el('div', 'ds-prod', over);
      u.el('b', '', prod, 'Everyday Backpack');
      u.el('span', '', prod, 'Sage Green');
      u.el('span', '', prod, 'Qty: 1');
      u.el('strong', '', prod, '$49.00');
      const del = u.el('div', 'ds-delto', over);
      u.el('b', '', del, 'Delivery to');
      u.el('span', '', del, 'Jordan Lee');
      u.el('span', '', del, '123 Maple Ave');
      u.el('span', '', del, 'Riverside, CA 92507');
      u.el('a', '', del, 'Edit').href = '#';
      const sum = u.el('div', 'ds-sum', over);
      u.el('b', '', sum, 'Order Summary');
      [['Subtotal', '$49.00'], ['Shipping', '$5.00'], ['Tax', '$4.46']].forEach((r) => {
        const d = u.el('div', 'ds-sumrow', sum);
        u.el('span', '', d, r[0]);
        u.el('span', '', d, r[1]);
      });
      const tot = u.el('div', 'ds-sumrow ds-total', sum);
      u.el('span', '', tot, 'Total');
      u.el('span', '', tot, '$58.46');
      const side = u.el('aside', 'ds-brief');
      const identity = u.el('div', 'ds-university', side);
      u.el('a', '', identity, 'Riverton University').href = '#';
      u.el('div', '', identity, 'Office of Communications');
      const task = u.el('section', 'ds-academic-task', side);
      u.el('h2', '', task, 'Task');
      const help = u.el('section', 'ds-academic-help', side);
      u.el('h3', '', help, 'Need help?');
      u.el('p', '', help, 'If you have questions, please contact the Communications Office at ');
      u.el('a', '', help, 'news@riverton.edu').href = '#';
      Object.assign(_c, { over, side, header: task });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.over;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      body.addEventListener('click', (e) => {
        const a = e.target.closest && e.target.closest('a[href]');
        if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
      });
      const content = u.el('div', 'ds-content', body);
      u.el('i', 'ds-tri-l', content);
      u.el('i', 'ds-tri-r', content);
      u.el('i', 'ds-dots ds-dots-b', content);
      const main = u.el('div', 'ds-main', content);
      main.appendChild(_c.side);
      Object.assign(_c, { body, contentBox: content, main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentBox.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentBox.appendChild(foot);
      const reset = _c.util.el('button', 'ds-reset', foot, 'Back');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        _c.stage.querySelectorAll('input[type=radio]').forEach((el) => (el.checked = false));
      });
      _c.util.el('a', 'ds-cancel-link', foot, 'Cancel').href = '#';
      const links = _c.util.el('nav', 'ds-footer-links', foot);
      ['Privacy Policy', 'Contact Us', 'Help'].forEach((t) => (_c.util.el('a', '', links, t).href = '#'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util;
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
  env.site({
    name: 'design-choose-option-radio-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#603ee0'], LOW_ACCENTS: ['#603ee0'], parts },
  });
})();
