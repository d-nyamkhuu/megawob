(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-autocomplete-04',
    'menu': ['File', 'Edit', 'View', 'Tools', 'Help'],
    'tools': [
      ['New', 'cube'],
      ['Open', 'folder'],
      ['Save', 'disk'],
      ['Preferences', 'cabinet'],
      ['Help', 'q'],
    ],
  };
  const ICONS = {
    cube: '<svg viewBox="0 0 80 80"><defs><linearGradient id="new-face" x2=".6" y2="1"><stop stop-color="#e6e7ee"/><stop offset="1" stop-color="#9ca0aa"/></linearGradient></defs><path d="M17 23L66 5v57L32 76 16 67z" fill="#30343b" transform="translate(2 2)"/><path d="M16 22L66 5 33 38z" fill="#eeeef6" stroke="#4a4d56"/><path d="M16 22L33 38v36L16 66z" fill="url(#new-face)" stroke="#4a4d56"/><path d="M33 38L66 5v57L33 74z" fill="url(#new-face)" stroke="#383b43" stroke-width="2"/><path d="M17 23v42l14 7M34 39L65 7" stroke="#f4f4fb" fill="none"/></svg>',
    folder:
      '<svg viewBox="0 0 80 80"><defs><linearGradient id="folder-face" x2=".6" y2="1"><stop stop-color="#c4bcef"/><stop offset=".6" stop-color="#9290c0"/><stop offset="1" stop-color="#68678f"/></linearGradient></defs><path d="M8 15h22l6 8h36v48H8z" fill="#aaa1d1" stroke="#555465"/><path d="M3 27h72l-4 44H6z" fill="#32333a" transform="translate(2 2)"/><path d="M3 27h72l-4 44H6z" fill="url(#folder-face)" stroke="#34343e" stroke-width="2"/><path d="M4 28h69M7 29l2 39M10 16h19l6 8h34" stroke="#dfd9ff" fill="none"/></svg>',
    disk: '<svg viewBox="0 0 80 80"><defs><linearGradient id="disk-face" x2=".5" y2="1"><stop stop-color="#aea7e0"/><stop offset="1" stop-color="#686392"/></linearGradient></defs><path d="M12 15h49l7 7v50H12z" fill="#30313a" transform="translate(2 2)"/><path d="M12 15h49l7 7v50H12z" fill="url(#disk-face)" stroke="#30313a" stroke-width="2"/><path d="M19 15h38v28H19z" fill="#423982" stroke="#ded8ff"/><path d="M24 16h27v22H24z" fill="#b8b3d8"/><path d="M12 16v53M14 16h45M20 43h38" stroke="#ded8ff" fill="none"/><path d="M64 22v47" stroke="#403857" stroke-width="3"/></svg>',
    cabinet:
      '<svg viewBox="0 0 80 80"><defs><linearGradient id="cab-face" x2=".4" y2="1"><stop stop-color="#a39ae5"/><stop offset="1" stop-color="#504795"/></linearGradient></defs><path d="M8 12h66v60H8z" fill="#2d2b3e" transform="translate(2 2)"/><path d="M8 12l7-7h60l-7 7z" fill="#b1a8e8" stroke="#55506d"/><path d="M8 12h60v60H8z" fill="#514597" stroke="#353043"/><path d="M68 12l7-7v60l-7 7z" fill="#342b70"/><path d="M11 16h54v24H11zM11 44h54v24H11z" fill="url(#cab-face)" stroke="#d6d0f7"/><path d="M33 26h10v6H33zM33 54h10v6H33z" fill="#292345" stroke="#cdc5ee"/><path d="M35 27h6M35 55h6" stroke="#fff"/></svg>',
    q: '<svg viewBox="0 0 80 90"><defs><linearGradient id="help-face" x2="1" y2="1"><stop stop-color="#dbd5ff"/><stop offset=".5" stop-color="#9b94c8"/><stop offset="1" stop-color="#4c457b"/></linearGradient></defs><path d="M16 29C15 12 25 6 38 6C53 6 62 13 62 25C62 35 58 40 50 45C43 50 41 54 41 63H28C27 49 32 43 40 37C45 33 48 30 48 24C48 19 45 17 40 17C33 17 30 22 30 29ZM28 68H41V80H28Z" fill="#33313d" stroke="#34333e" stroke-width="2" transform="translate(3 2)"/><path d="M16 29C15 12 25 6 38 6C53 6 62 13 62 25C62 35 58 40 50 45C43 50 41 54 41 63H28C27 49 32 43 40 37C45 33 48 30 48 24C48 19 45 17 40 17C33 17 30 22 30 29ZM28 68H41V80H28Z" fill="url(#help-face)" stroke="#bab2df" stroke-width="1.5"/></svg>',
    jet: '<svg viewBox="0 0 120 120"><defs><radialGradient id="globe"><stop stop-color="#edecff"/><stop offset="1" stop-color="#9090bb"/></radialGradient><linearGradient id="jet-face" x2=".6" y2="1"><stop stop-color="#ffffff"/><stop offset=".45" stop-color="#eaebee"/><stop offset="1" stop-color="#797c83"/></linearGradient></defs><circle cx="31" cy="35" r="26" fill="url(#globe)" stroke="#292546" stroke-width="3"/><ellipse cx="31" cy="35" rx="12" ry="26" fill="none" stroke="#312852" stroke-width="2"/><path d="M6 35h50M10 21h42M10 49h42M31 9v52" stroke="#302754" stroke-width="2" fill="none"/><path d="M15 99L64 61 62 30Q67 24 76 53L117 33Q129 30 123 42L88 78 111 106 69 91 54 103 46 91z" fill="#262734" transform="translate(2 3)"/><path d="M15 99L64 61 62 30Q67 24 76 53L117 33Q129 30 123 42L88 78 111 106 69 91 54 103 46 91z" fill="url(#jet-face)" stroke="#555763" stroke-width="2"/><path d="M17 97L118 36M65 34l8 22M71 88l37 15" stroke="#fff" stroke-width="2"/><path d="M52 88L119 37 83 78z" fill="#b5b7c0" opacity=".5"/></svg>',
    sgi: '<svg viewBox="0 0 30 32" fill="none" stroke="#111" stroke-width="2.7" stroke-linejoin="round"><path d="M14 2L4 8l8 4zM18 3l9 6-8 4zM3 12l8 5-8 5zM27 13l-8 4 8 5zM4 26l10-6v11zM18 21l9 5-9 5z"/></svg>',
    speaker:
      '<svg viewBox="0 0 32 30" fill="none" stroke="#20212b" stroke-width="2"><path d="M3 11h6l9-7v22l-9-7H3z" fill="#c0c1d2"/><path d="M22 8q8 7 0 14M26 4q12 11 0 22"/><path d="M5 12h5l6-5" stroke="#f0f0ff"/></svg>',
    monitor:
      '<svg viewBox="0 0 38 32" fill="#b7b9ca" stroke="#222631" stroke-width="2"><path d="M3 2h27v20H3zM12 22h10v5H12zM2 28h30v3H2z"/><path d="M6 5h21v14H6z" fill="#737b8b"/><path d="M4 3h25M4 3v17" stroke="#fff"/><path d="M34 26v4M37 26v4"/></svg>',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const bar = u.el('header', 'ds-bar', document.body);
      u.el('span', 'ds-logo', bar).innerHTML = ICONS.sgi;
      u.el('span', 'ds-sgi', bar, 'silicon graphics');
      u.el('span', 'ds-irix', bar, 'IRIX');
      C.menu.forEach((t, i) => u.el('span', 'ds-mi ds-mi' + i, bar, t));
      u.el('span', 'ds-clock', bar, 'Mon Apr 21   9:24 AM');
      u.el('span', 'ds-speaker', bar).innerHTML = ICONS.speaker;
      u.el('span', 'ds-monitor', bar).innerHTML = ICONS.monitor;
      const app = u.el('div', 'ds-app', document.body);
      const win = u.el('div', 'ds-win', app);
      const tb = u.el('div', 'ds-title', win);
      u.el('span', 'ds-wicon', tb).innerHTML =
        '<svg viewBox="0 0 30 30" fill="none" stroke="#edeaff" stroke-width="1.2"><circle cx="15" cy="15" r="9"/><ellipse cx="15" cy="15" rx="4" ry="9" transform="rotate(35 15 15)"/><ellipse cx="15" cy="15" rx="10" ry="4" transform="rotate(-30 15 15)"/><path d="M15 2v6M15 22v6M2 15h6M22 15h6"/></svg>';
      u.el('span', '', tb, 'Travel Planner');
      const wb = u.el('span', 'ds-wbtns', tb);
      ['−', '□', '×'].forEach((t) => u.el('b', '', wb, t));
      const brief = u.el('div', 'ds-brief', win);
      u.el('div', 'ds-jet', brief).innerHTML = ICONS.jet;
      u.el('h2', '', brief, 'Plan a Trip');
      u.el('p', '', brief, 'Find destinations, check availability, and plan your travel.');
      const tools = u.el('div', 'ds-tools', win);
      C.tools.forEach(([t, k], i) => {
        const b = u.el('div', 'ds-tool ds-tool' + i, tools);
        u.el('div', 'ds-ticon', b).innerHTML = ICONS[k];
        u.el('div', '', b, t);
      });
      const pane = u.el('div', 'ds-pane', win);
      u.el('h1', '', pane, 'Trip Search');
      u.el('div', 'ds-hr', pane);
      const stage = u.el('main', 'ds-stage', pane);
      const mode = ctx.display;
      const tp = u.el('aside', 'ds-side ds-task', win);
      u.el('div', 'ds-sh', tp, 'Task');
      const tbody = u.el('div', 'ds-sb ds-taskbody', tp);
      if (mode === 'toast') u.el('div', 'ds-toast ds-instruction', win, ctx.instruction);
      else if (mode !== 'hidden') u.el('div', 'ds-instruction', tbody, ctx.instruction);
      const pp = u.el('aside', 'ds-side ds-prog', win);
      u.el('div', 'ds-sh', pp, 'Progress');
      const pb = u.el('div', 'ds-sb ds-progbody', pp);
      u.el('span', 'ds-dot', pb);
      u.el('span', '', pb, 'Not submitted.');
      const foot = u.el('footer', 'ds-footer', win);
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      const placement = endR.pick(['footer', 'footer', 'title', 'progress']);
      const label =
        placement === 'footer'
          ? 'Submit'
          : labelOf(endR.pick(labels.filter((x) => labelOf(x).toLowerCase() !== 'submit')) || 'Done');
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = [
          ...new Set(labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (pool.length)
          collide = {
            label: labelOf(cr.pick(pool)),
            where: cr.pick(['title', 'progress', 'footer'].filter((x) => x !== placement)),
          };
      }
      const makeEnd = (parent, cls, text, aria) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', aria || text);
        b.title = aria || text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const makeDecoy = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(foot, 'ds-submit', label);
        else if (placement === 'title') submit = makeEnd(tb, 'ds-end-title', label);
        else submit = makeEnd(pp, 'ds-end-progress', label);
        if (collide) {
          const parent = collide.where === 'title' ? tb : collide.where === 'progress' ? pp : foot;
          makeDecoy(parent, collide.label);
        }
      }
      const clr = u.el('button', 'ds-clear', foot, 'Clear');
      clr.type = 'button';
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
