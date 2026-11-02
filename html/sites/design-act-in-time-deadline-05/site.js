// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-deadline-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-act-in-time-deadline-05',
        'brand': 'Sunny Meadow',
        'title': 'Recipe of the Day',
        'instruction': 'top',
        'rail': '',
        'menu': 'Home|Recipes|Pantry|Garden|Cooking School|Community',
        'briefTitle': 'Instructions',
      },
      parts: {
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { u } = _c;
            _c.nav = null;
            if (C.menu) {
              _c.nav = u.el('nav', 'ds-menu', document.body);
            const icons = [
              '<path d="M4 21 24 3l20 18-4 4-4-3v21H12V22l-4 3z" fill="#ecd894" stroke="#522416" stroke-width="2"/><path d="M7 21 24 6l17 15" fill="none" stroke="#ad3526" stroke-width="5"/><rect x="20" y="27" width="9" height="16" fill="#7b3422"/><rect x="14" y="23" width="5" height="6" fill="#63a3a2"/>',
              '<path d="M24 10C17 5 8 7 3 9v31c8-3 16-2 21 3 5-5 13-6 21-3V9c-5-2-14-4-21 1z" fill="#f4db8a" stroke="#a46a25" stroke-width="2"/><path d="M24 10v33M8 15c6-2 10-1 13 1M8 21c6-2 10-1 13 1M8 27c6-2 10-1 13 1M27 16c4-2 9-3 14-1M27 22c4-2 9-3 14-1M27 28c4-2 9-3 14-1" fill="none" stroke="#986729" stroke-width="1.4"/>',
              '<path d="M10 20h28l-4 23H14z" fill="#bd7624" stroke="#4a2915" stroke-width="2"/><path d="M15 20c0-16 18-16 18 0M7 24h34M11 30h26M13 36h22M19 22v20M27 22v20" fill="none" stroke="#f4c46b" stroke-width="3"/><path d="M10 18h28" stroke="#4a2915" stroke-width="2"/>',
              '<path d="M24 30v17M23 40c-12-12-19-5-13-2 4 3 8 3 13 4M25 38c11-11 17-5 12-1-4 3-8 3-12 3" stroke="#547f28" stroke-width="2" fill="#7b9836"/>' + Array.from({length:16}, (_, i) => '<path d="M24 18C17 13 20 4 24 1c4 5 7 12 0 17Z" transform="rotate(' + (i * 22.5) + ' 24 23)" fill="' + (i % 2 ? '#f1c637' : '#e6aa24') + '" stroke="#966c1e" stroke-width=".65"/>').join('') + '<circle cx="24" cy="23" r="10" fill="#684b28" stroke="#d4a039" stroke-width="2"/><circle cx="24" cy="23" r="6.5" fill="#3d3424"/><path d="M20 20h1m3-2h1m2 4h1m-7 3h1m3 2h1m-2-4h1" stroke="#b2a26b" stroke-width="1.1"/>',
              '<rect x="8" y="5" width="32" height="40" rx="2" fill="#d6b371" stroke="#432c1a" stroke-width="3"/><rect x="13" y="11" width="22" height="30" fill="#f0e1af"/><rect x="18" y="3" width="13" height="7" rx="2" fill="#94642b" stroke="#3e2b1a"/><path d="M16 17h3m4 0h9M16 24h3m4 0h9M16 31h3m4 0h9" stroke="#654323" stroke-width="2"/>',
              '<circle cx="17" cy="13" r="7" fill="#e8b18a"/><circle cx="32" cy="13" r="7" fill="#d6976e"/><path d="M5 43V28c0-8 5-12 12-12s12 4 12 12v15z" fill="#a53543" stroke="#3e2c25" stroke-width="2"/><path d="M21 43V28c0-8 5-12 12-12s12 4 12 12v15z" fill="#386b7c" stroke="#3e2c25" stroke-width="2"/><path d="M10 9c2-7 12-8 14 1M25 9c2-7 12-8 14 1" fill="none" stroke="#3c2926" stroke-width="5"/>'
            ];
            C.menu.split('|').forEach((t, i) => {
              const item = u.el('span', i === 0 ? 'selected' : '', _c.nav);
              item.innerHTML = '<svg class="sm-nav-icon" viewBox="0 0 48 48" aria-hidden="true">' + icons[i] + '</svg><span>' + t + '</span>';
            });
            const brand = u.el('div', 'sm-brand', document.body);
            brand.innerHTML = '<strong>Sunny Meadow</strong><small>— GOOD FOOD　❧　BRIGHTER DAYS —</small>';
            const hero = u.el('section', 'sm-hero', document.body);
            hero.innerHTML = '<div class="sm-welcome"><b>Welcome to<br><strong>Sunny Meadow</strong></b><i>❧</i><p>Recipes, tips and inspiration<br>for a happier home.</p></div><div class="sm-landscape"></div><div class="sm-season"><b>In Season Now</b><i>❧</i><span>🍎　Apples</span><span>🎃　Pumpkins</span><span>🌿　Fresh Herbs</span><span>☘　Garden Greens</span></div>';
            const produce = [
              '<defs><radialGradient id="season-apple" cx=".3" cy=".25"><stop stop-color="#f9d879"/><stop offset=".35" stop-color="#dc3930"/><stop offset="1" stop-color="#8b1020"/></radialGradient></defs><path d="M8 14c-4-13 6-17 11-12 8-5 17 1 13 13-3 12-9 17-13 14-6 3-10-5-11-15Z" transform="translate(0 5)" fill="url(#season-apple)" stroke="#71301a"/><path d="M19 8 21 1" stroke="#69401b" stroke-width="2"/><path d="M22 5c2-6 9-4 10-2-4 4-8 4-10 2" fill="#4f7b29"/>',
              '<path d="M18 9 17 1l5 1-1 8" fill="#52712c"/><ellipse cx="19" cy="21" rx="17" ry="13" fill="#dd7525" stroke="#9d4318"/><ellipse cx="19" cy="21" rx="11" ry="13" fill="#e28a33" stroke="#a84d17"/><ellipse cx="19" cy="21" rx="5" ry="13" fill="#f4a047" stroke="#b55a1d"/>',
              '<path d="m5 34 25-30M10 28l-4-13M15 22l17-1M21 15l-3-13M27 8l10-2" stroke="#426e29" stroke-width="1.7"/>' + [[7,18,-25],[10,23,40],[14,14,-35],[22,20,65],[19,8,-30],[29,12,65],[27,4,30],[31,22,80]].map(([x,y,a])=>'<ellipse cx="'+x+'" cy="'+y+'" rx="3" ry="7" transform="rotate('+a+' '+x+' '+y+')" fill="#62803b" stroke="#3a6026" stroke-width=".5"/>').join(''),
              '<g fill="#426e29" stroke="#315923" stroke-width=".8"><ellipse cx="12" cy="13" rx="7" ry="11" transform="rotate(-35 12 13)"/><ellipse cx="24" cy="13" rx="7" ry="12" transform="rotate(28 24 13)"/><ellipse cx="10" cy="25" rx="8" ry="10" transform="rotate(-60 10 25)"/><ellipse cx="29" cy="26" rx="8" ry="11" transform="rotate(49 29 26)"/><ellipse cx="19" cy="24" rx="7" ry="12"/></g><path d="m19 36-7-24m7 24 5-25m-5 25L7 26m12 10 12-13m-12 13V16" stroke="#a1ad55" fill="none" stroke-width="1"/>'
            ];
            hero.querySelectorAll('.sm-season>span').forEach((row, i) => {
              row.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true">' + produce[i] + '</svg><span>' + ['Apples', 'Pumpkins', 'Fresh Herbs', 'Garden Greens'][i] + '</span>';
            });
            const decor = u.el('div', 'sm-recipe-banner', document.body);
            decor.innerHTML = '<div class="sm-recipe-icon"><svg viewBox="0 0 110 90" aria-hidden="true"><defs><linearGradient id="box-gold"><stop stop-color="#9b5b1c"/><stop offset=".3" stop-color="#f0c45b"/><stop offset="1" stop-color="#b57c25"/></linearGradient><linearGradient id="box-front" x2="1" y2="1"><stop stop-color="#ffe09a"/><stop offset=".7" stop-color="#e6b84e"/><stop offset="1" stop-color="#a76c20"/></linearGradient></defs><path d="M11 33 9 9 89 4l1 30" fill="url(#box-gold)" stroke="#673c1c" stroke-width="2"/><path d="M18 29V14L89 9l2 27" fill="#fff2c2" stroke="#a4854a"/><path d="m23 27-1-9 56-4 1 9" fill="#edd8a2"/><path d="m18 28 79-6 2 24-79 5Z" fill="#fff6d6" stroke="#ae8e54"/><path d="m22 35 70-6m-66 12 39-3" stroke="#8d7352" stroke-width="1"/><path d="M8 29 3 35l2 49 13 5 1-51Z" fill="url(#box-gold)" stroke="#74411a" stroke-width="1.7"/><path d="m17 39 85-6-6 49-78 7Z" fill="url(#box-front)" stroke="#9b6428" stroke-width="1.5"/><path d="m22 43 72-5-5 38-66 6Z" fill="#efd179" opacity=".55"/><path d="M53 72c1-11 3-18 9-24M55 69 39 59m17 8 17-6" stroke="#567829" stroke-width="2"/><path d="M52 65c-8-15-21-9-12-3-11 5-6 16 3 7-3 14 9 16 10 4 10 8 20-1 8-7 14-3 10-15 1-8 3-13-9-15-10-3Z" fill="#b84c69" stroke="#97445a" stroke-width=".7"/><circle cx="53" cy="65" r="4" fill="#f9c74e"/><path d="M43 77c-12-5-19 1-16 4 8 1 12-1 16-4m18-4c13-6 18-2 16 1-7 3-12 2-16-1" fill="#5b832c"/></svg></div><div><b>Recipe of the Day</b><small>A fresh idea from our kitchen to yours.</small></div>';
            const lower = u.el('div', 'sm-lower', document.body);
            lower.innerHTML = '<section class="sm-feature"><div class="sm-crisp"></div><div class="sm-recipe-copy"><h2>Country Apple Crisp</h2><p>Sweet, tender apples under a crunchy oat topping. A classic dessert that brings the taste of the orchard to your table.</p></div></section><aside class="sm-inspector"><nav><b>Details</b><span>Directions</span><span>Cook’s Notes</span><span>Related Recipes</span></nav><div class="sm-facts"><p><b>Prep Time:</b><span>20 minutes</span></p><p><b>Cook Time:</b><span>40 minutes</span></p><p><b>Servings:</b><span>8</span></p><p><b>Category:</b><span>Desserts</span></p><p><b>Main Ingredient:</b><span>Apples</span></p><p><b>Difficulty:</b><span>Easy</span></p></div><div class="sm-flourish">❧</div><p class="sm-inspector-copy">A warm and comforting dessert made with fresh apples, cinnamon and a crunchy oat topping. Perfect for family gatherings or a cozy night in.</p><div class="sm-apples"><svg viewBox="0 0 220 150" aria-hidden="true"><defs><radialGradient id="appleRed"><stop stop-color="#f7c158"/><stop offset=".48" stop-color="#df4f32"/><stop offset="1" stop-color="#8d1f29"/></radialGradient><linearGradient id="stick"><stop stop-color="#98512c"/><stop offset=".5" stop-color="#c07b3a"/><stop offset="1" stop-color="#4c2a1d"/></linearGradient></defs><ellipse cx="123" cy="133" rx="92" ry="11" fill="#d2bc9b" opacity=".5"/><path d="M36 111c-2-36 17-53 40-45 14-6 31 0 36 22 8 32-5 55-29 54-8-2-18-2-25 0-15 1-22-11-22-31z" fill="url(#appleRed)" stroke="#8c3c25" stroke-width="2"/><path d="M104 116c-2-37 18-56 43-48 16-8 34 2 36 25 5 36-8 52-29 51-9-2-20-3-29 0-13 1-20-12-21-28z" fill="url(#appleRed)" stroke="#8c3c25" stroke-width="2"/><path d="M70 61c2-12 5-19 9-23M145 67c3-13 6-20 11-25" stroke="#5d3522" stroke-width="5" fill="none"/><path d="M80 46c-17-20-35-15-39-3 19 1 30 6 39 10M155 49c15-20 35-17 43-4-15 6-30 8-44 12" fill="#4e832d" stroke="#315626" stroke-width="2"/><path d="M21 137 89 110l10 7-69 29zM51 139 120 110l10 6-69 30z" fill="url(#stick)" stroke="#60341c" stroke-width="2"/><path d="M36 135 101 110M65 137l60-23" stroke="#4e2a18" stroke-width="2"/><path d="M88 111q-9 8 11 6M119 110q-10 9 11 6" fill="none" stroke="#482615" stroke-width="2"/></svg></div></aside>';
            const illustration = lower.querySelector('.sm-apples');
            illustration.replaceChildren();
            const apples = u.el('img', '', illustration);
            apples.src = new URL('assets/apples-cinnamon.png', new URL('sites/design-act-in-time-deadline-05/', document.baseURI)).href;
            apples.alt = '';
            lower.querySelector('.sm-flourish').textContent = '';
            u.el('span', 'sm-flourish-icon', lower.querySelector('.sm-flourish'));
            u.el('span', 'sm-scroll-thumb', lower.querySelector('.sm-inspector')).setAttribute('aria-hidden', 'true');
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, foot, top, u } = _c;
            const er = ctx.rng.fork('chrome/end');
            const labels = (
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x));
            const submitWord = labels.find((x) => x.trim().toLowerCase() === 'submit') || labels[0] || 'Submit';
            const classic = er.bool(0.5);
            const placement = classic ? 'footer' : er.pick(['header', 'link']);
            const label = classic ? submitWord : er.pick(labels);
            const cr = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (cr.bool(0.3)) {
              const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              if (options.length)
                _c.collide = { label: cr.pick(options), where: cr.pick(['header', 'header', 'footer']) };
            }
            const makeEnd = (parent, cls, text, tag = 'button') => {
              const b = u.el(tag, cls, parent, text);
              if (tag === 'button') b.type = 'button';
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
            const decoy = (parent, text) => {
              const b = u.el('button', 'ds-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
              return b;
            };
            _c.submit = null;
            if (_c.nav && (placement === 'header' || (_c.collide && _c.collide.where === 'header'))) {
              const tools = u.el('span', 'ds-menu-tools', _c.nav);
              if (_c.collide && _c.collide.where === 'header') decoy(tools, _c.collide.label);
              if (placement === 'header' && !ctx.finish) _c.submit = makeEnd(tools, 'ds-submit ds-head-submit', label);
            } else if (_c.collide && _c.collide.where === 'header') {
              const tools = u.el('span', 'ds-menu-tools', _c.nav || top);
              decoy(tools, _c.collide.label);
              if (placement === 'header' && !ctx.finish) _c.submit = makeEnd(tools, 'ds-submit ds-head-submit', label);
            }
            if (_c.collide && _c.collide.where === 'footer') decoy(foot, _c.collide.label);
            if (!ctx.finish && placement === 'footer') _c.submit = makeEnd(foot, 'ds-submit', label);
            if (!ctx.finish && placement === 'link') _c.submit = makeEnd(foot, 'ds-endlink', label + ' ›');
            Object.assign(_c, { classic, cr, decoy, er, label, labels, makeEnd, placement, submitWord });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': (base) => (_c) => {
          const { ctx, foot } = _c;
          const mode = ctx.display || 'header';
          document.body.classList.remove('sm-mode-header', 'sm-mode-panel', 'sm-mode-toast', 'sm-mode-hidden');
          document.body.classList.add('sm-mode-' + mode);
          document.body.classList.toggle('sm-has-footer', !!foot.querySelector('button,a'));
          document.body.classList.toggle('sm-has-header-tools', !!document.querySelector('.ds-menu-tools'));
          const tools = document.querySelector('.ds-menu-tools');
          if (tools) document.querySelector('.sm-brand').style.right = 'calc(' + Math.ceil(tools.getBoundingClientRect().width) + 'px + 2.2vw)';
          return base(_c);
        },
      },
    },
  });
})();
