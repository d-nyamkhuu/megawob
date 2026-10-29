(function () {
  'use strict';
  const SWATCH = {
    blue: '#1c7ed6',
    red: '#e03131',
    green: '#2f9e44',
    yellow: '#e8d800',
    orange: '#f08000',
    purple: '#8000c0',
    pink: '#f060a0',
    black: '#000',
    white: '#fff',
    gray: '#808080',
    grey: '#808080',
    cyan: '#00c0c0',
    brown: '#804020',
  };
  const END_FALLBACK = [
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
  function gadgets(parent, u, kind) {
    const g = u.el('span', 'gad-r', parent);
    const paths = [
      '<path d="M5 5h10v12H4V6h3V3h7v4H7V5m2 3h5v6H8V9"/>',
      '<path d="M3 5h11v10H3zm4-3h10v11h-3M7 8h7v7H7z"/>',
    ];
    paths.forEach((p) => {
      const i = u.el('i', '', g);
      i.innerHTML =
        '<svg viewBox="0 0 20 20" fill="#ddd" stroke="#111" stroke-width="1.7" shape-rendering="crispEdges">' +
        p +
        '</svg>';
    });
    return g;
  }
  env.site({
    name: 'design-click-control-hover-05',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref amiga';
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const display = ctx.display === 'panel' && window.innerWidth < 1260 ? 'header' : ctx.display;
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : END_FALLBACK;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const keepBase = !ctx.finish && endR.bool(0.5);
      const placement = ctx.finish ? null : keepBase ? 'footer' : endR.pick(['footer', 'titlebar', 'link']);
      const otherLabels = labels.map(labelOf).filter((x) => String(x).trim().toLowerCase() !== 'submit');
      const label = placement
        ? keepBase
          ? 'Submit'
          : labelOf(endR.pick(otherLabels.length ? otherLabels : labels))
        : null;
      const collidePool = [
        ...new Set(
          labels.map(labelOf).filter(
            (x) =>
              String(x).trim().toLowerCase() !==
              String(label || '')
                .trim()
                .toLowerCase(),
          ),
        ),
      ];
      const collide = collidePool.length && collideR.bool(0.3) ? labelOf(collideR.pick(collidePool)) : null;
      const instr = String(ctx.plainInstruction || ctx.instruction || '');
      const cm = instr.match(/\b(blue|red|green|yellow|orange|purple|pink|black|white|gr[ae]y|cyan|brown)\b/i);
      const color = cm ? cm[1].toLowerCase() : 'blue';
      const sm = instr.match(/(\d+(?:\.\d+)?)\s*(?:s\b|sec)/i);
      const secs = sm ? sm[1] : '2';
      const shell = u.el('main', 'shell', document.body);
      const bar = u.el('header', 'screenbar', shell);
      u.el('span', 'sb-t', bar, 'Amiga Workbench');
      u.el('span', 'sb-m', bar, '1,948,032 graphics mem');
      u.el('span', 'sb-m', bar, '7,864,320 other mem');
      u.el('span', 'sb-clock', bar, 'Mon Apr 22 10:24');
      u.el('span', 'sb-front', bar);
      const work = u.el('div', 'work', shell);
      const win = u.el('section', 'win main-win', work);
      const tb = u.el('div', 'wtitle', win);
      u.el('span', 'gad gad-l', tb);
      u.el('span', 'wt', tb, 'Pointer Task');
      let submit = null;
      const endButton = (parent, cls, text, onClick) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', onClick);
        return b;
      };
      if (!ctx.finish && placement === 'titlebar') submit = endButton(tb, 'submit title-submit', label, ctx.submit);
      gadgets(tb, u);
      const body = u.el('div', 'wbody', win);
      const center = u.el('div', 'center', body);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden' || display === 'panel';
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', body);
      const reset = u.el('span', 'gad gad-l reset-task', tb);
      reset.innerHTML =
        '<svg viewBox="0 0 20 20" fill="#eee" stroke="#111" stroke-width="1.6" shape-rendering="crispEdges"><path d="m8 3 5 4-2 3v6H7v-6L5 8z"/><path d="M9 6v5"/></svg>';
      tb.querySelector('.gad-l').replaceWith(reset);
      if (!ctx.finish && placement === 'footer') submit = endButton(foot, 'submit', label, ctx.submit);
      if (!ctx.finish && placement === 'link') submit = endButton(foot, 'submit end-link', label + ' ›', ctx.submit);
      if (collide) {
        const b = endButton(foot, 'xtra-end', collide, () => env.log('decoy', { label: collide, collide: true }));
        b.removeAttribute('aria-label');
        b.removeAttribute('title');
      }
      u.el('div', 'wsize', win);
      const aside = u.el('aside', 'win insp-win', work);
      const tb2 = u.el('div', 'wtitle', aside);
      const inspectorIcon = u.el('span', 'gad gad-l', tb2);
      inspectorIcon.innerHTML = reset.innerHTML;
      u.el('span', 'wt', tb2, 'Task Inspector');
      gadgets(tb2, u);
      const ib = u.el('div', 'wbody ibody', aside);
      const grp = (t) => {
        const g = u.el('fieldset', 'grp', ib);
        u.el('legend', '', g, t);
        return g;
      };
      u.el('p', '', grp('Status'), 'In progress');
      const tg = grp('Target');
      const trow = u.el('div', 'trow', tg);
      const sw = u.el('span', 'swatch', trow);
      sw.style.background = SWATCH[color] || '#0000ff';
      u.el('span', '', trow, color.charAt(0).toUpperCase() + color.slice(1) + ' square');
      u.el('p', '', tg, 'Moves to a new position during the task.');
      const goal = grp('Goal');
      goal.classList.toggle('panel-goal', display === 'panel');
      u.el(
        'p',
        '',
        goal,
        display === 'panel'
          ? ctx.instruction
          : display === 'hidden'
            ? 'Follow the assigned task. Progress is shown below the movement area.'
            : 'Keep the mouse over it for ' + secs + ' seconds in total.',
      );
      u.el('p', '', grp('Area'), 'The square can move anywhere inside the outlined area on the left.');
      const tp = grp('Tips');
      const ul = u.el('ul', '', tp);
      [
        'The square moves automatically.',
        'Your time only counts while the mouse is over it.',
        'You can move the mouse freely.',
      ].forEach((t) => u.el('li', '', ul, t));
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
