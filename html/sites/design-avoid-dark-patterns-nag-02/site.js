// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('folio-header');
      const mast = util.el('div', 'folio-mast', header);
      const brandMark = util.el('span', 'folio-mark', mast, '◧');
      brandMark.setAttribute('aria-hidden', 'true');
      util.el('strong', 'folio-brand', mast, 'Pocket Atlas');
      const folioNav = util.el('nav', 'folio-nav', mast);
      for (const item of ['Home', 'My Lists', 'Discover', 'People', 'Account']) {
        const a = util.el('a', item === 'Home' ? 'folio-tab active' : 'folio-tab', folioNav, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const search = util.el('div', 'folio-search', mast, '⌕　Search places, cities or collections…');
      util.el('span', 'folio-profile', mast, '●');
      S.frameBrand(_c, header);
      Object.assign(_c, { brandMark, folioNav, header, mast, search });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const stats = util.el('aside', 'folio-stats', document.body);
      util.el('div', 'folio-stats-title', stats, '▥　My reading activity');
      for (const [caption, value] of [['Articles read', '24'], ['Saved to lists', '8'], ['Comments', '3']]) {
        const row = util.el('div', 'folio-stats-row', stats);
        util.el('span', '', row, caption);
        util.el('span', '', row, value);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, stats });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'atlas-inspector', body);
      util.el('div', 'atlas-inspector-title', inspector, 'Place details');
      const map = util.el('div', 'atlas-map', inspector);
      util.el('span', 'atlas-map-location', map, 'Jardim da Estrela');
      util.el('span', 'atlas-map-name', map, 'Bluebell Botanical Garden');
      const pin = util.el('span', 'atlas-map-pin', map, '•');
      pin.setAttribute('aria-hidden', 'true');
      const fields = util.el('div', 'atlas-fields', inspector);
      for (const [key, value] of [['Name', 'Bluebell Botanical Garden'], ['City', 'Lisbon'], ['Country', 'Portugal'],
        ['Location', 'Rua das Estufas, 1300-011 Lisbon, Portugal'], ['Coordinates', '38.7062, -9.1614'],
        ['Website', 'https://www.bluebellgarden.pt'], ['Phone', '+351 21 123 4567'],
        ['Category', 'Botanical Garden'], ['Hours', 'Open daily 9:00 AM – 7:00 PM']]) {
        const row = util.el('div', 'atlas-field', fields);
        util.el('span', 'atlas-key', row, key);
        util.el('span', 'atlas-value', row, value);
      }
      const tags = util.el('div', 'atlas-tags', inspector);
      for (const tag of ['Garden', 'Nature', 'Plants', 'History', 'Family Friendly', 'Outdoor']) util.el('span', 'atlas-tag', tags, tag);
      Object.assign(_c, { fields, inspector, map, pin, stage, tags });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-nag-02',
    template: 'site/base',
    design: { parts },
  });
})();
