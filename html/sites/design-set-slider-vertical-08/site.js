// Soft image-adjustment frame, designed on the shared site/base sections.
(function () {
  'use strict';
  function toolbar(u, footer) {
      const tools=u.el('div','tools',footer);
      const icons={
        Brightness:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
        Contrast:'<circle cx="12" cy="12" r="9" stroke-width="1.8"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none"/>',
        Saturation:'<path d="M12 3C9 8 6 11 6 15a6 6 0 0 0 12 0c0-4-3-7-6-12Z"/>',
        Sharpness:'<path d="M12 4 21 20H3Z"/>',
        'Reset All':'<path d="M20 14a8 8 0 1 0-3 6M4 4v5h5"/>'};
      for(const label of ['Brightness','Contrast','Saturation','Sharpness','Reset All']){
        const b=u.el('div','tool'+(label==='Contrast'?' on':''),tools);
        const ic=u.el('span','tool-ic',b);
        ic.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+icons[label]+'</svg>';
        u.el('span','',b,label);
        if(label==='Sharpness')u.el('i','sep',tools);
      }
      u.el('i','sep wide',tools);
  }

  const palette = { bg: '#eef2f8', panel: '#f7f9fd', line: '#d3d9e2',
    muted: '#4b5563', fg: '#1f2733' };

  env.site({
    name: 'design-set-slider-vertical-08',
    template: 'site/base',
    styles: ['site.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css'],
    design: {
      THEMES: { soft: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2a7bf4'],
      LOW_ACCENTS: ['#2a7bf4'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          _c.display = _c.ctx.display;
          document.body.className = `library instruction-${_c.display}`;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const main = u.el('div', 'library-main ref-body', document.body);
          const task = u.el('aside', 'catalog-task', main);
          u.el('div', 'eyebrow', task, 'IMAGE ADJUSTMENT');
          Object.assign(_c, { main, task, header: task });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const instruction = _c.header.querySelector('.ref-instruction');
          if (instruction) instruction.classList.add('instruction');
        },
        'frame.tools': (base) => (_c) => {
          const { task, util: u } = _c;
          const divider = u.el('hr', '', task);
          const heading = u.el('div', 'details-heading', task);
          u.el('h3', '', heading, 'Task Details');
          _c.header = heading;
          base(_c);
          const extras = u.el('div', 'task-extras', task);
          for (const decoy of _c.headerTools.querySelectorAll('.ref-xtra')) {
            decoy.classList.add('task-end-xtra');
            extras.appendChild(decoy);
          }
          if (_c.submit) _c.submit.classList.add('task-end-heading');
          u.el('p', 'briefing', task, 'Use the adjustment panel beside the image. The scale shows the available values, and the readout shows the current setting.');
          u.el('p', 'briefing', task, 'Drag the slider handle to set the value.');
          _c.divider = divider;
        },
        'frame.body': () => (_c) => { _c.body = _c.task; },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.task.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('instruction');
            _c.task.insertBefore(panel, _c.divider);
          }
        },
        'frame.stage': () => (_c) => {
          const { main, util: u } = _c;
          const panel = u.el('div', 'workspace', main);
          const photo = u.el('div', 'photo', panel);
          const stage = u.el('main', 'record-stage', panel);
          stage.dataset.role = 'stage';
          const image = u.el('img', 'photo-image', photo);
          image.src = 'sites/design-set-slider-vertical-08/assets/mountain-lake.webp';
          image.alt = 'Mountain lake';
          _c.stage = stage;
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { ctx, util: u } = _c;
          const footer = document.querySelector('.ref-foot') || u.el('footer', '', document.body);
          const controls = footer.querySelector('.ref-tools');
          const filler = footer.querySelector('.ref-foot-text');
          if (filler) filler.remove();
          footer.className = 'library-footer';
          toolbar(u, footer);
          const actions = u.el('div', 'footer-actions' + (ctx.finish ? ' actions-finish' : ''), footer);
          const preview = u.el('button', 'preview', actions, 'Preview');
          preview.type = 'button';
          if (controls) actions.appendChild(controls);
          const end = controls && controls.querySelector('[data-role="submit"]');
          if (end) end.classList.add(end.tagName === 'A' ? 'task-end-link' : 'primary');
          Object.assign(_c, { footer, actions });
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.actions.appendChild(dock);
            _c.submit.classList.add('primary');
          }
        },
      },
    },
  });
})();
