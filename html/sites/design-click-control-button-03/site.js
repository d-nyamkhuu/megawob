(function () {
  'use strict';
  const FEATHER =
    '<svg viewBox="0 0 32 32"><defs><linearGradient id="quill" x2="1" y2="1"><stop stop-color="#fff0a1"/><stop offset=".55" stop-color="#dca449"/><stop offset="1" stop-color="#aa702b"/></linearGradient></defs><path d="M29 2C22 3 13 6 9 13l-1 5-3 5 3 2c9-1 16-9 21-23Z" fill="url(#quill)" stroke="#483419" stroke-width=".7"/><path d="M4 30C10 20 18 12 28 3M9 22l-1-7M12 18l-1-7M15 15l-1-6M18 12l-1-5M10 21l7-1M14 17l8-2M18 13l7-3" fill="none" stroke="#795225" stroke-width=".65"/><path d="M5 29 27 4" stroke="#f3d88f" stroke-width=".8"/></svg>';
  const CLIP =
    '<svg viewBox="0 0 16 16"><path d="M11.5 7.5l-4.6 4.6a2.6 2.6 0 0 1-3.7-3.7L8.6 3a1.7 1.7 0 0 1 2.5 2.5L5.8 10.8" fill="none" stroke="#3a2a14" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const CARET = '<svg viewBox="0 0 10 6"><path d="M0 0h10L5 6z" fill="#4a3b2a"/></svg>';
  const LN = (w) =>
    '<svg viewBox="0 0 20 16" width="20" height="16"><path d="' +
    w.map((x, i) => 'M' + x[0] + ' ' + (2 + i * 4) + 'h' + x[1]).join('') +
    '" stroke="currentColor" stroke-width="1.7" fill="none"/></svg>';
  const TB = [
    ['B', 'b'],
    ['I', 'i'],
    ['U', 'u'],
    '|',
    [
      '<svg viewBox="0 0 20 16" width="20" height="16"><path d="M7 3h12M7 8h12M7 13h12" stroke="currentColor" stroke-width="1.7"/><circle cx="2.5" cy="3" r="1.5"/><circle cx="2.5" cy="8" r="1.5"/><circle cx="2.5" cy="13" r="1.5"/></svg>',
    ],
    [
      '<svg viewBox="0 0 20 16" width="20" height="16"><path d="M8 3h11M8 8h11M8 13h11" stroke="currentColor" stroke-width="1.7"/><text x="0" y="5" font-size="5">1</text><text x="0" y="10" font-size="5">2</text><text x="0" y="15" font-size="5">3</text></svg>',
    ],
    '|',
    [
      LN([
        [0, 18],
        [0, 12],
        [0, 18],
        [0, 10],
      ]),
      'al on',
    ],
    [
      LN([
        [1, 18],
        [4, 12],
        [1, 18],
        [5, 10],
      ]),
      'al',
    ],
    [
      LN([
        [1, 18],
        [7, 12],
        [1, 18],
        [9, 10],
      ]),
      'al',
    ],
    [
      LN([
        [1, 18],
        [1, 18],
        [1, 18],
        [1, 18],
      ]),
      'al',
    ],
    '|',
  ];
  env.site({
    name: 'design-click-control-button-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref wood';
      const er = ctx.rng.fork('chrome/end'),
        endLabels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const legacyEnd = er.bool(0.5);
      const alternateLabels = endLabels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit');
      const endLabel = legacyEnd ? 'Submit' : labelOf(alternateLabels.length ? er.pick(alternateLabels) : 'Done');
      const placement = legacyEnd ? 'footer-right' : er.pick(['footer-right', 'after-draft', 'titlebar']);
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const logo = u.el('span', 'logo', head);
      logo.innerHTML = FEATHER;
      u.el('span', 'app', head, 'Pen & Page');
      u.el('span', 'doc', head, 'Message Composer');
      const wc = u.el('span', 'window-controls', head);
      wc.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const paper = u.el('section', 'paper', shell);
      const hdr = u.el('div', 'mailhdr', paper);
      [
        ['From:', 'alex.carter@westfieldstudio.com', 1],
        ['To:', 'jamie.chen@northbridge.co', 1],
        ['Subject:', 'Project Update', 0],
      ].forEach(([l, v, dd]) => {
        const r = u.el('div', 'mrow' + (dd ? '' : ' wide'), hdr);
        u.el('label', '', r, l);
        const f = u.el('div', 'mfield', r);
        u.el('span', '', f, v);
        if (dd) {
          const c = u.el('i', 'caret', f);
          c.innerHTML = CARET;
        }
      });
      u.el('div', 'stamp', hdr, 'Tue, Apr 12, 2011  10:24 AM');
      const note = u.el('div', 'instruction', paper, ctx.instruction);
      note.dataset.display = ctx.display || 'header';
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      ['tl', 'tr', 'bl', 'br'].forEach((c) => u.el('i', 'rivet ' + c, note));
      const ed = u.el('div', 'editor', paper);
      const bar = u.el('div', 'fmtbar', ed);
      TB.forEach((t) => {
        if (t === '|') u.el('span', 'sep', bar);
        else {
          const b = u.el('span', 'tb ' + (t[1] || ''), bar);
          b.innerHTML = t[0];
        }
      });
      const fs = u.el('span', 'sel', bar, 'Georgia');
      fs.style.width = '160px';
      const fz = u.el('span', 'sel', bar, '12');
      fz.style.width = '84px';
      const colr = u.el('span', 'tb colr', bar);
      colr.innerHTML =
        '<u style="font-size:1.1em;text-decoration:underline;text-decoration-color:#c0392b;text-decoration-thickness:3px">A</u><svg viewBox="0 0 10 6" width="9" height="6" style="margin-left:6px"><path d="M0 0h10L5 6z" fill="#4a3b2a"/></svg>';
      colr.style.minWidth = 'clamp(46px,4.6vw,78px)';
      [fs, fz].forEach((s) => {
        const c = u.el('i', 'caret', s);
        c.innerHTML = CARET;
      });
      const body = u.el('div', 'mailbody', ed);
      [
        'Hi Jamie,',
        "Here's a quick update on the project. Let me know if you have any questions.",
        'Best,<br>Alex',
      ].forEach((t) => {
        u.el('p', '', body).innerHTML = t;
      });
      const foot = u.el('footer', 'footer', shell);
      const att = u.el('span', 'brass attach', foot);
      att.innerHTML = CLIP + '<b>Attach File...</b>';
      u.el('span', 'grow', foot);
      const draft = u.el(
        'button',
        'brass draft',
        foot,
        ctx.content && ctx.content.DECOY_LABELS
          ? labelOf(ctx.content.DECOY_LABELS.find((x) => labelOf(x).toLowerCase() === 'save draft') || 'Save Draft')
          : 'Save Draft',
      );
      draft.type = 'button';
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const opts = endLabels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (opts.length) collide = cr.pick(opts);
      }
      if (collide) draft.textContent = collide;
      draft.addEventListener('click', () =>
        env.log('decoy', collide ? { label: collide, collide: true } : { label: draft.textContent }),
      );
      const stage = u.el('div', 'stage', foot);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'titlebar' ? head : foot;
        submit = u.el('button', 'submit brass ' + (placement === 'titlebar' ? 'title-submit' : ''), parent, endLabel);
        submit.type = 'button';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', ctx.submit);
        if (placement === 'after-draft') foot.insertBefore(submit, stage);
      }
      const reset = u.el('button', 'reset-task', wc);
      reset.type = 'button';
      reset.title = 'Minimize';
      reset.setAttribute('aria-label', 'Minimize');
      reset.innerHTML = '<svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg>';
      wc.firstElementChild.replaceWith(reset);
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
