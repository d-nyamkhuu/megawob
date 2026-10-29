(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-similar-04',
    'brand': 'Vocabulary Exercise',
    'title': 'Word Options',
    'instruction': 'left',
    'rail': '',
    'menu': 'File|Edit|Format|Tools|Window|Help',
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
      u.el('span', 'ds-brand', top, 'LexiLearn');
      ['Home|Practice|Reports|Admin'][0]
        .split('|')
        .forEach((t) => u.el('span', 'ds-nav' + (t === 'Practice' ? ' on' : ''), top, t));
      u.el('span', 'ds-user', top, 'Welcome, Alex ▾   |   Sign out');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      ['Vocabulary', 'Reading', 'Listening', 'Progress', 'Settings'].forEach((t, i) =>
        u.el('div', i ? '' : 'on', rail, t),
      );
      const content = u.el('div', 'ds-content', body);
      const titleRow = u.el('div', 'ds-title-row', content);
      u.el('h1', 'ds-h1', titleRow, 'Word Practice');
      const help = u.el('div', 'ds-help', document.body);
      const ht = u.el('div', 'ds-help-t', help);
      u.el('span', '', ht, 'Study Help');
      const hc = u.el('div', 'ds-help-controls', ht);
      const minimize = u.el('button', '', hc, '−');
      minimize.type = 'button';
      minimize.title = 'Minimize Study Help';
      minimize.addEventListener('click', () => help.classList.toggle('minimized'));
      const close = u.el('button', '', hc, '×');
      close.type = 'button';
      close.title = 'Close Study Help';
      close.addEventListener('click', () => {
        help.hidden = true;
      });
      const hb = u.el('div', 'ds-help-b', help);
      const hs = u.el('div', 'ds-help-s', hb);
      ['Synonyms', 'Examples', 'Tips'].forEach((t, i) => u.el('div', i ? '' : 'on', hs, t));
      const hm = u.el('div', 'ds-help-m', hb);
      u.el('h4', '', hm, 'What are synonyms?');
      u.el('p', '', hm, 'Synonyms are words that have the same or very similar meaning.');
      const ex = u.el('div', 'ds-help-ex', hm);
      u.el('b', '', ex, 'Example');
      u.el('div', '', ex, 'happy  →  glad');
      u.el('p', '', hm, 'Read each option carefully and select the words that match the meaning.');
      const mode = ctx.display || 'header';
      body.dataset.display = mode;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'header') briefing(main, 'ds-brief ds-header-note');
      if (mode === 'panel') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'link', 'header', 'footer']);
      const label = ctx.finish ? null : asLabel(endR.pick([...endLabels.map(() => 'Submit'), ...endLabels]));
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const opts = [...new Set(endLabels.map(asLabel))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (opts.length) collide = collideR.pick(opts);
      }
      function decoy(parent, text, isCollide) {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      }
      function endButton(parent, cls, text, tag) {
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
      }
      let submit = null;
      if (placement === 'header') {
        if (collide) decoy(titleRow, collide, true);
        submit = endButton(titleRow, 'ds-submit ds-head-submit', label);
      } else if (placement === 'footer') {
        if (collide) decoy(foot, collide, true);
        submit = endButton(foot, 'ds-submit', label);
      } else if (placement === 'link') {
        if (collide) decoy(foot, collide, true);
        submit = endButton(foot, 'ds-end-link', label + ' ›', 'a');
      }
      const clear = u.el('button', 'ds-clear', foot, 'Clear All');
      clear.type = 'button';
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
