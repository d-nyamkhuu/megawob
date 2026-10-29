// Editorial frame on the shared site template; preserve the widget's vt-* hooks.
(function () {
  'use strict';
  const palette = { bg: '#faf9f5', panel: '#faf9f5', fg: '#111', muted: '#444', line: '#999' };

  function highlightInstruction(el) {
    const text = el.textContent;
    const match = /\b(red|green|blue|yellow|orange|purple|pink|brown|gray|grey)\b/i.exec(text);
    if (!match) return;
    el.replaceChildren(document.createTextNode(text.slice(0, match.index)));
    const color = document.createElement('em');
    color.textContent = match[0];
    el.append(color, document.createTextNode(text.slice(match.index + match[0].length)));
  }

  env.site({
    name: 'design-read-figure-shades-06',
    template: 'site/base',
    styles: ['../base/site.css', 'site2.css'],
    design: {
      THEMES: { editorial: palette },
      LOW_THEME: palette,
      ACCENTS: ['#c8201e'],
      LOW_ACCENTS: ['#c8201e'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The editorial panel and docked note fit even the smallest viewport.
          _c.display = _c.ctx.display;
          document.body.className = 'vt-body instruction-' + _c.display;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // Task Controls always occupies the bottom dock; this design has no sidebar.
          Object.assign(_c, { nav: false, sidebar: false, wantFooter: true });
        },
        'frame.header': () => (_c) => {
          const { ctx, placement, util } = _c;
          const app = util.el('main', 'vt', document.body);
          app.classList.add(ctx.finish ? 'finish-mode' : 'end-' + placement);
          const top = util.el('header', 'vt-top', app);
          util.el('h1', 'vt-title', top, 'Visual Task');
          const nav = util.el('div', 'vt-nav', top);
          for (const label of ['Task 3 of 5', 'Previous', 'Next']) util.el('span', '', nav, label);
          const body = util.el('div', 'vt-main center ref-body', app);
          Object.assign(_c, { app, header: nav, body });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const brief = _c.header.querySelector('.ref-instruction');
          if (brief) {
            brief.classList.add('brief');
            highlightInstruction(brief);
            _c.body.append(brief);
          }
          _c.header.querySelector('.ref-spacer')?.remove();
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('brief');
            highlightInstruction(panel.querySelector('.ref-panel-text'));
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('section', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('brief');
            highlightInstruction(note.querySelector('.ref-note-text'));
            _c.body.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { app, header, util } = _c;
          const dock = document.querySelector('.ref-foot');
          // Keep the template's working end control and decoys in this design's dock/nav.
          for (const decoy of dock.querySelectorAll('.ref-xtra')) header.append(decoy);
          const end = dock.querySelector('[data-role="submit"]');
          dock.replaceChildren();
          dock.className = 'vt-dock bottom';
          app.append(dock);
          const notes = util.el('div', 'vt-notes', dock);
          util.el('h3', '', notes, 'Task Controls');
          util.el('p', '', notes,
            'Click the tiles that match the instruction. You can change your selection before submitting.');
          const mid = util.el('div', 'vt-mid', dock);
          util.el('span', 'vt-selected', mid, 'Selected: 0');
          const clear = util.el('button', 'vt-clear', mid, 'Clear Selection');
          clear.type = 'button';
          const right = util.el('div', 'vt-right', dock);
          if (end) right.append(end);
          Object.assign(_c, { right });
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.right.append(_c.submit);
            dock.remove();
          }
        },
        'frame.end': (base) => (_c) => {
          const { app, header, placement, right, submit } = _c;
          if (submit) {
            // Floating and icon variants retain their form within the dock/header.
            submit.className = placement === 'header' || placement === 'icon'
              ? 'vt-end-header' : placement === 'link' ? 'vt-end-link' : 'submit';
            if (placement === 'floating') submit.classList.add('vt-end-floating');
          }
          for (const decoy of app.querySelectorAll('.ref-xtra')) decoy.className = 'vt-xtra';
          const tools = header.querySelector('.ref-tools');
          if (tools) tools.replaceWith(...tools.childNodes);
          if (!right.children.length) right.remove();
          return base(_c);
        },
      },
    },
  });
})();
