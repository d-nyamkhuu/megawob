// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-matrix-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      parts: {
        'frame.6': (_base, S) => c => {
          c.u.el('span', 'vista-icon vista-app-icon', c.top);
          c.u.el('span', 'ds-brand', c.top, 'Customer Feedback - Survey');
        },
        'frame.7': () => c => {
          const controls = c.u.el('div', 'vista-window-controls', c.top);
          ['minimize', 'maximize', 'close'].forEach(name => c.u.el('span', 'vista-window-' + name, controls));
        },
        'frame.8': () => c => {
          const nav = c.u.el('nav', 'vista-nav', document.body);
          ['Home', 'Responses', 'Reports', 'Settings'].forEach((label, i) => {
            const item = c.u.el('div', 'vista-nav-item' + (i === 0 ? ' active' : ''), nav);
            c.u.el('span', 'vista-icon vista-nav-icon vista-icon-' + i, item);
            c.u.el('span', '', item, label);
          });
          c.nav = nav;
        },
        'frame.19': () => c => {
          c.stage = c.u.el('main', 'ds-stage', c.main);
          c.u.el('h1', 'ratings-title', c.stage, 'Product Ratings');
        },
        'frame.20': () => () => {},
        'frame.21': () => () => {},
        'frame.22': () => () => {},
        'frame.23': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'overlay.4': base => c => {
          if (c.ctx.kind !== 'promo') return base(c);
          const artwork = c.u.el('div', 'vista-envelope', c.el);
          artwork.innerHTML = '<svg viewBox="0 0 110 100" aria-hidden="true"><defs><linearGradient id="mail" x2="0" y2="1"><stop stop-color="#d4f3ff"/><stop offset="1" stop-color="#5db4df"/></linearGradient></defs><g stroke="#07549d" stroke-width="3" fill="none"><path d="M19 13 12 5m29 4-4-9m22 9 1-9m17 13 6-8"/><rect x="3" y="29" width="100" height="68" rx="3" fill="url(#mail)"/><path d="m5 32 49 39 47-39M5 94l34-33m62 33L69 61"/></g></svg>';
          const copy = c.u.el('div', 'vista-promo-copy', c.el);
          c.u.el('h2', '', copy, 'Stay in the loop');
          c.u.el('p', '', copy, 'Get the latest product updates, tips and special offers.');
          const email = c.u.el('input', 'vista-promo-email', copy);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
          const subscribe = c.u.el('button', 'vista-promo-subscribe', copy, 'Subscribe');
          subscribe.type = 'button';
        },
        'overlay.5': base => c => {
          base(c);
          if (c.ctx.kind === 'promo') {
            c.dismiss.classList.add('vista-dialog-close');
            c.dismiss.setAttribute('aria-label', 'Close');
            c.dismiss.title = 'Close';
          }
        },
        'frame.41': () => c => {
          const inspector = c.u.el('aside', 'vista-inspector', c.main);
          c.u.el('h2', 'vista-panel-title', inspector, 'Details');
          const body = c.u.el('div', 'vista-inspector-body', inspector);
          c.u.el('div', 'vista-product-photo', body);
          const facts = c.u.el('div', 'vista-facts', body);
          c.u.el('div', 'vista-field-label', facts, 'Product or Service');
          c.u.el('strong', 'vista-product-name', facts, 'Computers');
          c.u.el('div', 'vista-field-label', facts, 'Category');
          c.u.el('div', '', facts, 'Hardware');
          c.u.el('div', 'vista-field-label', facts, 'Description');
          c.u.el('div', 'vista-description', facts, 'Desktop and laptop computers for home and business use.');
          const related = c.u.el('div', 'vista-related', body);
          c.u.el('div', 'vista-related-title', related, 'Related Links');
          ['Product Information', 'Visit Website', 'Contact Support'].forEach((label, i) => {
            const link = c.u.el('div', 'vista-related-link', related);
            c.u.el('span', 'vista-icon vista-link-icon vista-link-' + i, link);
            c.u.el('span', '', link, label);
          });
          const panel = c.contentRoot.querySelector('.ds-brief');
          if (panel) c.main.appendChild(panel);
          const tools = c.top.querySelector('.ds-header-tools');
          if (tools) c.nav.appendChild(tools);
          const note = c.contentRoot.querySelector('.ds-header-note');
          if (note && note.querySelector('[data-role="submit"]')) {
            const holder = c.u.el('div', 'ds-header-tools', c.nav);
            Array.from(note.querySelectorAll('button, a')).forEach(button => holder.appendChild(button));
          }
          document.body.classList.toggle('vista-panel-mode', !!panel);
          document.body.classList.toggle('vista-toast-mode', !!c.contentRoot.querySelector('.ds-toast'));
          return { stage: c.stage, submit: c.submit };
        },
      },
    },
  });
})();
