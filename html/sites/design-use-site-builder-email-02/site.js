// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) => function overlay(ctx) {
      const { K } = S;
      const { rng, util, kind } = ctx;
      const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
      const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
      const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
      el.dataset.role = 'overlay';
      const endControl=document.querySelector('[data-role="submit"]');
      const endRect=endControl && endControl.getBoundingClientRect();
      if (kind==='banner') el.style.top=`${document.querySelector('.ref-task').getBoundingClientRect().bottom}px`;
      if (kind==='cookie' && endRect && endRect.top>window.innerHeight/2) {
        el.style.bottom=`${window.innerHeight-endRect.top+8}px`;
      }
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      const row = util.el('div', 'ref-ov-row', box);
      const btn = (label, how, primary) => {
        if (word && K.button[label]) label = word(K.button[label]);
        const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
        b.type = 'button';
        b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
        return b;
      };
      let dismiss;
      if (kind === 'cookie') {
        if (rng.bool(0.5)) btn('Settings', null, false);
        btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
        dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
      } else if (kind === 'promo') {
        dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
        btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
      } else if (kind === 'banner') {
        dismiss = btn('Dismiss', 'close', false);
      } else {
        dismiss = btn('×', 'close', false);
        dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.app = 'siteforge';
      const gadgets=util.el('div','wb-window-gadgets',header);
      for (const symbol of ['_','□','▣']) util.el('span','',gadgets,symbol);
      if (display !== 'header' || nav) {
        const title = 'SiteForge CMS';
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      } else {
        util.el('div', 'ref-brand', header, 'SiteForge CMS');
      }
      Object.assign(_c, { gadgets, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const deskNav = util.el('nav', 'wb-nav', document.body);
      body.before(deskNav);
      const navArt = {
        Home: '<path d="M5 24 24 5 43 24 39 27 36 24V43H26V31H18V43H9V24Z" fill="#455763"/><path d="M5 24 24 5 43 24 39 27 24 12 9 27Z" fill="#bfcad4"/><path d="M31 7H36V18L31 13Z" fill="#839db6"/><path d="M13 24V40H18V30H27V40H32V24L24 17Z" fill="#d9dfe3" stroke="none"/>',
        Pages: '<path d="M10 9H37V43H10Z" fill="#9aaaba"/><path d="M15 4H40V40H15Z" fill="#7295bf"/><path d="M19 8H35V35H19Z" fill="#c0c4c9"/><path d="M20 12H33M20 17H33M20 22H33M20 27H32M20 32H29" fill="none"/><path d="m32 35 9 6-11 1Z" fill="#d8e0e8"/>',
        Campaigns: '<path d="M5 11H43V39H5Z" fill="#f6f6f6"/><path d="m6 12 18 17 18-17M6 38l13-13M42 38 29 25" fill="none"/>',
        Social: '<path d="M5 8H41V32H20L10 41V32H5Z" fill="#7eabe1"/><path d="M8 10H38V13H8Z" fill="#bcd5ef" stroke="none"/><path d="M13 21h1m9 0h1m9 0h1" stroke-width="4"/>',
        Reports: '<path d="M5 26H13V43H5ZM20 16H28V43H20ZM35 6H43V43H35Z" fill="#7295bf"/><path d="M8 28V40M23 18V40M38 8V40" stroke="#d3e5f4"/>',
        Settings: '<path d="m20 4 8 0 1 6 5 2 5-3 5 6-4 5 1 5 6 2-2 8-6-1-4 4 1 6-8 2-3-6-5-1-5 4-6-6 4-5-1-5-6-2 2-8 6 1 4-4Z" fill="#647580"/><circle cx="25" cy="25" r="12" fill="#c2c6c9"/><circle cx="25" cy="25" r="7" fill="#59636b"/>',
      };
      for (const [icon, label] of [['⌂','Home'], ['▤','Pages'], ['✉','Campaigns'], ['▰','Social'], ['▥','Reports'], ['⚙','Settings']]) {
        const tab = util.el('div', `wb-tab${label === 'Campaigns' ? ' selected' : ''}`, deskNav);
        const art=util.el('span', 'wb-tab-icon', tab);
        art.innerHTML=`<svg viewBox="0 0 50 50" aria-hidden="true" fill="none" stroke="#080b0d" stroke-width="2.4" stroke-linejoin="miter">${navArt[label]}</svg>`;
        util.el('span', '', tab, label);
      }
      const records = util.el('aside', 'cc-records', body);
      util.el('div', 'cc-records-title', records, 'Block Properties');
      util.el('div', 'cc-inspector-empty', records, 'Select a block\nto edit its properties.');
      const inspector = util.el('div', 'cc-inspector-fields', records);
      for (const [label, kind] of [['Type:', 'select'], ['Title:', 'text'], ['Image:', 'browse'], ['Link:', 'text'], ['Alignment:', 'select'], ['Style:', 'select'], ['Spacing:', 'number']]) {
        const row = util.el('div', `cc-field cc-field-${kind} cc-field-${label.toLowerCase().replace(':','')}`, inspector);
        util.el('span', '', row, label);
        if (kind === 'browse') { util.el('span', 'cc-faux-input', row); util.el('button', 'cc-faux-button', row, 'Browse...'); }
        else if (kind === 'number') { util.el('span', 'cc-field-caption', row, 'Top:'); util.el('span', 'cc-faux-input', row, '0'); util.el('span', 'cc-field-caption', row, 'Bottom:'); util.el('span', 'cc-faux-input', row, '0'); }
        else util.el('span', 'cc-faux-input', row, kind === 'select' && label !== 'Type:' ? 'Default' : '');
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, deskNav, inspector, navArt, records });
    },
  };

  env.site({
    name: 'design-use-site-builder-email-02',
    template: 'site/base',
    design: { parts },
  });
})();
