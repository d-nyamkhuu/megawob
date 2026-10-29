// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    overlay: (base, S) =>
      function overlay(ctx) {
        const { K } = S;
        const { rng, util, kind } = ctx;
        const { text } = ctx.content.bannerText(rng, kind === 'banner' ? 'notice' : kind);
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const el = util.el('div', `ref-ov ref-ov-${kind}`, document.body);
        el.dataset.role = 'overlay';
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        if (kind === 'promo') {
          const art = util.el('div', 'aero-promo-art', box);
          art.innerHTML =
            '<svg viewBox="0 0 150 220" width="150" height="220" aria-hidden="true"><defs><linearGradient id="aero-travel-sky" x2="0" y2="1"><stop stop-color="#aee6fc"/><stop offset="1" stop-color="#56bce9"/></linearGradient></defs><path fill="url(#aero-travel-sky)" d="M0 0h150v220H0z"/><path d="M10 28q7-17 15-3 12-7 19 6H5m73 1q8-19 18-3 16-7 25 6H70" fill="#eefaff"/><path d="M-10 124L40 44l28 41 38-43 58 96" fill="#70b7e4"/><path d="M40 44L21 80l20-13 13 4zm66-2L83 79l23-15 16 5" fill="#e5f5fc"/><path d="M0 130l51-42 45 38 42-35 26 45v84H0z" fill="#368ec1"/><path d="M0 168q55-62 150-20v72H0z" fill="#67bba8"/><path d="M25 150q55 2 89 13t-40 24 40 33H45q-48-29-7-44t-13-26" fill="#7bd2ec"/><path d="M0 166q47 17 25 54H0zm150 4q-58 5-55 50h55z" fill="#a5d27c"/><g fill="#267d57"><path d="M12 98l-15 47h30zM25 132l-16 51h32zM134 130l-17 52h34zM120 167l-16 50h32z"/></g><path d="M71 125q-16 0-16 16 0 12 16 31 16-19 16-31 0-16-16-16z" fill="#ff942e" stroke="#fff" stroke-width="2"/><circle cx="71" cy="141" r="6" fill="white"/></svg>';
          util.el('h2', 'aero-promo-title', box, 'Explore More Places');
        }
        util.el(
          'div',
          'ref-ov-text',
          box,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'aero-promo-email', box);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
        }
        const row = util.el('div', 'ref-ov-row', box);
        const btn = (label, how, primary) => {
          if (word && K.button[label]) label = word(K.button[label]);
          const b = util.el('button', primary ? 'ref-ov-btn ref-ov-primary' : 'ref-ov-btn', row, label);
          b.type = 'button';
          b.addEventListener('click', () => (how ? ctx.dismiss(how) : env.log('overlay-click', { label })));
          return b;
        };
        let dismiss;
        if (kind === 'cookie') {
          if (rng.bool(0.5)) btn('Settings', null, false);
          btn(rng.pick(['Reject all', 'Necessary only']), 'reject', false);
          dismiss = btn(rng.pick(['Accept all', 'Accept', 'Got it']), 'accept', true);
        } else if (kind === 'promo') {
          dismiss = btn(rng.pick(['No thanks', 'Maybe later', 'Close']), 'close', false);
          btn(rng.pick(['Upgrade now', 'Start trial', 'Learn more']), null, true);
        } else if (kind === 'banner') {
          dismiss = btn('Dismiss', 'close', false);
        } else {
          dismiss = btn('×', 'close', false);
          dismiss.setAttribute('aria-label', word ? word('close') : 'Close');
        }
        const end = document.querySelector('[data-role="submit"]');
        const endRect = end && end.getBoundingClientRect();
        const bottom =
          endRect && endRect.top > window.innerHeight / 2 ? Math.max(72, window.innerHeight - endRect.top + 12) : 72;
        if (kind === 'cookie' || kind === 'chat') el.style.bottom = bottom + 'px';
        if (kind === 'banner')
          el.style.top = document.querySelector('.map-toolbar').getBoundingClientRect().bottom + 'px';
        if (kind === 'promo') {
          const map = document.querySelector('.mp-port').getBoundingClientRect();
          Object.assign(el.style, { top: map.top + 'px', left: map.left + 'px', right: '7px', bottom: bottom + 'px' });
        }
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.lang': (base, S) =>
      function (_c) {
        const { ctx, rng, util } = _c;
        // Localized frame: same layout draws as English, texts from UI_WORDS (own stream).
        const word = ctx.lang && ctx.lang !== 'en' && ctx.word ? ctx.word : null;
        const lr = rng.fork('chrome/lang');
        const local = (list, keys) => (word ? lr.sample(keys, list.length).map(word) : list);
        const closeLabel = word ? word('close') : 'Close';

        // 2006 desktop utility frame: application title, menu row and map tools.
        const appbar = util.el('div', 'map-appbar', document.body);
        util.el('span', 'map-globe', appbar, '🌍');
        util.el('strong', 'map-appname', appbar, 'City Map');
        util.el('div', 'map-window-controls', appbar, '−　□　×');
        const menubar = util.el('nav', 'map-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'map-menuitem', menubar, item);
        const maptools = util.el('div', 'map-toolbar', document.body);
        const toolArt = {
          pan: '<path d="M12 27l-5-9q-2-4 0-5 2-1 5 4V5q0-4 3-4 3 0 3 4v10V3q0-3 3-3t3 3v12V5q0-3 3-3t3 3v11V9q0-3 3-3t3 3v13l-6 13H16z" fill="#fff" stroke="#284552" stroke-width="2"/>',
          zoomIn:
            '<circle cx="14" cy="13" r="11" fill="#d5eaf4" stroke="#526574" stroke-width="3"/><circle cx="14" cy="13" r="7" fill="#f6fcff" stroke="#fff"/><path d="M22 22l11 11" stroke="#4b5963" stroke-width="7"/><path d="M22 22l10 10" stroke="#a5b6bf" stroke-width="3"/><path d="M8 13h12m-6-6v12" stroke="#366b8d" stroke-width="2"/>',
          zoomOut:
            '<circle cx="14" cy="13" r="11" fill="#e7f1f6" stroke="#526574" stroke-width="3"/><circle cx="14" cy="13" r="7" fill="#fff"/><path d="M22 22l11 11" stroke="#4b5963" stroke-width="7"/><path d="M22 22l10 10" stroke="#a5b6bf" stroke-width="3"/><path d="M7 13h14" stroke="#264b67" stroke-width="3"/>',
          pin: '<path d="M16 20L4 34l8-18" fill="#ced6d9" stroke="#596773"/><path d="M14 7l7 7-6 5-6-6z" fill="#ef5b58" stroke="#9d292a"/><path d="M21 2l10 9q2 3-1 4t-6-2L16 5q-2-4 1-5zM10 12l9 8q2 3-1 4l-13-12q1-3 5 0z" fill="#d43232" stroke="#8c2929"/>',
          flag: '<path d="M6 34V2" stroke="#4f6068" stroke-width="4"/><path d="M8 3q7-4 13 0t10 0v17q-6 3-11 0t-12 0z" fill="#529fce" stroke="#285578" stroke-width="1.5"/><path d="M11 4v13m12-12v13" stroke="#9dd8f3" stroke-width="2"/>',
          print:
            '<path d="M10 3h18v17H10z" fill="#fff" stroke="#778992"/><path d="M5 13h27v16H5z" fill="#9daeba" stroke="#405868" stroke-width="2"/><path d="M10 23h18v11H10z" fill="#f9fcff" stroke="#566e7b"/><path d="M7 16h24v5H7z" fill="#cddde5"/><path d="M13 27h12m-12 3h12" stroke="#92a0a9"/><circle cx="29" cy="23" r="1.5" fill="#43a83e"/>',
        };
        for (const [icon, label] of [
          ['pan', 'Pan'],
          ['zoomIn', 'Zoom In'],
          ['zoomOut', 'Zoom Out'],
          ['pin', 'Add Marker'],
          ['flag', 'Find Place'],
          ['print', 'Print Map'],
        ]) {
          const tool = util.el('span', 'map-tool', maptools);
          const symbol = util.el('span', 'map-tool-icon', tool);
          symbol.innerHTML =
            '<svg viewBox="0 0 38 38" width="31" height="31" aria-hidden="true">' + toolArt[icon] + '</svg>';
          util.el('span', 'map-tool-label', tool, label);
        }
        Object.assign(_c, { appbar, closeLabel, local, lr, maptools, menubar, toolArt, word });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const globe = util.el('span', 'aero-app-globe', header);
        globe.innerHTML =
          '<svg width="35" height="35" viewBox="0 0 36 36"><defs><radialGradient id="aero-globe"><stop stop-color="#9cddf7"/><stop offset="1" stop-color="#2477b5"/></radialGradient></defs><circle cx="18" cy="18" r="16" fill="url(#aero-globe)" stroke="#6787a1"/><path d="M7 8l7-4 5 2-4 6-4-1-1 5-5-1zm16-3l7 6-2 5-5-2-2-5zM12 19l7 2 2 6-4 7-3-4-1-5-5-3zM25 21l6 1-2 6-4 1z" fill="#9fca46" stroke="#82a841" stroke-width=".6"/><path d="M7 7q7-8 16-2" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/></svg>';
        const skyline = util.el('div', 'aero-skyline', header);
        skyline.setAttribute('aria-hidden', 'true');
        for (const [x, height, width] of [
          [0, 26, 13],
          [42, 20, 22],
          [70, 33, 28],
          [108, 48, 19],
          [145, 24, 24],
          [181, 72, 18],
          [211, 41, 17],
          [243, 84, 23],
          [277, 62, 17],
          [319, 26, 22],
          [357, 19, 13],
        ]) {
          const building = util.el('i', '', skyline);
          Object.assign(building.style, { left: x + 'px', height: height + 'px', width: width + 'px' });
        }
        const windowButtons = util.el('div', 'aero-window-buttons', header);
        for (const symbol of ['−', '□', '×']) util.el('span', '', windowButtons, symbol);
        S.frameBrand(_c, header);
        Object.assign(_c, { globe, header, skyline, windowButtons });
      },
  };

  env.site({
    name: 'design-pan-map-zoom-04',
    template: 'site/base',
    design: { parts },
  });
})();
