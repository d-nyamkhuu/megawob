/* Pixel-craft 2005 settings utility: briefing column left, System Settings window right. */
(function () {
  'use strict';
  const NAVY = '#0f2a5a';
  function icon(parent, kind, cls) {
    const u = env.util;
    const s = u.svg('svg', {viewBox: '0 0 24 24', class: 'ico ' + (cls || ''), 'aria-hidden': 'true'}, parent);
    const r = (x, y, w, h, f) => u.svg('rect', {x, y, width: w, height: h, fill: f || 'currentColor'}, s);
    if (kind === 'clip') {
      r(3, 3, 18, 20, '#6d98b8'); r(4, 3, 15, 18, '#d9e8e9'); r(5, 4, 13, 16, '#f3f7ee'); r(8, 0, 8, 5, '#7596b0'); r(8, 0, 7, 3, '#f5fcf2');
      for (const y of [7, 11, 15, 18]) r(6, y, 10, 1.5, '#214f71');
    } else if (kind === 'gear') {
      u.svg('path', {d:'M9 1H15V4H18V3H21V6H20V9H23V15H20V18H21V21H18V20H15V23H9V20H6V21H3V18H4V15H1V9H4V6H3V3H6V4H9ZM10 7H8V9H7V15H9V17H15V15H17V9H15V7Z',fill:'currentColor','fill-rule':'evenodd','shape-rendering':'crispEdges'},s);
    } else if (kind === 'bars') {
      r(1, 13, 6, 10, NAVY);r(8, 7, 6, 16, NAVY);r(15, 1, 6, 22, NAVY);
      r(3, 15, 2, 6, '#dceef5');r(10, 9, 2, 12, '#dceef5');r(17, 3, 2, 18, '#dceef5');
    } else if (kind === 'monitor') {
      r(1, 2, 22, 16); r(2,3,20,14,'#6a96ba'); r(4, 5, 16, 10, '#99c9e4');r(5,6,14,1,'#d6ecf5');r(5,7,1,7,'#b9e0f3');r(9, 18, 6, 3); r(6, 21, 12, 2);
    } else if (kind === 'speaker') {
      r(1, 8, 6, 9);r(3,10,2,5,'#8cbbd6');r(7,6,3,13);r(10,3,3,19);r(8,8,1,9,'#719dbb');
      u.svg('path',{d:'M16 7H18V9H19V15H18V17H16V15H17V9H16ZM20 3H22V6H23V9H24V15H23V18H22V21H20V18H21V15H22V9H21V6H20Z',fill:'currentColor','shape-rendering':'crispEdges'},s);
    } else if (kind === 'globe') {
      u.svg('circle', {cx: 12, cy: 12, r: 10, fill: 'none', stroke: 'currentColor', 'stroke-width': 2}, s);
      u.svg('ellipse', {cx:12,cy:12,rx:5,ry:10,fill:'none',stroke:'currentColor','stroke-width':1.4}, s);
      r(11, 2, 1.4, 20); r(2, 11, 20, 1.6); r(5, 6, 14, 1.4); r(5, 16, 14, 1.4);
    } else if (kind === 'reset') {
      u.svg('path', {d: 'M6 5H9V3H16V4H19V6H21V9H22V15H20V18H18V20H15V22H8V21H5V19H3V17H7V18H9V19H14V18H17V16H18V10H17V8H15V6H10V7H8V10H2V4H5V7Z', fill:'currentColor','shape-rendering':'crispEdges'}, s);
    } else if (kind === 'info') {
      u.svg('path', {d:'M8 1H16V2H19V5H21V8H23V16H21V19H18V22H7V20H4V17H2V8H4V5H7V2H8Z',fill:'#2678a9',stroke:NAVY,'stroke-width':1},s);
      r(6,5,2,11,'#4ba9d4');r(8,3,7,2,'#77b7da');r(17,7,3,10,'#1a6491');r(9,10,5,2,'#fff');r(11,11,3,7,'#fff');r(9,18,7,1,'#fff');r(11,6,3,2,'#fff');
    } else if (kind === 'gauge') {
      s.setAttribute('viewBox','0 0 36 24');s.setAttribute('shape-rendering','crispEdges');
      u.svg('path',{d:'M1 23V15H2V12H3V9H5V7H7V5H10V3H14V2H23V3H27V5H30V7H32V10H34V14H35V23H30V16H29V13H27V10H24V8H12V9H9V11H7V14H6V23Z',fill:'#738ba5',stroke:NAVY,'stroke-width':1},s);
      u.svg('path',{d:'M3 21V15H4V12H6V9H8V7H11V5H15V4H23V5H27V7H29V9H31V13H33V21H31V15H30V12H28V10H25V8H12V9H9V11H7V14H5V21Z',fill:'#148d98'},s);
      u.svg('path',{d:'M3 20V15H4V12H6V9H8V7H11V5H15V4H22',fill:'none',stroke:'#b2d5e1','stroke-width':1},s);
      for(const [x,y] of [[7,10],[11,6],[18,4],[25,6],[29,10]])r(x,y,1,2,'#c2e6e4');
      u.svg('path',{d:'M17 17H19L28 10L23 17L20 19V21H16V20H15V18H17Z',fill:NAVY},s);r(17,18,1.5,1.5,'#def2e9');
    }
    return s;
  }
  env.icon = icon;
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'px-dialog overlay-' + ctx.kind, document.body); el.setAttribute('role', 'dialog');
    const survey = ctx.kind === 'chat';
    const title = {chat: 'Quick Survey', cookie: 'Privacy Notice', toast: 'System Notice', promo: 'Upgrade Available', banner: 'Service Notice'}[ctx.kind];
    const bar = u.el('div', 'dlg-bar', el); u.el('span', '', bar, title);
    const x = u.el('button', 'dlg-x', bar, '×'); x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'dlg-body', el);
    if (survey) {
      u.el('p', '', body, 'How easy was this utility to use?');
      const choices = u.el('div', 'survey-choices', body);
      ['Very easy', 'Somewhat easy', 'Somewhat difficult', 'Very difficult'].forEach((label) => {
        const row = u.el('label', '', choices); const radio = u.el('input', '', row); radio.type = 'radio'; radio.name = 'ease'; radio.value = label; u.el('span', '', row, label);
      });
    } else {
      u.el('p', '', body, {cookie: 'This utility can remember your display preferences.', toast: 'Your settings are ready for editing.', promo: 'A newer driver pack is available.', banner: 'System services are running normally.'}[ctx.kind]);
    }
    const dismiss = u.el('button', 'px-btn primary', body, survey ? 'Close survey' : ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss'); dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  const palette = { bg: '#d3dfe3', panel: '#faf6e6', fg: '#0b2452',
    muted: '#57728e', line: '#8aa0bd' };

  env.site({
    name: 'design-set-slider-horizontal-07',
    template: 'site/base',
    design: {
      THEMES: { pixel: palette }, LOW_THEME: palette,
      ACCENTS: ['#008c98'], LOW_ACCENTS: ['#008c98'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // Every mode fits the existing briefing column, including at small viewports.
          _c.display = _c.ctx.display || 'header';
          document.body.className = `px instruction-${_c.display}`;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const left = u.el('aside', 'px-left', document.body);
          const lt = u.el('div', 'px-title', left);
          icon(lt, 'clip', 'ti'); u.el('span', '', lt, 'Task');
          const leftBody = u.el('div', 'px-left-body', left);
          const instructionSlot = u.el('div', 'px-instruction-slot', leftBody);
          u.el('hr', '', leftBody);
          u.el('p', 'brief-setting', leftBody, 'Use the controls on the right to configure performance settings.');
          u.el('p', '', leftBody, 'Use only the slider handle to move it. Do not click the track.');
          u.el('p', 'brief-readout', leftBody, 'The Current Value panel displays the setting as you adjust it.');
          const extras = u.el('div', 'px-extras', leftBody);

          const win = u.el('main', 'px-win', document.body);
          const titlebar = u.el('div', 'px-title', win);
          icon(titlebar, 'gear', 'ti'); u.el('span', '', titlebar, 'System Settings');
          const windowButtons = u.el('div', 'win-btns', titlebar);
          for (const c of ['min', 'max', 'close']) {
            const b = u.el('i', 'wbtn ' + c, windowButtons); u.el('b', '', b);
          }
          Object.assign(_c, { header: instructionSlot, instructionSlot, extras, win, titlebar, windowButtons });
        },
        'frame.nav': () => (_c) => {
          const { util: u, win } = _c;
          const tabs = u.el('div', 'px-tabs', win);
          [['Performance', 'bars'], ['Display', 'monitor'], ['Audio', 'speaker'], ['Network', 'globe']].forEach(([t, k], i) => {
            const tab = u.el('div', 'px-tab' + (i === 0 ? ' on' : ''), tabs);
            icon(tab, k); u.el('span', '', tab, t);
          });
        },
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const instruction = _c.instructionSlot.querySelector('.ref-instruction');
          if (instruction) instruction.className = 'instruction';
          _c.instructionSlot.querySelector('.ref-spacer')?.remove();
          _c.header = _c.titlebar;
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          // Keep the template's event handling; only dress the controls in pixel chrome.
          const { decoyBtn, endBtn } = _c;
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.className = 'px-btn extra';
          };
          _c.endBtn = (parent, cls, text) => {
            const b = endBtn(parent, cls, text);
            const where = _c.placement === 'icon' ? 'header' : _c.placement;
            b.className = 'px-btn primary end-' + where;
            return b;
          };
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.windowButtons.before(_c.headerTools);
          for (const b of [..._c.headerTools.querySelectorAll('[data-role="xtra"]')]) _c.extras.append(b);
          if (_c.submit) _c.titlebar.classList.add('has-end');
        },
        'frame.body': () => (_c) => {
          // The template's instruction panel belongs in the left briefing column.
          _c.body = _c.instructionSlot;
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.instructionSlot.querySelector('.ref-panel');
          if (panel) panel.className = 'instruction px-instruction-panel';
        },
        'frame.stage': () => (_c) => {
          const stage = _c.util.el('section', 'px-panel', _c.win);
          stage.dataset.role = 'stage';
          Object.assign(_c, { stage });
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.className = 'instruction';
            _c.instructionSlot.append(note);
            const close = note.querySelector('.ref-note-x');
            close.className = 'instruction-close';
            close.textContent = _c.closeLabel;
          }
        },
        'frame.footer': (base) => (_c) => {
          // The settings utility always has an action bar, even in finish mode.
          _c.wantFooter = true;
          base(_c);
          const bar = document.querySelector('.ref-foot');
          bar.className = 'px-actions';
          bar.querySelector('.ref-foot-text').remove();
          _c.win.append(bar);
          const tools = bar.querySelector('.ref-tools');
          for (const b of [...tools.querySelectorAll('[data-role="xtra"]')]) _c.extras.append(b);
          const reset = _c.util.el('button', 'px-btn reset');
          reset.type = 'button'; reset.dataset.action = 'reset';
          icon(reset, 'reset'); _c.util.el('span', '', reset, 'Reset');
          bar.prepend(reset);
          const applyLabel = _c.label === 'Apply' ? 'Help' : 'Apply';
          _c.decoyBtn(bar, applyLabel);
          const apply = bar.lastElementChild;
          apply.className = 'px-btn apply';
          apply.setAttribute('aria-disabled', 'true');
          apply.textContent = '';
          icon(apply, 'gear'); _c.util.el('span', '', apply, applyLabel);
          bar.insertBefore(apply, tools);
          Object.assign(_c, { bar });
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.bar.append(dock);
        },
        // These dialogs are drawn in the same pixel style as the settings window.
        overlay: () => drawOverlay,
      },
    },
  });
})();
