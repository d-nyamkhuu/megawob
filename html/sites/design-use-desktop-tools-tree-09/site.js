(function () {
  'use strict';
  const palette = { bg: '#f5f0e5', panel: '#f7f1e7', fg: '#203347', muted: '#6a6f72', line: '#236579' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', "'Roboto Condensed','Arial Narrow',Arial,sans-serif");
      document.documentElement.style.setProperty('--button-fg', '#fff');
      document.body.classList.add('riso', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const left = u.el('aside', 'rs-left', shell);
      const brand = u.el('div', 'rs-brand', left);
      brand.innerHTML =
        '<svg viewBox="0 0 60 56"><defs><filter id="rs-riso"><feTurbulence baseFrequency=".55" numOctaves="1" seed="9"/><feColorMatrix values="0 0 0 0 .96 0 0 0 0 .93 0 0 0 0 .87 6 0 0 0 -2.7"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs><path d="M4 12h8l5-7h15l5 7h17l3 6-3 33H3z" fill="#74303d"/><path d="M5 18h48l-2 29H5z" fill="#853b48"/><path d="M4 12h8l5-7h15l5 7h17l3 6-3 33H3z" filter="url(#rs-riso)"/></svg>';
      u.el('span', '', brand, 'File Finder');
      u.el('h3', 'rs-h', left, 'Tools');
      const tools = u.el('div', 'rs-tools', left);
      const IC = {
        'New Folder': '<path d="M6 3h8l4 4v14H6z"/><path d="M9 11h6M9 14h6M9 17h6"/>',
        'Upload File': '<path d="M12 18V6M7 11l5-5 5 5M5 20h14"/>',
        'Delete': '<path d="M5 7h14M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
      };
      for (const k of Object.keys(IC)) {
        const b = u.el('div', 'rs-tool', tools);
        b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#1d3a45" stroke-width="1.6">' + IC[k] + '</svg>';
        u.el('span', '', b, k);
      }
      const mid = u.el('div', 'rs-mid', shell);
      const note = u.el('section', 'task-note', mid);
      note.hidden = _c.display === 'hidden';
      if (!note.hidden) {
        const ic = u.el('div', 'rs-target', note);
        ic.innerHTML = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#6b1f2f" stroke-width="11"/><circle cx="50" cy="50" r="24" fill="#1d6f7d"/><circle cx="50" cy="50" r="9" fill="#efe6d2"/></svg>';
      }
      const text = u.el('div', 'rs-ntext', note);
      if (_c.display === 'header' || _c.display === 'toast') u.el('div', 'rs-nlabel', text, 'Task');
      Object.assign(_c, { shell, left, tools, mid, note, header: text });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
      if (_c.submit) _c.submit.classList.add('rs-end-tool');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const right = u.el('aside', 'rs-right', _c.shell);
      u.el('h3', 'rs-h rs-dh', right, 'Details');
      const det = u.el('div', 'rs-det', right);
      det.innerHTML = '<svg viewBox="0 0 24 30" fill="none" stroke="#555" stroke-width="1.2"><path d="M3 1h12l6 6v22H3z"/><path d="M15 1v6h6M7 13h10M7 17h10M7 21h10"/></svg>';
      u.el('b', '', det, 'No file selected');
      u.el('span', '', det, 'Select a file to see details here.');
      if (_c.display === 'panel' && _c.W > 1400 && _c.H >= 800) {
        right.insertBefore(_c.note, det);
        document.body.classList.add('rs-note-panel');
      }
      Object.assign(_c, { body: _c.mid, right });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) { title.classList.add('rs-nlabel'); title.textContent = 'Task'; }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.mid);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.right.appendChild(foot);
      foot.classList.add('design-footer');
      foot.querySelector('.ref-foot-text').hidden = true;
      // An empty footer must not displace the details pane.
      foot.hidden = !foot.querySelector('button, a');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.hidden = false;
        _c.foot.appendChild(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = ['File Finder Updates', 'News, tips and updates for your workspace.', 'Close'];
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
  };
  env.site({
    name: 'design-use-desktop-tools-tree-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#87273e'], LOW_ACCENTS: ['#87273e'], parts },
  });
})();
