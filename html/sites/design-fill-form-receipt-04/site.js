(function () {
  'use strict';
  const palette = { bg: '#eaf1fa', panel: '#ffffff', fg: '#081631', muted: '#536d91', line: '#c5d2e3' };
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((b) => b.classList.add('ds-ribbon-end'));
    parent.querySelectorAll('.ref-icon').forEach((b) => b.classList.add('ds-icon-end'));
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('ds-status-end'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('ds-end-xtra'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This application has dedicated note locations at every viewport.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'toast' && _c.ctx.instruction.length > 220 && _c.W < 1180) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      document.body.dataset.flowtrack = 'true';
      document.body.dataset.display = _c.display;
      document.body.dataset.end = ({ header: 'toolbar', link: 'status' })[_c.placement] || _c.placement || 'none';
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'FlowTrack');
      const nav = u.el('nav', 'ds-menu', top);
      'Expenses|Reports|Cards|Approvals|Settings'.split('|').forEach((t, i) => {
        const n = u.el('button', i === 0 ? 'active' : '', nav, t);
        n.type = 'button';
        n.addEventListener('click', () => env.log('navigation', { label: t }));
      });
      const ribbon = u.el('div', 'ds-ribbon', top);
      const topTools = u.el('div', 'ds-top-tools', top);
      const search = u.el('button', 'ds-search', topTools);
      search.type = 'button';
      search.title = 'Search';
      search.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
      u.el('span', 'ds-avatar', topTools, 'JD');
      const status = u.el('div', 'ds-statusbar', document.body);
      Object.assign(_c, { header: top, top, navElement: nav, ribbon, status });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note', 'ds-instruction');
        _c.top.insertBefore(note, _c.navElement);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.ribbon;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'ds-body', document.body);
      const content = _c.util.el('div', 'ds-content', body);
      const main = _c.util.el('div', 'ds-main', content);
      main.dataset.mode = _c.display === 'panel' ? 'left' : _c.display === 'header' ? 'top' : _c.display;
      Object.assign(_c, { body, content, main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
        _c.main.style.setProperty('--panel-note-h', panel.offsetHeight + 48 + 'px');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      const dock = _c.util.el('footer', 'ds-footer', _c.content);
      if (foot) {
        (_c.placement === 'link' ? _c.status : dock).appendChild(foot);
        styleControls(foot);
      }
      _c.footerDock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.footerDock.appendChild(dock);
        styleControls(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      el.style.setProperty('--app-header-h', document.querySelector('.ds-top').offsetHeight + 'px');
      const copy = {
        cookie: [
          'We use cookies',
          'We use cookies to improve your experience, analyze traffic, and personalize content. You can configure your preferences.',
        ],
        toast: ['Changes synced', 'Your recent changes have been saved.'],
        chat: ['How can we help?', 'Ask a question or search for help.'],
        promo: ['Stay in the loop', 'Get product updates, tips, and resources delivered to your inbox.'],
        banner: [
          'New! Export expenses to your accounting software',
          'Sync your expenses with popular tools like QuickBooks and Xero in just a few clicks.',
        ],
      }[ctx.kind] || ['FlowTrack', 'Workspace notification'];
      const badge = u.el(
        'div',
        'ds-overlay-badge',
        el,
        ctx.kind === 'cookie' ? '◉' : ctx.kind === 'banner' ? '⚑' : ctx.kind === 'chat' ? '▤' : '',
      );
      const message = u.el('div', 'ds-overlay-message', el);
      u.el('h2', '', message, copy[0]);
      u.el('p', '', message, copy[1]);
      if (ctx.kind === 'chat') {
        const f = u.el('div', 'ds-chat-input', message, 'Type a message…');
        u.el('span', '', f, '➤');
      }
      if (ctx.kind === 'promo') {
        u.el('div', 'ds-newsletter-art', el, '✉');
        u.el('div', 'ds-newsletter-input', message, 'Enter your email address');
        const subscribe = u.el('button', 'ds-subscribe', message, 'Subscribe');
        subscribe.type = 'button';
        subscribe.addEventListener('click', () => ctx.dismiss('subscribe'));
        const decline = u.el('button', 'ds-decline', message, 'No thanks');
        decline.type = 'button';
        decline.addEventListener('click', () => ctx.dismiss('decline'));
      }
      if (ctx.kind === 'cookie' || ctx.kind === 'banner') {
        const secondary = u.el('button', 'ds-overlay-secondary', el, ctx.kind === 'cookie' ? 'Manage' : 'Learn more');
        secondary.type = 'button';
        secondary.addEventListener('click', () => env.log('decoy', { label: secondary.textContent }));
      }
      const dismiss = u.el(
        'button',
        'ds-overlay-dismiss',
        el,
        ctx.kind === 'cookie' ? 'Accept' : ctx.kind === 'toast' ? 'Close' : '×',
      );
      dismiss.type = 'button';
      dismiss.title = ctx.kind === 'cookie' ? 'Accept cookies' : 'Close';
      dismiss.setAttribute('aria-label', dismiss.title);
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-fill-form-receipt-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-receipt-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#246bfd'],
      LOW_ACCENTS: ['#246bfd'],
      parts,
    },
  });
})();
