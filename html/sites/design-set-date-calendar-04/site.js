(function () {
  'use strict';
  const C = { 'site': 'design-set-date-calendar-04' };
  const TOOLS = [
    ['Open', 'M3 8h7l2 2h9v10H3z'],
    ['Save', 'M4 4h14l3 3v13H4zM8 4v6h8V4M8 20v-6h8v6'],
    ['New', 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 15h7M9 18h7'],
    ['Find', 'M12 3l9 17H3z'],
    ['Properties', 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
    ['Help', ''],
  ];
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const bar = u.el('header', 'ds-bar', document.body);
      const logo = u.el('span', 'ds-logo', bar);
      logo.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 1L22 6v12l-10 5L2 18V6z" fill="#141d32"/><path d="M12 4l7 4v9l-7 4-7-4V8zM12 4v17M5 8l7 8 7-8M5 17l7-8 7 8" fill="none" stroke="#bcc5dc" stroke-width="1.2"/></svg>';
      u.el('span', 'ds-irix', bar, 'IRIX');
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Actions', 'Help']) u.el('span', 'ds-mi', bar, m);
      u.el('span', 'ds-clock', bar, 'Mon Jul 26   10:14 AM');
      const main = u.el('div', 'ds-main', document.body);
      const left = u.el('div', 'ds-left', main);
      const sg = u.el('div', 'ds-sg', left);
      sg.innerHTML =
        '<svg width="46" height="52" viewBox="0 0 46 52"><defs><linearGradient id="sgi-metal"><stop stop-color="#b5b9d3"/><stop offset=".5" stop-color="#858baa"/><stop offset="1" stop-color="#5f678d"/></linearGradient></defs><g fill="url(#sgi-metal)" stroke="#6c7597" stroke-width="1.2" stroke-linejoin="round"><path d="M20 2l-8 5v10l8 5zM26 2l8 5v10l-8 5zM3 13l8 5 9 5v10L3 23zM43 13l-8 5-9 5v10l17-10zM3 29l17 10v11l-8-5V35l-9 5zM43 29L26 39v11l8-5V35l9 5z"/></g><g fill="none" stroke="#d0d3e7" stroke-width="1.6"><path d="M18 5v12l-4-2V9zM28 5v12l4-2V9zM6 17l11 7v5L6 22zM40 17l-11 7v5l11-7zM18 42v4l-4-3V33M28 42v4l4-3V33"/></g></svg><i>silicon graphics</i>';
      if (ctx.display !== 'hidden') {
        const n = u.el('aside', 'ds-note ds-note-' + ctx.display, left);
        u.el('div', 'ds-instruction', n, ctx.instruction);
      }
      const win = u.el('section', 'ds-win', main);
      const tb = u.el('div', 'ds-title', win);
      const wi = u.el('span', 'ds-ticon', tb);
      wi.innerHTML =
        '<svg viewBox="0 0 20 20"><path d="M10 3l-3 5 3 2 3-2zM10 10v5M5 16h10M7 11l-2 3M13 11l2 3" fill="none" stroke="#202538" stroke-width="1.3"/></svg>';
      u.el('span', 'ds-ttext', tb, 'Project Task Entry');
      const bt = u.el('span', 'ds-tbtns', tb);
      for (const g of ['_', '▢', '✕']) u.el('b', '', bt, g);
      const form = u.el('div', 'ds-form', win);
      const sec = u.el('div', 'ds-sec', form);
      u.el('span', '', sec, 'Task Information');
      const stage = u.el('main', 'ds-stage', form);
      const sec2 = u.el('div', 'ds-sec ds-sec2', form);
      u.el('span', '', sec2, 'Task Details');
      const det = u.el('div', 'ds-details', form);
      u.el('span', 'ds-dl', det, 'Description:');
      const ta = u.el('div', 'ds-ta', det);
      const sc = u.el('div', 'ds-scroll', ta);
      u.el('span', '', sc, '▲');
      u.el('span', '', sc, '▼');
      u.el('span', 'ds-dl ds-eh', det, 'Estimated hours:');
      u.el('div', 'ds-sm ds-eh2', det);
      u.el('span', 'ds-dl ds-tg', det, 'Tags:');
      u.el('div', 'ds-sm ds-tg2', det);
      const foot = u.el('footer', 'ds-footer', win);
      const endR = ctx.rng.fork('chrome/end');
      const collideR = ctx.rng.fork('chrome/collide');
      const endPool =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = ctx.finish ? null : endR.pick(['footer', 'footer', 'footer', 'title', 'link', 'icon']);
      const canonical = placement === 'footer';
      const otherEnds = endPool.filter((x) => endText(x).trim().toLowerCase() !== 'submit');
      const label = canonical
        ? 'Submit'
        : ctx.finish
          ? 'Submit'
          : endText(endR.pick(otherEnds.length ? otherEnds : endPool));
      const collide =
        !ctx.finish && collideR.bool(0.3)
          ? endText(
              collideR.pick(endPool.filter((x) => endText(x).trim().toLowerCase() !== label.trim().toLowerCase())),
            )
          : null;
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (placement === 'footer') submit = endBtn(foot, 'ds-submit', label);
      if (placement === 'link') submit = endBtn(foot, 'ds-endlink', label + '  ›');
      if (placement === 'title') submit = endBtn(tb, 'ds-title-end', label);
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const rail = u.el('aside', 'ds-tools', main);
      for (const [n, d] of TOOLS) {
        const t = u.el('div', 'ds-tool', rail);
        const ic = u.el('span', 'ds-ic', t);
        const art = {
          Open: '<path d="M2 7V3h9l3 3h8v15H2z" fill="url(#metal)" stroke="#50586b"/><path d="M3 21l2-14h19l-2 14z" fill="url(#metal)" stroke="#555e73"/><path d="M3 20L5 8h18M3 4h7" fill="none" stroke="#f1f2f6"/>',
          Save: '<path d="M2 2h20v21H2z" fill="url(#metal)" stroke="#42495e"/><path d="M5 3h13v9H5zM5 16h14v6H5z" fill="#e3e6ee" stroke="#42495e"/><path d="M13 4h4v7h-4zM7 18h8v3H7z" fill="#63698e"/>',
          New: '<path d="M3 2h12l6 6v15H3z" fill="url(#metal)" stroke="#4b5265"/><path d="M6 4h8l5 5v12H6z" fill="#edf0f6" stroke="#747d91"/><path d="M14 4v6h5M8 12h9M8 15h9M8 18h9" fill="none" stroke="#6e778d"/>',
          Find: '<path d="M12 1L1 22h23z" fill="#6861c2" stroke="#5f638c"/><path d="M12 1L1 22l11-6z" fill="#d0cdea"/><path d="M12 1v15l12 6z" fill="#514aa3"/><path d="M12 1L1 22" stroke="#f2f1fa"/>',
          Properties:
            '<path d="M2 2h21v21H2z" fill="url(#metal)" stroke="#42495e"/><path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z" fill="#eef0f7" stroke="#555e73"/><path d="M6 7h3M15 7h3M6 16h3M15 16h3" stroke="#929aaf"/>',
          Help: '<circle cx="12" cy="12" r="11" fill="url(#help)" stroke="#565b86"/><path d="M3 11a9 9 0 0 1 15-6" fill="none" stroke="#eaecff"/><text x="12" y="19" text-anchor="middle" font-size="20" fill="#fff" font-family="Arial">?</text>',
        };
        ic.innerHTML =
          '<svg width="40" height="40" viewBox="0 0 26 26"><defs><linearGradient id="metal" x2=".6" y2="1"><stop stop-color="#eef0f6"/><stop offset=".45" stop-color="#aab0c3"/><stop offset="1" stop-color="#7c839b"/></linearGradient><radialGradient id="help" cx=".3" cy=".25"><stop stop-color="#9b9be6"/><stop offset="1" stop-color="#5655b1"/></radialGradient></defs>' +
          art[n] +
          '</svg>';
        u.el('span', '', t, n);
      }
      if (placement === 'icon') submit = endBtn(rail, 'ds-rail-end', '✓');
      if (collide) {
        const b = u.el('button', 'ds-xtra', foot, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
