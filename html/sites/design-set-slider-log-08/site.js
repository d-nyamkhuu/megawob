/* Amiga Workbench design on the shared site frame. */
(function () {
  'use strict';

  const palette = { bg: '#a5a5a5', panel: '#a5a5a5', fg: '#000', muted: '#000', line: '#555' };

  // Keep the shared inert-control behavior, with Workbench's square gadgets.
  function gadget(_c, parent, label, cls, collides) {
    _c.decoyBtn(parent, label, collides);
    const button = parent.lastElementChild;
    button.className = `wb-btn ${cls || ''}`.trim();
    return button;
  }

  env.site({
    name: 'design-set-slider-log-08',
    template: 'site/base',
    design: {
      THEMES: { workbench: palette },
      LOW_THEME: palette,
      ACCENTS: ['#0039ab'],
      LOW_ACCENTS: ['#0039ab'],
      LANGS: ['en'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The dedicated briefing window fits every instruction mode at every size.
          _c.display = _c.ctx.display || 'header';
          document.body.className = `library amiga instruction-${_c.display}`;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const bar = u.el('header', 'wb-menubar', document.body);
          u.el('span', 'wb-disk', bar);
          u.el('span', 'wb-bartitle', bar, 'Amiga  Workbench');
          u.el('span', 'wb-clock', bar, 'Mon  Apr 22  1991    10:24');
          const body = u.el('div', 'wb-main ref-body', document.body);
          const brief = u.el('section', 'wb-win wb-brief', body);
          const title = u.el('div', 'wb-titlebar', brief);
          u.el('span', '', title, 'Task Briefing');
          u.el('i', 'wb-gad', title);
          const header = u.el('div', 'wb-body', brief);
          Object.assign(_c, { body, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const instruction = _c.header.querySelector('.ref-instruction');
          if (instruction) instruction.classList.add('instruction');
        },
        // Controls are placed after the Workbench windows have been built.
        'frame.tools': () => () => {},
        'frame.body': () => (_c) => {
          const { body, util: u } = _c;
          const win = u.el('section', 'wb-win wb-adj', body);
          const titlebar = u.el('div', 'wb-titlebar', win);
          u.el('i', 'wb-icon', titlebar);
          u.el('span', '', titlebar, 'Picture Adjuster');
          u.el('i', 'wb-gad r2', titlebar);
          u.el('i', 'wb-gad r1', titlebar);
          const adjustment = u.el('div', 'wb-adjbody', win);
          u.el('div', 'wb-picture', adjustment);
          const side = u.el('div', 'wb-side', adjustment);
          const preview = u.el('div', 'wb-panel wb-preview', side);
          u.el('div', 'wb-head', preview, 'Preview');
          const buttons = u.el('div', 'wb-prevbtns', preview);
          gadget(_c, buttons, 'Original', 'sel');
          gadget(_c, buttons, 'Adjusted');
          const controls = u.el('div', 'wb-panel wb-controls', side);
          u.el('div', 'wb-head', controls, 'Controls');
          const actions = u.el('div', 'wb-actions', side);
          const reset = gadget(_c, actions, 'Reset', 'reset');
          reset.dataset.action = 'reset';
          gadget(_c, actions, 'Auto');
          Object.assign(_c, { actions, controls, titlebar });
        },
        'frame.panel': (base) => (_c) => {
          base({ ..._c, body: _c.header });
          const instruction = _c.header.querySelector('.ref-panel-text');
          if (instruction) instruction.classList.add('instruction');
          const { ctx, header, label, util: u } = _c;
          const section = (heading, text) => {
            u.el('h3', '', header, heading);
            u.el('p', '', header, text);
          };
          section('Adjustment', 'Drag the slider handle to change the value. The readout beside each control shows its current setting.');
          section('Scale', 'Tick marks show the scale of each control.');
          section('Input method', 'Pointer (drag the slider handle).');
          section('When you are done', ctx.finish ? 'Finish when the adjustment is complete.' : `Click the ${label} button.`);
        },
        'frame.stage': () => (_c) => {
          const stage = _c.util.el('main', 'record-stage', _c.controls);
          stage.dataset.role = 'stage';
          _c.stage = stage;
        },
        'frame.footer': () => (_c) => {
          const { actions, collide, decoys, endBtn, label, placement, titlebar, util: u } = _c;
          const taskbar = u.el('footer', 'wb-taskbar', document.body);
          const workbench = u.el('div', 'wb-task wb-t1', taskbar);
          u.el('i', 'wb-floppy', workbench);
          u.el('span', '', workbench, 'Workbench');
          const adjuster = u.el('div', 'wb-task wb-t2', taskbar);
          u.el('i', 'wb-icon', adjuster);
          u.el('span', '', adjuster, 'Picture Adjuster');
          const tools = u.el('div', 'wb-tbfill', taskbar);
          u.el('i', 'wb-gad wb-tbgad', taskbar);

          // Map the template's placement choices onto the design's existing docks.
          const dock = placement === 'header' || placement === 'icon' ? 'titlebar'
            : placement === 'link' ? 'taskbar' : 'actions';
          const parent = dock === 'titlebar' ? titlebar : dock === 'taskbar' ? tools : actions;
          _c.submit = placement ? endBtn(parent, `wb-btn sel primary wb-end-${dock}`, placement === 'icon' ? '✓' : label) : null;
          if (placement && dock === 'titlebar') titlebar.classList.add('wb-titlebar-end');
          if (!placement || dock !== 'actions') actions.classList.add('wb-actions-secondary');
          for (const text of decoys) gadget(_c, tools, text, 'wb-end-xtra');
          if (collide) gadget(_c, tools, collide.text, 'wb-end-xtra', true);
        },
        'frame.floating': () => () => {},
      },
    },
  });
})();
