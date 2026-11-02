/* CalibPro 2.3 motor controller calibration utility: 2004 industrial Linux window, split-level layout. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function chart(parent) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 640 190');
    svg.setAttribute('class', 'resp');
    svg.setAttribute('preserveAspectRatio', 'none');
    const add = (tag, a, txt) => {
      const e = document.createElementNS(NS, tag);
      for (const k in a) e.setAttribute(k, a[k]);
      if (txt) e.textContent = txt;
      svg.appendChild(e);
      return e;
    };
    const X0 = 70,
      X1 = 620,
      Y0 = 8,
      Y1 = 150;
    [1, 10, 100, 1000, 10000].forEach((v, i) => {
      const x = X0 + ((X1 - X0) * i) / 4;
      add('line', { x1: x, y1: Y0, x2: x, y2: Y1, stroke: '#aaa59a', 'stroke-dasharray': '3 3' });
      add('text', { x, y: Y1 + 20, 'text-anchor': 'middle', 'font-size': 13 }, String(v));
    });
    ['100', '10', '1', '0.1'].forEach((t, i) => {
      const y = Y0 + 4 + ((Y1 - Y0 - 4) * i) / 3;
      add('line', { x1: X0 - 4, y1: y, x2: X1, y2: y, stroke: '#c0bbb0', 'stroke-dasharray': '3 3' });
      add('text', { x: X0 - 10, y: y + 4, 'text-anchor': 'end', 'font-size': 13 }, t);
    });
    add('line', { x1: X0, y1: Y0, x2: X0, y2: Y1, stroke: '#333' });
    add('line', { x1: X0, y1: Y1, x2: X1, y2: Y1, stroke: '#333' });
    add('path', {
      d: 'M70 85 C90 77 110 70 130 61 C148 54 164 51 180 55 C202 60 218 64 230 65 C248 67 249 77 265 84 C283 92 293 89 305 88 C323 86 332 97 345 103 C364 111 378 109 390 106 C405 101 414 108 428 115 C447 126 464 118 480 120 C495 119 499 123 515 123 C540 125 550 123 572 127 C591 130 603 127 620 129',
      fill: 'none',
      stroke: '#a01020',
      'stroke-width': 2,
    });
    add('text', { x: 345, y: 183, 'text-anchor': 'middle', 'font-size': 12 }, 'Frequency (Hz)');
    parent.appendChild(svg);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'cp-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const t = u.el(
      'div',
      'cp-dtitle',
      el,
      { cookie: 'Preferences', toast: 'Notice', chat: 'Message', promo: 'Information', banner: 'Service notice' }[
        ctx.kind
      ] || 'Notice',
    );
    const x = u.el('button', 'cp-dx', t, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    u.el('p', '', el, 'The utility can remember display settings for this session.');
    const dismiss = u.el('button', 'cp-btn', el, 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  // Keep template-provided controls in the utility's engraved button style.
  function styleControls(parent, compact) {
    for (const button of parent.querySelectorAll('[data-role="submit"], [data-role="xtra"]')) {
      button.classList.add('cp-btn');
      if (compact) button.classList.add('cp-chrome-btn');
      if (button.dataset.role === 'submit') button.classList.add('primary');
    }
  }
  env.site({
    name: 'design-set-slider-log-10',
    template: 'site/base',
    styles: ['../base/site.css', 'site.css'],
    design: {
      THEMES: { industrial: { bg: '#cbc9c3', panel: '#d0cec8', fg: '#0e0e0d', muted: '#2a2825', line: '#8c877c' } },
      LOW_THEME: { bg: '#cbc9c3', panel: '#d0cec8', fg: '#0e0e0d', muted: '#2a2825', line: '#8c877c' },
      ACCENTS: ['#6e0f26'],
      LOW_ACCENTS: ['#6e0f26'],
      LANGS: ['en'],
      parts: {
        'frame.header': () => (_c) => {
          const { ctx, util: u } = _c;
          const body = document.body;
          body.className = `calibpro instruction-${ctx.display}`;
          const tb = u.el('header', 'cp-title', body);
          u.el('span', 'cp-sys', tb);
          u.el('span', 'cp-ttl', tb, 'CalibPro 2.3  -  Motor Controller Calibration Utility');
          const wb = u.el('span', 'cp-wb', tb);
          ['_', '□', '×'].forEach((c) => u.el('i', '', wb, c));
          const menu = u.el('nav', 'cp-menu', body);
          ['File', 'Device', 'Tools', 'Help'].forEach((m) => {
            const s = u.el('span', '', menu);
            s.innerHTML = `<u>${m[0]}</u>${m.slice(1)}`;
          });
          const top = u.el('section', 'cp-top', body);
          const p1 = u.el('div', 'cp-panel p-dev', top);
          u.el('h3', '', p1, 'Device Overview');
          const kv = u.el('div', 'kv', p1);
          [
            ['Device ID:', 'MC-3178'],
            ['Serial No.:', '8842-6601-22'],
            ['Firmware:', 'v1.4.7'],
            ['Mode:', 'Calibration'],
            ['Status:', 'Ready'],
            ['Last Cal.:', '2004-11-02 14:26:18'],
          ].forEach(([k, v]) => {
            u.el('span', '', kv, k);
            u.el('span', k === 'Status:' ? 'ok' : '', kv, v);
          });
          const p2 = u.el('div', 'cp-panel p-resp', top);
          const h2 = u.el('h3', '', p2, 'Motor Response (Live)');
          u.el('small', '', h2, 'Amplitude (log scale)');
          chart(p2);
          const p3 = u.el('div', 'cp-panel p-key', top);
          u.el('h3', '', p3, 'Key Parameters');
          const kv3 = u.el('div', 'kv', p3);
          [
            ['Scale Minimum:', '—'],
            ['Scale Maximum:', '—'],
            ['Current Speed:', '—'],
            ['Units:', 'rev/sec'],
            ['Load:', 'Normal'],
            ['Temperature:', '36.4 °C'],
          ].forEach(([k, v]) => {
            u.el('span', '', kv3, k);
            u.el('span', '', kv3, v);
          });
          u.el('div', 'cp-split', body);
          const low = u.el('section', 'cp-low', body);
          u.el('h2', '', low, 'Speed Calibration');
          Object.assign(_c, { header: low, low, menu });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const instruction = _c.header.querySelector('.ref-instruction');
          if (instruction) instruction.classList.add('instruction');
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.classList.add('cp-menu-tools');
          _c.menu.appendChild(_c.headerTools);
          styleControls(_c.headerTools, true);
        },
        'frame.body': () => (_c) => { _c.body = _c.low; },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) panel.classList.add('instruction');
        },
        'frame.stage': () => (_c) => {
          const { util: u, low } = _c;
          const ctl = u.el('div', 'cp-group cp-speed', low);
          u.el('h4', '', ctl, 'Speed Control');
          const stage = u.el('main', 'record-stage', ctl);
          stage.dataset.role = 'stage';
          const row = u.el('div', 'cp-row', low);
          const g1 = u.el('div', 'cp-group g-scale', row);
          u.el('h4', '', g1, 'Scale (logarithmic)');
          const sc = u.el('div', 'sc', g1);
          const nums = u.el('div', 'nums', sc);
          ['1', '10', '100', '1000', '10000'].forEach((n) => u.el('span', '', nums, n));
          u.el('p', '', sc, 'Each step represents a 10× increase.');
          const g2 = u.el('div', 'cp-group g-tol', row);
          u.el('h4', '', g2, 'Readout');
          const tk = u.el('div', 'kv', g2);
          [
            ['Scale:', 'Logarithmic'],
            ['Units:', 'rev/sec'],
            ['Current:', '—'],
          ].forEach(([k, v]) => {
            u.el('span', '', tk, k);
            u.el('span', k === 'Current:' ? 'cur' : '', tk, v);
          });
          const g3 = u.el('div', 'cp-group g-act', row);
          u.el('h4', '', g3, 'Actions');
          const acts = u.el('div', 'acts', g3);
          const reset = u.el('button', 'cp-btn', acts, 'Reset');
          reset.type = 'button';
          reset.dataset.action = 'reset';
          const apply = u.el('button', 'cp-btn', acts, 'Apply');
          apply.type = 'button';
          const log = u.el('div', 'cp-log', low);
          u.el('h4', '', log, 'Log');
          const lb = u.el('pre', '', log);
          lb.textContent =
            '2004-11-02 14:28:11    Device connected.\n2004-11-02 14:28:13    Calibration mode enabled.\n2004-11-02 14:28:17    Readout initialized.';
          const scroll = u.el('div', 'cp-log-scroll', log);
          u.el('span', 'scroll-up', scroll, '▲');
          u.el('span', 'scroll-track', scroll);
          u.el('span', 'scroll-down', scroll, '▼');
          // The template selects and wires the control; the utility supplies its action slot.
          if (_c.placement === 'header' && _c.submit) {
            acts.appendChild(_c.submit);
            _c.submit.classList.remove('cp-chrome-btn');
          }
          Object.assign(_c, { stage, acts });
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { util: u } = _c;
          const body = document.body;
          const sb = u.el('footer', 'cp-status', body);
          u.el('span', 'l', sb, 'Ready');
          u.el('span', '', sb, 'MC-3178');
          u.el('span', '', sb, 'Calibration');
          u.el('span', '', sb, '2004-11-02 14:28');
          const foot = body.querySelector('.ref-foot');
          if (foot) {
            sb.appendChild(foot);
            styleControls(foot, true);
          }
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.body.querySelector('.ref-float-dock');
          if (dock) {
            _c.acts.appendChild(dock);
            styleControls(dock, false);
          }
        },
        overlay: () => drawOverlay,
      },
    },
  });
})();
