(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-range-03',
    'brand': 'Notebook',
    'instruction': 'left',
    'rail': '',
    'menu': 'File|Edit|View|Note|Format|Tools|Help',
    'briefTitle': 'Set the date range',
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
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = endRng.pick(['footer', 'toolbar', 'footer', 'link']);
      const referenceEnd = placement === 'footer';
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg width="26" height="26" viewBox="0 0 26 26"><rect x="1" y="1" width="24" height="24" rx="5" fill="#f26a1b"/><rect x="8" y="7" width="10" height="12" rx="1.5" fill="none" stroke="#fff" stroke-width="2"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const wc = u.el('span', 'ds-wc', top);
      wc.innerHTML =
        '<svg width="150" height="20" viewBox="0 0 150 20" fill="none" stroke="#e8e8e8" stroke-width="1.6"><path d="M8 10h16"/><rect x="72" y="3" width="14" height="14"/><path d="M127 3l14 14M141 3l-14 14"/></svg>';
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', top);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const mode0 =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      let leftBrief = null;
      if (mode0 === 'left') {
        leftBrief = u.el('aside', 'ds-brief', body);
        u.el('div', 'ds-kicker', leftBrief, 'TASK BRIEFING');
        u.el('h2', '', leftBrief, C.briefTitle);
        u.el('div', 'ds-instruction', leftBrief, ctx.instruction);
        u.el('p', 'ds-note', leftBrief, 'Use the calendar controls on the right to select the start and end dates.');
        u.el(
          'p',
          'ds-note',
          leftBrief,
          ctx.finish
            ? 'Review both dates when you are ready.'
            : `When you are ready, click the ${endLabel} ${placement === 'link' ? 'link' : 'button'}.`,
        );
        u.el('hr', '', leftBrief);
        u.el('div', 'ds-kicker', leftBrief, 'NOTES');
        u.el(
          'p',
          'ds-note',
          leftBrief,
          'You can navigate between months using the arrows in the calendar. Both a start date and an end date are required.',
        );
      }
      const content = u.el('div', 'ds-content', body);
      const tb = u.el('div', 'ds-toolbar', content);
      [
        ['New Note', '#f26a1b'],
        ['Open', '#777'],
        ['Save', '#555'],
        ['Bold', '#666'],
        ['Italic', '#666'],
        ['Bullets', '#666'],
      ].forEach(([t, c], i) => {
        const b = u.el('span', 'ds-tool' + (i === 0 ? ' on' : ''), tb);
        const icons = [
          '<path d="M5 2h10l5 5v16H5z" fill="#ff7900"/><path d="M15 2v6h5M8 12h9M8 16h9M8 20h9" fill="none" stroke="white"/>',
          '<path d="M2 6h9l3 3h10v13H2z" fill="#777d82"/><path d="M2 11h23l-3 12H2z" fill="#777d82" stroke="#f4f4f4" stroke-width="1.5"/>',
          '<rect x="3" y="3" width="21" height="21" rx="2" fill="#777d82"/><path d="M8 3v8h11V3M8 24V15h12v9" fill="#f4f4f4"/><path d="M15 3v6" stroke="#777d82" stroke-width="3"/>',
          '<text x="3" y="23" font-family="Georgia" font-weight="bold" font-size="27" fill="#777d82">B</text>',
          '<text x="6" y="23" font-family="Georgia" font-weight="bold" font-style="italic" font-size="27" fill="#777d82">I</text>',
          '<path d="M8 5h17M8 13h17M8 21h17" stroke="#777d82" stroke-width="3"/><path d="M1 3h4v4H1zM1 11h4v4H1zM1 19h4v4H1z" fill="#777d82"/>',
        ];
        b.innerHTML = '<svg width="26" height="26" viewBox="0 0 27 27">' + icons[i] + '</svg>';
        u.el('span', '', b, t);
        b.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      if (mode0 === 'left') {
        u.el('h1', 'ds-h1', content, 'Select Date Range');
        u.el('div', 'ds-h2', content, ctx.instruction);
      }
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'right') {
        const b = briefing(main, 'ds-brief');
        b.style.order = '2';
      } else if (mode === 'left' && !leftBrief) {
        briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      cancel.dataset.role = 'xtra';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tb : foot;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' + (placement === 'toolbar' ? ' ds-end-toolbar' : placement === 'link' ? ' ds-end-link' : ''),
          parent,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        if (placement === 'toolbar') tb.classList.add('ds-toolbar-end');
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideRng.pick(options);
          const decoy = u.el('button', 'ds-cancel ds-end-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
