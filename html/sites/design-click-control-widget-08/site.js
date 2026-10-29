(function () {
  'use strict';
  const cfg = {
    'title': 'Museum Explorer',
    'theme': 'cdrom',
    'layout': 'stacked',
    'tabs': ['Home', 'Exhibits', 'Collections', 'Activities', 'Visit'],
    'nav': ['Explore', 'Learn', 'Discover', 'Settings'],
    'obstacle': 'Welcome!',
    'copy': 'This short tour will show you around the interface.',
    'dismiss': 'Skip tour',
  };
  const GLYPH = {
    Explore:
      '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#d9b04a" stroke="#fbe9a0" stroke-width="2"/><circle cx="16" cy="16" r="9" fill="#2a2a7a"/><path d="M16 5l3 11-3 11-3-11z" fill="#f2d57a"/><path d="M5 16l11-3 11 3-11 3z" fill="#c9a43f"/></svg>',
    Learn:
      '<svg viewBox="0 0 32 32"><path d="M3 7l13 3 13-3v18l-13 3-13-3z" fill="#e8c978" stroke="#8a6a20" stroke-width="1.5"/><path d="M16 10v18" stroke="#8a6a20" stroke-width="1.5"/></svg>',
    Discover:
      '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#2f5fb5" stroke="#d9b04a" stroke-width="2"/><path d="M8 12c4-3 6 1 8-1s5 0 6 3-3 5-5 5-2 4-5 3-5-6-4-10z" fill="#6aa96a"/></svg>',
    Settings:
      '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="9" fill="#9a9aa8" stroke="#555" stroke-width="2" stroke-dasharray="4 2.2"/><circle cx="16" cy="16" r="5" fill="#2a2a7a"/></svg>',
  };
  const TEMPLE =
    '<svg viewBox="0 0 86 90"><defs><linearGradient id="column"><stop stop-color="#8a5a13"/><stop offset=".3" stop-color="#fff5b4"/><stop offset=".53" stop-color="#e9c35a"/><stop offset="1" stop-color="#926321"/></linearGradient><linearGradient id="gold" x2="0" y2="1"><stop stop-color="#fff9c6"/><stop offset=".4" stop-color="#eac66d"/><stop offset="1" stop-color="#a07824"/></linearGradient></defs><g stroke="#261b0a" stroke-width="1.4"><path d="M3 26L43 4l40 22-5 4H8Z" fill="url(#gold)"/><path d="M12 25L43 9l31 16Z" fill="#fff0ac"/><path d="M7 30H79V35H7Z" fill="url(#gold)"/><g fill="url(#column)"><path d="M11 37H22L20 74H13Z"/><path d="M29 37H40L38 74H31Z"/><path d="M47 37H58L56 74H49Z"/><path d="M65 37H76L74 74H67Z"/></g><g fill="url(#gold)"><path d="M10 34H23V39H10ZM28 34H41V39H28ZM46 34H59V39H46ZM64 34H77V39H64Z"/><path d="M10 72H23V77H10ZM28 72H41V77H28ZM46 72H59V77H46ZM64 72H77V77H64Z"/><path d="M7 77H79V82H7ZM2 83H84V88H2Z"/></g></g><path d="M6 84H81M10 31H77" stroke="#fff0ac"/></svg>';
  const FLOORPLAN =
    '<svg class="museum-floorplan" viewBox="0 0 390 308" preserveAspectRatio="none"><defs><linearGradient id="ancient" x2="1" y2="1"><stop stop-color="#9f9fc8"/><stop offset=".6" stop-color="#9397c0"/><stop offset="1" stop-color="#a8acd2"/></linearGradient><linearGradient id="modern" x2="1" y2="1"><stop stop-color="#86a482"/><stop offset="1" stop-color="#619476"/></linearGradient><linearGradient id="natural" x2="1" y2="1"><stop stop-color="#bda87c"/><stop offset="1" stop-color="#a39675"/></linearGradient><linearGradient id="special" x2="1" y2="1"><stop stop-color="#c59e95"/><stop offset="1" stop-color="#ad827f"/></linearGradient></defs><g stroke="#28251a" stroke-width="1.4"><path fill="url(#ancient)" d="M0 0H183V30H179V52H183V94A69 69 0 0 0 134 140H87V125H58V140H0Z"/><path fill="url(#modern)" d="M214 0H390V183H348V125H318V140H264A69 69 0 0 0 214 94V52H218V30H214Z"/><path fill="url(#natural)" d="M0 184H58V188H87V173H132A69 69 0 0 0 174 225V258H166V281H124V307H0Z"/><path fill="url(#special)" d="M264 173H318V188H348V184H390V307H264V281H222V258H224V225A69 69 0 0 0 264 173Z"/><path d="M0 140H57V183H0Z" fill="#aaaacb"/><path d="M184 0H213V18H184Z" fill="#ddd5bb"/><path d="M185 17H191M206 17H213" stroke="#fff8dc" stroke-width="3"/><g fill="#e4dec8" stroke="#66675c"><path d="M0 81H19V101H0Z"/><path d="M376 101H390V117H376Z"/><path d="M380 178H390V184H380Z"/></g><path d="M185 288l12-19 11 19Z" fill="#cd2926" stroke="#fff0bd" stroke-width="1.5"/></g><circle cx="198" cy="159" r="47" fill="#d7caa7" opacity=".7"/><g fill="#090805" text-anchor="middle" font-family="Georgia,Times New Roman,serif" font-size="23"><text x="85" y="52">Ancient<tspan x="85" dy="26">Worlds</tspan></text><text x="306" y="52">Modern<tspan x="306" dy="26">Life</tspan></text><text x="78" y="244">Natural<tspan x="78" dy="26">Wonders</tspan></text><text x="316" y="244">Special<tspan x="316" dy="26">Exhibits</tspan></text><text x="198" y="155">Great<tspan x="198" dy="26">Hall</tspan></text></g><rect width="390" height="308" fill="url(#unused)" opacity="0"/><rect width="390" height="308" fill="none" stroke="#393124" stroke-width="1.4"/></svg>';
  const GOLDDEFS =
    '<defs><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#fff8c3"/><stop offset=".3" stop-color="#e8c36b"/><stop offset=".6" stop-color="#ae761c"/><stop offset=".8" stop-color="#f7d880"/><stop offset="1" stop-color="#7b5018"/></linearGradient></defs>';
  GLYPH.Explore =
    '<svg viewBox="0 0 52 58">' +
    GOLDDEFS +
    '<g stroke="#442d11"><circle cx="26" cy="5" r="3" fill="url(#metal)"/><path d="M24 51h4v6h-4z" fill="url(#metal)"/><circle cx="26" cy="29" r="23" fill="url(#metal)"/><circle cx="26" cy="29" r="18" fill="#edca76"/><circle cx="26" cy="29" r="15" fill="none"/><path d="M26 11l4 14 14 4-14 4-4 14-4-14-14-4 14-4z" fill="#7b4c13"/><path d="M26 11v36M8 29h36M14 17l24 24M14 41l24-24" stroke="#fff0b0"/><path d="M26 11l-4 18h4zM44 29l-18 4v-4zM26 47l4-18h-4z" fill="#553511"/></g><circle cx="26" cy="29" r="2" fill="#fff3b6"/></svg>';
  GLYPH.Learn =
    '<svg viewBox="0 0 54 54">' +
    GOLDDEFS +
    '<g stroke="#4c300b" stroke-width="1.5"><path d="M3 10q12-5 24 0 12-5 24 0v36q-12-4-24 0-12-4-24 0Z" fill="url(#metal)"/><path d="M7 8q9-4 18 1v31q-8-5-18-2Z" fill="#ffedb6"/><path d="M29 9q9-5 18-1v30q-10-3-18 2Z" fill="#f9e1a0"/><path d="M26 11v34" stroke="#805514"/><path d="M10 12v23M14 11v24M43 12v23" stroke="#d4b471" stroke-width=".5"/></g></svg>';
  GLYPH.Discover =
    '<svg viewBox="0 0 54 56">' +
    GOLDDEFS +
    '<ellipse cx="27" cy="27" rx="23" ry="24" fill="url(#metal)" stroke="#5a3a12"/><circle cx="27" cy="27" r="19" fill="#172660" stroke="#ffde78" stroke-width="2"/><g fill="url(#metal)"><path d="M18 10l8 2 1 5-6 5-2 6-4-2-3-8zM31 10l8 5 4 10-5 2-2-6-5-2zM26 26l8 1 3 5-5 12-7 2-3-7 4-7-5-4z"/></g><ellipse cx="27" cy="27" rx="11" ry="19" fill="none" stroke="#c7a34a" transform="rotate(18 27 27)"/><path d="M12 18l29 10M9 30l28 10" stroke="#c7a34a" opacity=".7"/></svg>';
  GLYPH.Settings =
    '<svg viewBox="0 0 54 54"><defs><linearGradient id="steel" x2="1" y2="1"><stop stop-color="#fffddd"/><stop offset=".5" stop-color="#c7c9bc"/><stop offset="1" stop-color="#737d7c"/></linearGradient></defs><path d="M22 2h10l1 8 5 2 6-5 7 7-5 6 2 5 7 1v10l-8 1-2 5 5 6-7 7-6-5-5 2-1 7H21l-1-8-5-2-6 5-7-7 5-6-2-5-7-1V23l8-1 2-5-5-6 7-7 6 5 5-2Z" transform="translate(3 2) scale(.86)" fill="url(#steel)" stroke="#25272b" stroke-width="2"/><circle cx="27" cy="27" r="10" fill="#10164a" stroke="#eee9d0" stroke-width="2"/></svg>';
  env.site({
    name: 'design-click-control-widget-08',
    styles: ['site.css', 'cdrom.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ]
      ).map(labelOf);
      const originalEnd = endRng.bool(0.5);
      const endPlacement = originalEnd ? 'footer' : endRng.pick(['header', 'link']);
      const endLabel = originalEnd ? 'Submit' : endRng.pick(endWords);
      const collideRng = ctx.rng.fork('chrome/collide');
      const otherWords = endWords.filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collideLabel = collideRng.bool(0.3) && otherWords.length ? collideRng.pick(otherWords) : null;
      const win = u.el('main', 'cd-win', document.body);
      const head = u.el('header', 'cd-head', win);
      const logo = u.el('span', 'cd-logo', head);
      logo.innerHTML = TEMPLE;
      const tt = u.el('div', 'cd-titlebox', head);
      u.el('div', 'cd-title', tt, cfg.title);
      u.el('div', 'cd-sub', tt, 'ART  •  HISTORY  •  PEOPLE  •  PLACES');
      const tag = u.el('div', 'cd-tag', head);
      u.el('div', '', tag, 'A World of Discovery');
      u.el('div', '', tag, 'on CD-ROM');
      const wc = u.el('span', 'cd-wc', head);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wc, t));
      const tabs = u.el('nav', 'cd-tabs', win);
      cfg.tabs.forEach((t, i) => u.el('div', 'cd-tab' + (i === 1 ? ' on' : ''), tabs, t));
      const sheet = u.el('section', 'cd-sheet', win);
      const note = u.el('div', 'instruction cd-note', sheet);
      const ic = u.el('span', 'cd-info', note, 'i');
      u.el('span', 'cd-note-text', note, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      note.setAttribute('role', ctx.display === 'toast' ? 'status' : 'note');
      const roomy = win.clientWidth >= 1000 && win.clientHeight >= 720;
      if (ctx.display === 'panel' && roomy) note.classList.add('cd-note-panel');
      if (ctx.display === 'toast' && roomy) note.classList.add('cd-note-toast');
      u.el('h2', 'cd-h2', sheet, 'Plan Your Visit');
      u.el('p', 'cd-lead', sheet, 'Tell us a little about yourself.');
      u.el('hr', 'cd-rule', sheet);
      const stage = u.el('div', 'stage cd-stage', sheet);
      u.el('hr', 'cd-rule cd-rule2', sheet);
      const btns = u.el('div', 'cd-btns', sheet);
      const clear = u.el('button', 'cd-clear', btns, 'Clear');
      clear.type = 'button';
      clear.dataset.role = 'xtra';
      clear.addEventListener('click', () => env.log('decoy', { label: 'Clear' }));
      if (collideLabel) {
        const decoy = u.el('button', 'cd-clear cd-xtra', btns, collideLabel);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
      }
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlacement === 'header' ? head : btns;
        submit = u.el(endPlacement === 'link' ? 'a' : 'button', 'submit cd-end-' + endPlacement, parent, endLabel);
        if (endPlacement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (endPlacement === 'header') tag.hidden = true;
      }
      const foot = u.el('footer', 'cd-foot', win);
      const navs = u.el('div', 'cd-navs', foot);
      cfg.nav.forEach((n) => {
        const b = u.el('div', 'cd-nav', navs);
        const g = u.el('span', 'cd-glyph', b);
        g.innerHTML = GLYPH[n];
        u.el('span', '', b, n);
      });
      const cul = u.el('div', 'cd-culture', foot);
      u.el('div', '', cul, 'Culture');
      u.el('div', '', cul, 'Brings Us Together');
      u.el('i', '', cul);
      const mw = u.el('aside', 'cd-map-win', document.body);
      const mh = u.el('div', 'cd-mh', mw);
      const ml = u.el('span', 'cd-mlogo', mh);
      ml.innerHTML = TEMPLE;
      u.el('span', 'cd-mt', mh, 'Map & Help');
      const mc = u.el('span', 'cd-wc', mh);
      ['_', '□', '×'].forEach((t) => u.el('i', '', mc, t));
      const mt = u.el('div', 'cd-mtabs', mw);
      u.el('div', 'cd-mtab on', mt, 'Museum Map');
      u.el('div', 'cd-mtab', mt, 'Help Topics');
      const mb = u.el('div', 'cd-mbody', mw);
      u.el('h3', '', mb, 'Museum Map');
      const mp = u.el('div', 'cd-mapbox', mb);
      const map = u.el('div', 'cd-map', mp);
      map.innerHTML = FLOORPLAN;
      u.el('div', 'cd-arrow', map);
      u.el('div', 'cd-entr', mp, 'Main Entrance');
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.kind === 'chat') {
        const old = document.querySelector('.design-obstacle');
        if (old) old.hidden = true;
        const el = ctx.util.el('section', 'perturb chat tour-overlay', document.body);
        ctx.util.el('h2', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const dismiss = ctx.util.el('button', 'dismiss-design', el, cfg.dismiss);
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        const next = ctx.util.el('button', 'next-design', el, 'Next');
        next.type = 'button';
        next.addEventListener('click', ctx.dismiss);
        const x = ctx.util.el('button', 'x-design', el, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        x.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
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
