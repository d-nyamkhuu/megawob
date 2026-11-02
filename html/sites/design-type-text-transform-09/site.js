// Pastel Text Tools chrome on the shared frame; task behavior stays in the widget.
(function () {
  'use strict';

  const palette = { bg: '#e7faf2', panel: '#ffffff', fg: '#090c20', muted: '#3b3b55', line: '#d8e6de' };

  function briefing(util, note, text) {
    text.classList.add('ds-instruction');
    util.el('div', 'ds-sub', note, 'Enter your answer below.');
  }

  env.site({
    name: 'design-type-text-transform-09',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    langs: ['en'],
    design: {
      THEMES: { pastel: palette },
      LOW_THEME: palette,
      ACCENTS: ['#6f55c0'],
      LOW_ACCENTS: ['#6f55c0'],
      parts: {
        'frame.header': () => function (_c) {
          const { util } = _c;
          const header = util.el('header', 'ds-top', document.body);
          util.el('span', 'ds-logo', header, 'Tt');
          util.el('span', 'ds-brand', header, 'Text Tools');
          const wc = util.el('span', 'ds-wc', header);
          wc.innerHTML =
            '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#222" stroke-width="1.6"><path d="M5 12h14"/></svg><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#222" stroke-width="1.8"><rect x="5" y="5" width="14" height="14" rx="1.5"/></svg><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#222" stroke-width="1.6"><path d="M5 5l14 14M19 5 5 19"/></svg>';
          // Instructions precede the task canvas, so prepare their parent before that section runs.
          const body = util.el('div', 'ref-body ds-body', document.body);
          const content = util.el('div', 'ds-content', body);
          Object.assign(_c, { header, wc, body, content });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => function (_c) {
          const { content, util } = _c;
          base({ ..._c, header: content });
          const text = content.querySelector('.ref-instruction');
          if (text) {
            const note = util.el('aside', 'ds-header-note', content);
            note.append(text);
            briefing(util, note, text);
          } else content.querySelector('.ref-spacer').remove();
        },
        'frame.tools': (base) => function (_c) {
          base(_c);
          _c.header.insertBefore(_c.headerTools, _c.wc);
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => function (_c) {
          const { content, util } = _c;
          base({ ..._c, body: content });
          const panel = content.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('ds-header-note', 'ds-panel-note');
            panel.querySelector('.ref-panel-title').remove();
            briefing(util, panel, panel.querySelector('.ref-panel-text'));
          }
        },
        'frame.stage': () => function (_c) {
          const { content, util } = _c;
          const main = util.el('div', 'ds-main', content);
          const stage = util.el('main', 'ds-stage', main);
          const opts = util.el('aside', 'ds-options', main);
          util.el('div', 'ds-opt-title', opts, 'Options');
          for (const text of ['Trim spaces', 'Show result preview']) {
            const row = util.el('div', 'ds-opt', opts);
            util.el('span', 'ds-box', row);
            util.el('span', '', row, text);
          }
          Object.assign(_c, { main, stage });
        },
        'frame.toast': (base) => function (_c) {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('ds-toast');
            _c.content.insertBefore(note, _c.main);
            briefing(_c.util, note, note.querySelector('.ref-note-text'));
          }
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          if (foot) {
            foot.classList.add('ds-footer');
            _c.content.append(foot);
          }
        },
        'frame.floating': (base) => function (_c) {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            dock.classList.add('ds-footer');
            _c.content.append(dock);
          }
        },
        'frame.end': (base) => function (_c) {
          const { header, submit } = _c;
          for (const button of document.querySelectorAll('.ref-xtra')) button.classList.add('ds-xtra');
          if (submit) {
            submit.classList.add('ds-submit');
            if (header.contains(submit)) submit.classList.add('ds-end-header');
            if (submit.classList.contains('ref-endlink')) submit.classList.add('ds-end-link');
          }
          return base(_c);
        },
      },
    },
  });
})();
