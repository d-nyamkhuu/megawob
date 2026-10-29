(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-phone-book-06',
    'brand': 'Contact Book',
    'nav': 'All Contacts|Favorites|Groups|Trash',
  };
  const ICON = {
    person:
      '<svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.5" fill="#111"/><path d="M3 21c0-5 4-7.5 9-7.5s9 2.500 9 7.500z" fill="#111"/></svg>',
    star: '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 2l3 7 7.500.600-5.700 5 1.800 7.400L12 18l-6.600 4 1.800-7.400-5.700-5L9 9z" fill="#111"/></svg>',
    group:
      '<svg width="22" height="22" viewBox="0 0 24 24"><circle cx="8" cy="8" r="3.500" fill="#111"/><circle cx="17" cy="9" r="3" fill="#111"/><path d="M1 20c0-4 3-6 7-6s7 2 7 6zM15 15c4-.5 8 1 8 5h-6z" fill="#111"/></svg>',
    trash:
      '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15" fill="none" stroke="#111" stroke-width="2.500"/><path d="M10 10v8M14 10v8" stroke="#111" stroke-width="2"/></svg>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const desk = u.el('div', 'ek-desk', document.body);
      const mode = ctx.display;
      if (mode !== 'hidden' && mode !== 'toast') {
        const b = u.el('aside', 'ds-brief' + (mode === 'panel' ? ' ds-brief-panel' : ''), desk);
        u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
      }
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      const cr = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = cr.bool(0.3) && collideLabels.length ? cr.pick(collideLabels) : null;
      const win = u.el('div', 'ek-win', desk);
      const tb = u.el('header', 'ek-title', win);
      const ti = u.el('span', 'ek-ico', tb);
      ti.innerHTML = ICON.person;
      u.el('span', 'ek-name', tb, C.brand);
      const wc = u.el('span', 'ek-wc', tb);
      wc.innerHTML =
        '<svg width="70" height="16" viewBox="0 0 70 16" fill="none" stroke="#111" stroke-width="1.500"><path d="M3 8h13"/><rect x="29" y="2" width="12" height="12"/><path d="M54 2l12 12M66 2L54 14"/></svg>';
      if (mode === 'toast') {
        const n = u.el('aside', 'ds-toast', win);
        u.el('div', 'ds-instruction', n, ctx.instruction);
      }
      const body = u.el('div', 'ek-body', win);
      const side = u.el('nav', 'ek-side', body);
      const ic = [ICON.group, ICON.star, ICON.group, ICON.trash];
      C.nav.split('|').forEach((t, i) => {
        const r = u.el('div', 'ek-nav' + (i === 0 ? ' on' : ''), side);
        const s = u.el('span', 'ek-ni', r);
        s.innerHTML = ic[i];
        u.el('span', '', r, t);
      });
      const main = u.el('div', 'ek-main', body);
      const tools = u.el('div', 'ek-tools', main);
      const sb = u.el('div', 'ek-search', tools);
      sb.innerHTML =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><circle cx="10" cy="10" r="6.500"/><path d="M15 15l6 6"/></svg><span>Search contacts...</span>';
      u.el('div', 'ek-add', tools, 'Add Contact');
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', win);
      u.el('span', 'ek-contact-count', foot, 'Contacts');
      const footTools = u.el('div', 'ek-end-tools', foot);
      if (collide) {
        const decoy = u.el('button', 'ds-xtra', footTools, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' + (placement === 'header' ? ' ds-submit-header' : placement === 'link' ? ' ds-submit-link' : ''),
          placement === 'header' ? tb : footTools,
          endLabel,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const tk = u.el('div', 'ek-task', document.body);
      tk.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M1 3l10 1.500v7H1zM12 4.500L23 3v8.500H12zM1 12.500h10v7L1 21zM12 12.500h11V21l-11-1.500z" fill="#111"/></svg>';
      u.el('span', 'ek-tsearch', tk, 'Type here to search');
      const fo = u.el('span', '', tk);
      fo.innerHTML =
        '<svg width="28" height="22" viewBox="0 0 28 22"><path d="M1 3h9l3 3h14v15H1z" fill="#111"/></svg>';
      u.el('span', 'ek-tbtn', tk, 'Contact Book');
      u.el('span', 'ek-clock', tk, '10:24 AM Apr 28, 2024');
      const searchText = tk.querySelector('.ek-tsearch');
      searchText.innerHTML =
        '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.7"><circle cx="14" cy="9" r="7"/><path d="M9 15L2 23"/></svg><span>Type here to search</span>';
      const taskButton = tk.querySelector('.ek-tbtn');
      taskButton.innerHTML = ICON.person + '<span>Contact Book</span>';
      const tray = u.el('span', 'ek-tray', tk);
      tray.innerHTML =
        '<svg width="28" height="26" viewBox="0 0 28 26" fill="none" stroke="#111" stroke-width="1.8"><path d="M2 8q12-11 24 0M6 12q8-8 16 0M10 16q4-4 8 0"/><circle cx="14" cy="21" r="1" fill="#111"/></svg><svg width="28" height="26" viewBox="0 0 28 26" fill="none" stroke="#111" stroke-width="1.7"><path d="M2 10h5l6-6v18l-6-6H2zM18 7q6 6 0 12M22 3q10 10 0 20"/></svg>';
      const clock = tk.querySelector('.ek-clock');
      tk.append(clock);
      clock.innerHTML = '10:24 AM<br>Apr 28, 2024';
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
