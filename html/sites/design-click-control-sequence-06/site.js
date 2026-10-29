(function () {
  'use strict';
  const cfg = { 'title': 'CalPro 1.3  -  Sensor Calibration Utility', 'theme': 'calpro', 'layout': 'strip' };
  const INFO = [
    [
      'dev',
      [
        ['Device', 'S-2700'],
        ['Serial No', '7A3F-1182'],
        ['Mode', 'Calibration'],
        ['Status', 'Ready'],
      ],
    ],
    [
      'sess',
      [
        ['Date', '2004-11-16'],
        ['Time', '14:27:08'],
        ['User', 'operator'],
        ['Profile', 'default'],
      ],
    ],
    [
      'sig',
      [
        ['CH1', '12.4'],
        ['CH2', '11.9'],
        ['CH3', '12.1'],
        ['CH4', '12.0'],
      ],
      'Signal Input (mV)',
    ],
    [
      'temp',
      [
        ['Board', '36.8'],
        ['Ambient', '22.1'],
        ['Sensor', '35.9'],
      ],
      'Temperature (°C)',
    ],
  ];
  env.site({
    name: 'design-click-control-sequence-06',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-icon', title);
      u.el('span', 'title-text', title, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const usualLabel = labelOf(endLabels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || endLabels[0]);
      const label = er.bool(0.5) ? usualLabel : labelOf(er.pick(endLabels));
      const placement = ctx.finish ? null : er.pick(['footer', 'footer', 'header', 'link']);
      const collide =
        !ctx.finish && cr.bool(0.3)
          ? labelOf(cr.pick(endLabels.filter((x) => labelOf(x).trim().toLowerCase() !== label.trim().toLowerCase())))
          : null;
      const info = u.el('section', 'info', shell);
      INFO.forEach(([k, rows, h]) => {
        const c = u.el('div', 'info-col info-' + k, info);
        if (h) u.el('div', 'info-h', c, h);
        rows.forEach(([a, b]) => {
          const r = u.el('div', 'info-row', c);
          u.el('span', 'il', r, a);
          u.el('span', 'ic', r, ':');
          u.el('span', 'iv', r, b);
        });
      });
      u.el('div', 'rule', shell);
      const work = u.el('div', 'work', shell);
      const note = u.el('div', 'instruction', work, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const row = u.el('div', 'panels', work);
      const p1 = u.el('section', 'panel p-read', row);
      u.el('div', 'panel-h', p1, 'Sensor Readings');
      const rb = u.el('div', 'panel-b read-b', p1);
      const rin = u.el('div', 'read-in', rb);
      [
        ['CH1', '12.4'],
        ['CH2', '11.9'],
        ['CH3', '12.1'],
        ['CH4', '12.0'],
      ].forEach(([a, b]) => {
        const r = u.el('div', 'read-row', rin);
        u.el('span', '', r, a);
        u.el('span', '', r, b);
        u.el('span', '', r, 'mV');
      });
      const center = u.el('section', 'panel p-ctl center', row);
      u.el('div', 'panel-h', center, 'Controls');
      const stage = u.el('div', 'stage', center);
      const p3 = u.el('section', 'panel p-out', row);
      u.el('div', 'panel-h', p3, 'Output');
      const ob = u.el('div', 'panel-b out-b', p3);
      const oin = u.el('div', 'out-in', ob);
      ['> System ready.', '> No actions performed.', '> Awaiting input...'].forEach((t) => u.el('div', '', oin, t));
      u.el('div', 'rule rule-b', shell);
      const foot = u.el('footer', 'footer', shell);
      const left = u.el('div', 'foot-l', foot);
      ['Load Profile', 'Save Profile', 'Reset'].forEach((t) => {
        const b = u.el('button', 'fbtn', left, t);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const right = u.el('div', 'foot-r', foot);
      const help = u.el('button', 'fbtn', right, 'Help');
      help.type = 'button';
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      const decoyBtn = (parent, text, isCollide) => {
        if (!text) return null;
        const b = u.el('button', isCollide ? 'fbtn pq-xtra' : 'fbtn', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let submit = null;
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(right, 'submit', label);
        if (placement === 'header') submit = endBtn(title, 'head-submit', label);
        if (placement === 'link') {
          const a = u.el('a', 'end-link', right, label + ' ›');
          a.href = '#';
          a.setAttribute('aria-label', label);
          a.title = label;
          a.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          submit = a;
        }
        if (collide) decoyBtn(left, collide, true);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
