// DocRead's notebook frame on the shared site template.
(function () {
  'use strict';

  const palette = { bg: '#e8f2ec', panel: '#fff', fg: '#1d2a24', muted: '#4f5f57', line: '#c5d8cd' };
  const section = (u, parent, cls, title) => {
    const panel = u.el('section', 'dr-panel ' + cls, parent);
    u.el('h2', 'dr-bar', panel, title);
    return panel;
  };
  const briefLines = (u, note, instruction, ctx, label) => {
    const intro = u.el('div', 'dr-line', note, 'Read the paragraphs below.');
    note.prepend(intro);
    instruction.classList.add('instruction');
    u.el('div', 'dr-line', note, 'Drag across text to select it' + (ctx.finish ? '.' : `, then press ${label}.`));
  };

  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      document.body.className = 'design docread';
      _c.root.style.setProperty('--font', 'Arial, Helvetica, sans-serif');
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This frame has room for the right-hand brief even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
    },
    'frame.header': () => (_c) => {
      const { ctx, display, util: u } = _c;
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head dr-head', shell);
      u.el('span', 'dr-brand', head, 'DocRead');
      u.el('span', 'dr-ws', head, 'Workspace');
      u.el('span', 'dr-meta', head, 'Project: Training Set A   |   User: analyst01   |   May 6, 2000');
      const grid = u.el('div', 'dr-grid', shell);
      const left = u.el('div', 'dr-left', grid);
      const right = u.el('div', 'dr-right', grid);
      let header = u.el('div');
      if (display === 'header') header = u.el('section', 'task-note', section(u, left, 'dr-brief', 'Task Brief'));
      const reading = section(u, left, 'dr-reading', 'Reading Task');
      const tabs = u.el('div', 'dr-tabs', reading);
      ['1', '2', '3'].forEach((text, i) => {
        const button = u.el('button', 'dr-tab' + (i === 0 ? ' on' : ''), tabs, text);
        button.type = 'button';
        button.onclick = () => {
          tabs.querySelectorAll('.dr-tab').forEach((tab) => tab.classList.remove('on'));
          button.classList.add('on');
        };
      });
      const clear = u.el('button', 'clear dr-clear', tabs, 'Clear Selection');
      clear.type = 'button';
      clear.onclick = () => env.widgetDef.clear?.();
      Object.assign(_c, { shell, left, right, header, reading, tabs, body: right });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      if (_c.display === 'header') {
        briefLines(_c.util, _c.header, _c.header.querySelector('.ref-instruction'), _c.ctx, _c.label);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.tabs.append(_c.headerTools);
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const { ctx, right, util: u } = _c;
      const panel = right.querySelector('.ref-panel');
      if (panel) {
        panel.className = 'dr-panel dr-brief';
        right.prepend(panel);
        const title = panel.querySelector('.ref-panel-title');
        title.className = 'dr-bar';
        title.textContent = 'Task Brief';
        const instruction = panel.querySelector('.ref-panel-text');
        instruction.className = 'instruction';
        const note = u.el('section', 'task-note instruction-panel', panel);
        note.append(instruction);
        briefLines(u, note, instruction, ctx, _c.label);
      }
      const progress = section(u, right, 'dr-progress', 'Task Progress');
      const steps = u.el('div', 'dr-steps', progress);
      ['Read', 'Select', 'Submit'].forEach((text, i) => {
        const step = u.el('div', 'dr-step' + (i === 0 ? ' on' : ''), steps);
        u.el('span', 'dr-dot', step, String(i + 1));
        u.el('span', 'dr-lbl', step, text);
      });
      const status = section(u, right, 'dr-status', 'Status');
      u.el('p', '', status, 'Waiting for your selection...');
      const tips = section(u, right, 'dr-tips', 'Tips');
      const list = u.el('ul', '', tips);
      for (const text of ['Drag across text to select it.', 'Read every sentence in each paragraph.', 'Selections are highlighted.']) u.el('li', '', list, text);
      Object.assign(_c, { tips, status });
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage', _c.reading);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.querySelector('.ref-foot');
      if (footer) {
        footer.querySelector('.ref-foot-text').remove();
        _c.tips.append(footer);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.tips.append(dock);
    },
    'frame.end': (base) => (_c) => {
      const { submit, placement } = _c;
      document.querySelectorAll('.ref-xtra').forEach((button) => button.classList.add('dr-xtra'));
      if (submit) {
        const where = placement === 'header' || placement === 'icon' ? 'toolbar' : placement;
        submit.classList.add('submit', 'dr-submit', 'dr-end-' + where);
        if (placement === 'link') _c.status.append(submit);
      }
      return base(_c);
    },
    overlay: (base) => (ctx) => {
      if (ctx.kind !== 'promo') return base(ctx);
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-promo', document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const bar = u.el('div', 'dr-mbar', box);
      u.el('h3', '', bar, 'Software Update Available');
      const close = u.el('button', 'dr-mx', bar, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Close');
      close.onclick = () => ctx.dismiss('close');
      const body = u.el('div', 'dr-mbody', box);
      u.el('span', 'dr-micon', body, '!');
      u.el('p', '', body, 'A new version of DocRead is available (v2.1). We recommend updating now for the latest improvements and security fixes.');
      const buttons = u.el('div', 'dr-mbtns', box);
      const update = u.el('button', 'dr-upd', buttons, 'Update now');
      update.type = 'button';
      update.onclick = () => env.log('update-now', {});
      const dismiss = u.el('button', 'dismiss', buttons, 'Remind me later');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: 0 };
    },
  };

  env.site({
    name: 'design-select-text-sentence-11',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    langs: ['en'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { light: palette }, LOW_THEME: palette,
      ACCENTS: ['#1f5b45'], LOW_ACCENTS: ['#1f5b45'],
      parts,
    },
  });
})();
