(function () {
  'use strict';
  const palette = { bg: '#f1e8d5', panel: '#f8f0df', fg: '#382115', muted: '#806b53', line: '#d8c8aa' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const head = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brand', head);
      u.el('span', 'ds-leaf', brand, '❧');
      const heading = u.el('div', 'ds-brand-copy', brand);
      u.el('strong', '', heading, 'My Kitchen');
      const links = u.el('nav', 'ds-links', heading);
      ['Recipes', 'Meal Plans', 'Shopping Lists', 'A Healthier You'].forEach((x) => u.el('span', '', links, x));
      u.el('div', 'ds-search', head, '⌕  Search recipes, ingredients, or keywords...');
      u.el('div', 'ds-produce', head, '🍅   🫒');
      const content = u.el('div', 'ds-content', document.body);
      const header = u.el('div', 'ds-header-note', content);
      header.hidden = _c.display !== 'header';
      if (_c.display === 'header') u.el('span', '', header, 'Today in your kitchen');
      Object.assign(_c, { head, content, header });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const rail = u.el('aside', 'ds-rail', document.body);
      [
        ['◆', 'Home'], ['♜', 'Recipes'], ['▤', 'Meal Plan'], ['🛒', 'Shopping List'],
        ['▱', 'Pantry'], ['▦', 'Calendar'], ['★', 'Favorites'], ['⚙', 'Settings'],
      ].forEach((it, i) => {
        const a = u.el('div', 'ds-navitem' + (i === 1 ? ' active' : ''), rail);
        u.el('b', '', a, it[0]);
        u.el('span', '', a, it[1]);
      });
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.content);
      const insp = u.el('aside', 'ds-inspector', main);
      u.el('h2', '', insp, 'Recipe Details');
      u.el('h3', '', insp, 'Category');
      u.el('div', 'ds-category', insp, '🐓   Poultry');
      [['Prep Time', '10 min'], ['Cook Time', '20 min'], ['Total Time', '30 min'], ['Servings', '4']].forEach((x) => {
        const row = u.el('div', 'ds-detail', insp);
        u.el('span', '', row, x[0]);
        u.el('b', '', row, x[1]);
      });
      const nutrition = u.el('section', 'ds-nutrition', insp);
      u.el('h3', '', nutrition, 'Nutrition (per serving)');
      [['Calories', '320'], ['Fat', '18 g'], ['Carbs', '6 g'], ['Protein', '36 g']].forEach((x) => {
        const row = u.el('div', 'ds-detail', nutrition);
        u.el('span', '', row, x[0]);
        u.el('b', '', row, x[1]);
      });
      u.el('h3', 'ds-ingredients-title', insp, 'Main Ingredients');
      [['🥩', 'Chicken'], ['🍋', 'Lemon'], ['🧄', 'Garlic'], ['🌿', 'Fresh Herbs']].forEach((x) => {
        const row = u.el('div', 'ds-ingredient', insp);
        u.el('span', '', row, x[0]);
        u.el('b', '', row, x[1]);
      });
      Object.assign(_c, { body: main, insp });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.content });
      const panel = _c.content.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
        panel.querySelector('.ref-panel-title').textContent = 'Kitchen note';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
      _c.body.insertBefore(_c.stage, _c.insp);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'A little inspiration for your kitchen.',
        banner: 'Fresh ideas for your table this week.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : '×');
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-carousel-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#6d7b3d'], LOW_ACCENTS: ['#6d7b3d'], parts },
  });
})();
