/* Data Lab: the forum utility design on the shared site frame. */
(function () {
  'use strict';

  function briefCopy(util, body) {
    util.el('p', 'range-intro', body,
      'Drag the slider handles to adjust the lower and upper values. The table and handle labels show the current settings as you work.');
    util.el('hr', '', body);
    const guide = util.el('div', 'range-guide', body);
    util.el('h4', '', guide, 'Slider values:');
    const values = util.el('ul', '', guide);
    for (const text of ['Lower handle: lower value', 'Upper handle: upper value']) util.el('li', '', values, text);
    util.el('h4', '', body, 'Notes:');
    const notes = util.el('ul', '', body);
    for (const text of ['Drag a handle to change its value.', 'The scale shows the available range.',
      'Current values update as you drag the handles.']) util.el('li', '', notes, text);
  }

  const parts = {
    'frame.theme': () => function (_c) {
      const { ctx } = _c;
      const { rng, util, content } = ctx;
      document.body.className = `forum instruction-${ctx.display}`;
      Object.assign(_c, { rng, util, content });
    },
    'frame.layout': (base) => function (_c) {
      base(_c);
      // This design has room for its brief and inline notice at every supported size.
      _c.display = _c.ctx.display;
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      // The two-column workspace and Actions panel are permanent parts of this design.
      Object.assign(_c, { nav: false, sidebar: false, wantFooter: true });
    },
    'frame.header': () => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'forum-header', document.body);
      util.el('span', 'app-name', header, 'Data Lab');
      util.el('span', 'app-title', header, 'Parameter Tuning Exercise');
      const links = util.el('nav', 'head-links', header);
      for (const text of ['Help', 'Preferences', 'Log Out']) util.el('span', '', links, text);
      Object.assign(_c, { header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => function (_c) {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) instruction.classList.add('instruction', 'instruction-header');
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      _c.headerTools.classList.add('header-tools');
      if (_c.submit) _c.submit.classList.add('header-end');
    },
    'frame.body': () => function (_c) {
      _c.body = _c.util.el('div', 'forum-main ref-body', document.body);
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const { body, util } = _c;
      const panel = body.querySelector('.ref-panel') || util.el('section', '', body);
      panel.classList.add('panel', 'brief');
      body.classList.remove('ref-panel-right');
      const title = panel.querySelector('.ref-panel-title') || util.el('div', '', panel);
      title.classList.add('bar');
      title.textContent = 'Task Brief';
      const briefBody = util.el('div', 'panel-body', panel);
      const instruction = panel.querySelector('.ref-panel-text');
      if (instruction) {
        instruction.classList.add('instruction');
        briefBody.appendChild(instruction);
      }
      briefCopy(util, briefBody);
      Object.assign(_c, { briefBody });
    },
    'frame.stage': () => function (_c) {
      const { body, util } = _c;
      const work = util.el('section', 'panel work', body);
      util.el('div', 'bar', work, 'Workspace');
      const stage = util.el('main', 'work-body', work);
      stage.dataset.role = 'stage';
      Object.assign(_c, { stage });
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.querySelector('.ref-note-x').classList.add('instruction-close');
        _c.briefBody.appendChild(note);
      }
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const { ctx, decoyBtn, label, placement, util } = _c;
      const foot = document.querySelector('.ref-foot');
      foot.classList.add('panel', 'actions');
      const bar = util.el('div', 'bar', foot, 'Actions');
      foot.prepend(bar);
      const row = util.el('div', 'action-row', foot);
      const hint = foot.querySelector('.ref-foot-text');
      hint.classList.add('hint');
      hint.textContent = ctx.finish ? 'When you are finished, complete the task.'
        : `When you are finished, ${placement === 'icon' ? 'click the checkmark' : `click ${label}`} to check your answer.`;
      row.appendChild(hint);
      const btns = foot.querySelector('.ref-tools');
      btns.classList.add('btns');
      row.appendChild(btns);
      if (_c.submit && (placement === 'footer' || placement === 'link')) {
        _c.submit.classList.add(placement === 'link' ? 'end-link' : 'primary');
      }
      decoyBtn(btns, 'Reset');
      btns.lastElementChild.classList.add('reset');
      btns.lastElementChild.dataset.action = 'reset';
      decoyBtn(btns, 'Clear');
      Object.assign(_c, { btns });
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        // Keep the floating placement in the reserved Actions area, clear of the slider.
        _c.btns.prepend(dock);
        _c.submit.classList.add('primary');
      }
    },
  };

  env.site({
    name: 'design-set-slider-range-04',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: { parts },
  });
})();
