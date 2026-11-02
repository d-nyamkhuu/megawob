(function () {
  'use strict';
  const palette = { bg: '#f6efe2', panel: '#fbf6ec', fg: '#1d3a40', muted: '#6a6a64', line: '#6b1a3a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every note mode has a dedicated place in the original left pane.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'riso');
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      _c.root.style.setProperty('--font', "Georgia, 'Times New Roman', serif");
      const shell = u.el('div', 'shell', document.body);
      if (_c.placement) shell.classList.add('end-' + _c.placement);
      const note = u.el('section', 'task-note', shell);
      u.el('div', 'note-label', note, 'Panel resize task');
      u.el('div', 'note-rule', note);
      const workspace = u.el('section', 'workspace', shell);
      const toolbar = u.el('div', 'ws-head', workspace);
      u.el('span', 'ws-title', toolbar, 'Workspace');
      u.el('span', 'ws-hint', toolbar, 'Same top-left corner  •  Resize to match dashed outline');
      Object.assign(_c, { shell, note, workspace, toolbar, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      // The shell itself owns the original two-column layout.
      _c.body = _c.shell;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      const text = _c.note.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
      const u = _c.util;
      const info = u.el('div', 'info-card', _c.note);
      u.el('div', 'info-k', info, 'Current size (W × H)');
      const current = u.el('div', 'info-v', info);
      current.dataset.role = 'cur-size';
      u.el('p', 'info-help', info, 'The top-left corner stays fixed. Drag only the bottom-right corner handle.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.workspace);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        _c.note.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.shell.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const label = u.el('div', 'foot-label');
      u.el('div', 'note-label', label, 'Actions');
      u.el('div', 'note-rule', label);
      footer.prepend(label);
      const reset = u.el('button', 'clear', footer, 'Reset');
      footer.insertBefore(reset, footer.querySelector('.ref-tools'));
      reset.type = 'button';
      reset.onclick = () => { env.widgetDef.clear?.(); };
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-resize-element-ghost-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'riso.css'],
    design: {
      THEMES: { 'design-resize-element-ghost-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6b1a3a'],
      LOW_ACCENTS: ['#6b1a3a'],
      parts,
    },
  });
})();
