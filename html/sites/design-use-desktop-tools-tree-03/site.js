(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-03',
    'brand': 'Terminal',
    'mode': 'notebook',
    'tokens': {
      'bg': '#4a9be0',
      'panel': '#ffffff',
      'fg': '#14305a',
      'accent': '#2f86d6',
      'font': "'Trebuchet MS','Segoe UI',Verdana,sans-serif",
      'line': '#c4d8ee',
      'muted': '#5a7090',
      'button-fg': '#fff',
    },
    'nav': 'Terminal    Edit    Settings    Help',
    'obstruction': ['Notebook updates', 'Keep your files and notes together in your workspace.', 'Close'],
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
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      ['Files', 'Notes', 'Tasks', 'Calendar', 'Contacts'].forEach((t, i) => {
        const tab = u.el('div', 'nb-tab' + (i === 0 ? ' on' : ''), header);
        u.el('span', 'nb-ico', tab).innerHTML = window.nbIcon(['folder', 'notes', 'tasks', 'calendar', 'contacts'][i]);
        u.el('span', '', tab, t);
      });
      const binding = u.el('div', 'nb-binding', shell);
      for (let i = 0; i < 6; i++) u.el('i', 'nb-ring', binding);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      note.classList.add('display-' + ctx.display);
      if (ctx.display !== 'hidden') {
        if (ctx.display === 'panel') u.el('strong', 'note-kicker', note, 'Task instructions');
        u.el('span', 'nb-folder', note).innerHTML = window.nbIcon('folder');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const tbar = u.el('div', 'nb-toolbar', body);
      const arrows = u.el('div', 'nb-nav', tbar);
      ['back', 'forward'].forEach((k) => (u.el('span', '', arrows).innerHTML = window.nbIcon(k)));
      [
        ['folder', 'New Folder'],
        ['upload', 'Upload'],
        ['delete', 'Delete'],
      ].forEach(([k, t]) => {
        const b = u.el('div', 'nb-btn ' + k, tbar);
        b.innerHTML = window.nbIcon(k);
        u.el('span', '', b, t);
      });
      const search = u.el('div', 'nb-search', tbar);
      search.innerHTML = window.nbIcon('search');
      u.el('span', '', search, 'Search files...');
      const endRng = ctx.rng.fork('chrome/end');
      const picks = [endRng.bool(0.5), endRng.bool(0.5), endRng.bool(0.5)];
      const keepDefault = picks.filter(Boolean).length % 2 === 1;
      const placement = ctx.finish ? null : keepDefault ? 'footer' : endRng.pick(['toolbar', 'link']);
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = keepDefault ? 'Submit' : labelOf(endRng.pick(bank));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const options = [...new Set(bank.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = collideRng.pick(options);
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'nb-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
      };
      if (collide) decoy(tbar, collide, true);
      let submit = null;
      if (placement === 'toolbar') {
        submit = u.el('button', 'end-control nb-toolbar-end', tbar, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const fl = u.el('span', 'footer-label', footer);
      u.el('span', 'nb-folder sm', fl);
      u.el('span', '', fl, 'Files');
      if (!submit && placement === 'footer') {
        submit = u.el('button', 'end-control', footer, 'Submit');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      } else if (!ctx.finish && placement === 'link') {
        submit = u.el('a', 'end-control nb-end-link', footer, label + ' ›');
        submit.dataset.role = 'submit';
        submit.href = '#';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (!ctx.finish) {
      } else submit = null;
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
// Local, decorative Aero icons; task controls retain their own model wiring.
window.nbIcon = function (kind) {
  const paths = {
    folder:
      '<path d="M4 8Q4 4 8 4H15L19 9H31Q34 9 34 13V32H4Z" fill="#ffe98e" stroke="#d79f27"/><path d="M5 12H35L32 34H4Z" fill="url(#nbGold)" stroke="#cb961e"/><path d="M6 13H33M5 32V14" fill="none" stroke="#fff9cd" stroke-width="1.5"/>',
    notes:
      '<rect x="7" y="6" width="25" height="29" rx="2" fill="url(#nbBlue)" stroke="#165392" stroke-width="1.5"/><rect x="9" y="8" width="21" height="24" fill="#edfaff"/><path d="M13 17H27M13 22H27M13 27H23" stroke="#4796d1" stroke-width="1.5"/><path d="M13 5V11M20 5V11M27 5V11" stroke="#155496" stroke-width="3"/><path d="M14 4V9M21 4V9M28 4V9" stroke="#b5e7ff"/>',
    tasks:
      '<rect x="5" y="6" width="29" height="29" rx="2" fill="url(#nbBlue)" stroke="#165392" stroke-width="2"/><rect x="8" y="9" width="23" height="22" fill="#daf3ff"/><path d="M10 20L18 28 35 8" stroke="#1c649e" stroke-width="5" fill="none"/><path d="M11 18L18 25 34 7" stroke="#9de3ff" stroke-width="2" fill="none"/>',
    calendar:
      '<rect x="5" y="7" width="30" height="28" rx="2" fill="url(#nbBlue)" stroke="#165392" stroke-width="2"/><rect x="7" y="15" width="26" height="17" fill="#e5f6ff"/><path d="M5 13H35M12 5V12M28 5V12" stroke="#165392" stroke-width="3"/><path d="M13 5V10M29 5V10" stroke="#b5e7ff"/><path d="M11 20h4M18 20h4M25 20h4M11 26h4M18 26h4M25 26h4" stroke="#5296bf" stroke-width="2.5"/>',
    contacts:
      '<ellipse cx="28" cy="13" rx="6" ry="7" fill="url(#nbBlue)" stroke="#165392"/><path d="M20 34Q18 21 27 21Q37 21 37 32Z" fill="url(#nbBlue)" stroke="#165392"/><ellipse cx="15" cy="12" rx="7" ry="8" fill="url(#nbBlue)" stroke="#165392"/><path d="M3 34Q3 22 10 21L15 25 20 21Q26 22 27 35Z" fill="url(#nbBlue)" stroke="#165392" stroke-width="1.5"/>',
    upload:
      '<path d="M8 19L20 5 32 19H25V34H15V19Z" fill="url(#nbGreen)" stroke="#3d8519" stroke-width="1.5"/><path d="M10 18L20 7 29 18M16 20V32" fill="none" stroke="#b1ee72"/>',
    delete:
      '<path d="M10 7L20 17 30 7 35 12 25 22 35 32 30 37 20 27 10 37 5 32 15 22 5 12Z" fill="url(#nbRed)" stroke="#b74f44" stroke-width="1.3"/><path d="M10 9L20 19 30 9" stroke="#ffb6ab" fill="none" stroke-width="2"/>',
    search:
      '<circle cx="16" cy="16" r="11" fill="#f0fbff" stroke="#347fc0" stroke-width="3"/><path d="M24 24L35 35" stroke="#347fc0" stroke-width="5" stroke-linecap="round"/><path d="M9 16A7 7 0 0 1 16 9" fill="none" stroke="#fff" stroke-width="3"/>',
    back: '<circle cx="20" cy="20" r="16" fill="url(#nbMint)" stroke="#97c2af"/><path d="M19 9L9 20 19 30V24H30V16H19Z" fill="#79b598" stroke="#689d86"/><path d="M19 10L10 20M20 17H29" stroke="#ddf6e5"/>',
    forward:
      '<circle cx="20" cy="20" r="16" fill="url(#nbMint)" stroke="#a6c7d5"/><path d="M21 9L31 20 21 30V24H10V16H21Z" fill="#66a1bc" stroke="#6898ab"/><path d="M21 10L30 20M11 17H20" stroke="#e4fbff"/>',
  };
  return (
    '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="nbGold" x2="0" y2="1"><stop stop-color="#fff4ae"/><stop offset=".5" stop-color="#ffda61"/><stop offset="1" stop-color="#edb32a"/></linearGradient><linearGradient id="nbBlue" x2="0" y2="1"><stop stop-color="#9ce4ff"/><stop offset=".5" stop-color="#60b4ed"/><stop offset="1" stop-color="#1875b9"/></linearGradient><linearGradient id="nbGreen" x2="0" y2="1"><stop stop-color="#a7f365"/><stop offset="1" stop-color="#44ad0a"/></linearGradient><linearGradient id="nbRed" x2="0" y2="1"><stop stop-color="#ff9c8e"/><stop offset="1" stop-color="#ef4533"/></linearGradient><linearGradient id="nbMint" x2="0" y2="1"><stop stop-color="#ecfff0"/><stop offset="1" stop-color="#aedbc5"/></linearGradient></defs>' +
    (paths[kind] || paths.folder) +
    '</svg>'
  );
};
