// Industrial extranet frame; shared controls and episode chrome come from site/base.
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = { close: 'M5 5L21 21M21 5L5 21' };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7 }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to the Partner Extranet', 'Take a quick tour of the Navigation Control Panel.', 'Start tour', 'Skip tour'],
        cookie: ['Site preferences', 'Allow optional cookies on this extranet?', 'Accept optional', 'Reject optional'],
        toast: ['Session notice', 'Your session is active until 11:30.', null, 'Dismiss'],
        promo: ['Equipment bulletin', 'New service documentation is available.', 'Show details', 'Not now'],
        banner: ['Scheduled maintenance', 'The extranet will be unavailable Sunday 02:00.', null, 'Dismiss'],
      }[ctx.kind];
      u.el('h2', '', el, content[0]);
      const close = u.el('button', 'bubble-close', el);
      close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 25);
      close.onclick = () => ctx.dismiss('close');
      const message = u.el('p', '', el, content[1]);
      const actions = u.el('div', 'tour-actions', el);
      if (content[2]) {
        const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
        primary.onclick = () => {
          if (ctx.kind === 'cookie') ctx.dismiss('accept');
          else { message.textContent = 'Click and drag the dial. Use the task instruction to choose the target setting.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }

  // Keep the original classes while using the template's instruction and control behavior.
  function taskNote(note, mode, util) {
    note.className = 'task-note note-' + mode;
    const title = note.querySelector('.ref-panel-title');
    if (title) title.remove();
    const heading = util.el('h3', '', null, 'Task');
    note.prepend(heading);
    const text = note.querySelector('.ref-instruction, .ref-panel-text, .ref-note-text');
    if (text) text.classList.add('instruction');
  }
  function styleControls(parent, title) {
    for (const button of parent.querySelectorAll('[data-role="submit"]')) {
      button.classList.add(button.tagName === 'A' ? 'end-link' : 'submit-button');
      if (title) button.classList.add('title-submit');
    }
    for (const button of parent.querySelectorAll('[data-role="xtra"]')) button.classList.add('pqs-xtra');
  }

  env.site({
    name: 'design-rotate-object-dial-03',
    template: 'site/base',
    langs: ['en'],
    design: {
      parts: {
        'frame.theme': () => (_c) => {
          const { ctx } = _c;
          Object.assign(_c, { rng: ctx.rng, util: ctx.util, content: ctx.content });
        },
        'frame.layout': (base) => (_c) => {
          base(_c);
          _c.display = _c.ctx.display;
          document.body.className = 'metro-cube instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util } = _c;
          const mast = util.el('header', 'masthead', document.body);
          util.el('span', 'brand', mast, 'NorthRiver Industrial');
          util.el('span', 'mast-sep', mast);
          util.el('span', 'mast-sub', mast, 'Partner Extranet');
          const links = util.el('div', 'mast-util', mast);
          ['Help', 'Site Map', 'Log Out'].forEach((text, i) => {
            if (i) util.el('span', 'bar', links, '|');
            util.el('a', '', links, text);
          });
          const dlg = util.el('section', 'dialog', document.body);
          const header = util.el('div', 'dlg-title', dlg);
          util.el('span', '', header, 'Navigation Control Panel');
          util.el('span', 'dlg-date', header, 'Apr 14, 1999   10:27');
          Object.assign(_c, { dlg, header });
        },
        'frame.nav': () => (_c) => {
          const { util } = _c;
          const tabs = util.el('nav', 'tabs', document.body);
          ['Operations', 'Equipment', 'Reports', 'Documentation', 'Support'].forEach((text, i) => {
            const button = util.el('button', 'tab' + (i ? '' : ' active'), tabs, text);
            button.type = 'button';
          });
        },
        'frame.instruction': (base) => (_c) => {
          if (_c.display !== 'header') return;
          const note = _c.util.el('aside', '', document.body);
          base({ ..._c, header: note });
          taskNote(note, 'header', _c.util);
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          styleControls(_c.headerTools, true);
          _c.header.append(_c.header.querySelector('.dlg-date'));
        },
        'frame.body': () => (_c) => {
          const body = _c.util.el('div', 'dlg-body', _c.dlg);
          Object.assign(_c, { body });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const note = _c.body.querySelector('.ref-panel');
          if (note) {
            taskNote(note, 'panel', _c.util);
            _c.util.el('p', 'task-helper', note, 'Adjust the dial in the panel.');
            document.body.append(note);
          }
        },
        'frame.stage': () => (_c) => {
          const { body, util } = _c;
          const dialPanel = util.el('div', 'panel dial-panel', body);
          util.el('div', 'panel-h', dialPanel, 'Heading Dial');
          const stage = util.el('main', 'dial-stage', dialPanel);
          stage.dataset.role = 'stage';
          const side = util.el('div', 'side', body);
          const current = util.el('div', 'panel', side);
          util.el('div', 'panel-h', current, 'Current Heading');
          const curBox = util.el('div', 'val-box', current);
          curBox.id = 'cur-heading';
          const mode = util.el('div', 'panel', side);
          util.el('div', 'panel-h', mode, 'Control Mode');
          util.el('div', 'val-box', mode, 'Manual');
          const status = util.el('div', 'panel status', side);
          util.el('div', 'panel-h', status, 'Status');
          util.el('p', '', status, 'Drag the handle to adjust the dial.');
          Object.assign(_c, { stage });
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) taskNote(note, 'toast', _c.util);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { dlg, util } = _c;
          const foot = document.querySelector('.ref-foot') || util.el('div', '', dlg);
          foot.className = 'dlg-foot';
          const filler = foot.querySelector('.ref-foot-text');
          if (filler) filler.remove();
          const meta = util.el('span', 'meta', null, 'Vessel: NR-417   |   Mode: Manual   |   Unit: Degrees');
          foot.prepend(meta);
          const buttons = foot.querySelector('.ref-tools') || util.el('div', '', foot);
          buttons.classList.add('btns');
          styleControls(buttons, false);
          const reset = util.el('button', 'reset-button', buttons, 'Reset');
          reset.type = 'button';
          dlg.append(foot);
          const pageFoot = util.el('footer', 'page-foot', document.body);
          util.el('span', '', pageFoot, 'NorthRiver Industrial   |   Confidential');
          util.el('span', 'right', pageFoot, 'Terms of Use   |   Privacy   |   Contact');
        },
        overlay: () => drawOverlay,
      },
    },
  });
})();
