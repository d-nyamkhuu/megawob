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
      const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
      let chatHead;
      if(kind==='promo'){
        const graphic=util.el('div','ref-promo-icon',box);
        graphic.innerHTML='<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="15" width="52" height="36" rx="3" fill="#0872bf"/><path d="m8 18 24 19 24-19M8 48l17-16m31 16L39 32" fill="none" stroke="white" stroke-width="3"/></svg>';
        util.el('h2','ref-promo-title',box,'Stay informed');
      }
      if(kind==='chat'){
        chatHead=util.el('div','ref-chat-head',box);
        util.el('strong','',chatHead,'▣　Need help?');
      }
      const overlayText=util.el('div', 'ref-ov-text', box, word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text);
      if(kind==='cookie'){
        const title=util.el('strong','ref-cookie-title',overlayText,'We use cookies');
        overlayText.prepend(title);
      }
      if(kind==='promo'){
        const input=util.el('input','ref-promo-input',box);
        input.type='email';input.placeholder='Enter your email address';input.setAttribute('aria-label','Email address');
      }
      if(kind==='chat'){
        const input=util.el('input','ref-chat-input',box);
        input.type='text';input.placeholder='Type a message…';input.setAttribute('aria-label','Chat message');
      }
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
      if(kind==='chat')chatHead.append(dismiss);
      if(kind==='promo'){
        const close=util.el('button','ref-promo-close',box,'×');
        close.type='button';close.setAttribute('aria-label',word?word('close'):'Close');
        close.addEventListener('click',()=>ctx.dismiss('close'));
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const winbar = util.el('div', 'gov-windowbar', document.body);
      util.el('span', 'gov-appicon', winbar, '▣');
      util.el('strong', '', winbar, 'Civic Support – Application');
      const wincontrols = util.el('div', 'gov-window-controls', winbar);
      for (const mark of ['−', '□', '×']) util.el('span', '', wincontrols, mark);
      const menubar = util.el('nav', 'gov-menubar', document.body);
      const tabIcons = [
        '<path fill="currentColor" d="M5 2h13l5 5v23H5z"/><path fill="none" stroke="#24465e" stroke-width="2" d="M9 11h10M9 16h10M9 21h10"/>',
        '<path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M12 21 25 8c5-5-1-10-6-5L5 17c-8 8 2 17 9 10L28 13M10 20 23 7"/>',
        '<circle cx="16" cy="16" r="14" fill="currentColor"/><path fill="none" stroke="#14232b" stroke-width="3" d="m8 16 6 6 11-13"/>',
        '<path fill="currentColor" d="M6 2h15l5 5v23H6z"/><path fill="none" stroke="#253039" stroke-width="2" d="M10 10h10M10 15h12M10 20h12M10 25h8"/>',
        '<rect x="2" y="6" width="28" height="22" rx="2" fill="currentColor"/><path fill="none" stroke="#15232a" stroke-width="2" d="m3 8 13 10L29 8"/>'
      ];
      for (const [index, item] of ['Application','Evidence','Eligibility','Review','Correspondence'].entries()) {
        const tab = util.el('span', 'gov-tab', menubar);
        const icon=util.el('b', '', tab);
        icon.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true">'+tabIcons[index]+'</svg>';
        util.el('span', '', tab, item);
      }
      const stats = util.el('div', 'gov-stats', menubar);
      util.el('div', '', stats, 'Application status: Draft');
      util.el('div', '', stats, 'Required documents: 0/4　 Optional documents: 0/2');
      // Keep the standard episode note and end controls in the application frame.
      document.body.insertBefore(winbar, header);
      document.body.insertBefore(menubar, header);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, stats, tabIcons, winbar, wincontrols });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      {
        const side = util.el('aside', 'ref-side', body);
        if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      }
      Object.assign(_c, { body });
    },
  };

  env.site({
    name: 'design-use-gov-portal-checklist-02',
    template: 'site/base',
    design: { parts },
  });
})();
