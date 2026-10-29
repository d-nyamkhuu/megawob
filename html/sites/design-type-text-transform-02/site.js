(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-transform-02',
    'brand': 'Text Transformation Task',
    'title': 'Your answer',
    'instruction': 'top',
    'rail': '',
    'menu': 'Home|Notes|Format|Insert|View',
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
      const tools = u.el('div', 'ds-organizer-tools', document.body);
      function group(title) {
        const g = u.el('div', 'ds-organizer-group', tools);
        u.el('small', 'ds-organizer-caption', g, title);
        return g;
      }
      function button(parent, label, path) {
        const b = u.el('button', 'ds-organizer-button', parent);
        b.type = 'button';
        if (path)
          b.innerHTML =
            '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#535a5c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' +
            path +
            '"/></svg>';
        u.el('span', '', b, label);
        return b;
      }
      const clip = group('Clipboard');
      button(clip, 'Paste', 'M8 5H5v17h14V5h-3M8 2h8v6H8zM8 12h8M8 16h8');
      const c = u.el('div', 'ds-organizer-col', clip);
      button(c, 'Cut', 'M5 4l14 16M19 4 5 20M5 4a3 3 0 1 0 0 .1M19 4a3 3 0 1 0 0 .1');
      button(c, 'Copy', 'M7 7h14v15H7zM17 7V2H2v15h5');
      const font = group('Font');
      const line = u.el('div', 'ds-organizer-fontrow', font);
      u.el('div', 'ds-organizer-font', line, 'Georgia');
      u.el('div', 'ds-organizer-font', line, '16');
      const styles = u.el('div', 'ds-organizer-fontrow', font);
      ['B', 'I', 'U', 'A'].forEach((t) => button(styles, t));
      const align = group('Alignment');
      [
        'M3 4h18M3 9h12M3 14h18M3 19h12',
        'M3 4h18M6 9h12M3 14h18M6 19h12',
        'M3 4h18M9 9h12M3 14h18M9 19h12',
        'M3 4h18M3 9h18M3 14h18M3 19h18',
      ].forEach((p) => button(align, '', p));
      const lists = group('Lists');
      button(lists, '', 'M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1');
      button(lists, '', 'M8 5h13M8 12h13M8 19h13M3 3v4M2 7h2M2 11h2l-2 4h2M2 18h2l-1 2 1 2H2');
      const insert = group('Insert');
      button(insert, 'Image', 'M2 3h20v18H2zM2 17l6-7 5 5 4-4 5 6M16 7h1');
      button(
        insert,
        'Link',
        'M9 15 6 18a4 4 0 0 1-5-5l5-5a4 4 0 0 1 5 0M15 9l3-3a4 4 0 0 1 5 5l-5 5a4 4 0 0 1-5 0M8 16l8-8',
      );
      button(insert, 'Date & Time', 'M3 5h18v17H3zM3 10h18M8 2v6M16 2v6M7 15h2M12 15h2');
      button(insert, 'Add Note', 'M3 2h18v16l-5 4H3zM16 18h5');
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const roomy =
        ((ctx.size && ctx.size.width) || window.innerWidth) >= 1260 &&
        ((ctx.size && ctx.size.height) || window.innerHeight) >= 700;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? roomy
              ? 'toast'
              : 'top'
            : ctx.display === 'panel'
              ? roomy
                ? 'left'
                : 'top'
              : natural;
      content.classList.add('ds-mode-' + mode);
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(main, 'ds-toast');
        main.insertBefore(note, stage);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      const endRng = ctx.rng.fork('chrome/end');
      const legacyEnd = endRng.bool(0.5);
      const placement = legacyEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endWord = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const endLabel = legacyEnd ? 'Submit' : endWord(endRng.pick(endBank));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [...new Set(endBank.map(endWord))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) collide = { label: cr.pick(options), where: cr.pick(['toolbar', 'footer']) };
      }
      let submit = null;
      if (collide && collide.where === 'toolbar') {
        const d = u.el('button', 'ds-organizer-button ds-ribbon-xtra', insert, collide.label);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
      }
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'ds-submit', foot, endLabel);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.addEventListener('click', () => ctx.submit());
        } else if (placement === 'link') {
          submit = u.el('a', 'ds-endlink', foot, endLabel);
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.title = endLabel;
          submit.setAttribute('aria-label', endLabel);
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          submit = u.el('button', 'ds-organizer-button ds-ribbon-end', insert, endLabel);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.title = endLabel;
          submit.setAttribute('aria-label', endLabel);
          submit.addEventListener('click', () => ctx.submit());
        }
      }
      if (collide && collide.where === 'footer') {
        const d = u.el('button', 'ds-end-xtra', foot, collide.label);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
      }
      const binding = u.el('div', 'ds-organizer-binding', document.body);
      for (let i = 0; i < 6; i++) u.el('i', '', binding);
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
