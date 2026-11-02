(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-11',
    'brand': 'TravelDesk',
    'mode': 'top',
    'tokens': {
      'bg': '#f0f1f3',
      'panel': '#ffffff',
      'fg': '#161a27',
      'accent': '#247ee2',
      'font': 'Segoe UI,Calibri,Carlito,Arial,sans-serif',
      'line': '#d1cec5',
      'muted': '#626675',
    },
    'nav': 'Trips    Passengers    Payment    Preferences    New Search    Filter    Sort    List    Map',
    'obstruction': [
      'Get travel tips in your inbox',
      'Join our monthly newsletter for destination ideas, travel alerts and more.',
      'Close',
    ],
    'footer': '',
  };
  const palette = { bg: D.tokens.bg, panel: D.tokens.panel, fg: D.tokens.fg, muted: D.tokens.muted, line: D.tokens.line };
  function decorateNote(_c, note, text) {
    if (!note) return;
    const u = _c.util;
    note.classList.add("task-note");
    note.classList.toggle("long-instruction", text.textContent.length > 45);
    note.classList.toggle("very-long-instruction", text.textContent.length > 50);
    const copy = text.textContent;
    text.textContent = "";
    u.el("p", "", text, copy);
    if (_c.display === "toast") return;
    u.el("div", "tdk-subtitle", note, "Select a ticket below when you’re ready.");
        const flds = u.el('div', 'tdk-fields', note);
        for (const [l, v] of [
          ['From', 'Riverton'],
          ['To', 'Lakeside'],
          ['Date', 'Tue, Apr 14, 2015'],
        ]) {
          const f = u.el('div', 'tdk-field', flds);
          u.el('label', '', f, l);
          const val = u.el('div', '', f, v);
          val.insertAdjacentHTML(
            'beforeend',
            l === 'Date'
              ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="16" height="16" rx="1"/><path d="M4 10h16M8 2v6M16 2v6M8 14h1m3 0h1m3 0h1M8 18h1m3 0h1m3 0h1"/></svg>'
              : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
          );
        }
  }
  const parts = {
    "frame.layout": (base) => (_c) => {
      base(_c);
      if (_c.ctx.display === "panel" && _c.W < 1280) _c.display = "header";
      document.body.classList.add(D.mode, "instruction-" + _c.display);
      document.documentElement.style.setProperty("--font", D.tokens.font);
    },
    "frame.placement": (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    "frame.header": () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const tb = u.el('div', 'tdk-title', header);
      const lights = u.el('div', 'tdk-lights', tb);
      for (const c of ['#fe5f57', '#febc2e', '#28c840']) {
        const l = u.el('i', '', lights);
        l.style.background = c;
      }
      u.el('div', 'design-brand', tb, D.brand);
      const ss = u.el('div', 'tdk-search', tb);
      ss.innerHTML =
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#555" stroke-width="2"><circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/></svg><span>Search trips...</span>';
      const rib = u.el('nav', 'design-nav', header);
      const IC = {
        cal: '<path d="M8 13h1m3 0h1m3 0h1M8 16h1m3 0h1m3 0h1"/><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7z"/>',
        card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
        gear: '<path fill-rule="evenodd" stroke-width=".4" d="m10 2 4 0 .5 3 2 1.2 2.8-1.2 2 3.5-2.4 1.8v2.5l2.4 1.7-2 3.5-2.8-1.2-2 1.2-.5 3h-4l-.5-3-2-1.2-2.8 1.2-2-3.5 2.4-1.7v-2.5L2.7 8.5l2-3.5 2.8 1.2L9.5 5zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>',
        search: '<circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/>',
        filter: '<path d="M3 4h18l-7 9v7l-4-2v-5z"/>',
        sort: '<path d="M8 20V5M4 9l4-4 4 4M16 4v15M12 15l4 4 4-4"/>',
        list: '<path d="M9 6h12M9 12h12M9 18h12M4 6h1M4 12h1M4 18h1"/>',
        map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
      };
      const grp = [
        [
          'Booking',
          [
            ['Trips', 'cal', 1],
            ['Passengers', 'user'],
            ['Payment', 'card'],
            ['Preferences', 'gear'],
          ],
        ],
        [
          'Search & Refine',
          [
            ['New Search', 'search'],
            ['Filter', 'filter'],
            ['Sort', 'sort'],
          ],
        ],
        [
          'View',
          [
            ['List', 'list', 1],
            ['Map', 'map'],
          ],
        ],
      ];
      for (const [gn, items] of grp) {
        const g = u.el('div', 'tdk-group', rib);
        const its = u.el('div', 'tdk-items', g);
        for (const [n, ic, on] of items) {
          const b = u.el('div', 'tdk-btn' + (on ? ' on' : '') + (ic === 'sort' ? ' tdk-sort-control' : ''), its);
          b.innerHTML =
            '<svg class="tdk-icon" viewBox="0 0 24 24" width="28" height="28" fill="' +
            (ic === 'user' || ic === 'filter' || ic === 'gear' ? '#555' : 'none') +
            '" stroke="' +
            (on ? '#2a6fd0' : '#555') +
            '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            IC[ic] +
            '</svg><span>' +
            n +
            '</span>';
        }
        u.el('div', 'tdk-gn', g, gn);
      }
      const tools = u.el("div", "tdk-episode-tools", rib);
      const body = u.el("div", "design-body");
      Object.assign(_c, { shell, chrome: header, toolbar: tools, body, header: body });
    },
    "frame.nav": () => () => {},
    "frame.instruction": (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector(".ref-instruction");
      if (note) {
        const text = _c.util.el("div", "tdk-note-text");
        text.textContent = note.textContent;
        note.textContent = "";
        note.appendChild(text);
        decorateNote(_c, note, text);
      }
    },
    "frame.tools": (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    "frame.body": () => (_c) => { _c.shell.appendChild(_c.body); },
    "frame.panel": (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector(".ref-panel");
      if (note) decorateNote(_c, note, note.querySelector(".ref-panel-text"));
    },
    "frame.stage": () => (_c) => { _c.stage = _c.util.el("main", "stage", _c.body); },
    "frame.toast": (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector(".ref-note");
      if (note) {
        decorateNote(_c, note, note.querySelector(".ref-note-text"));
        _c.body.insertBefore(note, _c.stage);
      }
    },
    "frame.footer": (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector(".ref-foot");
      footer.classList.add("design-footer");
      _c.shell.appendChild(footer);
      const label = footer.querySelector(".ref-foot-text");
      label.classList.add("footer-label");
      label.textContent = "Task timer: Ready";
      const fr = u.el("div", "tdk-fr");
      footer.insertBefore(fr, footer.querySelector(".ref-tools"));
      const help = u.el("button", "tdk-help", fr, "Help");
      help.type = "button";
      help.addEventListener("click", () => env.log("decoy", { label: "Help" }));
      const bt = u.el("button", "tdk-buyticket", fr, "Buy ticket");
      bt.type = "button";
      _c.foot = footer;
    },
    "frame.floating": (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector(".ref-float-dock");
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {

      const u = ctx.util;
      const status = document.querySelector('.footer-label');
      if (status) status.textContent = 'Task timer: Paused (closes when overlay is dismissed)';
      const close = () => {
        if (status) status.textContent = 'Task timer: Ready';
        ctx.dismiss();
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
        accept.addEventListener('click', () => close());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      let dismiss;
      if (ctx.kind === 'promo') {
        el.classList.add('tdk-promo');
        const em = u.el('div', 'tdk-email', el);
        em.innerHTML =
          '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#666" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><span>Your email address</span>';
        el.insertBefore(em, actions);
        const su = u.el('button', 'tdk-signup', el, 'Sign me up');
        su.type = 'button';
        su.addEventListener('click', () => close());
        el.insertBefore(su, actions);
        dismiss = u.el('button', 'tdk-x', el, '×');
        dismiss.setAttribute('aria-label', label);
        dismiss.title = label;
        const nt = u.el('button', 'tdk-nothanks', actions, 'No thanks');
        nt.type = 'button';
        nt.addEventListener('click', () => close());
      } else {
        dismiss = u.el('button', 'primary', actions, label);
      }
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => close());
      return { el, dismiss };
    },
  };
  env.site({
    name: D.site,
    template: "site/base",
    langs: ["en"],
    initialOverlay: { kind: "promo" },
    styles: ["templates/site/css/base-hooks.css", "site.css"],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: [D.tokens.accent],
      LOW_ACCENTS: [D.tokens.accent],
      parts,
    },
  });
})();
