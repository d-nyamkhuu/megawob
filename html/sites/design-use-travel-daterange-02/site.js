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
        if (kind === 'banner') document.body.classList.add('ref-banner-space');
        const box = kind === 'promo' ? util.el('div', 'ref-ov-box', el) : el;
        let copy = box;
        if (kind === 'promo') {
          const art = util.el('div', 'travel-offer-art', box);
          const photo = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          photo.setAttribute('viewBox', '717 763 253 105');
          photo.setAttribute('preserveAspectRatio', 'xMidYMid slice');
          photo.setAttribute('aria-hidden', 'true');
          const bitmap = document.createElementNS('http://www.w3.org/2000/svg', 'image');
          bitmap.setAttribute('width', '1672');
          bitmap.setAttribute('height', '941');
          const paths = [
            new URL('sites/design-use-travel-daterange-02/assets/header-reference.webp', document.baseURI).href,
            new URL('/sites/design-use-travel-daterange-02/assets/header-reference.webp', location.href).href,
          ];
          let pathIndex = 0;
          bitmap.onerror = () => {
            if (++pathIndex < paths.length) bitmap.setAttribute('href', paths[pathIndex]);
          };
          bitmap.setAttribute('href', paths[pathIndex]);
          photo.append(bitmap);
          art.append(photo);
          copy = util.el('div', 'travel-offer-content', box);
          util.el('div', 'travel-offer-kicker', copy, 'SPECIAL OFFER');
          util.el('h2', '', copy, 'Save 15% on stays in Europe');
        }
        util.el(
          'div',
          'ref-ov-text',
          copy,
          word ? word(rng.fork('lang').pick(K.overlay[kind] || K.overlay.toast)) : text,
        );
        if (kind === 'promo') {
          const email = util.el('input', 'travel-offer-email', copy);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
        }
        const row = util.el('div', 'ref-ov-row', copy);
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
        return { el, dismiss, ttlSteps: kind === 'toast' ? rng.int(3, 5) : 0 };
      },
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');
        document.body.classList.remove('ref-banner-space');
        Object.assign(_c, { H, W, display, roomy, tall });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.dataset.hero = display === 'header' ? 'clean' : 'reference';
        const heroAsset = display === 'header' ? 'brno-hero-v2.webp' : 'header-reference.webp';
        const heroImage = util.el('img', 'travel-hero-image', header);
        heroImage.alt = '';
        const heroPaths = [
          new URL(`sites/design-use-travel-daterange-02/assets/${heroAsset}`, document.baseURI).href,
          new URL(`/sites/design-use-travel-daterange-02/assets/${heroAsset}`, location.href).href,
          new URL(`assets/${heroAsset}`, document.baseURI).href,
          new URL(`/assets/${heroAsset}`, location.href).href,
        ];
        let heroPathIndex = 0;
        heroImage.onerror = () => {
          if (++heroPathIndex < heroPaths.length) heroImage.src = heroPaths[heroPathIndex];
        };
        heroImage.src = heroPaths[heroPathIndex];
        const heroCopy = util.el('div', 'travel-hero-copy', header);
        util.el('h1', '', heroCopy, 'Find your stay');
        util.el('p', '', heroCopy, 'Hotels, apartments and more around the world');
        const heroSearch = util.el('div', 'travel-hero-search', heroCopy);
        const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        searchIcon.setAttribute('viewBox', '0 0 24 24');
        searchIcon.setAttribute('aria-hidden', 'true');
        const searchPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        searchPath.setAttribute('d', 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z');
        searchIcon.append(searchPath);
        heroSearch.append(searchIcon);
        util.el('span', '', heroSearch, 'Search destinations, hotels or areas');
        util.el('span', 'travel-hero-place', header, 'Brno, Czechia');
        const rail = util.el('nav', 'travel-rail', document.body);
        const railItems = [
          ['plane', 'Trips'],
          ['bed', 'Hotels'],
          ['plane', 'Flights'],
          ['car', 'Cars'],
          ['pin', 'Destinations'],
          ['list', 'Itineraries'],
        ];
        const railSvg = (parent, name) => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('aria-hidden', 'true');
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const paths = {
            bag: 'M7 2h10a2 2 0 0 1 2 2v3h2a2 2 0 0 1 2 2v12H1V9a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2Zm0 5h10V4H7v3ZM5 7v14h2V7H5Zm12 0v14h2V7h-2Z',
            bed: 'M3 5H1v16h2v-4h18v4h2V9a3 3 0 0 0-3-3h-8v8H3V5Zm4 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
            plane: 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5Z',
            car: 'm5 3-3 8v9a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h14v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-9l-3-8H5Zm1.3 2h11.4l1.8 5h-15l1.8-5ZM6 12a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm12 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z',
            pin: 'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z',
            list: 'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 4v2h12V6H6Zm0 5v2h12v-2H6Zm0 5v2h9v-2H6Z',
          };
          path.setAttribute('d', paths[name]);
          svg.append(path);
          parent.append(svg);
          path.setAttribute('fill-rule', 'evenodd');
        };
        const mark = util.el('div', 'travel-rail-mark', rail);
        railSvg(mark, 'bag');
        for (const [icon, label] of railItems) {
          const item = util.el('a', `travel-rail-item${label === 'Hotels' ? ' active' : ''}`, rail);
          item.href = '#';
          item.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label });
          });
          const glyph = util.el('span', 'travel-rail-icon', item);
          railSvg(glyph, icon);
          util.el('span', 'travel-rail-label', item, label);
        }
        S.frameBrand(_c, header);
        Object.assign(_c, {
          header,
          heroAsset,
          heroCopy,
          heroImage,
          heroPathIndex,
          heroPaths,
          heroSearch,
          mark,
          rail,
          railItems,
          railSvg,
          searchIcon,
          searchPath,
        });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, heroCopy, heroSearch, util } = _c;
        if (display === 'header') {
          const instruction = util.el('div', 'ref-instruction', heroCopy, ctx.instruction);
          heroCopy.insertBefore(instruction, heroSearch);
        } else util.el('div', 'ref-spacer', header);
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        if (display === 'panel') {
          const panel = util.el('aside', 'ref-panel', body);
          const heading = rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
          util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : heading);
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          document.body.style.setProperty('--travel-note-height', `${panel.getBoundingClientRect().height}px`);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
      },
  };

  env.site({
    name: 'design-use-travel-daterange-02',
    template: 'site/base',
    design: { parts },
  });
})();
