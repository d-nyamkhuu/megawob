// Yosemite notebook frame on the shared site template.
(function () {
  'use strict';

  function emphasizeInstruction(text) {
    const split = text.textContent.indexOf('"');
    if (split > 0) {
      const instruction = text.textContent;
      text.textContent = '';
      env.util.el('strong', '', text, instruction.slice(0, split));
      text.append(document.createTextNode(instruction.slice(split)));
    }
  }

  const parts = {
    'frame.theme': () => function (_c) {
      const { rng, util, content } = _c.ctx;
      Object.assign(_c, { rng, util, content });
    },
    'frame.layout': (base) => function (_c) {
      base(_c);
      // The notebook has responsive styles for a panel even in the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.header': () => function (_c) {
      const { util: u, display } = _c;
      const mb = u.el('header', 'mb', document.body);
      const icon = (cls, svg) => {
        const node = u.el('span', cls, mb);
        node.innerHTML = svg;
        return node;
      };
      icon(
        'apple',
        '<svg viewBox="0 0 24 28"><path fill="currentColor" d="M16 0c.4 3-1.7 5.4-4.2 5.5C11.6 3 13.8.7 16 0ZM20.8 9c-4.4 2.9-3.6 7.3.6 9-1 3.5-3.5 7.4-5.6 7.4-1.6 0-2.4-1-4.2-1s-2.8 1-4.2 1C4.5 25.4.5 18.5.5 13.7.5 8.8 4 6 7.2 6c2 0 3.2 1.1 4.4 1.1S14.5 6 16.4 6c2 0 3.3 1 4.4 3Z"/></svg>',
      );
      u.el('b', '', mb, 'Contact Manager');
      ['File', 'Edit', 'View', 'Window', 'Help'].forEach((t) => u.el('span', '', mb, t));
      const status = u.el('div', 'system-status', mb);
      const statusIcon = (cls, body) => {
        const n = u.el('span', cls, status);
        n.innerHTML = '<svg viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="2">' + body + '</svg>';
      };
      statusIcon(
        'wifi',
        '<path d="M2 7Q14 -3 26 7M6 11Q14 4 22 11M10 15Q14 11 18 15"/><circle cx="14" cy="19" r="1.5" fill="currentColor"/>',
      );
      statusIcon(
        'volume',
        '<path fill="currentColor" stroke="none" d="M2 9h5l6-5v16l-6-5H2Z"/><path d="M17 7q5 5 0 10M21 3q9 9 0 18"/>',
      );
      statusIcon(
        'battery',
        '<rect x="1" y="5" width="23" height="14" rx="2"/><path d="M26 9v6"/><rect x="4" y="8" width="17" height="8" fill="currentColor" stroke="none"/>',
      );
      u.el('span', 'system-clock', status, 'Tue Apr 14  10:24 AM');
      statusIcon('search', '<circle cx="11" cy="10" r="7"/><path d="m16 15 7 7"/>');
      statusIcon('list', '<path d="M8 5h18M8 11h18M8 17h18"/><path stroke-width="3" d="M2 5h2M2 11h2M2 17h2"/>');
      const win = u.el('div', 'win', document.body);
      const tb = u.el('div', 'tb', win);
      u.el('i', '', tb);
      u.el('i', '', tb);
      u.el('i', '', tb);
      u.el('span', '', tb, 'Contact Manager');
      const nb = u.el('div', 'nb', win);
      const tabs = u.el('div', 'tabs', nb);
      ['Personal', 'Address', 'Account', 'Notes', 'Other'].forEach((t, i) =>
        u.el('div', 'tab' + (i ? '' : ' on'), tabs, t),
      );
      const frame = u.el('div', 'frame', nb);
      const rg = u.el('div', 'rings', frame);
      for (let i = 0; i < 11; i++) u.el('i', '', rg);
      const content = u.el('div', 'page', frame);
      content.dataset.display = display;
      Object.assign(_c, { header: tb, content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => function (_c) {
      base({ ..._c, header: _c.content });
      const text = _c.content.querySelector('.ref-instruction');
      if (text) {
        text.classList.add('ds-header-note', 'ds-instruction');
        emphasizeInstruction(text);
      } else _c.content.querySelector('.ref-spacer').remove();
    },
    'frame.controls': (base) => function (_c) {
      base(_c);
      const endBtn = _c.endBtn;
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.classList.add(cls === 'ref-endlink' ? 'ds-endlink' : 'ds-submit');
        if (parent.closest('.tb')) button.classList.add('ds-toolbar-end');
        return button;
      };
    },
    'frame.body': () => function (_c) {
      _c.body = _c.util.el('div', 'ds-main ref-body', _c.content);
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        const text = panel.querySelector('.ref-panel-text');
        text.classList.add('ds-instruction');
        emphasizeInstruction(text);
      }
    },
    'frame.stage': () => function (_c) {
      _c.stage = _c.util.el('main', 'ds-stage ref-stage', _c.body);
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        const text = note.querySelector('.ref-note-text');
        text.classList.add('ds-instruction');
        emphasizeInstruction(text);
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => function (_c) {
      // This design always has a form action bar, including in finish mode.
      _c.wantFooter = true;
      base(_c);
      const foot = document.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.append(foot);
      foot.querySelector('.ref-foot-text').remove();
      _c.decoyBtn(foot, 'Clear All');
      foot.prepend(foot.lastElementChild);
      const tools = foot.querySelector('.ref-tools');
      foot.insertBefore(_c.util.el('span', 'sp'), tools);
      _c.decoyBtn(tools, 'Cancel');
      if (_c.submit && _c.submit.parentElement === tools) tools.insertBefore(tools.lastElementChild, _c.submit);
      _c.foot = foot;
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.foot.append(dock);
    },
  };

  env.site({
    name: 'design-type-text-multi-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['../base/site.css', 'ref.css', 'site.css'],
    design: { parts },
  });
})();
