(function () {
  'use strict';
  const C = { site: 'design-set-date-calendar-12' };
  const I = {
    parcel:
      '<svg viewBox="0 0 120 120" width="112" height="112"><defs><linearGradient id="pt" x2="1" y2="1"><stop stop-color="#e5c5a1"/><stop offset="1" stop-color="#d3ad82"/></linearGradient><linearGradient id="pl" x2="1" y2="1"><stop stop-color="#d9b78d"/><stop offset="1" stop-color="#caa476"/></linearGradient><linearGradient id="pr" x2="1" y2="1"><stop stop-color="#c5a079"/><stop offset="1" stop-color="#b38d66"/></linearGradient></defs><path d="M9 36Q7 38 7 42v49q0 4 4 6l47 22 55-28V34L66 10q-3-1-6 0z" fill="url(#pl)"/><path d="M7 39l49 23 57-28-47-24q-3-1-6 0L10 34q-3 2-3 5" fill="url(#pt)"/><path d="M56 62l57-28v55q0 3-4 5l-53 25z" fill="url(#pr)"/><path d="M27 49l11 5 55-29-11-5z" fill="#efdabd" opacity=".8"/><path d="M27 49v13l11 5V54z" fill="#e4c69f"/><path d="M27 90l8 4v12l-8-4zM42 104l6 3v8l-6-3z" fill="#b5926b" opacity=".35"/></svg>',
    wifi: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M2 8q10-7 20 0M5 11q7-5 14 0M8 14q4-3 8 0M10 17l2 2 2-2"/></svg>',
    volume:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9h4l6-5v16l-6-5H3z"/><path d="M17 8q4 4 0 8" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    battery:
      '<svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 1h6v3H9zM6 4h12v18H6z"/><path d="M8 6h8v4H8z" fill="#22384b"/></svg>',
    doc: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h8l5 5v13H6z"/><path d="M9 13h7M9 17h7M9 9h3"/></svg>',
    truck:
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M2 6h12v10H2zM14 9h4l4 4v3h-8z"/><circle cx="7" cy="17.5" r="2.2"/><circle cx="17" cy="17.5" r="2.2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.500z"/></svg>',
    bars: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4 12h4v8H4zM10 4h4v16h-4zM16 9h4v11h-4z"/></svg>',
    gear: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M10 2h4l.6 2.8 2 .9 2.4-1.5 2.8 2.8-1.5 2.4.9 2 2.8.6v4l-2.8.6-.9 2 1.500 2.400-2.800 2.800-2.400-1.500-2 .9L14 26h-4l-.6-2.800-2-.9-2.400 1.500L2.200 21.200l1.500-2.400-.9-2L0 16.200v-4l2.800-.6.9-2L2.200 7.200 5 4.400l2.400 1.500 2-.9z" transform="translate(1 -2) scale(.92)"/><circle cx="12" cy="12" r="3.500" fill="#fff"/></svg>',
    box: '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 2l9 4.500v11L12 22 3 17.500v-11z" fill="#2a7de1"/><path d="M12 2l9 4.500L12 11 3 6.500z" fill="#6bb2ff"/><path d="M12 11v11l-9-4.500v-11z" fill="#1b5fc2"/></svg>',
    min: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2"><path d="M6 12h12"/></svg>',
    max: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="30" height="30"><circle cx="12" cy="12" r="11" fill="#1c6ee0"/><rect x="10.800" y="10" width="2.400" height="8" fill="#fff"/><circle cx="12" cy="6.800" r="1.500" fill="#fff"/></svg>',
    pen: '<svg viewBox="0 0 24 24" width="20" height="20" fill="#444"><path d="M3 21l1-5L16 4l4 4L8 20zM17 3l2-1 3 3-1 2z"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
  };
  function svg(parent, html, cls) {
    const s = document.createElement('span');
    s.className = cls || 'ds-ic';
    s.innerHTML = html;
    parent.append(s);
    return s;
  }
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const dims = ctx.size || { width: innerWidth, height: innerHeight };
      let display = ctx.display || 'header';
      if (
        (display === 'panel' && dims.width < 1260) ||
        (display === 'toast' && (dims.width < 1120 || dims.height < 700))
      )
        display = 'header';
      const wall = u.el('div', 'ds-wall', document.body);
      wall.innerHTML =
        '<svg viewBox="0 0 1672 941" preserveAspectRatio="none"><defs><linearGradient id="wb" x2="1" y2="1"><stop stop-color="#365f8b"/><stop offset="1" stop-color="#4f82b7"/></linearGradient><linearGradient id="wf" x2="1" y2="1"><stop stop-color="#274c77"/><stop offset="1" stop-color="#5084bc"/></linearGradient></defs><rect width="1672" height="941" fill="url(#wb)"/><path d="M650 941C900 650 1050 172 1460 66Q1550 49 1610 12L1672 55V941" fill="#335b88" opacity=".6"/><path d="M840 941C1190 650 1240 188 1510 234Q1580 249 1672 285V941" fill="#244771" opacity=".5"/><path d="M1150 941C1300 620 1450 407 1672 370V941" fill="#5183b6"/><path d="M0 620Q220 590 430 780L690 941H0z" fill="#274f7b"/><path d="M1160 941C1240 691 1380 622 1440 641Q1560 658 1672 692V941" fill="url(#wf)"/></svg>';
      const bar = u.el('div', 'ds-gbar', document.body);
      u.el('span', 'ds-act', bar, 'Activities');
      const app = u.el('span', 'ds-gapp', bar);
      svg(app, I.box.replace(/width="30" height="30"/, 'width="18" height="18"').replace(/#[a-f0-9]{6}/g, '#ffffff'));
      app.append('Logistics');
      u.el('span', 'ds-clock', bar, 'Thu Aug 3  10:24 AM');
      const tray = u.el('span', 'ds-tray', bar);
      svg(tray, I.wifi);
      svg(tray, I.volume);
      svg(tray, I.battery);
      const win = u.el('div', 'ds-win', document.body);
      const hb = u.el('header', 'ds-hb', win);
      svg(hb, I.box, 'ds-logo');
      const t = u.el('div', 'ds-hbt', hb);
      u.el('b', '', t, 'Logistics Pro');
      u.el('span', '', t, 'Ship Smarter');
      const wc = u.el('div', 'ds-wc', hb);
      svg(wc, I.min);
      svg(wc, I.max);
      svg(wc, I.x);
      const body = u.el('div', 'ds-body', win);
      const side = u.el('nav', 'ds-side', body);
      [
        ['New Request', I.doc],
        ['Shipments', I.truck],
        ['Addresses', I.pin],
        ['Reports', I.bars],
        ['Settings', I.gear],
      ].forEach((r, i) => {
        const it = u.el('div', 'ds-nav' + (i === 0 ? ' on' : ''), side);
        svg(it, r[1]);
        u.el('span', '', it, r[0]);
      });
      const content = u.el('div', 'ds-content', body);
      u.el('h1', 'ds-h1', content, 'New Delivery Request');
      u.el('div', 'ds-lead', content, 'Fill in the details below to schedule a delivery.');
      let n = null;
      if (display === 'header') {
        n = u.el('aside', 'ds-banner ds-note-' + display, content);
        svg(n, I.info);
        u.el('div', 'ds-instruction', n, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', content);
      const foot = u.el('footer', 'ds-footer', content);
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const endChoices = Array.isArray(ctx.content && ctx.content.END_LABELS)
        ? ctx.content.END_LABELS
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const textOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = endRng.bool(0.5)
        ? 'Submit'
        : textOf(
            endRng.pick(
              endChoices.filter((x) => textOf(x).trim().toLowerCase() !== 'submit').length
                ? endChoices.filter((x) => textOf(x).trim().toLowerCase() !== 'submit')
                : endChoices,
            ),
          );
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'toolbar', 'link', 'icon']);
      const makeEnd = (parent, cls, text) => {
        const b = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(foot, 'ds-submit', label);
        else if (placement === 'link') submit = makeEnd(foot, 'ds-end-link', label + ' ›');
        else
          submit = makeEnd(
            hb,
            placement === 'icon' ? 'ds-submit ds-end-icon' : 'ds-submit ds-end-toolbar',
            placement === 'icon' ? '✓' : label,
          );
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [...new Set(endChoices.map(textOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (pool.length) collide = { label: collideRng.pick(pool), where: collideRng.pick(['footer', 'toolbar']) };
      }
      if (collide) {
        const parent = collide.where === 'toolbar' ? hb : foot;
        const b = u.el('button', 'ds-xtra-end', parent, collide.label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
      }
      const pv = u.el('aside', 'ds-prev', body);
      const card = u.el('div', 'ds-pvcard', pv);
      svg(card, I.parcel, 'ds-pvbox');
      u.el('h2', '', card, 'Preview Your Shipment');
      u.el('p', '', card, 'See a summary of your delivery details before submitting.');
      const pb = u.el('button', 'ds-preview', card);
      pb.type = 'button';
      pb.append('Preview ');
      svg(pb, I.arrow);
      const pal = u.el('aside', 'ds-pal', document.body);
      const ph = u.el('div', 'ds-palh', pal);
      svg(ph, I.pen);
      u.el('b', '', ph, 'Quick Notes');
      const pc = u.el('span', 'ds-palc', ph);
      svg(pc, I.min);
      svg(pc, I.x);
      const pbd = u.el('div', 'ds-palb', pal);
      if (display === 'panel' || display === 'toast') {
        pbd.classList.add(display === 'panel' ? 'ds-note-panel' : 'ds-palb-toast');
        u.el('div', '', pbd, ctx.instruction);
      } else pbd.remove();
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
