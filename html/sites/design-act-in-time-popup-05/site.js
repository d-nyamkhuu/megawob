(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-popup-05', styles: ['site.css'], scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection(); if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('strong', 'ds-brand', top, 'WorkHub');
      const nav = u.el('nav', 'ds-menu', top);
      ['Home', 'Documents', 'Tasks', 'Calendar', 'Reports', 'Settings'].forEach((label, i) => {
        const item = u.el('span', i === 0 ? 'active' : '', nav, label);
      });
      u.el('span', 'ds-guest', top, '◉　Guest　⌄');
      const ribbon = u.el('nav', 'ds-ribbon', document.body);
      const groups = [
        [['▤', 'New'], ['📁', 'Open'], ['▣', 'Save']],
        [['↶', 'Undo'], ['↷', 'Redo']],
        [['♟', 'Share'], ['✉', 'Email']],
        [['▣', 'Print'], ['⬇', 'Export']],
        [['⚙', 'Preferences'], ['?', 'Help']],
      ];
      groups.forEach(group => {
        const g = u.el('div', 'ds-toolgroup', ribbon);
        group.forEach(([icon, label]) => { const b = u.el('button', 'ds-tool', g); b.type = 'button';
          u.el('span', 'ds-tool-icon', b, icon); u.el('span', '', b, label); });
      });
      const mode = ctx.display;
      document.body.dataset.instruction = mode;
      document.body.classList.toggle('ds-has-end', !ctx.finish);
      const body = u.el('div', 'ds-content' + (mode === 'panel' ? ' ds-has-panel' : ''), document.body);
      let panel = null;
      if (mode === 'panel') { panel = u.el('aside', 'ds-brief', body); u.el('h2', '', panel, 'Instructions'); u.el('div', 'ds-instruction', panel, ctx.instruction); }
      const stage = u.el('main', 'ds-stage', body);
      if (mode === 'header') { const note = u.el('div', 'ds-header-note', body); u.el('div', 'ds-instruction', note, ctx.instruction); }
      if (mode === 'toast') { const note = u.el('div', 'ds-toast', body); u.el('div', 'ds-instruction', note, ctx.instruction); }
      const foot = u.el('footer', 'ds-footer', document.body);
      u.el('span', 'ds-status', foot, '●　All systems operational');
      u.el('span', 'ds-time', foot, 'Apr 28, 2025　 2:14 PM');
      let submit = null;
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end');
        const words = (ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length) ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const textOf = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
        const sampledLabel = textOf(r.pick(words));
        const sampledPlace = r.pick(['footer', 'footer', 'header', 'link']);
        const standard = r.fork('reference').bool(0.5);
        const label = standard ? 'Submit' : sampledLabel;
        const place = standard ? 'footer' : (sampledPlace === 'link' ? 'link' : 'header');
        const parent = place === 'header' ? top : foot;
        submit = u.el(place === 'link' ? 'a' : 'button', place === 'link' ? 'ds-endlink' : 'ds-submit', parent, place === 'link' ? label + ' ›' : label);
        if (submit.tagName === 'BUTTON') submit.type = 'button'; else submit.href = '#';
        submit.dataset.role = 'submit'; submit.title = label; submit.setAttribute('aria-label', label);
        document.body.dataset.endPlacement = place;
        submit.addEventListener('click', () => ctx.submit());
        if (place === 'link') submit.addEventListener('click', e => e.preventDefault());
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const choices = words.map(textOf).filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (choices.length) {
            const decoy = u.el('button', 'ds-xtra', foot, cr.pick(choices)); decoy.type = 'button'; decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
          }
        }
      }
      if (ctx.finish) delete document.body.dataset.endPlacement;
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util; const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'A scheduled system update will occur this evening. You may experience brief interruptions.' };
      u.el('div', 'ds-overlay-text', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, 'Close'); dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
