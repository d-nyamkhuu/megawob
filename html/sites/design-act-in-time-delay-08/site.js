(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#343b48', muted: '#78818f', line: '#e0e4e8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      const top = u.el('header', 'rm-header', document.body);
      const brand = u.el('div', 'rm-brand', top);
      u.el('span', 'rm-leaf', brand, '◢');
      const word = u.el('div', '', brand);
      u.el('b', '', word, 'Rivermere');
      u.el('small', '', word, 'Learning');
      const toolbar = u.el('div', 'rm-header-tools', top);
      u.el('div', 'rm-module', toolbar, 'Module 3　|　Task 2 of 4');
      u.el('div', 'rm-rule', document.body);
      const layout = u.el('div', 'rm-layout');
      const stage = u.el('main', 'ds-stage rm-document', layout);
      const margin = u.el('aside', 'rm-margin', layout);
      const timed = u.el('div', 'rm-timed', margin);
      u.el('span', 'rm-clockicon', timed, '◷');
      const summary = u.el('div', 'rm-summary', timed);
      u.el('strong', '', summary, 'Timed Task');
      // The widget updates these compatibility nodes; their goal copy stays hidden.
      u.el('p', 'rm-widget-summary', summary);
      u.el('div', 'rm-summary-copy', summary, 'The task clock shows the elapsed time for this activity.');
      u.el('div', 'rm-readout', timed, '00:00 / 00:10');
      Object.assign(_c, { layout, stage, margin, toolbar, header: margin });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('rm-instruction', 'rm-header-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.layout);
      _c.body = _c.layout;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.margin;
      base(_c);
      _c.body = body;
      const panel = _c.margin.querySelector('.ref-panel');
      if (panel) panel.classList.add('rm-instruction', 'rm-panel-instruction');
      const notes = _c.util.el('section', 'rm-notes', _c.margin);
      _c.util.el('h2', '', notes, 'Notes');
      const ul = _c.util.el('ul', '', notes);
      _c.util.el('li', 'rm-widget-note', ul);
      ['The task clock updates automatically.', 'Your activity stays in this workspace.', 'Review the instructions for this step.'].forEach(t => _c.util.el('li', '', ul, t));
    },
    'frame.stage': () => (_c) => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('rm-instruction', 'rm-notice');
        _c.margin.insertBefore(note, _c.margin.querySelector('.rm-notes'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('rm-actions');
      const lane = _c.util.el('div', 'rm-task-actions');
      foot.insertBefore(lane, foot.firstChild);
      _c.margin.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util;const el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
      const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
      u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');
      dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
    },
  };
  env.site({
    name: 'design-act-in-time-delay-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#7dd9b8'], LOW_ACCENTS: ['#7dd9b8'], parts },
  });
})();
