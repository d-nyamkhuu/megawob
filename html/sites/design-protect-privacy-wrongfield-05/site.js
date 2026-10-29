// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const icon = (name) => {
    const paths = {
      home: '<path d="M3 10 12 3l9 7M5 9v12h14V9M9 21v-8h6v8"/>',
      search: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
      cart: '<path d="M2 3h3l3 13h11l3-10H6M9 20h.01M18 20h.01"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',
      cube: '<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm-9 5 9 5 9-5M12 12v10M7.5 4.5l9 5"/>',
      heart: '<path d="M12 21 3.8 13a5.7 5.7 0 0 1 8.2-8 5.7 5.7 0 0 1 8.2 8L12 21Z"/>',
      user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-3c0-5 16-5 16 0v3H4Z"/>',
      bell: '<path d="M5 17h14l-2-3V9c0-3-2-5-5-5S7 6 7 9v5l-2 3ZM10 21h4M12 2v2"/>',
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.home}</svg>`;
  };

  const parts = {
    'frame.layout': (base) => function (_c) {
      base(_c);
      if (_c.display === 'toast' && !_c.roomy) {
        _c.display = 'header';
        document.body.classList.remove('ref-has-note');
      }
    },
    endLabel: (base) => (rng, content) => {
      const label = base(rng, content);
      return rng.fork('sh/end-label').bool(.55) ? 'Continue' : label;
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      S.frameBrand(_c, document.createElement('div'));
      const crmBrand = util.el('div', 'crm-brand', header);
      util.el('span', 'crm-cube', crmBrand).innerHTML = '<svg viewBox="0 0 36 40" aria-hidden="true"><path fill="#62ed87" d="m18 0 17 10v20L18 40 1 30V10Z"/><path fill="#4bdd77" d="m18 21 17-11v20L18 40Z"/><path d="m9 11 9 5 9-5M18 23v13" fill="none" stroke="#183b29" stroke-width="2" stroke-linecap="round"/></svg>';
      util.el('strong', '', crmBrand, 'ShopHub');
      const accountTools = util.el('div', 'crm-account-tools', header);
      util.el('span', 'crm-bell', accountTools).innerHTML = icon('bell');
      const user = util.el('div', 'crm-user', accountTools);
      util.el('span', 'crm-user-photo', user, 'JT');
      util.el('span', 'crm-user-name', user, 'Jamie Taylor');
      util.el('span', 'crm-user-caret', user, '▾');
      Object.assign(_c, { accountTools, crmBrand, header, user });
    },
    'frame.nav': (_base, S) => function (_c) {
      const { content, local, nav, rng, util } = _c;
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), S.K.nav);
      const dock = util.el('nav', 'sh-dock', document.body);
      const items = [['home','Home'],['search','Browse'],['cart','Cart'],['cube','Orders'],['heart','Favorites'],['user','Account']];
      items.forEach(([name, label]) => {
        const a = util.el('a', `sh-dock-item${label === 'Orders' ? ' active' : ''}`, dock);
        a.href = '#'; a.setAttribute('aria-label', label);
        const glyph = util.el('span', 'sh-dock-icon', a);
        glyph.innerHTML = icon(name);
        if (label === 'Cart') util.el('span', 'sh-cart-count', glyph, '1');
        util.el('span', '', a, label);
        a.addEventListener('click', e => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
      });
    },
    'frame.body': (_base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), S.K.nav);
      Object.assign(_c, { body });
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (_c.display === 'toast' && note) {
        document.body.classList.remove('ref-has-note');
        const column = _c.util.el('aside', 'sh-note-column', _c.body);
        column.append(note);
      }
    },
    'frame.end': (base) => function (_c) {
      const result = base(_c);
      if (result.submit && (_c.label === 'Continue' || _c.placement === 'floating')) {
        let footer = document.querySelector('.ref-foot');
        if (!footer) {
          footer = _c.util.el('footer', 'ref-foot', document.body);
          _c.util.el('span', 'ref-foot-text', footer, 'Secure checkout');
        }
        let tools = footer.querySelector('.ref-tools');
        if (!tools) tools = _c.util.el('div', 'ref-tools', footer);
        const oldDock = result.submit.closest('.ref-float-dock');
        result.submit.className = 'ref-submit';
        result.submit.textContent = _c.label;
        tools.append(result.submit);
        if (oldDock) oldDock.remove();
      }
      const footer = document.querySelector('.ref-foot');
      if (footer) {
        const caption = footer.querySelector('.ref-foot-text');
        if (caption) caption.textContent = '';
        if (_c.ctx.finish && !footer.querySelector('button, a')) footer.remove();
      }
      return result;
    },
    overlay: (base, S) => function (ctx) {
      const result = base(ctx);
      if (ctx.kind === 'banner') {
        const header = document.querySelector('.ref-task');
        if (result.dismiss) {
          result.dismiss.textContent = '×';
          result.dismiss.title = 'Dismiss';
          result.dismiss.setAttribute('aria-label', 'Dismiss');
        }
        Object.assign(result.el.style, {
          position: 'fixed', top: `${header ? header.getBoundingClientRect().bottom : 60}px`,
          bottom: 'auto', left: '0', right: '0', width: 'auto', margin: '0',
          flex: '0 0 auto', boxSizing: 'border-box',
        });
      }
      return result;
    },
  };

  env.site({
    name: 'design-protect-privacy-wrongfield-05',
    template: 'site/base',
    design: { parts },
  });
})();
