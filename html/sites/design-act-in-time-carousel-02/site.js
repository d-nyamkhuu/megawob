(function () {
  'use strict';
  const C = { site: 'design-act-in-time-carousel-02' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const head = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brand', head);
      u.el('span', 'ds-leaf', brand, '❧');
      const heading = u.el('div', 'ds-brand-copy', brand);
      u.el('strong', '', heading, 'My Kitchen');
      const links = u.el('nav', 'ds-links', heading);
      ['Recipes', 'Meal Plans', 'Shopping Lists', 'A Healthier You'].forEach((x) => u.el('span', '', links, x));
      const search = u.el('div', 'ds-search', head, '⌕  Search recipes, ingredients, or keywords...');
      u.el('div', 'ds-produce', head, '🍅   🫒');
      const rail = u.el('aside', 'ds-rail', document.body);
      [
        ['◆', 'Home'],
        ['♜', 'Recipes'],
        ['▤', 'Meal Plan'],
        ['🛒', 'Shopping List'],
        ['▱', 'Pantry'],
        ['▦', 'Calendar'],
        ['★', 'Favorites'],
        ['⚙', 'Settings'],
      ].forEach((it, i) => {
        const a = u.el('div', 'ds-navitem' + (i === 1 ? ' active' : ''), rail);
        u.el('b', '', a, it[0]);
        u.el('span', '', a, it[1]);
      });
      const content = u.el('div', 'ds-content', document.body);
      let submit = null,
        place = 'footer',
        label = 'Submit';
      const make = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish) {
        const pool = ctx.content?.END_LABELS || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ];
        const norm = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
        const r = ctx.rng.fork('chrome/end');
        const standard = r.bool(0.5);
        label = standard ? 'Submit' : norm(r.pick(pool));
        place = standard ? 'footer' : r.pick(['footer', 'header', 'link']);
        if (place === 'header') submit = make(head, 'ds-submit ds-submit-head');
      }
      const mode = ctx.display || 'header';
      if (mode === 'header') {
        const note = u.el('div', 'ds-header-note', content);
        u.el('span', '', note, 'Today in your kitchen');
        u.el('p', 'ds-instruction', note, ctx.instruction);
      }
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const insp = u.el('aside', 'ds-inspector', main);
      u.el('h2', '', insp, 'Recipe Details');
      u.el('h3', '', insp, 'Category');
      u.el('div', 'ds-category', insp, '🐓   Poultry');
      [
        ['Prep Time', '10 min'],
        ['Cook Time', '20 min'],
        ['Total Time', '30 min'],
        ['Servings', '4'],
      ].forEach((x) => {
        const row = u.el('div', 'ds-detail', insp);
        u.el('span', '', row, x[0]);
        u.el('b', '', row, x[1]);
      });
      const nutrition = u.el('section', 'ds-nutrition', insp);
      u.el('h3', '', nutrition, 'Nutrition (per serving)');
      [
        ['Calories', '320'],
        ['Fat', '18 g'],
        ['Carbs', '6 g'],
        ['Protein', '36 g'],
      ].forEach((x) => {
        const row = u.el('div', 'ds-detail', nutrition);
        u.el('span', '', row, x[0]);
        u.el('b', '', row, x[1]);
      });
      u.el('h3', 'ds-ingredients-title', insp, 'Main Ingredients');
      [
        ['🥩', 'Chicken'],
        ['🍋', 'Lemon'],
        ['🧄', 'Garlic'],
        ['🌿', 'Fresh Herbs'],
      ].forEach((x) => {
        const row = u.el('div', 'ds-ingredient', insp);
        u.el('span', '', row, x[0]);
        u.el('b', '', row, x[1]);
      });
      if (mode === 'panel') {
        const n = u.el('aside', 'ds-panel-note', content);
        u.el('b', '', n, 'Kitchen note');
        u.el('span', '', n, ctx.instruction);
      }
      if (mode === 'toast') {
        const n = u.el('aside', 'ds-toast', content, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', content);
      if (!ctx.finish && place === 'footer') submit = make(foot, 'ds-submit');
      if (!ctx.finish && place === 'link') {
        const a = u.el('button', 'ds-link', foot, label);
        a.type = 'button';
        a.dataset.role = 'submit';
        a.onclick = () => ctx.submit();
        submit = a;
      }
      if (!ctx.finish && ctx.rng.fork('chrome/collide').bool(0.3)) {
        const d = u.el('button', 'ds-xtra', foot, 'Finish');
        d.type = 'button';
        d.onclick = () => env.log('decoy', { label: 'Finish', collide: true });
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
        promo: 'A little inspiration for your kitchen.',
        banner: 'Fresh ideas for your table this week.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : '×');
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
