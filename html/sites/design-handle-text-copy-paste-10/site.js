(function () {
  'use strict';
  const palette = { bg: '#eff8ff', panel: '#fff', fg: '#17344f', muted: '#52667b', line: '#b7dcf4' };

  function editingTools(u, foot) {
    const edit = u.el('section', 'edit-tools', foot);
    u.el('div', 'edit-heading', edit, 'Editing Tools');
    const btns = u.el('div', 'edit-buttons', edit);
    [['▣', 'Copy'], ['▣', 'Paste'], ['◆', 'Clear']].forEach(([icon, label]) => {
      const b = u.el('button', 'edit-tool', btns);
      u.el('span', 'edit-icon', b, icon);
      u.el('span', '', b, label);
      b.type = 'button';
      b.addEventListener('click', () => {
        const src = document.querySelector('.ut-src .ut-text'), field = document.querySelector('.ut-input');
        if (label === 'Copy' && src) {
          const r = document.createRange();
          r.selectNodeContents(src);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(r);
          document.execCommand('copy');
        } else if (label === 'Paste' && field) {
          field.focus();
          field.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true }));
        } else if (label === 'Clear' && field) {
          field.value = '';
          field.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });
    return edit;
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original briefing column accommodates every note mode at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'ref web2 two-row';
      const shell = u.el('main', 'shell', document.body);
      shell.classList.toggle('finish-mode', _c.ctx.finish);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Text Transfer Task');
      u.el('div', 'civic-subtitle', head, 'Follow the instruction below to complete the task.');
      u.el('div', 'civic-application', head, 'Application for Community Support');
      u.el('div', 'civic-step', head, 'Step 2 of 3');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', center);
      note.dataset.display = _c.display;
      note.hidden = _c.display === 'hidden';
      if (_c.display === 'toast') note.classList.add('instruction-toast');
      const toolbar = u.el('div', 'workspace-tools', work);
      Object.assign(_c, { shell, work, center, header: note, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction-copy');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel-text');
      if (note) note.classList.add('instruction-copy');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').classList.add('instruction-copy');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      const edit = editingTools(_c.util, foot);
      foot.insertBefore(edit, foot.querySelector('.ref-tools'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
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
    name: 'design-handle-text-copy-paste-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#397e25'],
      LOW_ACCENTS: ['#397e25'],
      parts,
    },
  });
})();
