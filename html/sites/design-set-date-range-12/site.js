(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-range-12',
    'brand': 'Task Manager',
    'tabs': 'Calendar Tools|My Tasks|Reports|Settings',
    'briefTitle': 'Task',
  };
  const ICON_APP =
    '<svg width="40" height="40" viewBox="0 0 40 40"><rect x="3" y="7" width="34" height="30" fill="#e8eefc" stroke="#12285f" stroke-width="3"/><rect x="3" y="7" width="34" height="8" fill="#2c4d9a" stroke="#12285f" stroke-width="3"/><rect x="9" y="2" width="4" height="9" fill="#12285f"/><rect x="27" y="2" width="4" height="9" fill="#12285f"/><path d="M8 20h5v4H8zM17 20h5v4h-5zM26 20h5v4h-5zM8 27h5v4H8zM17 27h5v4h-5zM26 27h5v4h-5z" fill="#6f87c4"/></svg>';
  const ICON_WARN =
    '<svg width="62" height="56" viewBox="0 0 62 56"><path d="M31 3 L59 53 H3 Z" fill="#ffc400" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="miter"/><rect x="28" y="18" width="6" height="19" fill="#1a1a1a"/><rect x="28" y="41" width="6" height="6" fill="#1a1a1a"/></svg>';
  const ICON_DOC =
    '<svg width="36" height="36" viewBox="0 0 36 36"><path d="M7 3h17l6 6v24H7z" fill="#fff" stroke="#12285f" stroke-width="2.5"/><path d="M12 14h13M12 19h13M12 24h13M12 29h9" stroke="#12285f" stroke-width="2.5"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML = ICON_APP;
      u.el('span', 'ds-brand', top, C.brand);
      const tabs = u.el('nav', 'ds-tabs', top);
      C.tabs.split('|').forEach((t, i) => u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), tabs, t));
      const util = u.el('span', 'ds-util', top);
      u.el('span', '', util, 'Help');
      u.el('span', '', util, '|');
      u.el('span', '', util, 'Sign Out');
      let display = ctx.display;
      const W = document.documentElement.clientWidth,
        H = document.documentElement.clientHeight;
      if ((display === 'panel' && W < 1260) || (display === 'toast' && (W < 1260 || H < 700))) display = 'header';
      const desk = u.el('div', 'ds-desk ds-display-' + display, document.body);
      const dlg = u.el('section', 'ds-dialog', desk);
      const tb = u.el('div', 'ds-dtitle', dlg);
      u.el('span', '', tb, 'Select Date Range');
      u.el('span', 'ds-x', tb, '✕');
      const dbody = u.el('div', 'ds-dbody', dlg);
      const spacer = u.el('div', 'ds-spacer', dbody);
      if (display === 'header') u.el('div', 'ds-heading', dbody, ctx.instruction);
      const stage = u.el('main', 'ds-stage', dbody);
      const foot = u.el('footer', 'ds-footer', dlg);
      const cancel = u.el('button', 'ds-cancel', foot, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      const er = ctx.rng.fork('chrome/end');
      const candidate = er.pick(['footer', 'footer', 'header', 'link']);
      const original = er.bool(0.5);
      const endBank = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const label = original ? 'Submit' : er.pick(endBank.filter((x) => x.toLowerCase() !== 'submit'));
      const placement =
        label.toLowerCase() === 'submit' ? 'footer' : candidate === 'footer' ? er.pick(['header', 'link']) : candidate;
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'ds-submit', foot, label);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.addEventListener('click', () => ctx.submit());
        } else if (placement === 'header') {
          submit = u.el('button', 'ds-submit ds-end-head', tb, label);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.addEventListener('click', () => ctx.submit());
        } else {
          submit = u.el('a', 'ds-end-link', foot, label + ' ›');
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        }
      }
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const opts = endBank.filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (opts.length) collide = cr.pick(opts);
      }
      if (collide) {
        const b = u.el('button', 'ds-xtra', placement === 'header' ? foot : tb, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (display !== 'hidden') {
        const note = u.el('aside', 'ds-brief' + (display === 'toast' ? ' ds-task-toast' : ''), desk);
        const h = u.el('h2', '', note);
        const ic = u.el('span', '', h);
        ic.innerHTML = ICON_DOC;
        u.el('span', '', h, display === 'toast' ? 'Task reminder' : C.briefTitle);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'banner') {
        const icon = u.el('span', 'ds-warn', el);
        icon.innerHTML = ICON_WARN;
        const text = u.el('div', 'ds-wtext', el);
        u.el('h2', '', text, 'Layout could not be restored.');
        u.el('p', '', text, 'Your previous layout could not be restored. Some elements may be out of place.');
      } else {
        const texts = {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new workspace.',
        };
        u.el('div', '', el, texts[ctx.kind]);
      }
      const dismiss = u.el(
        'button',
        '',
        el,
        ctx.kind === 'banner' ? 'Use default layout' : ctx.kind === 'cookie' ? 'Accept all' : 'Close',
      );
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
