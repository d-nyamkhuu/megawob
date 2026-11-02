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
      if(kind==='banner'){
        el.style.top=`${document.querySelector('.ref-body').getBoundingClientRect().top}px`;
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
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'flash-titlebar', document.body);
      titlebar.textContent = '▣  Ninebark Landscaping · Workshop survey';
      const win = util.el('div', 'flash-window-buttons', titlebar);
      for (const glyph of ['—', '□', '×']) util.el('span', '', win, glyph);
      document.body.insertBefore(titlebar, header);
      const menubar = util.el('nav', 'flash-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help']) util.el('span', '', menubar, item);
      document.body.insertBefore(menubar, header);
      const toolbar = util.el('div', 'flash-toolbar', document.body);
      const icons = {
        New:'<path fill="white" d="M5 2h12l6 6v21H5z"/><path fill="#d5deef" d="M17 2v7h6"/>',
        Open:'<path fill="#f3ca36" d="M2 10h9l3-5h10v21H2z"/><path fill="#ffdc4a" d="M3 14h25l-6 13H0z"/><path fill="white" d="M6 10V3h12v9"/>',
        Cut:'<path fill="none" stroke="#062d7c" stroke-width="3" d="M12 19L22 2M12 19L4 2"/><circle fill="#eee" cx="7" cy="24" r="4"/><circle fill="#eee" cx="17" cy="24" r="4"/>',
        Copy:'<path fill="white" d="M2 8h15v20H2z"/><path fill="#e3efff" d="M9 2h10l5 5v19H9z"/><path fill="none" stroke="#1466c9" d="M12 11h9m-9 4h9m-9 4h9"/>',
        Paste:'<path fill="#f5d34b" d="M3 5h20v23H3z"/><path fill="#ddd" d="M9 2h9v6H9z"/><path fill="white" d="M12 12h15v18H12z"/><path fill="none" d="M15 17h9m-9 4h9m-9 4h9"/>',
        Delete:'<path fill="#e21530" d="M5 3l9 9 9-9 4 4-9 9 9 9-4 4-9-9-9 9-4-4 9-9-9-9z"/>',
        'Move Up':'<path fill="#1268c2" d="M14 1L1 14h8v15h11V14h8z"/>',
        'Move Down':'<path fill="#1268c2" d="M9 1h11v15h8L14 29 1 16h8z"/>'
      };
      for (const text of ['New','Open','|','Cut','Copy','Paste','Delete','|','Move Up','Move Down']) {
        if(text==='|'){util.el('i','',toolbar);continue;}
        const item=util.el('span','',toolbar);
        item.innerHTML='<svg viewBox="0 0 30 32" aria-hidden="true" stroke="#17273b" stroke-width="1.3" stroke-linejoin="round">'+icons[text]+'</svg>';
        util.el('b','',item,text).style.fontWeight='normal';
      }
      document.body.insertBefore(toolbar, header);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, icons, menubar, titlebar, toolbar, win });
    },
    'frame.floating': (base, S) => function (_c) {
      const { endBtn, headerTools, label, placement, toolbar, util } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      toolbar.append(headerTools);
      Object.assign(_c, { submit });
    },
  };

  env.site({
    name: 'design-use-form-builder-reorder-01',
    template: 'site/base',
    design: { parts },
  });
})();
