// CalibratePro chrome on the shared site frame; task rendering stays in the widget.
(function () {
  'use strict';

  const palette = { bg: '#d8d5cc', panel: '#d5d2ca', fg: '#25262e', muted: '#4a4540', line: '#a5a49f' };
  const monitor =
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 2h26v22H3z" fill="#c7c7c4" stroke="#323a40" stroke-width="2"/><path d="M6 5h20v15H6z" fill="#869cb1" stroke="#444"/><path d="M8 7h16v11H8z" fill="#bed4e5"/><path d="M10 25h12l4 4H6z" fill="#bbb" stroke="#333"/><path d="M8 7v11h16" fill="none" stroke="#e6e9ec"/></svg>';

  function desktop(util) {
    const tk = util.el('div', 'cp-task', document.body);
    util.el('span', 'cp-gear', tk).innerHTML =
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M13 2h6l1 5 4-3 4 4-3 4 5 1v6l-5 1 3 4-4 4-4-3-1 5h-6l-1-5-4 3-4-4 3-4-5-1v-6l5-1-3-4 4-4 4 3z" fill="#96a6b1" stroke="#39434b" stroke-width="1.7"/><circle cx="16" cy="16" r="6" fill="#ccc" stroke="#39434b" stroke-width="2"/></svg>';
    ['Applications', 'Places', 'System'].forEach((t) => util.el('span', 'cp-tk', tk, t));
    const win = util.el('span', 'cp-tkwin', tk);
    util.el('span', 'cp-ico', win).innerHTML = monitor;
    util.el('span', '', win, 'CalibratePro 1.3.2');
    util.el('span', 'cp-speaker', tk).innerHTML =
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 12h6l8-7v22l-8-7H3z" fill="#333a40"/><path d="M20 10q7 6 0 12m3-16q11 10 0 20m3-23q13 13 0 26" fill="none" stroke="#333a40" stroke-width="2"/></svg>';
    util.el('span', 'cp-task-monitor cp-ico', tk).innerHTML = monitor;
    util.el('span', 'cp-clock', tk, 'Tue Nov  2, 2004    15:06');
  }

  env.site({
    name: 'design-choose-option-radio-02',
    template: 'site/base',
    design: {
      THEMES: { calibration: palette },
      LOW_THEME: palette,
      ACCENTS: ['#830b29'],
      LOW_ACCENTS: ['#830b29'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The margin and in-flow toast fit even at the smallest viewport.
          _c.display = _c.ctx.display || 'header';
          document.body.classList.remove('ref-has-note');
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // This desktop window always has a footer; its menu is the toolbar.
          _c.wantFooter = true;
          if (_c.placement === 'floating') _c.placement = 'footer';
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const title = util.el('div', 'cp-title', document.body);
          util.el('span', 'cp-ico', title).innerHTML = monitor;
          util.el('span', '', title, 'CalibratePro 1.3.2  -  Display Calibration Utility');
          const buttons = util.el('span', 'cp-wbtn', title);
          ['min', 'max', 'close'].forEach((t) => util.el('b', 'cp-window-' + t, buttons));
          const body = util.el('div', 'ds-body ref-body', document.body);
          const content = util.el('div', 'ds-content', body);
          const main = util.el('div', 'ds-main', content);
          const left = util.el('div', 'cp-left', main);
          const header = util.el('nav', 'cp-menu', left);
          ['File', 'Edit', 'Tools', 'Help'].forEach((t) => util.el('span', '', header, t));
          const side = util.el('aside', 'ds-brief', main);
          Object.assign(_c, { body, content, main, left, header, side });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          // Both instruction placements use the document's right margin.
          base({ ..._c, header: _c.side, display: _c.display === 'panel' ? 'header' : _c.display });
          const instruction = _c.side.querySelector('.ref-instruction');
          if (instruction) instruction.className = 'ds-instruction';
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { decoyBtn, endBtn, header } = _c;
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.className = 'ds-cancel-link' +
              (header.contains(parent) ? ' cp-menu-button' : ' cp-footer-action');
          };
          _c.endBtn = (parent, cls, text) => {
            const control = endBtn(parent, cls, text);
            control.className = control.tagName === 'A' ? 'cp-end-link' :
              'ds-submit' + (header.contains(parent) ? ' cp-menu-button' : '');
            return control;
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.className = 'cp-menu-tools';
        },
        'frame.body': () => () => {},
        'frame.panel': () => (_c) => {
          const { side, util } = _c;
          util.el('h3', '', side, 'Steps:');
          const steps = util.el('div', 'cp-steps', side);
          [
            '1.  Review the display information.',
            '2.  Choose your target settings\n(leave the current values if unsure).',
            '3.  Select the matching option under Subscription.',
          ].forEach((t) => util.el('p', '', steps, t));
          util.el('h3', '', side, 'Notes:');
          const notes = util.el('div', 'cp-notes', side);
          [
            'No payment is required to choose a subscription.',
            'You can change the subscription later from within the application.',
          ].forEach((t) => util.el('p', '', notes, '•  ' + t));
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'ds-stage', _c.left);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.className = 'ds-toast';
            note.querySelector('.ref-note-text').className = 'ds-instruction';
            _c.content.insertBefore(note, _c.main);
          }
        },
        'frame.footer': () => (_c) => {
          const { collide, decoyBtn, decoys, endBtn, label, left, placement, util } = _c;
          const foot = util.el('footer', 'ds-footer', left);
          decoyBtn(foot, 'Restore Defaults');
          foot.lastElementChild.className = 'ds-reset';
          if (placement === 'link') _c.submit = endBtn(foot, 'ref-endlink', label);
          util.el('span', 'cp-spacer', foot);
          for (const text of decoys.slice(1)) decoyBtn(foot, text);
          if (collide && collide.where === 'footer') decoyBtn(foot, collide.text, true);
          decoyBtn(foot, 'Cancel');
          foot.lastElementChild.className = 'ds-cancel-link';
          if (placement === 'footer') _c.submit = endBtn(foot, 'ref-submit', label);
          desktop(util);
        },
        'frame.floating': () => () => {},
      },
    },
  });
})();
