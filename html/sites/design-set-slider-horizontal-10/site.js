/* Windows 3.1-style Audio Settings Utility: teal desktop, navy title bars, beveled controls. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'survey-drawer overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title =
      { chat: 'Feedback', cookie: 'Privacy', toast: 'Notice', promo: 'Information', banner: 'Service Notice' }[
        ctx.kind
      ] || 'Notice';
    const bar = u.el('div', 'dlg-title', el);
    u.el('span', '', bar, title);
    const x = u.el('button', 'dlg-x', bar, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'dlg-body', el);
    u.el(
      'p',
      'survey-intro',
      body,
      {
        chat: 'Please rate this utility. Thank you for your feedback.',
        cookie: 'This utility can remember your display preferences.',
        toast: 'Your settings are ready for editing.',
        promo: 'Discover more multimedia utilities.',
        banner: 'Audio services are available.',
      }[ctx.kind] || 'Notice',
    );
    const dismiss = u.el('button', 'primary survey-close', body, ctx.kind === 'cookie' ? 'Reject optional' : 'OK');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function tbtn(parent, u, txt) {
    const b = u.el('span', 'tbtn', parent);
    b.textContent = txt;
    return b;
  }
  function speaker(parent, u) {
    const s = u.svg('svg', { viewBox: '0 0 20 20', class: 'spk', 'aria-hidden': 'true' }, parent);
    u.svg('path', { d: 'M2 7h4l5-4v14l-5-4H2Z', fill: '#c0c0c0', stroke: '#000' }, s);
    u.svg('path', { d: 'M3 8h2v4H3M7 7l3-2v10', fill: 'none', stroke: '#fff', 'stroke-width': 0.8 }, s);
    u.svg(
      'path',
      { d: 'M13 7q2 3 0 6M15 5q4 5 0 10M17 3q5 7 0 14', fill: 'none', stroke: '#000', 'stroke-width': 1.4 },
      s,
    );
    u.svg(
      'path',
      { d: 'M12 6q3 4 0 8M14 4q5 6 0 12M16 2q6 8 0 16', fill: 'none', stroke: '#fff', 'stroke-width': 0.8 },
      s,
    );
  }
  function drawDesktop(u) {
      // palette
      const pal = u.el('div', 'palette', document.body);
      const pt = u.el('div', 'titlebar small', pal);
      u.el('span', 'tt', pt, 'Tools');
      const pc = u.el('div', 'tctl', pt);
      tbtn(pc, u, '✕');
      const pb = u.el('div', 'pbody', pal);
      const icons = {
        Pointer: 'M5 2v18l4-4 3 7 3-1-3-7h6Z',
        Zoom: 'M10 3a6 6 0 1 0 0 12a6 6 0 0 0 0-12ZM14 14l7 7',
        Pan: 'M8 12V5Q8 3 10 4V11V3Q12 1 13 3V11V4Q15 2 16 5V12V7Q18 5 19 8V14L16 21H10L5 16L3 12Q2 9 4 9L8 12Z',
      };
      ['Pointer', 'Zoom', 'Pan'].forEach((n, i) => {
        const t = u.el('div', 'tool', pb);
        const ic = u.el('span', 'ticon' + (i === 0 ? ' sel' : ''), t);
        const s = u.svg('svg', { viewBox: '0 0 24 24' }, ic);
        u.svg(
          'path',
          {
            d: icons[n],
            fill: i === 1 ? '#d8f0f5' : '#fff',
            stroke: '#000',
            'stroke-width': 1.3,
            'stroke-linejoin': 'round',
          },
          s,
        );
        if (i === 1) {
          u.svg('path', { d: 'M15 15l6 6', stroke: '#000', 'stroke-width': 3 }, s);
          u.svg('path', { d: 'M6 8q1-3 4-3', stroke: '#fff', fill: 'none' }, s);
        }
        u.el('span', 'tl', t, n);
      });
      // taskbar
      const bar = u.el('div', 'taskbar', document.body);
      const pm = u.el('div', 'tk pm', bar);
      const logo = u.svg('svg', { viewBox: '0 0 32 32', class: 'logo', 'aria-hidden': 'true' }, pm);
      u.svg('path', { d: 'M2 4L28 1L30 28L3 31Z', fill: '#000', stroke: '#fff' }, logo);
      for (const [x, y, c] of [
        [7, 8, '#f54c56'],
        [17, 6, '#1ba641'],
        [8, 19, '#5275ff'],
        [18, 18, '#ffff28'],
      ]) {
        u.svg('path', { d: `M${x} ${y}l6-1v8l-6 1Z`, fill: c, stroke: '#fff', 'stroke-width': 0.6 }, logo);
        u.svg('path', { d: `M${x + 2} ${y}v8M${x} ${y + 3}l6-1`, stroke: '#000', 'stroke-width': 0.7 }, logo);
      }
      u.svg('path', { d: 'M2 9h3M1 13h5M2 17h4M3 22h4M4 26h3', stroke: '#c0c0c0', 'stroke-width': 2 }, logo);
      u.el('span', '', pm, 'Program Manager');
      const au = u.el('div', 'tk au', bar);
      speaker(au, u);
      u.el('span', '', au, 'Audio Settings Utility');
      u.el('div', 'clock', bar, '10:24 AM');
  }
  // The shared sections own the instruction and every episode end control.
  function formatInstruction(el, display) {
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    el.classList.add('instruction');
    el.dataset.display = display;
    const cut = text.indexOf('. ');
    const first = document.createElement('div');
    first.className = 'i1';
    first.textContent = cut > 0 ? text.slice(0, cut + 1) : text;
    el.appendChild(first);
    if (cut > 0) {
      const second = document.createElement('div');
      second.className = 'i2';
      second.textContent = text.slice(cut + 2);
      el.appendChild(second);
    }
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated note area in this window at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('desk', `instruction-${_c.display}`);
      document.body.classList.toggle('finish-mode', !!_c.ctx.finish);
      const win = u.el('div', 'win', document.body);
      const tb = u.el('div', 'titlebar', win);
      speaker(tb, u);
      u.el('span', 'tt', tb, 'Audio Settings Utility');
      const ctl = u.el('div', 'tctl', tb);
      tbtn(ctl, u, '_');
      tbtn(ctl, u, '□');
      tbtn(ctl, u, '✕');
      const menu = u.el('div', 'menubar', win);
      for (const m of ['File', 'Settings', 'Help']) {
        const item = u.el('span', '', menu);
        u.el('u', '', item, m[0]);
        item.append(document.createTextNode(m.slice(1)));
      }
      const body = u.el('div', 'winbody', win);
      drawDesktop(u);
      Object.assign(_c, { win, menu, body, header: body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instr-box');
        const text = _c.util.el('div', '', null, note.textContent);
        note.textContent = '';
        note.appendChild(text);
        formatInstruction(text, _c.display);
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instr-box', 'instr-panel');
        formatInstruction(panel.querySelector('.ref-panel-text'), _c.display);
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const group = u.el('div', 'group g-speed', _c.body);
      u.el('span', 'legend', group, 'Playback Speed');
      const stage = u.el('main', 'record-stage', group);
      stage.dataset.role = 'stage';
      const pv = u.el('div', 'group g-prev', _c.body);
      u.el('span', 'legend', pv, 'Preview');
      const prow = u.el('div', 'prow', pv);
      const play = u.el('button', 'bevel play', prow, 'Play');
      play.type = 'button';
      u.el('div', 'progress', prow);
      Object.assign(_c, { stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instr-box', 'instr-toast');
        formatInstruction(note.querySelector('.ref-note-text'), _c.display);
        const close = note.querySelector('.ref-note-x');
        close.classList.add('instruction-close');
        close.textContent = 'Close';
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('winfoot');
      _c.body.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const reset = _c.util.el('button', 'bevel reset', null, 'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      foot.prepend(reset);
      _c.foot = foot;
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#007d83', panel: '#c0c0c2', fg: '#000000', muted: '#808080', line: '#404040' };
  env.site({
    name: 'design-set-slider-horizontal-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-slider-horizontal-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000080'],
      LOW_ACCENTS: ['#000080'],
      parts,
    },
  });
})();
