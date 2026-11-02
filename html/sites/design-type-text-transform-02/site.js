(function () {
  'use strict';
  const palette = { bg: '#704d36', panel: '#fbf3e4', fg: '#342315', muted: '#66707d', line: '#bbc2c9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const { ctx } = _c;
      const roomy = ((ctx.size && ctx.size.width) || window.innerWidth) >= 1260 &&
        ((ctx.size && ctx.size.height) || window.innerHeight) >= 700;
      _c.display = (ctx.display === 'panel' || ctx.display === 'toast') && !roomy ? 'header' : (ctx.display || 'header');
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Text Transformation Task');
      u.el('span', '', top, '−    □    ×');
      const nav = u.el('nav', 'ds-menu', document.body);
      'Home|Notes|Format|Insert|View'.split('|').forEach((t) => u.el('span', '', nav, t));
      const tools = u.el('div', 'ds-organizer-tools', document.body);
      function group(title) {
        const g = u.el('div', 'ds-organizer-group', tools);
        u.el('small', 'ds-organizer-caption', g, title);
        return g;
      }
      function button(parent, label, path) {
        const b = u.el('button', 'ds-organizer-button', parent);
        b.type = 'button';
        if (path) b.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#535a5c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + path + '"/></svg>';
        u.el('span', '', b, label);
        return b;
      }
      const clip = group('Clipboard');
      button(clip, 'Paste', 'M8 5H5v17h14V5h-3M8 2h8v6H8zM8 12h8M8 16h8');
      const c = u.el('div', 'ds-organizer-col', clip);
      button(c, 'Cut', 'M5 4l14 16M19 4 5 20M5 4a3 3 0 1 0 0 .1M19 4a3 3 0 1 0 0 .1');
      button(c, 'Copy', 'M7 7h14v15H7zM17 7V2H2v15h5');
      const font = group('Font');
      const line = u.el('div', 'ds-organizer-fontrow', font);
      u.el('div', 'ds-organizer-font', line, 'Georgia');
      u.el('div', 'ds-organizer-font', line, '16');
      const styles = u.el('div', 'ds-organizer-fontrow', font);
      ['B', 'I', 'U', 'A'].forEach((t) => button(styles, t));
      const align = group('Alignment');
      ['M3 4h18M3 9h12M3 14h18M3 19h12', 'M3 4h18M6 9h12M3 14h18M6 19h12',
        'M3 4h18M9 9h12M3 14h18M9 19h12', 'M3 4h18M3 9h18M3 14h18M3 19h18'].forEach((p) => button(align, '', p));
      const lists = group('Lists');
      button(lists, '', 'M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1');
      button(lists, '', 'M8 5h13M8 12h13M8 19h13M3 3v4M2 7h2M2 11h2l-2 4h2M2 18h2l-1 2 1 2H2');
      const insert = group('Insert');
      button(insert, 'Image', 'M2 3h20v18H2zM2 17l6-7 5 5 4-4 5 6M16 7h1');
      button(insert, 'Link', 'M9 15 6 18a4 4 0 0 1-5-5l5-5a4 4 0 0 1 5 0M15 9l3-3a4 4 0 0 1 5 5l-5 5a4 4 0 0 1-5 0M8 16l8-8');
      button(insert, 'Date & Time', 'M3 5h18v17H3zM3 10h18M8 2v6M16 2v6M7 15h2M12 15h2');
      button(insert, 'Add Note', 'M3 2h18v16l-5 4H3zM16 18h5');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const mode = { header: 'top', panel: 'left', toast: 'toast', hidden: 'hidden' }[_c.display];
      content.classList.add('ds-mode-' + mode);
      Object.assign(_c, { body, content, header: content, toolbar: insert });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.main.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
      _c.foot = foot;
      const binding = _c.util.el('div', 'ds-organizer-binding', document.body);
      for (let i = 0; i < 6; i++) _c.util.el('i', '', binding);
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
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-type-text-transform-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-transform-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#326aa2'],
      LOW_ACCENTS: ['#326aa2'],
      parts,
    },
  });
})();
