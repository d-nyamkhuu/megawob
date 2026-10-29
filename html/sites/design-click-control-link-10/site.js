(function () {
  'use strict';
  const globe =
    '<svg viewBox="0 0 24 24" width="100%" height="100%" shape-rendering="crispEdges"><path d="M8 1h8v1h3v2h2v3h2v10h-2v3h-3v2H7v-2H4v-3H2V7h2V4h4z" fill="#07214a"/><path d="M8 2h8v1h3v3h2v11h-2v3h-3v1H8v-2H5v-3H3V8h2V5h3z" fill="#0086e9"/><path d="M8 3h6v2h-3v2H7v3H5V7h2V5h1zM14 3h3v3h3v3h-4V7h-2zM4 11h5v2h3v3h-2v5H8v-3H6v-3H4zM17 11h4v5h-2v3h-3v-4h-2v-2h3z" fill="#6ac72e"/><path d="M11 2v20M5 8h16M4 15h17M16 3l2 5v8l-2 5" fill="none" stroke="#004e83" stroke-width=".6"/><path d="M7 4h3v1H7zM4 8h2v3H4z" fill="#7ae4ff"/></svg>';
  const doc =
    '<svg viewBox="0 0 24 30" width="100%" height="100%" shape-rendering="crispEdges"><path d="M2 1h15v2h2v2h2v2h2v22H2z" fill="#fff" stroke="#070d3b" stroke-width="1.5"/><path d="M4 3h11v6h6v18H4z" fill="#f4faff"/><path d="M17 2v6h5M19 5v3h3" fill="none" stroke="#070d3b" stroke-width="1"/><path d="M6 9h6M6 13h14M6 17h14M6 21h14M6 25h10" stroke="#479bff" stroke-width="1.7"/><path d="M4 3v24h17" fill="none" stroke="#c3dbed"/></svg>';
  // Add the design's document icon to text drawn by the shared instruction parts.
  function documentNote(util, note, textClass) {
    const text = util.el('span', textClass, null, note.textContent);
    note.replaceChildren();
    const icon = util.el('span', 'pix-docicon', note);
    icon.innerHTML = doc;
    note.append(text);
  }

  env.site({
    name: 'design-click-control-link-10',
    template: 'site/base',
    design: {
      LANGS: ['en'],
      THEMES: { pixel: { bg: '#fffdf5', panel: '#fffdf7', fg: '#080d39', muted: '#14203a', line: '#50688a' } },
      LOW_THEME: { bg: '#fffdf5', panel: '#fffdf7', fg: '#080d39', muted: '#14203a', line: '#50688a' },
      ACCENTS: ['#002cf4'],
      LOW_ACCENTS: ['#002cf4'],
      parts: {
        'frame.theme': (base) => (_c) => {
          base(_c);
          document.body.className = 'ref pix';
        },
        'frame.layout': () => (_c) => {
          const W = window.innerWidth;
          const H = window.innerHeight;
          Object.assign(_c, { W, H, roomy: W >= 1260, tall: H >= 700, display: _c.ctx.display });
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const shell = util.el('main', 'shell', document.body);
          const left = util.el('section', 'pix-left', shell);
          const bar = util.el('header', 'pix-bar', left);
          util.el('span', 'pix-globe', bar).innerHTML = globe;
          util.el('span', 'pix-apptitle', bar, 'Web Explorer');
          const header = util.el('span', 'pix-barlinks', bar);
          util.el('span', '', header, 'Online Tools');
          util.el('span', 'pix-sep', header, '|');
          util.el('span', '', header, 'Help');
          Object.assign(_c, { shell, left, header });
        },
        'frame.nav': () => ({ left, util }) => {
          const tabs = util.el('nav', 'pix-tabs', left);
          ['Home', 'Resources', 'Library'].forEach((t, i) => util.el('span', 'pix-tab' + (i === 0 ? ' on' : ''), tabs, t));
        },
        'frame.instruction': (base) => (_c) => {
          base({ ..._c, header: _c.left });
          const note = _c.left.querySelector('.ref-instruction');
          if (note) {
            note.className = 'instruction';
            note.dataset.display = _c.display;
            documentNote(_c.util, note, 'pix-instext');
          }
          _c.left.querySelector('.ref-spacer')?.remove();
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('pix-xtra'));
          _c.submit?.classList.add('pix-end', 'pix-end-head');
        },
        'frame.body': () => (_c) => {
          const { shell, util } = _c;
          const side = util.el('aside', 'pix-side', shell);
          util.el('h2', 'pix-sidehead', side, 'Task Inspector');
          Object.assign(_c, { side, body: side });
        },
        'frame.panel': (base) => (_c) => {
          const { ctx, display, side, util } = _c;
          base(_c);
          side.classList.remove('ref-panel-right');
          let panel = side.querySelector('.ref-panel');
          if (panel) {
            panel.className = 'pix-panel';
            const heading = panel.querySelector('.ref-panel-title');
            const title = util.el('h3', '', null, 'Current Task');
            heading.replaceWith(title);
            const note = panel.querySelector('.ref-panel-text');
            note.className = 'instruction instruction-panel pix-pbody pix-cur';
            note.dataset.display = display;
            documentNote(util, note, 'pix-instext');
          } else {
            panel = util.el('section', 'pix-panel', side);
            util.el('h3', '', panel, 'Resource Guide');
            const body = util.el('div', 'pix-pbody pix-cur', panel);
            util.el('span', 'pix-docicon sm', body).innerHTML = doc;
            util.el('span', '', body, 'Browse the available resources and references.');
          }
          const details = util.el('section', 'pix-panel', side);
          util.el('h3', '', details, 'Details');
          const body = util.el('div', 'pix-pbody pix-det', details);
          [['Task Type:', 'Link click'], ['View:', 'All resources'], ['Status:', 'Ready']].forEach((row) => {
            row.forEach((text) => util.el('span', '', body, text));
          });
          const actions = util.el('section', 'pix-panel', side);
          util.el('h3', '', actions, 'Actions');
          const actionBody = util.el('div', 'pix-pbody pix-act', actions);
          if (!ctx.finish && _c.placement !== 'floating') {
            util.el('span', 'pix-action-hint', actionBody,
              ['header', 'icon'].includes(_c.placement) ? 'Finish from the toolbar.' : 'Finish from the action strip.');
          }
          actions.hidden = ctx.finish;
          Object.assign(_c, { actionBody });
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('div', 'stage', _c.left);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('instruction', 'instruction-toast');
            note.dataset.display = _c.display;
            const text = note.querySelector('.ref-note-text');
            text.classList.add('pix-instext');
            const icon = _c.util.el('span', 'pix-docicon', null);
            icon.innerHTML = doc;
            note.prepend(icon);
            _c.left.insertBefore(note, _c.stage);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            _c.shell.classList.add('pix-has-foot');
            foot.classList.add('pix-action-strip');
            foot.querySelector('.ref-foot-text').className = 'pix-foot-label';
            foot.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('pix-xtra'));
            if (['footer', 'link'].includes(_c.placement)) _c.submit.classList.add('submit');
            _c.shell.append(foot);
          }
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          if (_c.placement === 'floating') {
            const dock = _c.submit.parentElement;
            _c.submit.className = 'submit';
            _c.actionBody.append(_c.submit);
            dock.remove();
          }
        },
      },
    },
  });
})();
