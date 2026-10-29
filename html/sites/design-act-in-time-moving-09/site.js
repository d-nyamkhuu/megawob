(function () {
  'use strict';
  const C = { site: 'design-act-in-time-moving-09' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const rail = u.el('aside', 'ds-rail', document.body);
      u.el('div', 'ds-mark', rail, '●');
      [
        ['▶', 'Game'],
        ['▮', 'Stats'],
        ['⚙', 'Settings'],
        ['ⓘ', 'Help'],
      ].forEach(([i, t], n) => {
        const item = u.el('div', 'ds-nav' + (n === 0 ? ' active' : ''), rail);
        u.el('b', '', item, i);
        u.el('span', '', item, t);
      });
      const content = u.el('div', 'ds-content', document.body);
      let display = ctx.display;
      if (display === 'panel' && window.innerWidth < 1200) display = 'header';
      if (display === 'toast' && window.innerHeight < 700) display = 'header';
      const head = u.el('header', 'ds-header-note ds-display-' + display, content);
      if (display !== 'hidden') {
        const note = u.el('div', 'ds-instruction', head, ctx.instruction);
        if (display === 'panel') note.classList.add('ds-instruction-panel');
        if (display === 'toast') note.classList.add('ds-instruction-toast');
      }
      const stage = u.el('main', 'ds-stage', content);
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-summary', foot, 'Shapes to catch:');
      u.el('span', 'ds-time-label', foot, 'Time Left:');
      let submit = null;
      let placement = null;
      let label = 'Submit';
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        if (er.bool(0.5)) {
          placement = 'footer';
          label = 'Submit';
        } else {
          placement = er.pick(['header', 'link', 'icon']);
          const bank = ctx.content && ctx.content.END_LABELS;
          const labels =
            Array.isArray(bank) && bank.length
              ? bank
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
          const raw = er.pick(labels);
          label = (typeof raw === 'string' ? raw : raw && (raw.label || raw.text || raw.name)) || String(raw);
          if (label.trim().toLowerCase() === 'submit') label = 'Done';
        }
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const bank = ctx.content && ctx.content.END_LABELS;
          const labels =
            Array.isArray(bank) && bank.length
              ? bank
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
          const pool = labels
            .map((x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x))
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) collide = cr.pick(pool);
        }
        const addEnd = (parent, cls, text, tag) => {
          const b = u.el(tag || 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        const addDecoy = (parent, text) => {
          const b = u.el('button', 'ds-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          return b;
        };
        if (placement === 'header') {
          const tools = u.el('div', 'ds-header-tools', head);
          if (collide) addDecoy(tools, collide);
          submit = addEnd(tools, 'ds-submit ds-submit-header', label);
        } else if (placement === 'link') {
          submit = addEnd(foot, 'ds-end-link', label + ' ›', 'a');
          if (collide) addDecoy(foot, collide);
        } else if (placement === 'icon') {
          submit = addEnd(foot, 'ds-submit ds-submit-icon', '✓');
          if (collide) addDecoy(foot, collide);
        } else {
          submit = addEnd(foot, 'ds-submit', label);
          if (collide) addDecoy(foot, collide);
        }
      }
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
