// Memphis Playground frame on the shared site template.
(function () {
  'use strict';

  const palette = {
    bg: '#fdf6ee', panel: '#fdf6ee', fg: '#14142b', accent: '#f9685d',
    font: "'Trebuchet MS',Verdana,Arial,sans-serif", line: '#14142b',
    muted: '#3a3a55', 'button-fg': '#14142b',
  };

  // Keep the widget's hint/reset hooks and detached code preview in the frame.
  function terminalButtons(u, footer) {
    const hb = u.el('button', 'mp-btn hint', footer, 'Show Hint');
    hb.type = 'button';
    hb.innerHTML =
      '<svg viewBox="0 0 32 24"><rect x="1" y="1" width="30" height="22" rx="3" fill="currentColor"/><path d="M5 6h3m3 0h3m3 0h3m3 0h3M5 11h3m3 0h3m3 0h3m3 0h3M8 17h16" stroke="#eeeaff" stroke-width="2"/></svg>Show Hint';
    const rb = u.el('button', 'mp-btn reset', footer, 'Reset Terminal');
    rb.type = 'button';
    rb.innerHTML =
      '<svg viewBox="0 0 28 28"><path d="M24 13A10 10 0 0 0 6 6L3 9m0-6v6h6M4 15a10 10 0 0 0 18 7l3-3m0 6v-6h-6" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/></svg>Reset Terminal';
  }

  function filePreview(u, shell) {
    const pv = u.el('aside', 'mp-preview', shell);
    const ph = u.el('div', 'mp-ph', pv);
    ph.innerHTML =
      '<svg viewBox="0 0 20 24"><path d="M3 1.5h9l5 5V22H3z M12 1.5v6h5" fill="none" stroke="#222" stroke-width="1.8" stroke-linejoin="round"/></svg><b>File Preview</b><span>&mdash;</span>';
    u.el('div', 'mp-pf', pv, 'index.html');
    const pc = u.el('pre', 'mp-code', pv);
    const code = [
      '&lt;!DOCTYPE html&gt;',
      '&lt;html <em>lang</em>=<i>"en"</i>&gt;',
      '&lt;head&gt;',
      '    &lt;meta <em>charset</em>=<strong>"UTF-8"</strong>&gt;',
      '    &lt;title&gt;My Game<strong>&lt;/title&gt;</strong>',
      '&lt;/head&gt;',
      '&lt;body&gt;',
      '    &lt;h1&gt;Welcome to My Game<strong>&lt;/h1&gt;</strong>',
      '&lt;/body&gt;',
      '&lt;/html&gt;',
    ];
    pc.innerHTML = code
      .map((l, i) => '<div><span class="mp-ln">' + (i + 1) + '</span><span>' + l + '</span></div>')
      .join('');
  }

  // Style the shared controls without replacing their behavior or seeded choices.
  function styleControls(parent, header) {
    for (const button of parent.querySelectorAll('[data-role="xtra"]')) button.classList.add('mp-xtra');
    for (const button of parent.querySelectorAll('[data-role="submit"]')) {
      button.classList.add('end-control');
      if (header) button.classList.add('mp-end-header');
      else if (button.classList.contains('ref-endlink')) button.classList.add('mp-end-link');
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has room for its detached instruction card at every training size.
      _c.display = _c.ctx.display;
      document.body.className = 'side-left instruction-' + _c.display;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'site-shell', document.body);
      const dec = u.el('div', 'mp-decor', shell);
      dec.innerHTML =
        '<div class="mp-orb"></div><div class="mp-tri"></div><div class="mp-dots">' +
        '<i></i>'.repeat(16) +
        '</div><svg class="mp-zig" viewBox="0 0 100 70"><path d="M3 12 L20 5 L32 32 L61 20 L72 46 L98 31" fill="none" stroke="#f98f86" stroke-width="7"/></svg><svg class="mp-sparks" viewBox="0 0 60 100"><path d="M25 5 L47 31 M6 46 L39 56 M8 94 L40 81" stroke="#f98f86" stroke-width="6" stroke-linecap="round"/></svg>';
      const header = u.el('header', 'design-header', shell);
      const br = u.el('div', 'design-brand', header);
      br.innerHTML =
        '<svg viewBox="0 0 48 44"><path d="M2 42 L33 1 L46 42Z" fill="#8f86e8"/><path d="M33 1 L46 42 L25 42Z" fill="#10182b"/></svg><div><b>Playground</b><small>PRACTICE &nbsp;•&nbsp; EXPLORE &nbsp;•&nbsp; BUILD</small></div>';
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => (_c) => {
      const { header, util: u } = _c;
      const nv = u.el('nav', 'design-nav', header);
      for (const t of ['Home', 'Tools', 'Learn', 'Projects']) u.el('span', t === 'Tools' ? 'on' : '', nv, t);
      u.el('span', 'mp-av', nv).innerHTML =
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#fff"/><path d="M5 21v-3c0-6 14-6 14 0v3z" fill="#fff"/></svg>';
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        const note = _c.util.el('section', 'task-note', _c.shell);
        note.dataset.role = 'instruction';
        note.append(instruction);
      }
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      styleControls(_c.headerTools, true);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'design-body ref-body', _c.shell);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.dataset.role = 'instruction';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      filePreview(_c.util, _c.shell);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note');
        note.dataset.role = 'instruction';
        _c.shell.append(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      let footer = document.querySelector('.ref-foot');
      if (!footer) footer = _c.util.el('footer', '', _c.shell);
      footer.classList.add('design-footer');
      _c.shell.append(footer);
      terminalButtons(_c.util, footer);
      // Keep the design's two tools first; the template owns completion and decoys.
      footer.prepend(footer.querySelector('.mp-btn.hint'), footer.querySelector('.mp-btn.reset'));
      styleControls(footer, false);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        _c.shell.append(dock);
        styleControls(dock, false);
      }
    },
  };

  env.site({
    name: 'design-use-desktop-tools-terminal-08',
    template: 'site/base',
    design: {
      THEMES: { memphis: palette }, LOW_THEME: palette,
      ACCENTS: ['#f9685d'], LOW_ACCENTS: ['#f9685d'], LANGS: ['en'],
      parts,
    },
  });
})();
