(function () {
  'use strict';
  const S = 'fill="#fff" stroke="#000" stroke-width="2" stroke-linejoin="round"';
  const ICONS = {
    New: `<path ${S} d="M8 3h12l5 5v21H8z"/><path ${S} d="M20 3v5h5"/>`,
    Open: `<path ${S} d="M2 10h6l3-6h9l3 4h6v21H2z"/><path ${S} d="M2 29l5-18h25l-6 18z"/>`,
    Save: `<path fill="#000" d="M5 3h21l3 3v24H3V5z"/><path fill="#fff" d="M9 4h13v9H9zM9 20h15v9H9z"/><path stroke="#000" stroke-width="1" d="M12 23h7M12 25h7M12 27h7"/>`,
    'Archive...': `<path ${S} d="M2 11l8-8h21v22l-8 7H2z"/><path ${S} d="M2 11h21v21M23 11l8-8M23 18l8-8M2 17h21"/><path stroke="#000" stroke-width="2" d="M9 20h7"/>`,
    Print: `<path ${S} d="M9 2h15v12H9z"/><path ${S} d="M3 12h26v16H3z"/><path ${S} d="M8 21h17v10H8z"/><path stroke="#000" stroke-width="1.2" d="M11 25h11M11 28h11M6 16h3M24 16h2M12 6h9M12 9h9"/>`,
    Cut: `<path fill="none" stroke="#000" stroke-width="2" d="M9 3l14 18M23 3L9 21"/><circle cx="9" cy="25" r="4" ${S}/><circle cx="23" cy="25" r="4" ${S}/>`,
    Copy: `<path ${S} d="M4 2h14l4 4v20H4z"/><path ${S} d="M12 8h11l5 5v18H12zM23 8v5h5"/><path stroke="#000" d="M16 17h7M16 20h6"/>`,
    Paste: `<path ${S} d="M5 5h23v26H5z"/><path ${S} d="M11 2h10v6H11z"/><path fill="none" stroke="#000" d="M9 12h14M9 16h7M9 20h12M9 24h9M22 13l4-3M20 17l4-3"/>`,
    Left: `<path stroke="#000" stroke-width="1.6" d="M4 3h24M4 6h19M4 9h24M4 12h17M4 15h23M4 18h19M4 21h24M4 24h17M4 27h13M4 30h11"/>`,
    Center: `<path stroke="#000" stroke-width="1.6" d="M4 3h24M7 6h18M4 9h24M8 12h16M5 15h22M7 18h18M4 21h24M8 24h16M10 27h12M12 30h8"/>`,
    Right: `<path stroke="#000" stroke-width="1.6" d="M4 3h24M9 6h19M4 9h24M11 12h17M5 15h23M9 18h19M4 21h24M11 24h17M15 27h13M17 30h11"/>`,
    Fonts: `<text x="16" y="28" text-anchor="middle" font-family="Times New Roman,serif" font-weight="700" font-size="32">A</text>`,
    Text: `<path ${S} d="M6 3h20v26H6z"/><path stroke="#000" stroke-width="2" d="M10 9h12M10 14h12M10 19h12M10 24h12"/>`,
    Picture: `<defs><pattern id="mac-picture-dots" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0h1v1H0zM1 2h1v1H1z"/></pattern></defs><path ${S} d="M1 2h30v28H1z"/><path fill="url(#mac-picture-dots)" stroke="#000" stroke-width="1.2" d="M2 28l9-12 7 9 5-8 7 11z"/><path stroke="#000" d="M7 6v5M5 8h4M25 7v4M23 9h4"/>`,
    Line: `<path stroke="#000" stroke-width="1.4" d="M1 30L31 2"/>`,
    Rectangle: `<path ${S} d="M1 3h30v27H1z"/>`,
    Find: `<path fill="#000" d="M5 3h6v5h10V3h6v5l3 4 1 13-2 4h-6l-3-3v-5h-4v5l-3 3H5l-2-4 1-13 3-4z"/><path fill="#fff" d="M7 17h3v6H7zM22 17h3v6h-3z"/>`,
  };
  const MENUS = ['File', 'Edit', 'Format', 'Document', 'Tools', 'Window', 'Help'];
  const GROUPS = [
    ['Document', ['New', 'Open', 'Save', '|', 'Archive...', 'Print']],
    ['Edit', ['Cut', 'Copy', 'Paste']],
    ['Format', ['Left', 'Center', 'Right', '|', 'Fonts']],
    ['Insert', ['Text', 'Picture', 'Line', 'Rectangle']],
    ['Find', ['Find']],
  ];
  env.site({
    name: 'design-click-control-dialog-04',
    styles: ['site.css', 'mac.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref mac';
      const shell = u.el('main', 'shell', document.body);
      const mb = u.el('header', 'mac-menubar', shell);
      const ap = u.el('span', 'mac-apple', mb);
      ap.innerHTML =
        '<svg viewBox="0 0 20 24"><path d="M10 6c-2-2-7-1-7 5 0 5 3 10 5 10 1 0 1.500-.600 2-.600s1 .600 2 .600c2 0 5-4 5-7-3-1-3-5 0-6-2-3-5-3-7-2zM11 4c0-2 1-3 3-4 0 2-1 3-3 4z"/></svg>';
      MENUS.forEach((m) => u.el('span', 'mac-mi', mb, m));
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ]
      ).map(labelOf);
      const endLabel = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(endLabels));
      const placement = endRng.pick(['footer', 'footer', 'menubar', 'titlebar']);
      const collide = collideRng.bool(0.3)
        ? String(collideRng.pick(endLabels.filter((x) => String(x).toLowerCase() !== endLabel.toLowerCase())))
        : null;
      const endControl = (parent, cls, visual) => {
        const b = u.el('button', cls, parent, visual);
        b.type = 'button';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      let submit = null;
      const collideButton = (parent) => {
        if (!collide) return;
        const b = u.el('button', 'mac-xtra', parent, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      };
      const fillerRng = ctx.rng.fork('chrome/decoy');
      const fillers = (
        (ctx.content && ctx.content.DECOY_LABELS) || [
          'Help',
          'Feedback',
          'Preview',
          'Save draft',
          'Reset view',
          'Share',
          'Export',
          'History',
        ]
      ).map(labelOf);
      const fillerCount = fillerRng.int(0, 2);
      for (let i = 0; i < fillerCount; i++) {
        const label = String(fillerRng.pick(fillers));
        const b = u.el('button', 'mac-xtra mac-filler', mb, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label }));
      }
      if (placement === 'menubar' && !ctx.finish) submit = endControl(mb, 'mac-submit mac-submit-menu', endLabel);
      collideButton(mb);
      u.el('span', 'mac-clock', mb, 'Mon Mar 14  10:24 AM');
      const rb = u.el('div', 'mac-ribbon', shell);
      GROUPS.forEach((g) => {
        const grp = u.el('section', 'mac-group', rb);
        u.el('h4', '', grp, g[0]);
        const row = u.el('div', 'mac-tools', grp);
        g[1].forEach((n) => {
          if (n === '|') {
            u.el('i', 'mac-sep', row);
            return;
          }
          const t = u.el(
            n === 'Archive...' ? 'button' : 'span',
            'mac-tool' + (n === 'Archive...' ? ' opener' : ''),
            row,
          );
          if (n === 'Archive...') t.type = 'button';
          const ic = u.el('i', '', t);
          ic.innerHTML = '<svg viewBox="0 0 32 32">' + ICONS[n] + '</svg>';
          u.el('span', '', t, n);
        });
      });
      const win = u.el('section', 'mac-win', shell);
      const tb = u.el('div', 'mac-titlebar', win);
      u.el('b', 'mac-close', tb);
      u.el('span', 'mac-tt', tb, 'Project Notes');
      u.el('b', 'mac-zoom', tb);
      u.el('b', 'mac-zoom z2', tb);
      if (placement === 'titlebar' && !ctx.finish) submit = endControl(tb, 'mac-submit mac-submit-title', '✓');
      collideButton(tb);
      const mode = ctx.display || 'header';
      if (mode === 'toast') {
        const note = u.el('div', 'mac-mode-note mac-toast-note', win, ctx.instruction);
      }
      const body = u.el('div', 'mac-wbody', win);
      if (mode === 'panel') {
        const panel = u.el('aside', 'mac-mode-note mac-panel-note', body, ctx.instruction);
        panel.setAttribute('aria-label', 'Task instructions');
      }
      const stage = u.el('div', 'stage', body);
      const sb = u.el('div', 'mac-scroll', body);
      u.el('i', 'up', sb);
      u.el('i', 'dn', sb);
      const st = u.el('div', 'mac-status', win);
      ['Page  1 of 1', 'Words: 24', 'Plain Text'].forEach((t) => u.el('span', '', st, t));
      const foot = u.el('footer', 'mac-foot', shell);
      if (mode === 'header') {
        const note = u.el(
          'div',
          'instruction' + (ctx.instruction.length > 100 ? ' mac-long-instruction' : ''),
          foot,
          ctx.instruction,
        );
        note.dataset.display = mode;
      }
      if (!ctx.finish && placement === 'footer') submit = endControl(foot, 'submit', endLabel);
      if (!ctx.finish && placement !== 'footer' && placement !== 'menubar' && placement !== 'titlebar')
        submit = endControl(foot, 'submit', endLabel);
      if (mode === 'hidden') shell.dataset.instruction = 'hidden';
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
