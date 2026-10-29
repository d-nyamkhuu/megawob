(function () {
  'use strict';
  const WC =
    '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
  env.site({
    name: 'design-click-control-hover-09',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref';
      const wallpaper = u.el('div', 'wallpaper', document.body);
      wallpaper.innerHTML =
        '<svg viewBox="0 0 1672 941" preserveAspectRatio="none"><defs><linearGradient id="sky" x2="1" y2="1"><stop stop-color="#183555"/><stop offset=".55" stop-color="#365d86"/><stop offset="1" stop-color="#8da5bd"/></linearGradient><linearGradient id="wave" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#91a8bd"/><stop offset=".5" stop-color="#527596"/><stop offset="1" stop-color="#9badbf"/></linearGradient><linearGradient id="deep" x2="1" y2="1"><stop stop-color="#183954"/><stop offset="1" stop-color="#567c9f"/></linearGradient></defs><path fill="url(#sky)" d="M0 0h1672v941H0Z"/><path fill="url(#wave)" d="M1503 36C1310 222 1210 454 1672 593V36Z"/><path fill="url(#wave)" d="M0 372C280 610 863 893 1672 593V941H0Z"/><path fill="url(#deep)" d="M0 492C386 691 1086 907 1672 941H744C445 760 178 711 0 492Z"/><path fill="url(#deep)" d="M1135 752C1354 785 1520 814 1672 941V593C1489 636 1314 688 1135 752Z"/></svg>';
      const top = u.el('div', 'topbar', document.body);
      const tl = u.el('div', 'l', top);
      u.el('span', '', tl, 'Activities');
      const app = u.el('span', 'app', tl);
      u.el('i', '', app);
      u.el('span', '', app, 'Attention Task');
      u.el('div', 'c', top, 'Mon Apr 28  10:24 AM');
      const tr = u.el('div', 'r', top);
      tr.innerHTML =
        '<svg viewBox="0 0 16 16"><path d="M8 13l1.6-1.8a2.4 2.4 0 0 0-3.2 0ZM3.5 8.6l1.1 1.2a4.8 4.8 0 0 1 6.8 0l1.1-1.2a6.4 6.4 0 0 0-9 0ZM1 6l1.1 1.2a8.4 8.4 0 0 1 11.8 0L15 6A10 10 0 0 0 1 6Z"/></svg><svg viewBox="0 0 16 16"><path d="M2 6h3l4-3v10l-4-3H2ZM11 5a4 4 0 0 1 0 6l.8.8a5 5 0 0 0 0-7.6Z"/></svg><svg viewBox="0 0 16 16"><path d="M4 2h6v2h1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4h1ZM6 7h2v3H6Z"/></svg>';

      const win = u.el('main', 'win main', document.body);
      const hb = u.el('header', 'hb', win);
      u.el('span', 'tl', hb).innerHTML = '<i></i><i></i><i></i>';
      u.el('span', '', hb, 'Attention Task');
      u.el('span', 'wc', hb).innerHTML = WC;
      const body = u.el('div', 'mbody', win);
      const card = u.el('section', 'card', body);
      let display = ctx.display || 'header';
      const small = window.innerWidth < 1260 || window.innerHeight < 700;
      if ((display === 'panel' && small) || (display === 'toast' && window.innerHeight < 700)) display = 'header';
      const note = u.el('div', 'instruction', card, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'panel' || display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', card);
      const foot = u.el('footer', 'footer', win);
      let submit = null;
      let endLabel = 'Submit';
      let placement = 'footer';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide');
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        endLabel = labelOf(er.pick(labels));
        placement = er.pick(['footer', 'footer', 'footer', 'header', 'link']);
        if (!ctx.rng.fork('chrome/reference').bool(0.5)) {
          endLabel = 'Submit';
          placement = 'footer';
        }
        if (cr.bool(0.3)) {
          const choices = [...new Set(labels.map(labelOf))].filter(
            (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
          );
          if (choices.length) collide = labelOf(cr.pick(choices));
        }
        const makeEnd = (parent, cls, text) => {
          const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
          b.type === 'BUTTON' && (b.type = 'button');
          if (b.tagName === 'A') b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', endLabel);
          b.title = endLabel;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'footer') submit = makeEnd(foot, 'submit', endLabel);
        else if (placement === 'header') submit = makeEnd(hb, 'submit header-submit', endLabel);
        else submit = makeEnd(foot, 'end-link', endLabel + ' ›');
      }
      const decoyBtn = (parent, label, isCollide) => {
        const b = u.el('button', 'chrome-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', isCollide ? { label, collide: true } : { label }));
        return b;
      };
      if (collide) {
        const parent = collide && placement === 'header' ? foot : hb;
        decoyBtn(parent, collide, true);
      }

      const nw = u.el('aside', 'win notes', document.body);
      const nh = u.el('div', 'nhb', nw);
      u.el('span', 'ico', nh).appendChild(document.createElement('i'));
      u.el('span', '', nh, 'Notes');
      u.el('span', 'wc', nh).innerHTML = WC;
      const nb = u.el('div', 'nbody', nw);
      const nc = u.el('div', 'ncard', nb);
      u.el('h2', '', nc, 'How this works');
      if (display === 'panel') u.el('div', 'instruction panel-instruction', nc, ctx.instruction);
      const ul = u.el('ul', '', nc);
      u.el('li', '', ul, 'A highlighted square moves to different positions within the dashed area.');
      if (display === 'header') u.el('li', '', ul, ctx.instruction);
      u.el('li', '', ul, 'The counter shows the total time your mouse has been over the square.');
      u.el('li', '', ul, 'The square may change position at any time within the dashed area.');

      const dock = u.el('div', 'dock', document.body);
      ['ff', 'fl', 'tm', 'dc', 'ap'].forEach((c) => u.el('i', c, dock));
      dock.querySelector('.ff').innerHTML =
        '<svg viewBox="0 0 48 48"><defs><linearGradient id="fox" x2=".8" y2="1"><stop stop-color="#ffd249"/><stop offset=".55" stop-color="#ff8226"/><stop offset="1" stop-color="#e73765"/></linearGradient></defs><path fill="url(#fox)" d="M36 3c2 8 10 13 10 24 0 13-10 21-23 20C10 46 2 37 2 26c0-6 2-12 6-17l2 8 6-6 6 5C28 13 30 8 30 2l6 10Z"/><circle fill="#8136c6" cx="25" cy="28" r="13"/><path fill="#ffad31" d="m7 16 10-6 6 7 8 2-7 5-7-2c-2 8 4 11 11 9-6 9-19 4-20-4Z"/></svg>';
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
