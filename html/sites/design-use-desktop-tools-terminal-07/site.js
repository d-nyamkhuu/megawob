(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-terminal-07',
    'brand': 'Terminal',
    'mode': 'side-left',
    'tokens': {
      'bg': '#285184',
      'panel': '#ccccd2',
      'fg': '#0a1038',
      'accent': '#f5da48',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
      'button-fg': '#000',
    },
    'nav': 'Terminal    Edit    Settings    Help',
    'obstruction': ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
    'footer': '',
  };
  const icons = {
    terminal:
      '<rect x="2" y="2" width="36" height="36" rx="2" fill="#eeeede" stroke="#555a52" stroke-width="2"/><rect x="6" y="6" width="28" height="28" fill="#253529" stroke="#9da494"/><path d="M8 8H32V18L8 29Z" fill="#799c65"/><path d="M11 14l5 4-5 4m10 3h7" stroke="white" stroke-width="2" fill="none"/>',
    doc: '<path d="M7 2H25L34 11V38H7Z" fill="#f4fbff" stroke="#416d9c" stroke-width="1.4"/><path d="M25 2V11H34" fill="#9fc6ec" stroke="#416d9c"/><path d="M10 5H22V17H10Z" fill="#adcde9"/><path d="M11 20H30M11 23H29M11 26H26M11 29H29M11 32H23" stroke="#6899bc" stroke-width="1.3"/><path d="M9 37V4" stroke="white"/>',
    gear: '<path d="M17 2H23L24 7L28 9L33 6L37 11L34 15L35 19L40 21L39 27L34 28L31 32L32 37L26 40L22 36L17 36L14 40L8 37L9 32L6 28L1 27L0 21L5 19L6 15L3 11L7 6L12 9L16 7Z" transform="translate(1 0) scale(.94)" fill="#a7c8e9" stroke="#426da5" stroke-width="1.8"/><circle cx="20" cy="21" r="9" fill="#ecebe2" stroke="#517ab0" stroke-width="2"/><circle cx="20" cy="21" r="5" fill="#83acd4"/>',
    help: '<circle cx="20" cy="20" r="18" fill="#619ed0" stroke="#355f89" stroke-width="2"/><path d="M5 14Q20 -2 34 14" fill="none" stroke="#b8dcf4" stroke-width="3"/><text x="20" y="30" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="30" fill="white">?</text>',
    check:
      '<path d="M2 20L12 10L22 20L43 1L51 9L22 37Z" fill="#65cc2b" stroke="#3f8e22" stroke-width="1.5"/><path d="M4 20L12 13L22 23L43 4" fill="none" stroke="#b2ed84" stroke-width="2"/>',
  };
  const icon = (el, name) => {
    el.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      (name === 'check' ? '54 40' : '40 40') +
      '" aria-hidden="true">' +
      icons[name] +
      '</svg>';
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const tb = u.el('div', 'gk-titlebar', header);
      icon(u.el('span', 'gk-ico', tb), 'terminal');
      u.el('span', 'gk-title', tb, 'Terminal Task');
      const wc = u.el('span', 'gk-wc', tb);
      ['_', '▢', '✕'].forEach((t) => u.el('i', '', wc, t));
      const mb = u.el('nav', 'gk-menu', header);
      ['File', 'Edit', 'View', 'Terminal', 'Help'].forEach((t) => u.el('span', '', mb, t));
      const endR = ctx.rng.fork('chrome/end');
      const placement = ctx.finish
        ? null
        : endR.pick(['footer', 'footer', 'footer', 'footer', 'menu-button', 'menu-link', 'title-button', 'menu-icon']);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const sampledEndLabel = String(
        endR.pick(
          labels.map((label) =>
            typeof label === 'string' ? label : label.label || label.text || label.name || String(label),
          ),
        ),
      );
      const submitDefault =
        labels.find(
          (x) =>
            String(typeof x === 'string' ? x : x.label || x.text || x.name || String(x))
              .trim()
              .toLowerCase() === 'submit',
        ) || labels[0];
      const preferSubmit = ctx.rng.fork('chrome/end-label').bool(0.5);
      let endLabel =
        placement === 'footer' || preferSubmit
          ? String(
              typeof submitDefault === 'string'
                ? submitDefault
                : submitDefault.label || submitDefault.text || submitDefault.name || String(submitDefault),
            )
          : sampledEndLabel;
      if (placement && placement !== 'footer' && endLabel.trim().toLowerCase() === 'submit') {
        const alternatives = labels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
          .filter((x) => x.trim().toLowerCase() !== 'submit');
        if (alternatives.length) endLabel = ctx.rng.fork('chrome/end-alternative').pick(alternatives);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      const wantCollide = !ctx.finish && collideR.bool(0.3);
      let collideLabel = null;
      if (wantCollide) {
        const pool = labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        const choices = pool.filter((x) => String(x).trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) collideLabel = String(collideR.pick(choices));
      }
      const decoy = (parent, label, collide) => {
        const b = u.el('button', 'gk-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
        return b;
      };
      const endButton = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (placement === 'menu-button') submit = endButton(mb, 'gk-end-menu', endLabel);
      if (placement === 'menu-link') {
        submit = u.el('a', 'gk-end-link', mb, endLabel);
        submit.href = '#';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (placement === 'title-button') {
        submit = endButton(tb, 'gk-title-end', endLabel);
        tb.insertBefore(submit, wc);
      }
      if (placement === 'menu-icon') {
        submit = endButton(mb, 'gk-end-icon', String.fromCharCode(10003));
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
      }
      if (collideLabel && placement !== 'footer') decoy(mb, collideLabel, true);
      const fillerR = ctx.rng.fork('chrome/decoys');
      const fillerPool =
        ctx.content && Array.isArray(ctx.content.DECOY_LABELS)
          ? ctx.content.DECOY_LABELS
          : ['Help', 'Feedback', 'Preview', 'Save draft', 'Reset view', 'Share', 'Export', 'History'];
      for (const label of fillerR.sample(fillerPool, fillerR.int(0, 2)))
        decoy(
          mb,
          String(typeof label === 'string' ? label : label.label || label.text || label.name || String(label)),
          false,
        );
      if (ctx.display === 'header' || ctx.display === 'toast') {
        const mn = u.el('div', 'mode-note ' + (ctx.display === 'toast' ? 'mode-toast' : 'mode-header'), header);
        u.el('strong', '', mn, ctx.display === 'header' ? 'Task' : 'Notification');
        u.el('span', '', mn, ctx.instruction);
      }
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display === 'panel') {
        u.el('h2', '', note, 'Task');
        u.el('p', '', note, ctx.instruction);
        u.el('div', 'gk-help', note, 'You can use standard Linux commands. A file listing is shown in the terminal.');
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const fl = u.el('span', 'footer-label', footer);
      [
        ['Clear Terminal', 'doc'],
        ['Reset', 'gear'],
        ['Show Hint', 'help'],
      ].forEach(([t, k]) => {
        const b = u.el('button', 'gk-btn', fl);
        b.type = 'button';
        b.dataset.action = k;
        icon(u.el('span', 'gk-bi ' + k, b), k);
        u.el('span', '', b, t);
      });
      const divider = u.el('span', 'gk-sep', fl);
      let footerSubmit = null;
      if (!ctx.finish && placement === 'footer') {
        footerSubmit = endButton(footer, 'end-control', endLabel);
        icon(u.el('span', 'submit-icon', footerSubmit), 'check');
      }
      if (collideLabel && placement === 'footer') {
        const b = decoy(footer, collideLabel, true);
        footer.insertBefore(b, footerSubmit);
      }
      if (placement !== 'footer') divider.hidden = true;
      submit = footerSubmit || submit;
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
