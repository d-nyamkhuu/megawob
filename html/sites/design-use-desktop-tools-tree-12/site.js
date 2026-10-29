(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-12',
    'brand': 'ACME SUPPLY CO.',
    'mode': 'side-right',
    'tokens': {
      'bg': '#e7eef3',
      'panel': '#ffffff',
      'fg': '#111b35',
      'accent': '#b24d1b',
      'font': 'Verdana,Arial,sans-serif',
      'line': '#bebebe',
      'muted': '#5e6779',
    },
    'nav': 'Home    Documents    Orders    Accounts    Support',
    'obstruction': null,
    'footer': 'Ready',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const bank = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const endLabels = bank.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const alternatives = endLabels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const endLabel = er.bool(0.5) || !alternatives.length ? 'Submit' : er.pick(alternatives);
      let placement = ctx.finish ? null : er.pick(['dock', 'dock', 'footer', 'panel']);
      if (ctx.display === 'hidden' || ctx.display === 'toast') placement = placement === 'panel' ? 'dock' : placement;
      let collideLabel = null;
      if (cr.bool(0.3)) {
        const pool = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) collideLabel = cr.pick(pool);
      }
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const logo = u.el('span', 'design-logo', header);
      logo.innerHTML =
        '<svg viewBox="0 0 44 42"><path fill="#b5d7ef" stroke="#749ab8" d="M22 1L11 22l11 19V1zM24 4v35l10-17zM9 24L1 40h17zM35 25l8 15H27z"/></svg>';
      u.el('div', 'design-brand', header, D.brand);
      const sub = u.el('div', 'design-sub', header, 'Partner Extranet');
      const tl = u.el('div', 'design-toplinks', header);
      ['Help', '|', 'Contact Us', '|', 'Log Out'].forEach((t) => u.el('span', t === '|' ? 'sep' : 'lnk', tl, t));
      if (collideLabel) {
        const cb = u.el('button', 'pqs-xtra', tl, collideLabel);
        cb.type = 'button';
        cb.dataset.role = 'xtra';
        cb.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
      }
      const nav = u.el('nav', 'design-nav', header);
      ['Home', 'Documents', 'Orders', 'Accounts', 'Support'].forEach((t) =>
        u.el('span', 'tab' + (t === 'Documents' ? ' on' : ''), nav, t),
      );
      u.el('span', 'date', nav, 'Mon, Mar 22, 1999');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', 'instruction-copy', note, ctx.instruction);
        const details = u.el('div', 'task-details', note);
        u.el('h3', '', details, 'Task Details');
        u.el(
          'p',
          '',
          details,
          'Find the requested file in the document library. The file is inside one of the folders. Click the file to select it.' +
            (ctx.finish ? '' : ' Then click ' + endLabel + '.'),
        );
        u.el('p', '', details, 'Do not use the Save view button\n(it only saves your display preferences).');
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', body);
      const dock = u.el('div', 'response-dock', body);
      const tb = u.el('span', 'footer-label', footer);
      ['New Folder', 'Upload...', 'Delete', 'Rename', 'Move...', 'Copy...'].forEach((t) => {
        const b = u.el('span', 'fake-btn', tb, t);
      });
      let submit = null;
      if (placement) {
        const parent = placement === 'footer' ? footer : placement === 'panel' ? note : dock;
        submit = u.el('button', 'end-control end-' + placement, parent, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
        if (placement !== 'dock') dock.hidden = true;
      } else dock.hidden = true;
      const decoy = u.el('button', 'design-xtra', footer, 'Save view');
      decoy.type = 'button';
      decoy.addEventListener('click', () => env.log('decoy', { what: 'Save view' }));
      decoy.textContent = 'Save View...';
      const dn = u.el('span', 'xtra-note', footer, '(saves your\nview settings only)');
      footer.insertBefore(decoy, dn);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
