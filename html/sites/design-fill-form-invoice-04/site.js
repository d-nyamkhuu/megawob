(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-invoice-04',
    'brand': 'People Manager',
    'title': 'Add Contact',
    'instruction': 'left',
    'rail': '',
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
      u.el('span', 'ds-logo', top, '✦');
      u.el('span', 'ds-brand', top, 'Receipt Entry - Document Helper');
      const wc = u.el('span', 'ds-wc', top);
      ['_', '□', '×'].forEach((t, i) => u.el('b', i === 2 ? 'x' : '', wc, t));
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const ribbon = u.el('div', 'ds-ribbon', document.body);
      const paper =
        '<path d="M10 3h17l9 9v31H10z" fill="#fafcfe"/><path d="M27 3v10h9" fill="#d8e2eb"/><path d="M15 20h16m-16 6h16m-16 6h16m-16 6h12" stroke="#a5cbe6"/>';
      const icons = {
        'New': paper,
        'Open':
          '<path d="M5 15V9h14l5 5h17v27H5z" fill="#ffdc83"/><path d="M3 41l5-22h36l-6 22z" fill="#f8ca62"/><path d="M10 22h29" stroke="#fff5d2"/>',
        'Save':
          '<path d="M5 3h33l5 5v35H5z" fill="#77a7cc"/><path d="M12 3h23v15H12z" fill="#eee"/><path d="M28 4h5v11h-5z" fill="#333"/><path d="M12 27h25v15H12z" fill="#fafafa"/><path d="M16 32h17m-17 5h17" stroke="#a6bbca"/>',
        'Print':
          '<path d="M12 3h24v19H12z" fill="#f8fafc"/><path d="M5 18h38v21H5z" fill="#b9c0c5"/><path d="M8 21h32v10H8z" fill="#e9edf0"/><path d="M12 29h24v16H12z" fill="#fff"/><path d="M16 35h16m-16 5h16" stroke="#759ab3"/><circle cx="37" cy="25" r="1" fill="#383f40"/>',
        'Cut':
          '<circle cx="12" cy="35" r="6" fill="none"/><circle cx="29" cy="35" r="6" fill="none"/><path d="M15 31L34 3 25 27 8 4z" fill="#c9c6c0"/><circle cx="21" cy="27" r="2" fill="#b7b4ae"/>',
        'Copy': '<path d="M6 3h22v32H6z" fill="#d9dfe3"/>' + paper,
        'Paste':
          '<path d="M7 7h27v35H7z" fill="#d2a552"/><path d="M11 11h20v27H11z" fill="#fff"/><path d="M15 4h5V1h7v3h5v8H15z" fill="#eee2bc"/><path d="M22 19h14l7 7v19H22z" fill="#f5f8fa"/><path d="M36 19v7h7" fill="#cbd6df"/><path d="M26 31h12m-12 5h12m-12 5h12" stroke="#95bddb"/>',
        'Zoom In':
          '<path d="M29 29l14 14" stroke-width="7" stroke="#40464a"/><circle cx="19" cy="19" r="15" fill="#c9e4f5"/><circle cx="19" cy="19" r="11" fill="#9fcee9" stroke="#fff"/><path d="M12 19h14m-7-7v14" stroke="#386c9d" stroke-width="2"/>',
        'Zoom Out':
          '<path d="M29 29l14 14" stroke-width="7" stroke="#40464a"/><circle cx="19" cy="19" r="15" fill="#c9e4f5"/><circle cx="19" cy="19" r="11" fill="#a7c7eb" stroke="#fff"/><path d="M12 19h14" stroke="#386c9d" stroke-width="3"/>',
        'Fit Width':
          '<path d="M4 3h40v40H4z" fill="#fff"/><path d="M9 16V8h8m-8 0 9 9M31 8h8v8m0-8-9 9M9 30v8h8m-8 0 9-9m13 9h8v-8m0 8-9-9" fill="none" stroke="#3c7dac" stroke-width="3"/>',
        'Options':
          '<path d="M19 3h9l2 6 6 2 5-2 5 8-5 4v6l5 4-5 8-6-2-5 3-2 6h-9l-2-6-6-2-5 2-5-8 5-4v-6l-5-4 5-8 6 2 5-3z" fill="#aaa9a4"/><circle cx="23" cy="24" r="8" fill="#edeae2"/>',
        'Help':
          '<circle cx="24" cy="24" r="21" fill="#4f8fc8"/><circle cx="24" cy="24" r="18" fill="none" stroke="#9ac9ed"/><text x="24" y="36" text-anchor="middle" font-size="34" font-family="Arial" font-weight="bold" fill="white" stroke="none">?</text>',
      };
      Object.entries(icons).forEach(([label, svg]) => {
        const b = u.el('button', 'ds-ribbon-item', ribbon);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label }));
        b.innerHTML =
          '<svg viewBox="0 0 48 48" width="42" height="42" fill="none" stroke="' +
          (label === 'Cut' ? '#aaa79f' : '#414440') +
          '" stroke-width="1.5" stroke-linejoin="round">' +
          svg +
          '</svg>';
        u.el('span', '', b, label);
      });
      const items = [...ribbon.children];
      [
        ['Document', 4],
        ['Edit', 3],
        ['View', 3],
        ['Tools', 2],
      ].forEach(([label, n]) => {
        const g = u.el('div', 'ds-ribbon-group', ribbon);
        for (let i = 0; i < n; i++) g.append(items.shift());
        u.el('span', 'ds-ribbon-caption', g, label);
      });
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      content.dataset.instruction = ctx.display;
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
        if (ctx.display === 'panel') b.classList.add('ds-panel-note');
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
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
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready'); // New episode choices use independent streams; the original frame and widget draws stay intact.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endWords.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? document.querySelector('.ds-menu') : foot;
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'toolbar' ? ' ds-menu-end' : placement === 'link' ? ' ds-endlink' : ''),
          parent,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const alternatives = [...new Set(endWords)].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (alternatives.length) {
          const label = cr.pick(alternatives);
          const decoy = u.el('button', 'ds-cancel ds-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear Form');
      cancel.type = 'button';
      cancel.dataset.role = 'xtra';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Clear Form' }));
      if (submit && submit.parentElement === foot) foot.insertBefore(cancel, submit);
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
