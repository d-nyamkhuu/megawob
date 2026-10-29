(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-some-12',
    'brand': 'Chatter',
    'mode': 'side-right',
    'tokens': {
      'bg': '#e9e5fa',
      'panel': '#ffffff',
      'fg': '#151842',
      'accent': '#7164ee',
      'font': 'Arial,sans-serif',
      'line': '#bebebe',
      'muted': '#5e6779',
    },
    'nav': 'Home    Explore    Notifications    Messages',
    'obstruction': [
      'Unsaved layout changes',
      'You have unsaved layout changes. Continuing will keep your task progress, but your custom layout won’t be saved.',
      'Continue without saving',
    ],
    'footer': 'Ready',
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
      u.el('div', 'design-brand', header, D.brand);
      const wc = u.el('div', 'native-controls', header);
      wc.innerHTML =
        '<svg viewBox="0 0 140 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 12h13"/><rect x="58" y="6" width="12" height="12" rx="1"/><path d="M108 6l12 12m0-12l-12 12"/></svg>';
      const nav = u.el('nav', 'design-nav', header);
      ['Home', 'Explore', 'Notifications', 'Messages'].forEach((t) => u.el('span', '', nav, t));
      const searchIcon = u.el('i', 'native-search-icon', nav);
      searchIcon.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="10" r="7"/><path d="M15.3 15.3l5 5"/></svg>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      const hm = u.el('i', 'helper-mark', note);
      hm.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7l4 4 8-7M6 14l4 4 8-7"/></svg>';
      const nc = u.el('div', 'native-controls', note);
      nc.innerHTML = wc.innerHTML;
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const railEl = u.el('nav', 'fake-rail', body);
      const RI = {
        Home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" fill="currentColor"/>',
        Explore: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
        Notifications: '<path d="M6 17v-6a6 6 0 0 1 12 0v6l1.5 1.5h-15z"/><path d="M10 21h4"/>',
        Messages: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
        Bookmarks: '<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',
        Lists:
          '<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8.5h1M11.5 8.5H16M8 12h1M11.5 12H16M8 15.5h1M11.5 15.5H16"/>',
        Profile: '<circle cx="12" cy="6.8" r="4"/><path d="M4 19c0-4 3-6.5 8-6.5s8 2.5 8 6.5v2H4z"/>',
        Settings:
          '<path d="M9.5 3.2l.7-1.2h3.6l.7 2.6 2 .9 2.5-.7 1.8 3.1-1.9 1.9.2 2.2 1.9 1.9-1.8 3.1-2.5-.7-2 .9-.7 2.8h-3.6l-.7-2.8-2-.9-2.5.7-1.8-3.1 1.9-1.9.2-2.2-1.9-1.9L5.5 5l2.5.7 2-.9z" transform="translate(0 1)"/><circle cx="12" cy="12" r="3.2"/>',
      };
      Object.keys(RI).forEach((k, i) => {
        const d = u.el('div', 'rail-item' + (i === 0 ? ' on' : ''), railEl);
        d.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
          RI[k] +
          '</svg><span>' +
          k +
          '</span>';
      });
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      ['tb-win', 'tb-files', 'tb-edge', 'tb-chat', 'tb-set'].forEach((c) => u.el('i', 'tb ' + c, footer));
      u.el('i', 'taskbar-searchmark', footer);
      const tray = u.el('div', 'tray-icons', footer);
      tray.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l9-2-1 8-3-2-5 7-2-2 5-7z"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 8a16 16 0 0 1 20 0M5 11a11 11 0 0 1 14 0M8 14a6 6 0 0 1 8 0"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3 9h4l5-4v14l-5-4H3zM16 8q4 4 0 8M19 5q6 7 0 14"/></svg><svg viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="7" width="20" height="12" rx="2"/><path d="M7 4h10M24 10v6"/><rect x="5" y="10" width="14" height="6" fill="currentColor"/></svg>'; // Keep the reference footer and Submit label together in half of episodes.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'helper-footer' : er.pick(['toolbar', 'taskbar']);
      const alternatives = endWords.filter((x) => x.trim().toLowerCase() !== 'submit');
      const endLabel = referenceEnd ? 'Submit' : er.pick(alternatives);
      let submit = null;
      if (!ctx.finish) {
        // A sibling of the instruction window stays clickable even in toast mode.
        submit = u.el('button', 'end-control end-' + placement, shell, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.dataset.endLabel = endLabel;
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(endWords)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'chrome-xtra', header, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const kind = ctx.kind;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      if (kind === 'toast') {
        const wi = u.el('i', 'warning-icon', el);
        wi.innerHTML =
          '<svg viewBox="0 0 40 38" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="warning-gold" x2="0" y2="1"><stop stop-color="#d5911d"/><stop offset="1" stop-color="#b56a00"/></linearGradient></defs><path d="M16.6 3a3.9 3.9 0 0 1 6.8 0l15 27.8a4 4 0 0 1-3.5 5.9H5.1a4 4 0 0 1-3.5-5.9z" fill="url(#warning-gold)" stroke="#b57009" stroke-width=".6"/><path d="M20 12v11" stroke="white" stroke-width="3.7" stroke-linecap="round"/><circle cx="20" cy="29.2" r="2.1" fill="white"/></svg>';
      }
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (kind === 'cookie') {
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
      if (kind === 'toast') {
        const cn = u.el('button', '', actions, 'Cancel');
        cn.type = 'button';
        cn.addEventListener('click', () => ctx.dismiss());
        const x = u.el('button', 'ov-x', el, '');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.innerHTML =
          '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 3l14 14M17 3L3 17"/></svg>';
        x.addEventListener('click', () => ctx.dismiss());
      }
      return { el, dismiss };
    },
  });
})();
