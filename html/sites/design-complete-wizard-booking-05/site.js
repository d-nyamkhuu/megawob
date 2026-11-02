// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const iconSVG = (name) => {
    const paths = {
      Home: '<path d="m3 10 9-8 9 8M5 9v12h5v-7h4v7h5V9"/>',
      Explore: '<circle cx="12" cy="12" r="9"/><path d="m15 7-2 6-4 4 2-6 4-4Z"/>',
      Stays: '<path d="M3 4v17M3 17h18v4M3 9h15a3 3 0 0 1 3 3v5M7 9V6h6v3M3 13h18"/>',
      Flights: '<path d="m12 2 2 7 7 4v2l-7-2v5l3 2v2l-5-2-5 2v-2l3-2v-5l-7 2v-2l7-4 2-7Z"/>',
      'Car rentals': '<path d="m5 6-2 7v6h3v-3h12v3h3v-6l-2-7H5ZM3 12h18M7 15h1m8 0h1"/>',
      'Things to do': '<path d="M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Z"/>',
      Trips: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12c6 3 12 3 18 0M10 12v3h4v-3"/>',
      Saved: '<path d="M12 21 4 13C-3 5 8-1 12 6c4-7 15-1 8 7l-8 8Z"/>',
      'Recently viewed': '<circle cx="12" cy="12" r="9"/><path d="M12 5v8l5 3"/>',
      Location: '<path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="9" r="2.5"/>',
      'Best time to visit': '<circle cx="12" cy="12" r="6"/><path d="M12 0v3m0 18v3M0 12h3m18 0h3M3 3l2 2m14 14 2 2M3 21l2-2M19 5l2-2"/>',
      'Popular for': '<circle cx="9" cy="7" r="3"/><path d="M2 21v-4a7 7 0 0 1 14 0v4H2ZM16 4a3 3 0 0 1 0 6m2 3c4 0 4 4 4 8h-4"/>',
      'Local highlights': '<path d="m2 5 6-3 8 4 6-3v16l-6 3-8-4-6 3V5ZM8 2v16M16 6v16"/>',
      Notifications: '<path d="M6 9a6 6 0 0 1 12 0v7l2 3H4l2-3V9ZM10 22h4M12 1v2"/>',
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`;
  };

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.appTitle = 'Hotel Reservation';
      const lights = util.el('div', 'booking-window-lights', header);
      for (const label of ['Close', 'Minimize', 'Zoom']) {
        const light = util.el('button', '', lights);
        light.type = 'button';
        light.setAttribute('aria-label', label);
      }
      const history = util.el('div', 'booking-history', header);
      util.el('span', '', history, '‹');
      util.el('span', '', history, '›');
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Hotel Reservation');
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      util.el('span', 'booking-bell', headerTools).innerHTML = iconSVG('Notifications');
      util.el('span', 'booking-avatar', headerTools);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      for (const [glyph, label] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const control = util.el('button', 'ref-window-control', headerTools, glyph);
        control.type = 'button';
        control.title = label;
        control.setAttribute('aria-label', label);
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const sidebar = util.el('aside', 'booking-sidebar', body);
      for (const [icon, label] of [['⌂','Home'], ['◉','Explore'], ['▣','Stays'], ['✳','Flights'], ['▱','Car rentals'], ['▤','Things to do']]) {
        const link = util.el('div', `booking-side-link${label === 'Stays' ? ' selected' : ''}`, sidebar);
        util.el('span', '', link).innerHTML = iconSVG(label);
        util.el('b', '', link, label);
      }
      util.el('div', 'booking-side-rule', sidebar);
      for (const [icon, label] of [['▢','Trips'], ['♡','Saved'], ['◷','Recently viewed']]) {
        const link = util.el('div', 'booking-side-link', sidebar);
        util.el('span', '', link).innerHTML = iconSVG(label);
        util.el('b', '', link, label);
      }
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const backdrop = util.el('div', 'booking-backdrop', stage);
      const tabs = util.el('div', 'booking-tabs', backdrop);
      for (const name of ['Hotels', 'Vacation rentals', 'Resorts']) util.el('span', '', tabs, name);
      const feature = util.el('section', 'booking-feature', backdrop);
      util.el('div', 'booking-feature-photo', feature);
      util.el('div', 'booking-feature-caption', feature, 'Zacatecas');
      util.el('div', 'booking-feature-subtitle', feature, 'Mexico');
      const results = util.el('section', 'booking-results', backdrop);
      util.el('div', 'booking-results-count', results, '124 stays');
      for (const [name, rating, tone] of [
        ['Hotel Emporio Zacatecas', '★★★★', 'warm'], ['Mesón de Jobito', '★★★★', 'stone'],
        ['Hotel Casa Faroles', '★★★★', 'gold'], ['Quinta Real Zacatecas', '★★★★', 'night'],
      ]) {
        const row = util.el('article', `booking-hotel ${tone}`, results);
        util.el('div', 'booking-hotel-photo', row);
        const copy = util.el('div', 'booking-hotel-copy', row);
        util.el('b', '', copy, name);
        util.el('strong', '', copy, rating);
        util.el('small', '', copy, '⌖  Zacatecas');
      }
      const detail = util.el('section', 'booking-detail', backdrop);
      util.el('div', 'booking-detail-photo', detail);
      util.el('h2', '', detail, 'Zacatecas');
      util.el('div', 'booking-detail-country', detail, 'Mexico');
      const detailTabs = util.el('div', 'booking-detail-tabs', detail);
      for (const name of ['Overview', 'Attractions', 'When to go', 'Getting around']) util.el('span', '', detailTabs, name);
      util.el('p', '', detail, "Zacatecas is a historic city in central Mexico, known for its well-preserved colonial architecture, charming plazas and vibrant cultural scene. Explore its museums, churches and scenic viewpoints, and enjoy the region's rich history and cuisine.");
      for (const [icon, title, copy] of [
        ['⌖', 'Location', 'Zacatecas, Mexico'], ['☼', 'Best time to visit', 'October – April'],
        ['♧', 'Popular for', 'History, culture, architecture'], ['◇', 'Local highlights', 'Historic center, El Cerro de la Bufa, museums, traditional cuisine'],
      ]) {
        const item = util.el('div', 'booking-detail-row', detail);
        util.el('i', '', item).innerHTML = iconSVG(title);
        const text = util.el('div', '', item);
        util.el('b', '', text, title);
        util.el('span', '', text, copy);
      }
      const inspector = util.el('aside', 'booking-inspector', body);
      const inspectorValues = new Map();
      util.el('div', 'booking-inspector-title', inspector, 'Trip Details');
      for (const [section, rows] of [
        ['Stay', ['Destination:', 'Check-in date:', 'Nights:', 'Guests:']],
        ['Guest', ['Full name:', 'E-mail:', 'Phone:']],
        ['Room', ['Room type:', 'Breakfast:']],
        ['Review', ['Status:']],
      ]) {
        const block = util.el('section', 'booking-inspector-section', inspector);
        util.el('h3', '', block, section);
        for (const label of rows) {
          const row = util.el('div', 'booking-inspector-row', block);
          util.el('span', '', row, label);
          const value = util.el('b', '', row, '—');
          value.dataset.forLabel = label.toLowerCase().replace(/[^a-z]/g, '');
          inspectorValues.set(value.dataset.forLabel, value);
        }
      }
      const refreshInspector = (event) => {
        if (!stage.contains(backdrop)) stage.append(backdrop);
        for (const [label, text] of event.detail) {
          const value = inspectorValues.get(label);
          if (value) value.textContent = text || '—';
        }
      };
      stage.addEventListener('booking-values', refreshInspector);
      Object.assign(_c, { inspector, refreshInspector, stage });
    },
  };

  env.site({
    name: 'design-complete-wizard-booking-05',
    template: 'site/base',
    design: { parts },
  });
})();
