// HarborNet's visual frame on the shared site/base behavior.
(function () {
  'use strict';
  const palette = {
    bg: '#ffffff', panel: '#ffffff', fg: '#111111', accent: '#0b2fd0',
    font: 'Arial,Helvetica,sans-serif', line: '#7f9fd4', muted: '#666666', header: '#c7d8f7',
  };
  const ICONS = {
    mail: '<rect x="3" y="5" width="18" height="14" fill="#fff"/><path d="M3 6l9 7 9-7"/>',
    search: '<circle cx="10" cy="10" r="6.5" fill="#fff"/><path d="M15 15l6 6" stroke-width="3"/>',
    people:
      '<g fill="#1a3f94" stroke="none"><circle cx="12" cy="7" r="3"/><circle cx="6" cy="9" r="2.4"/><circle cx="18" cy="9" r="2.4"/><path d="M7 20v-7a5 5 0 0 1 10 0v7z"/><path d="M1.5 19v-5a3.5 3.5 0 0 1 5-3v8zM22.5 19v-5a3.5 3.5 0 0 0-5-3v8z"/></g>',
    clip: '<rect x="5" y="4" width="14" height="17" fill="#fff"/><path d="M9 3h6v3H9zM8 10h8M8 13h8M8 16h8" stroke-width="1.5"/>',
  };

  // Preserve the reference's blue handles in every instruction presentation.
  function highlightHandle(node, util) {
    const text = node.textContent;
    node.textContent = '';
    for (const part of text.split(/(@\w+)/)) {
      if (/^@\w/.test(part)) {
        const handle = util.el('span', 'hn-h', node, part);
        handle.style.setProperty('--handle-length', part.length);
      } else node.append(part);
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The design reserves a full left column for all instruction modes, even at 1024px.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'instruction-' + _c.display + ' display-' + _c.display;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const shell = u.el('div', 'site-shell', document.body);
      const left = u.el('section', 'hn-left', shell);
      const brand = u.el('div', 'hn-brand', left);
      const logo = u.el('span', 'hn-logo', brand);
      logo.style.cssText =
        "background:url('sites/design-use-social-feed-all-10/assets/portal-details.webp') -.875rem -1.5rem / 104.5rem 58.8125rem no-repeat";
      const bt = u.el('span', 'hn-brandtext', brand);
      u.el('b', '', bt, 'HarborNet');
      u.el('small', '', bt, 'PEOPLE  PLACES  INTERESTS  TOGETHER');
      const note = u.el('section', 'task-note', left);
      note.dataset.role = 'instruction';
      note.hidden = _c.display !== 'header';
      const doc = u.el('section', 'hn-doc', shell);
      const top = u.el('div', 'hn-top', doc);
      u.el('h1', '', top, 'HarborNet Social');
      const sr = u.el('div', 'hn-search', top);
      u.el('label', '', sr, 'Search People or Topics:');
      const inp = u.el('input', '', sr);
      inp.type = 'text';
      const sb = u.el('button', '', sr, 'Search');
      sb.type = 'button';
      sb.addEventListener('click', () => env.log('decoy', { what: 'search' }));
      const hl = u.el('div', 'hn-help', top);
      for (const [i, t] of ['Help', 'Sign Out'].entries()) {
        if (i) u.el('i', '', hl, '|');
        const a = u.el('a', '', hl, t);
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: t });
        });
      }
      Object.assign(_c, { shell, left, note, doc, top, header: top });
    },
    'frame.nav': () => (_c) => {
      const { doc, shell, util: u } = _c;
      const nav = u.el('nav', 'hn-nav', doc);
      const links = u.el('div', '', nav);
      ['Home', 'People', 'Messages', 'Explore', 'Popular', 'Directory'].forEach((t, i) => {
        if (i) u.el('i', '', links, '|');
        const a = u.el('a', '', links, t);
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: t });
        });
      });
      u.el('span', 'hn-date', nav, 'Mon, Apr 27, 1998');
      const tools = u.el('aside', 'hn-tools', shell);
      u.el('div', 'hn-toolhead', tools, 'Tools');
      for (const [label, ic] of [
        ['New Post', 'mail'], ['Find People', 'search'], ['My Profile', 'people'], ['Saved Posts', 'clip'],
      ]) {
        const b = u.el('button', 'hn-tool', tools);
        b.type = 'button';
        const s = u.el('span', 'hn-ticon', b);
        s.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#1a3f94" stroke-width="1.8">' + ICONS[ic] + '</svg>';
        u.el('span', '', b, label);
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      Object.assign(_c, { navBar: nav });
    },
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.note });
      const text = _c.note.querySelector('.ref-instruction');
      if (text) highlightHandle(text, _c.util);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'hn-body ref-body', _c.doc);
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.left });
      const panel = _c.left.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.dataset.role = 'instruction';
        highlightHandle(panel.querySelector('.ref-panel-text'), _c.util);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const toast = document.querySelector('.ref-note');
      if (toast) {
        toast.classList.add('task-note');
        toast.dataset.role = 'instruction';
        toast.querySelector('.ref-note-x').classList.add('note-close');
        highlightHandle(toast.querySelector('.ref-note-text'), _c.util);
        _c.left.append(toast);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      let foot = document.querySelector('.ref-foot');
      if (!foot) foot = _c.util.el('footer', '', _c.doc);
      foot.classList.add('hn-foot');
      _c.doc.append(foot);
      const filler = foot.querySelector('.ref-foot-text');
      if (filler) filler.remove();
      const count = _c.util.el('span', 'hn-count', foot, 'Showing latest posts');
      foot.prepend(count);
      _c.foot = foot;
    },
    'frame.end': (base) => (_c) => {
      const { foot, headerTools, navBar, placement, submit, top } = _c;
      // Dock the template's controls in the design's existing chrome regions.
      const headerDecoys = [...headerTools.querySelectorAll('.ref-xtra')];
      navBar.append(...headerDecoys);
      headerTools.remove();
      const dock = document.querySelector('.ref-float-dock');
      if (submit) {
        submit.className = 'end-control' + (placement === 'header' || placement === 'icon' ? ' end-header' : '')
          + (placement === 'link' ? ' end-link' : '');
        (placement === 'header' || placement === 'icon' ? top : foot).append(submit);
      }
      if (dock) dock.remove();
      document.querySelectorAll('.ref-xtra').forEach((button) => button.classList.add('end-xtra'));
      return base(_c);
    },
    overlay: () => function (ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      const [title, copy, label] = texts[ctx.kind];
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    }

  };
  env.site({
    name: 'design-use-social-feed-all-10',
    template: 'site/base',
    styles: ['site.css', 'templates/site/css/base-hooks.css'],
    design: {
      THEMES: { harbor: palette }, LOW_THEME: palette,
      ACCENTS: [palette.accent], LOW_ACCENTS: [palette.accent], LANGS: ['en'],
      parts,
    },
  });
})();
