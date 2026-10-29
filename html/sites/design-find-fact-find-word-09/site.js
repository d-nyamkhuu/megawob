(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-09',
    'brand': 'Finder',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Go|Window|Help',
    'briefTitle': 'Instructions',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, '−    □    ×');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const status = u.el('div', 'ds-status', top);
      status.innerHTML =
        '<svg viewBox="0 0 30 24"><path d="M2 7Q15-3 28 7M6 11q9-7 18 0M10 15q5-4 10 0" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="15" cy="20" r="2"/></svg><svg viewBox="0 0 30 24"><path d="M3 9h6l7-6v18l-7-6H3Z"/><path d="M20 7q6 5 0 10m3-14q10 9 0 18" fill="none" stroke="currentColor" stroke-width="2"/></svg><span>Mon 10:24 AM</span><svg viewBox="0 0 30 28"><circle cx="12" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M18 17l8 8" stroke="currentColor" stroke-width="2.6"/></svg>';
      const body = u.el('div', 'ds-body', document.body);
      const controls = u.el('div', 'ds-window-controls', body);
      ['red', 'yellow', 'green'].forEach((c) => u.el('i', c, controls));
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      let mode = ctx.display || 'header';
      const roomy = (ctx.size && ctx.size.width ? ctx.size.width : window.innerWidth) >= 1260;
      const tall = (ctx.size && ctx.size.height ? ctx.size.height : window.innerHeight) >= 700;
      if (mode === 'panel' && !roomy) mode = 'header';
      if (mode === 'toast' && !tall) mode = 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const endRng = ctx.rng.fork('chrome/end');
      const placements = ['header', 'footer', 'header', 'footer', 'link', 'footer'];
      let placement = placements[endRng.int(0, placements.length - 1)];
      let label = 'Submit';
      if (!endRng.bool(0.5)) {
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const item = endRng.pick(labels);
        label = typeof item === 'string' ? item : (item && (item.label || item.text || item.name)) || String(item);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const options = labels
          .map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      let submit = null;
      const foot = document.createElement('footer');
      foot.className = 'ds-footer';
      foot.dataset.placement = placement;
      if (!ctx.finish) {
        u.el('span', '', foot, 'Ready');
        const addDecoy = (text) => {
          const d = u.el('button', 'ds-xtra', foot, text);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        };
        if (collide) addDecoy(collide);
        if (placement === 'link') {
          submit = u.el('a', 'ds-submit ds-endlink', foot, label + ' ›');
          submit.href = '#';
        } else {
          submit = u.el('button', 'ds-submit', foot, label);
          submit.type = 'button';
        }
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        content.appendChild(foot);
        content.dataset.end = placement;
        content.dataset.xtra = collide ? 'yes' : 'no';
      }
      content.dataset.mode = mode;
      content.dataset.finish = ctx.finish ? 'yes' : 'no';
      if (submit && placement !== 'header')
        content.style.setProperty('--end-width', foot.getBoundingClientRect().width + 'px');
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
