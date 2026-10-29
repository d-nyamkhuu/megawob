(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-search-10',
    'tokens': {
      'bg': '#ffffff',
      'panel': '#ececec',
      'fg': '#222222',
      'accent': '#0000ee',
      'font': 'Helvetica,Arial,sans-serif',
      'line': '#8a8a8a',
      'muted': '#555555',
    },
    'obstruction': null,
  };
  const TOOLS = [
    [
      'Web',
      '<defs><radialGradient id="ocean" cx=".3" cy=".2" r=".9"><stop stop-color="#c4f0ff"/><stop offset=".4" stop-color="#4583f7"/><stop offset="1" stop-color="#071182"/></radialGradient><radialGradient id="land"><stop stop-color="#a5f258"/><stop offset="1" stop-color="#288c29"/></radialGradient></defs><circle cx="16" cy="16" r="13" fill="url(#ocean)" stroke="#162050"/><path d="M7 6l5-2 3 3-3 4 4 4-4 5-3-2-1-5-3-2zM18 4l6 4-3 3 5 4-2 6-3 3-2-5-4-3 2-4zM9 23l4-1 3 4-2 3z" fill="url(#land)" stroke="#185b24" stroke-width=".6"/><path d="M4 13q12-4 24 0M4 20q12 4 24 0M15 3q-9 12 0 26M18 3q8 12 0 26" fill="none" stroke="#222b73" opacity=".4" stroke-width=".6"/>',
    ],
    [
      'Images',
      '<path d="M5 1h16l8 8v22H5z" fill="#fff" stroke="#222"/><path d="M21 1v8h8" fill="#ddd" stroke="#222"/><rect x="8" y="12" width="17" height="13" fill="#fff" stroke="#333"/><rect x="10" y="14" width="13" height="9" fill="#a5caff"/><path d="M10 23l4-6 4 4 3-5 2 7" fill="#70a840"/><circle cx="20" cy="16" r="1.5" fill="#fff478"/><path d="M9 27h14" stroke="#aaa"/>',
    ],
    [
      'News',
      '<path d="M5 3h22v25H5z" fill="#fafafa" stroke="#222"/><text x="7" y="8" font-family="serif" font-size="4.5" font-weight="bold">DAILY NEWS</text><path d="M7 10h18M15 13h10M15 15h10M15 17h10M7 20h18M7 22h18M7 24h18" stroke="#333" stroke-width=".7"/><rect x="7" y="12" width="6" height="6" fill="#555"/><path d="M9 13v3h3" stroke="#fff" stroke-width=".5"/>',
    ],
    [
      'Directory',
      '<defs><linearGradient id="pages"><stop stop-color="#fafaff"/><stop offset=".6" stop-color="#b9c4fb"/><stop offset="1" stop-color="#6f80c4"/></linearGradient></defs><path d="M2 5q7-3 14 1 7-4 14-1v23q-7-3-14 0-7-3-14 0z" fill="#8598d4" stroke="#16162a" stroke-width="1.3"/><path d="M4 4q6-2 11 1v21q-5-3-11-1zM28 4q-6-2-11 1v21q5-3 11-1z" fill="url(#pages)" stroke="#3c456e" stroke-width=".8"/><path d="M16 6v22" stroke="#121f4b"/>',
    ],
  ];
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'mac instruction-' + ctx.display;
      const shell = u.el('div', 'mac-shell', document.body);
      const bar = u.el('header', 'mac-menubar', shell);
      const ap = u.el('span', 'mac-apple', bar);
      ap.innerHTML =
        '<svg viewBox="0 0 24 28"><defs><linearGradient id="appleBands" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#54b948"/><stop offset=".24" stop-color="#54b948"/><stop offset=".24" stop-color="#ffdf25"/><stop offset=".42" stop-color="#ffdf25"/><stop offset=".42" stop-color="#f5a12b"/><stop offset=".58" stop-color="#f5a12b"/><stop offset=".58" stop-color="#e43236"/><stop offset=".73" stop-color="#e43236"/><stop offset=".73" stop-color="#963f9c"/><stop offset=".87" stop-color="#963f9c"/><stop offset=".87" stop-color="#2383cd"/></linearGradient></defs><path d="M12 7c-3-2-9-1-9 6 0 6 4 12 7 12l3-1 3 1c3 0 6-5 7-8-5-1-6-6-1-8-3-4-7-3-10-2z" fill="url(#appleBands)" stroke="#34343b" stroke-width=".8"/><path d="M12 6c-1-4 3-6 5-5 0 3-2 5-5 5z" fill="#4ba548" stroke="#333" stroke-width=".6"/></svg>';
      for (const m of ['File', 'Edit', 'View', 'Window', 'Help']) u.el('span', 'mac-menu', bar, m);
      const clock = u.el('span', 'mac-clock', bar);
      clock.innerHTML =
        '<svg viewBox="0 0 28 28"><path d="M3 10h5l7-6v20l-7-6H3z" fill="#111"/><path d="M18 9q5 5 0 10M21 5q9 9 0 18" fill="none" stroke="#111" stroke-width="2"/></svg><span>10:24 AM</span>';
      const body = u.el('div', 'mac-body', shell);
      const note = u.el('section', 'mac-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', 'mac-task', note, ctx.instruction);
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endR = ctx.rng.fork('chrome/end');
      const collR = ctx.rng.fork('chrome/collide');
      let submit = null,
        placement = null,
        label = 'Submit',
        collide = null;
      if (!ctx.finish) {
        placement = endR.pick(['note', 'note', 'link', 'tools']);
        const words = labels.map(labelOf),
          alternatives = words.filter((x) => x.trim().toLowerCase() !== 'submit');
        label = endR.bool(0.5) ? 'Submit' : endR.pick(alternatives.length ? alternatives : words);
        const makeEnd = (parent, tag, cls, text) => {
          const b = u.el(tag, cls, parent, text);
          if (tag === 'a') b.href = '#';
          else b.type = 'button';
          b.dataset.role = 'submit';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'note') submit = makeEnd(note, 'button', 'end-control', label);
        if (placement === 'link') submit = makeEnd(note, 'a', 'end-link', label);
        if (collR.bool(0.3)) {
          const choices = words.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (choices.length) collide = collR.pick(choices);
        }
      }
      const win = u.el('section', 'mac-window', body);
      const tb = u.el('div', 'mac-title', win);
      const dots = u.el('span', 'mac-dots', tb);
      for (let i = 0; i < 3; i++) u.el('i', '', dots);
      u.el('span', 'mac-wtitle', tb, 'Web Search');
      u.el('span', 'mac-close', tb, '');
      const cont = u.el('div', 'mac-content', win);
      const stage = u.el('main', 'mac-stage', cont);
      const tools = u.el('aside', 'mac-tools', cont);
      TOOLS.forEach(([n, svg], i) => {
        const t = u.el('div', 'mac-tool' + (i === 0 ? ' on' : ''), tools);
        const ic = u.el('span', '', t);
        ic.innerHTML = '<svg viewBox="0 0 32 32" width="34" height="34">' + svg + '</svg>';
        u.el('em', '', t, n);
        t.addEventListener('click', () => env.log('decoy', { what: n }));
      });
      if (placement === 'tools')
        submit = (function () {
          const b = u.el('button', 'tool-end', tools, label);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', () => ctx.submit());
          return b;
        })();
      if (collide) {
        const b = u.el('button', 'tool-xtra', tools, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
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
