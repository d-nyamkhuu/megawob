(function () {
  'use strict';
  const palette = { bg: '#f3f2ee', panel: '#fffefd', fg: '#131620', muted: '#5f6a78', line: '#d9dadb' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'twin instruction-' + _c.display;
      document.documentElement.style.setProperty('--font', "'Segoe UI','Noto Sans','Helvetica Neue',Arial,sans-serif");
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const top = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', top, 'T R A V E L   N E X U S');
      u.el('nav', 'design-nav', top, 'Tickets for a wider tomorrow');
      const hr = u.el('div', 'design-hright', top);
      u.el('span', '', hr, 'Help'); u.el('span', 'hr-en', hr, 'EN ⌄'); u.el('span', '', hr, 'Tue, Apr 22, 2026');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden' || _c.display === 'panel';
      if (_c.display === 'header') {
        const ey = u.el('div', 'tn-eyebrow', note); u.el('i', '', ey); u.el('span', '', ey, 'Choose your ticket');
      }
      const detail = u.el('aside', 'side-detail', body);
      const photo = u.el('div', 'sd-photo', detail);
      photo.setAttribute('role', 'img'); photo.setAttribute('aria-label', 'Mountain landscape. Same places, a brighter way there.');
      const tag = u.el('div', 'sd-tag', photo);
      for (const t of ['SAME PLACES', 'A BRIGHTER', 'WAY THERE']) u.el('span', '', tag, t);
      const inner = u.el('div', 'sd-inner', detail);
      const ey = u.el('div', 'tn-eyebrow sm', inner); u.el('i', '', ey); u.el('span', '', ey, 'Your selection');
      Object.assign(_c, { shell, shopBody: body, header: note, inner });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('tn-main');
        note.classList.toggle('long-goal', _c.ctx.instruction.length > 52);
        _c.util.el('p', 'tn-sub', _c.header, 'Select a ticket and click Buy.');
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.inner;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('selection-tools');
    },
    'frame.body': () => (_c) => { _c.body = _c.shopBody; },
    'frame.panel': (base) => (_c) => {
      const b = _c.body;
      _c.body = _c.inner;
      base(_c);
      _c.body = b;
      const panel = _c.inner.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('episode-panel');
        _c.inner.insertBefore(panel, _c.headerTools);
      }
      const u = _c.util;
      const empty = u.el('p', 'detail-empty', _c.inner, 'No ticket selected yet.'); empty.dataset.role = 'selection-status';
      const fields = u.el('dl', 'sd-fields', _c.inner); fields.dataset.role = 'selection-details';
      for (const f of ['Operator', 'Route', 'Departure', 'Arrival', 'Duration', 'Price']) {
        u.el('dt', '', fields, f); u.el('dd', '', fields, '—');
      }
      const tip = u.el('div', 'sd-tip', _c.inner); u.el('b', '', tip, 'i');
      u.el('span', '', tip, 'Select a ticket and click Buy.');
      _c.inner.appendChild(_c.headerTools);
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'stage', _c.body); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-text').classList.add('tn-main');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const fl = u.el('span', 'footer-label', foot);
      u.el('b', '', fl, 'TRAVEL NEXUS'); u.el('em', '', fl, 'Travel simply. Further.');
      foot.prepend(fl);
      if (_c.display !== 'toast' && _c.display !== 'hidden') {
        const fr = u.el('span', 'footer-right', foot);
        u.el('span', '', fr, 'Need assistance?'); u.el('u', '', fr, 'Contact support');
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shopBody.querySelector('.sd-photo').appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util, named = null;
      const texts = { cookie: ['We use cookies','We use optional cookies to improve your experience.','Reject optional'],
        toast: ['Notification','Your workspace is up to date.','Dismiss'], chat: ['Help','Need help with this workspace?','Close'],
        promo: ['News and updates','Discover the latest workspace updates.','Close'],
        banner: ['Announcement','You can still work now. Save your changes regularly.','Collapse announcement'] };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo','toast','banner','cookie'].includes(ctx.kind)) [title, copy, label] = named;
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', title); u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') { const accept = u.el('button', '', actions, 'Accept all'); accept.addEventListener('click', () => ctx.dismiss()); }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el); c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c); ch.type = 'checkbox'; c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label); dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-shop-ticket-02', template: 'site/base', langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#ed640e'], LOW_ACCENTS: ['#ed640e'], parts },
  });
})();
