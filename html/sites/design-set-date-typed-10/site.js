(function () {
  'use strict';
  const C = { site: 'design-set-date-typed-10', brand: 'Task Manager', title: 'Project Task', instruction: 'right', rail: '', menu: 'Project Task', briefTitle: 'Your task' };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  const fallbackEnds = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];

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
      const mast = u.el('div', 'ds-mast', top);
      u.el('div', 'ds-brand', mast, 'The Daily Chronicle');
      u.el('div', 'ds-slogan', mast, 'News for a more informed tomorrow.');
      const util = u.el('div', 'ds-util', top);
      const links = u.el('div', 'ds-links', util);
      ['My Account', 'Settings', 'Help', 'Sign Out'].forEach(t => u.el('span', '', links, t));
      const srch = u.el('div', 'ds-search', util);
      u.el('span', 'ds-searchbox', srch, 'Search articles...');
      const searchIcon = u.el('span', 'ds-searchbtn', srch);
      searchIcon.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" stroke-width="3"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>';
      const nav = u.el('nav', 'ds-menu', document.body);
      ['Home', 'World', 'Business', 'Opinion', 'Life'].forEach(t => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach(t => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : ctx.display === 'panel' ? 'right' : 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'right') {
        const b = briefing(main, 'ds-brief');
        b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, '© 2011 The Daily Chronicle');
      u.el('span', 'ds-fl', foot, 'Contact');
      u.el('span', 'ds-fl', foot, 'Privacy');
      u.el('span', 'ds-fl', foot, 'Terms');
      u.el('span', 'ds-fr', foot, 'A calmer place for a clearer view.');

      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const placement = endRng.pick(['form', 'form', 'menu', 'footer']);
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS.map(labelOf) : fallbackEnds;
        const label = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(labels));
        const submitParent = placement === 'menu' ? nav : placement === 'footer' ? foot : main;
        const submitClass = placement === 'form' ? 'ds-submit' : placement === 'menu' ? 'ds-submit ds-submit-menu' : 'ds-submit ds-submit-footer';
        submit = u.el('button', submitClass, submitParent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const options = [...new Set(labels)].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const collidingLabel = labelOf(collideRng.pick(options));
            const decoyParent = collideRng.pick([nav, nav, foot]);
            const decoy = u.el('button', 'ds-xtra', decoyParent, collidingLabel);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: collidingLabel, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
