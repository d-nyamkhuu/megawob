(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-terminal-09',
    'brand': 'Terminal',
    'mode': 'side-left',
    'tokens': {
      'bg': '#e6e7ff',
      'panel': '#f7faff',
      'fg': '#202636',
      'accent': '#8572f4',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
      'button-fg': '#fff',
    },
    'nav': 'Terminal    Edit    Settings    Help',
    'obstruction': null,
    'footer': '',
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
      const shell = u.el('div', 'site-shell tm-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const ic = u.el('span', 'tm-appicon', header, '>_');
      u.el('div', 'design-brand', header, 'Terminal Task');
      const tools = u.el('div', 'tm-header-tools', header);
      const wc = u.el('div', 'tm-wc', header);
      ['min', 'max', 'close'].forEach((t) => u.el('span', 'tm-wb tm-' + t, wc));
      const body = u.el('div', 'design-body tm-body', shell);
      const left = u.el('div', 'tm-left', body);
      const note = u.el('section', 'task-note', left);
      note.dataset.role = 'instruction';
      if (ctx.display === 'header' || ctx.display === 'toast') {
        const fi = u.el('span', 'tm-fileicon', note);
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', left);
      const side = u.el('aside', 'tm-side', body);
      u.el('h2', '', side, 'Task Details');
      if (ctx.display !== 'hidden' && ctx.display !== 'toast') u.el('h3', '', side, 'Goal');
      if (ctx.display !== 'hidden' && ctx.display !== 'toast') u.el('div', 'tm-box tm-goal', side, ctx.instruction);
      u.el('h3', '', side, 'Current Directory');
      u.el('div', 'tm-box tm-mono tm-directory', side, '/home/user');
      u.el('h3', '', side, 'Helpful Commands');
      const hc = u.el('div', 'tm-box tm-mono tm-cmds', side);
      [
        ['ls', '# list files'],
        ['rm', '# remove a file'],
        ['pwd', '# print working directory'],
        ['cd', '# change directory'],
      ].forEach((r) => {
        const row = u.el('div', '', hc);
        u.el('b', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      u.el('h2', 'tm-app', side, 'Appearance');
      [
        ['Theme', 'Dark'],
        ['Font Size', '14 px'],
      ].forEach((r) => {
        const row = u.el('div', 'tm-row', side);
        u.el('span', '', row, r[0]);
        u.el('span', 'tm-sel', row, r[1]);
      });
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const placement = endR.pick(['inspector', 'inspector', 'toolbar', 'link']);
      const endLabel = placement === 'inspector' ? 'Submit' : endR.pick(endWords);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control tm-end-' + placement, placement === 'toolbar' ? tools : side, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      if (collideR.bool(0.3)) {
        const options = endWords.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideR.pick(options),
            decoy = u.el('button', 'tm-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const dismissOverlay = () => {
        ctx.dismiss();
        const command = document.querySelector('input[aria-label="command line"]');
        if (command && command.value) command.focus({ preventScroll: true });
      };
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
        accept.addEventListener('click', () => dismissOverlay());
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
      dismiss.addEventListener('click', () => dismissOverlay());
      return { el, dismiss };
    },
  });
})();
