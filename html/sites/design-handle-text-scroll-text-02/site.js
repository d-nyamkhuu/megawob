(function () {
  'use strict';
  const palette = { bg: '#e8e4d9', panel: '#f8f6f0', fg: '#1c1b19', muted: '#6d685f', line: '#c2bbae' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original workspace supports its side note and status note at these sizes.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W < 1180) _c.display = 'header';
      if (_c.display === 'toast' && _c.H < 680) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'gnome', 'centerstage');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      title.innerHTML =
        '<span class="app-icon">✿</span><strong>Reading Task - Word Finder</strong><span class="window-controls"><i>−</i><i>□</i><i>×</i></span>';
      const menu = u.el('nav', 'menubar', shell);
      menu.innerHTML = '<span>File</span><span>Edit</span><span>View</span><span>Help</span><b>⌄</b>';
      const work = u.el('div', 'work', shell);
      const tools = u.el('aside', 'toolbox', work);
      tools.innerHTML =
        '<h2>Tools</h2><div class="tool"><i><svg viewBox="0 0 48 48"><path d="M8 5h23l9 9v28H8z" fill="#fffaf0"/><path d="M31 5v10h9" fill="#e6ddca"/><path d="m12 34 3-9L32 8l8 8-17 17-9 3z" fill="#e9ad43"/><path d="m28 12 8 8M12 34l9-3"/></svg></i><span>New Task</span></div><div class="tool"><i><svg viewBox="0 0 48 48"><path d="M4 14h15l5 5h20v22H4z" fill="#e8a543"/><path d="M4 14h15l5 5H4z" fill="#ffd17a"/><path d="M4 20h40v21H4z" fill="#e5a13d"/></svg></i><span>Open Text</span></div><div class="tool"><i><svg viewBox="0 0 48 48"><path d="M9 5h30v38H9z" fill="#f8f6ef"/><path d="M14 5h20v11H14z" fill="#6d8ba8"/><path d="M16 24h16M16 29h16M16 34h16"/></svg></i><span>Save</span></div><div class="tool"><i><svg viewBox="0 0 48 48"><path d="M13 5h22v12H13zM10 17h28a5 5 0 0 1 5 5v13h-8v8H13v-8H5V22a5 5 0 0 1 5-5z" fill="#f5f4ee"/><path d="M13 31h22v12H13zM14 5h20v12H14z" fill="#d7d8d4"/><path d="M15 34h18M15 38h18M35 22h3"/></svg></i><span>Print</span></div>';
      const center = u.el('section', 'center', work);
      u.el('div', 'panel-heading', center, 'Task');
      const help = u.el('aside', 'helpbox', work);
      help.innerHTML =
        '<h2>Help</h2><div class="help-item"><i>?</i><span>Instructions</span></div><div class="help-item"><i>▤</i><span>Example Task</span></div>';
      if (_c.display === 'panel') work.classList.add('panel-display');
      const foot = u.el('footer', 'footer', shell);
      Object.assign(_c, { shell, menu, work, center, help, foot, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.help;
      base(_c);
      _c.body = body;
      const panel = _c.help.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'instruction-panel');
        _c.help.insertBefore(panel, _c.help.children[1]);
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('div', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        _c.foot.classList.add('has-toast');
        _c.foot.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready';
      _c.foot.insertBefore(ready, _c.foot.firstChild);
      u.el('span', 'status-mid', _c.foot, 'Ln 1, Col 1');
      u.el('span', 'zoom', _c.foot, '100%');
      _c.foot.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-scroll-text-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-scroll-text-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f07819'],
      LOW_ACCENTS: ['#f07819'],
      parts,
    },
  });
})();
