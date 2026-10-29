(() => {
  'use strict';
  env.site({
    name: 'design-act-in-time-simon-04', styles: ['site.css'], scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const bar = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-apple', bar, '●');
      const menus = u.el('nav', 'ds-menu', bar);
      ['File', 'Edit', 'Game', 'Window', 'Help'].forEach(t => u.el('span', '', menus, t));
      u.el('span', 'ds-time', bar, '10:24 AM　 ✉');

      const content = u.el('section', 'ds-content', document.body);
      const title = u.el('header', 'ds-window-title', content);
      u.el('i', 'ds-window-box', title, '□');
      u.el('span', 'ds-title-rule', title, '');
      u.el('strong', '', title, 'Memory Game');
      u.el('span', 'ds-title-rule', title, '');
      u.el('i', 'ds-window-box', title, '▤');
      const mast = u.el('div', 'ds-masthead', content);
      u.el('span', 'ds-paper-icon', mast, '▤');
      u.el('strong', '', mast, 'Memory Game');
      u.el('span', 'ds-tagline', mast, 'A test of your memory.');

      let mode = ctx.display === 'hidden' ? 'hidden' : ctx.display === 'toast' ? 'toast' : ctx.display === 'panel' ? 'panel' : 'header';
      if (mode === 'panel' && window.innerWidth < 1260) mode = 'header';
      if (mode === 'toast' && window.innerHeight < 700) mode = 'header';
      document.body.dataset.simonbrief = mode;
      const briefing = (parent, cls) => {
        const b = u.el('aside', cls, parent);
        if (ctx.instruction.length > 58) b.classList.add('ds-long-instruction');
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      };
      if (mode === 'header') briefing(content, 'ds-header-note');
      const stage = u.el('main', 'ds-stage', content);
      const note = u.el('aside', 'ds-simon-notes', document.body);
      u.el('div', 'ds-note-title', note, 'Notes');
      u.el('div', 'ds-note-body', note, '▤　Remember:\n　　 Watch the lights.\n　　 Click the buttons\n　　 in the same order.');
      u.el('div', 'ds-note-rule', note, '');
      u.el('div', 'ds-round', note, 'Round 1 of 5');
      if (mode === 'panel') briefing(note, 'ds-brief');
      if (mode === 'toast') {
        const toast = briefing(content, 'ds-toast');
        content.insertBefore(toast, stage);
      }

      const rng = ctx.rng;
      const endRng = rng.fork('chrome/end');
      const bank = ctx.content && ctx.content.END_LABELS;
      const labels = Array.isArray(bank) && bank.length ? bank : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      const pickedLabel = labelOf(endRng.pick(labels));
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'toolbar', 'link']);
      // Preserve the reference's footer/Submit pair in half of episodes.
      const label = placement === 'footer' ? 'Submit' : pickedLabel;
      const tools = u.el('div', 'ds-window-tools', title);
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Watch the sequence, then repeat it.');
      let submit = null;
      const makeSubmit = (parent, cls, link = false) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, label);
        if (link) b.href = '#'; else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeSubmit(foot, 'ds-submit');
        else if (placement === 'link') submit = makeSubmit(foot, 'ds-endlink', true);
        else submit = makeSubmit(tools, 'ds-submit ds-toolbar-end');
      }
      const collideRng = rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(labels.map(labelOf))].filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const decoy = u.el('button', 'ds-xtra', tools, collideRng.pick(options));
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', `ds-overlay ds-overlay-${ctx.kind}`, document.body);
      el.dataset.role = 'overlay';
      const text = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, text[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
