(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function svg(parent, html, vb) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', vb || '0 0 64 64');
    s.setAttribute('fill', '#e8e8e8');
    s.setAttribute('stroke', '#000');
    s.setAttribute('stroke-width', '3');
    s.innerHTML = html;
    parent.appendChild(s);
    return s;
  }
  function fitInstruction(c) {
    const instruction = c.contentBox.querySelector('.ds-instruction');
    if (!instruction) return;
    const n = instruction.textContent.length;
    if (n > 90) instruction.style.setProperty('--fit', Math.sqrt(90 / n).toFixed(4));
    const line = parseFloat(getComputedStyle(instruction).lineHeight);
    const scale = parseFloat(getComputedStyle(c.contentBox.querySelector('h3')).lineHeight) / 33;
    const extra = Math.max(0, instruction.getBoundingClientRect().height - line);
    c.contentBox.style.setProperty('--field-top-space', Math.max(8 * scale, 45 * scale - extra) + 'px');
  }
  const parts = {
    'frame.layout': (base) => (c) => {
      base(c);
      c.display = c.ctx.display || 'header';
    },
    'frame.placement': (base) => (c) => {
      base(c);
      c.nav = false;
      c.sidebar = false;
      c.wantFooter = true;
    },
    'frame.header': () => (c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = c.util;
      const top = u.el('header', 'ds-top', document.body);
      svg(top, '<path d="M26 3 V26 L22 38 L7 54 V60 H15 L29 39 V3 M32 3 V60 M35 3 V39 L49 60 H57 V54 L42 38 L38 26 V3" fill="none"/>').setAttribute('class', 'ds-logo');
      'Desk|File|Edit|Options'.split('|').forEach((t) => u.el('span', '', top, t));
      u.el('span', 'ds-sp', top);
      u.el('span', 'ds-clock', top, 'Mon 27 Jan 1986   10:24');
      u.el('span', 'ds-batt', top);
      const desktop = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', desktop);
      const i1 = u.el('div', '', rail);
      svg(i1, '<path d="M5 8 H54 L59 13 V55 H5 Z" fill="#bbb"/><path d="M15 8 H47 V25 H15 Z" fill="#3dbf3a"/><path d="M35 10 H42 V20 H35 Z" fill="#eee" stroke-width="2"/><path d="M13 32 H49 L52 36 V55 H11 V36 Z" fill="#eee"/><path d="M28 40 H34 V48 H28 Z M29 43 H33" stroke-width="2"/><path d="M54 13 V55" fill="none"/>');
      u.el('div', '', i1, 'A:\\\nFloppy');
      const i2 = u.el('div', '', rail);
      svg(i2, '<path d="M5 33 L18 12 H59 L47 33 Z" fill="#bdbdbd"/><path d="M5 33 H47 V52 H5 Z" fill="#e8e8e8"/><path d="M47 33 L59 12 V41 L47 52 Z" fill="#999"/><path d="M11 36 H18 V39 H12 V46 H18 M31 38 H41 V46 H31 Z" fill="none" stroke-width="3"/><path d="M19 16 H48 M54 28 V39 L50 44" stroke="#fff" stroke-width="2"/>');
      u.el('div', '', i2, 'B:\\\nHard Disk');
      const i3 = u.el('div', '', rail);
      svg(i3, '<path d="M23 7 V3 H39 V7 M12 17 H51 V58 L47 62 H17 L12 58 Z" fill="#bdbdbd"/><path d="M8 8 H55 V14 H8 Z" fill="#e8e8e8"/><path d="M16 18 V57 H47 V18" fill="#eee"/><path d="M22 23 V55 M32 23 V55 M42 23 V55" fill="none" stroke-width="4"/><path d="M10 15 H54" fill="none"/>');
      u.el('div', '', i3, 'Trash');
      const win = u.el('div', 'ds-window', desktop);
      const tb = u.el('div', 'ds-titlebar', win);
      const gadget = u.el('span', 'ds-gadget', tb);
      svg(gadget, '<path d="M14 18 H50 V26 H14 Z M24 29 H40 V36 H24 Z M32 26 V50 M24 50 H40" fill="#000"/>');
      const tt = u.el('div', 'ds-ttl', tb);
      u.el('span', '', tt, 'Account Setup');
      const minimize = u.el('span', 'ds-gadget', tb);
      svg(minimize, '<path d="M10 12 H54 M10 49 H54" fill="none" stroke-width="5"/>');
      const close = u.el('span', 'ds-gadget', tb);
      svg(close, '<path d="M14 14 L50 50 M50 14 L14 50" fill="none" stroke-width="5"/>');
      const up = u.el('section', 'ds-upper', win);
      u.el('h3', '', up, 'Account Setup');
      const info = u.el('div', 'ds-info', up);
      [['User:', 'New User'], ['Account type:', 'Standard'], ['Location:', 'A:\\USERS'], ['Disk space:', '2 MB (estimated)']].forEach((r) => {
        u.el('span', '', info, r[0]);
        u.el('span', '', info, r[1]);
      });
      const doc = u.el('div', 'ds-doc', up);
      svg(doc, '<path d="M8 3 H43 L57 17 V61 H8 Z M43 3 V17 H57"/><path d="M15 12 H36 M15 17 H40 M15 23 H50 M15 28 H50 M15 33 H50 M15 38 H50 M15 43 H50 M15 48 H50 M15 53 H35" fill="none" stroke-width="2"/>');
      u.el('div', '', doc, 'A new account will be created\nwith the settings shown.');
      const contentBox = u.el('div', 'ds-lower', win);
      u.el('h3', '', contentBox, 'Set Password');
      Object.assign(c, { header: contentBox, contentBox, tb, minimize });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (c) => {
      base(c);
      const note = c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (c) => {
      const header = c.header;
      c.header = c.tb;
      base(c);
      c.header = header;
      c.tb.insertBefore(c.headerTools, c.minimize);
    },
    'frame.body': () => (c) => {
      c.body = c.util.el('div', 'ds-main', c.contentBox);
    },
    'frame.panel': (base) => (c) => {
      base(c);
      const panel = c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (c) => {
      c.stage = c.util.el('main', 'ds-stage', c.body);
    },
    'frame.toast': (base) => (c) => {
      base(c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        c.contentBox.insertBefore(note, c.body);
      }
    },
    'frame.footer': (base) => (c) => {
      base(c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      c.contentBox.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      const cursor = c.util.el('div', 'ds-cursor', c.contentBox);
      svg(cursor, '<path d="M4 3 V49 L17 38 L28 59 L36 55 L25 34 H42 Z" fill="#000" stroke="#fff" stroke-width="2"/>');
      c.foot = foot;
    },
    'frame.floating': (base) => (c) => {
      base(c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) c.foot.appendChild(dock);
      fitInstruction(c);
      if (c.ctx.finish) {
        const scale = parseFloat(getComputedStyle(c.contentBox.querySelector('h3')).lineHeight) / 33;
        const deficit = 134 * scale - c.stage.getBoundingClientRect().height;
        if (deficit > 0) c.foot.style.height = Math.max(0, c.foot.getBoundingClientRect().height - deficit) + 'px';
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  const palette = { bg: '#38bf34', panel: '#e6e6e6', fg: '#000000', muted: '#777777', line: '#000000' };
  env.site({
    name: 'design-type-text-password-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-password-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#38bf34'],
      LOW_ACCENTS: ['#38bf34'],
      parts,
    },
  });
})();
