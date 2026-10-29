(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-typed-09',
    'brand': 'Event Planner',
    'title': 'Add Event',
    'instruction': 'top',
    'rail': 'Events|Tasks|Notes|Contacts|Settings|Help',
    'menu': 'File|Edit|View|Tools|Help',
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
      const wins = u.el('div', 'ds-windows', top);
      ['−', '□', '×'].forEach((t, i) => u.el('span', 'ds-window ds-window-' + i, wins, t));
      let nav = null;
      if (C.menu) {
        nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const roomy = document.body.clientWidth >= 1366;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel' && roomy
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const hd = u.el('div', 'ds-heading', content);
      u.el('span', 'ds-hicon', hd);
      u.el('h1', '', hd, C.title);
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main' + (mode === 'left' ? ' ds-main-panel' : ''), content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, '');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const alternateLabel = er.pick(endWords.filter((x) => x !== 'Submit'));
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
      const label = referenceEnd ? 'Submit' : alternateLabel;
      const decoyBtn = (parent, text, collide = false) => {
        const b = u.el('button', 'ds-btn' + (parent === nav ? ' ds-menu-action' : ''), parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      decoyBtn(foot, 'Clear');
      decoyBtn(foot, 'Cancel');
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'toolbar' ? ' ds-end-toolbar' : placement === 'link' ? ' ds-end-link' : ''),
          placement === 'toolbar' ? hd : foot,
          label,
        );
        if (placement === 'link') foot.insertBefore(submit, foot.firstChild);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = endWords.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) decoyBtn(nav, cr.pick(options), true);
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
