(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#f7f8fa', fg: '#16243b', muted: '#66707d', line: '#bbc2c9' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Contact Manager');
      u.el('span', 'ds-wc', top, '—    ▢    ✕');
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const tools = u.el('div', 'ds-tools');
      [
        '<path d="M6 3l0 22 6-6 4 8 4-2-4-8 8 0z"/>',
        '<rect x="5" y="5" width="18" height="18" stroke-dasharray="3 3"/>',
        '<circle cx="14" cy="14" r="8"/><path d="M14 2v24M2 14h24"/>',
        '<path d="M5 23L23 5"/>',
        '<rect x="5" y="5" width="18" height="18"/>',
        '<path d="M6 5h16M14 5v20"/>',
        '<rect x="3" y="10" width="22" height="8"/><path d="M8 10v4M13 10v4M18 10v4"/>',
      ].forEach((p, i) => {
        const t = u.el('div', 'ds-tool' + (i === 0 ? ' on' : ''), tools);
        t.innerHTML = '<svg viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="#bfe6f5" stroke-width="2">' + p + '</svg>';
      });
      Object.assign(_c, { header: content, content, tools });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
      _c.body.appendChild(_c.tools);
      _c.util.el('div', 'ds-readout', _c.body, 'X: 412.6  Y: 93.4\nSCALE 1:1\nGRID  10');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.body);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      texts.banner =
        'You have unsaved layout changes. Continuing will discard your layout changes, but keep your data.';
      const tb = u.el('div', 'ds-dtitle', el);
      u.el('span', 'ds-warn', tb).innerHTML =
        '<svg viewBox="0 0 36 36" width="36" height="36"><path d="M18 3L34 32H2Z" fill="#ffdc29" stroke="#213f50" stroke-width="1.5"/><path d="M18 11v11" stroke="#213f50" stroke-width="3"/><circle cx="18" cy="27" r="1.7" fill="#213f50"/></svg>';
      u.el('span', '', tb, 'Unsaved layout changes');
      u.el('span', 'ds-dx', tb, '✕');
      const bd = u.el('div', 'ds-dbody', el);
      u.el('div', '', bd, texts[ctx.kind]);
      const row = u.el('div', 'ds-drow', bd);
      const dismiss = u.el(
        'button',
        'ds-dok',
        row,
        ctx.kind === 'cookie' ? 'Accept all' : ctx.kind === 'banner' ? 'Continue without saving' : 'Close',
      );
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      const cn = u.el('button', '', row, 'Cancel');
      cn.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-fill-form-card-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'site2.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#087ce9'], LOW_ACCENTS: ['#087ce9'],
      parts,
    },
  });
})();
