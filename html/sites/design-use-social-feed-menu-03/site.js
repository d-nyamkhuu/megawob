(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-menu-03',
    'brand': 'Chatter',
    'mode': 'bottom',
    'tokens': {
      'bg': '#6b78cf',
      'panel': '#fdfdff',
      'fg': '#222428',
      'accent': '#2a56c6',
      'font': "'Trebuchet MS','Segoe UI',Verdana,sans-serif",
      'line': '#c4c6cc',
      'muted': '#6a6d75',
    },
    'obstruction': null,
    'footer': '3 items',
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
      const bar = u.el('header', 'mac-menubar', shell);
      u.el('span', 'mac-apple', bar).innerHTML =
        '<svg viewBox="0 0 24 24" width="26" height="26"><defs><clipPath id="ap"><path d="M12 8c1-3 3-4 5-4 0 2-1 4-4 4zM5 12c0-3 2-5 4-5 1.500 0 2 .7 3 .7S13.500 7 15 7c1.200 0 2.200.6 3 1.600-2.500 1.400-2.200 5 .5 6.200-1 2.600-2.500 5-4.500 5-1.200 0-1.500-.6-2.800-.6S9.500 20 8.500 20C6.500 20 5 16 5 12z"/></clipPath></defs><g clip-path="url(#ap)"><rect y="3" width="24" height="3.500" fill="#61bb46"/><rect y="6.500" width="24" height="3" fill="#fdb827"/><rect y="9.500" width="24" height="3" fill="#f5821f"/><rect y="12.500" width="24" height="3" fill="#e03a3e"/><rect y="15.500" width="24" height="2.500" fill="#963d97"/><rect y="18" width="24" height="3" fill="#009ddc"/></g></svg>';
      u.el('b', 'mac-app', bar, 'Chatter');
      bar.querySelector('.mac-apple').innerHTML =
        '<svg viewBox="24 1 28 32" aria-hidden="true"><image href="sites/design-use-social-feed-menu-03/assets/reference-scene.webp" width="1672" height="941"/></svg>';
      for (const m of ['File', 'Edit', 'View', 'Go', 'Window', 'Help']) {
        const s = u.el('span', 'mac-mi', bar, m);
        s.addEventListener('click', () => env.log('decoy', { what: m }));
      }
      u.el('span', 'mac-clock', bar, 'Mon Apr 24   9:17 AM');
      u.el('span', 'mac-vol', bar).innerHTML =
        '<svg viewBox="0 0 28 28" width="28" height="28" fill="#9fa7bc" stroke="#20232d" stroke-width="1.5"><path d="M3 10h5l7-6v20l-7-6H3z"/><path d="M19 8q6 6 0 12M22 4q9 10 0 20" fill="none"/></svg>';
      const desk = u.el('div', 'mac-desktop', shell);
      const icons = [
        ['Macintosh HD', 'disk'],
        ['Documents', 'folder'],
        ['Applications', 'folder'],
        ['Utilities', 'folder'],
        ['Trash', 'trash'],
      ];
      const dside = u.el('div', 'mac-icons', desk);
      const artwork = {
        folder:
          '<defs><linearGradient id="folderFace" x2=".2" y2="1"><stop stop-color="#cbd8ff"/><stop offset="1" stop-color="#879dd7"/></linearGradient></defs><path d="M9 12V6l8-3 11 7 27 10v37L9 44Z" fill="#c5cce6" stroke="#151725" stroke-width="2"/><path d="m11 8 7-2 10 7 26 9-3 3-28-11-12-3Z" fill="white" stroke="#151725"/><path d="m7 12 45 15v33L7 45Z" fill="url(#folderFace)" stroke="#151725" stroke-width="2"/><path d="m9 15 41 14v28" fill="none" stroke="#eef0ff" stroke-width="2"/>',
        disk: '<defs><linearGradient id="diskFace" x2=".15" y2="1"><stop stop-color="#d9dde4"/><stop offset="1" stop-color="#8e94a2"/></linearGradient></defs><path d="M14 3h37l9 49-3 7H5l-2-7Z" fill="url(#diskFace)" stroke="#242935" stroke-width="2"/><path d="M16 7h32l7 42H8Z" fill="none" stroke="#f4f4f8"/><rect x="20" y="9" width="23" height="6" rx="2" fill="#5b5f69" stroke="#f1f2f9"/><ellipse cx="31" cy="32" rx="15" ry="12" fill="#b9beca" stroke="#e1e5ee"/><ellipse cx="31" cy="32" rx="5" ry="4" fill="none" stroke="#e1e5ee"/><path d="m13 44 8 2m18 0 8-2M8 52h46" stroke="#eef0f6"/><circle cx="11" cy="54" r="1"/><circle cx="51" cy="54" r="1"/>',
        trash:
          '<defs><linearGradient id="trashFace"><stop stop-color="#959eac"/><stop offset=".3" stop-color="#eef1f7"/><stop offset=".6" stop-color="#bac3d2"/><stop offset="1" stop-color="#6d7788"/></linearGradient></defs><path d="m10 16 4 40q18 12 36 0l4-40" fill="url(#trashFace)" stroke="#171c27" stroke-width="2"/><path d="m19 24 2 29m7-28 1 31m7-31-1 31m9-33-2 30" stroke="#647083" stroke-width="2"/><path d="m16 25 3 28m7-29 1 31m7-31v31m8-31-2 28" stroke="#f3f6fa"/><ellipse cx="32" cy="16" rx="25" ry="7" fill="url(#trashFace)" stroke="#171c27" stroke-width="2"/><ellipse cx="32" cy="13" rx="19" ry="5" fill="#d6dce5" stroke="#586373"/><path d="M27 12V7q5-6 10 0v5" fill="#e8ecf1" stroke="#202633" stroke-width="2"/>',
      };
      const iconCrops = { disk: '1566 62 64 60', folder: '1568 210 57 63', trash: '1572 819 57 72' };
      for (const [n, k] of icons) {
        const i = u.el('div', 'mac-icon ' + k, dside);
        u.el('div', 'mac-glyph', i).innerHTML =
          '<svg viewBox="' +
          iconCrops[k] +
          '" aria-hidden="true"><image href="sites/design-use-social-feed-menu-03/assets/reference-scene.webp" width="1672" height="941"/></svg>';
        u.el('span', '', i, n);
      }
      const win = u.el('div', 'mac-window', desk);
      const tb = u.el('div', 'mac-titlebar', win);
      const bt = u.el('div', 'mac-tbtns', tb);
      for (let i = 0; i < 3; i++) u.el('span', 'mac-tbtn', bt);
      u.el('span', 'mac-ttl', tb, 'Chatter');
      u.el('span', 'mac-close', tb);
      const inner = u.el('div', 'mac-inner', win);
      const note = u.el('section', 'task-note', inner);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('span', 'task-clipboard', note).innerHTML =
          '<svg viewBox="0 0 40 48"><defs><linearGradient id="docFace" x2="0" y2="1"><stop stop-color="#8697ff"/><stop offset="1" stop-color="#485bc9"/></linearGradient></defs><path d="M3 2h23l12 13v30H3Z" fill="url(#docFace)" stroke="#11152b" stroke-width="2"/><path d="M26 2v13h12" fill="#f4f5ff" stroke="#11152b" stroke-width="2"/><path d="M12 19h9v5h8v11H12Z" fill="white"/><path d="M5 4h18" stroke="white"/></svg>';
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const content = u.el('div', 'mac-content', inner);
      const appbar = u.el('div', 'mac-appbar', content);
      u.el('span', 'mac-bubble', appbar);
      u.el('b', 'mac-appname', appbar, 'Chatter');
      const srch = u.el('div', 'mac-search', appbar);
      srch.innerHTML =
        '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#333" stroke-width="2"><circle cx="10" cy="10" r="6.500"/><path d="M15 15l6 6"/></svg><span>Search posts</span>';
      const stage = u.el('main', 'stage', content);
      const modesmall = window.innerWidth < 1100 || window.innerHeight < 680;
      if (ctx.display === 'panel' && !modesmall) {
        note.hidden = true;
        const panel = u.el('aside', 'task-panel', inner);
        u.el('b', '', panel, 'Task');
        u.el('span', '', panel, ctx.instruction);
      } else if (ctx.display === 'toast') {
        note.hidden = true;
        const toast = u.el('div', 'task-toast', content, ctx.instruction);
        toast.setAttribute('role', 'status');
      }
      const actionbar = u.el('div', 'mac-actions', inner);
      const status = u.el('footer', 'mac-status', win);
      u.el('span', '', status, D.footer);
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const endrng = ctx.rng.fork('chrome/end');
      let endPlacement = 'bottom',
        endLabel = 'Submit';
      if (!ctx.finish && endrng.bool(0.5)) {
        endPlacement = endrng.pick(['bottom', 'toolbar', 'status']);
        endLabel = endrng.pick(labels);
      }
      let submit = null;
      const makeEnd = (parent, cls, label) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, label);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (endPlacement === 'bottom') submit = makeEnd(actionbar, 'end-control', endLabel);
        else if (endPlacement === 'toolbar') submit = makeEnd(appbar, 'end-control end-toolbar', endLabel);
        else submit = makeEnd(status, 'end-link', endLabel);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
        if (pool.length) {
          const text = collideRng.pick(pool);
          const parent = endPlacement === 'bottom' ? appbar : endPlacement === 'toolbar' ? status : actionbar;
          const decoy = u.el('button', 'end-xtra', parent, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      const clear = u.el('button', 'clear-task', actionbar, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => env.log('decoy', { what: 'Clear' }));
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
