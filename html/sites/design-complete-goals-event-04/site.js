// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const CAT_IMAGE = new URL('assets/shelter-cat.png', document.currentScript.src).href;

  const parts = {
    'frame.nav': (base, S) =>
      function (_c) {
        const { content, header, local, nav, rng, util } = _c;
        const { K } = S;
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        const gnav = util.el('nav', 'gnome-nav', header);
        const navIcons = [
          '<path d="M3 10.5 12 3l9 7.5M5.5 9v11h13V9M9 20v-6h6v6"/>',
          '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20v-1.5a6.5 6.5 0 0 1 13 0V20zM16 5.2a3 3 0 0 1 0 5.7M18 14a5 5 0 0 1 3.5 4.8V20h-4"/>',
          '<circle cx="7" cy="6" r="2"/><circle cx="12" cy="4.5" r="2"/><circle cx="17" cy="6" r="2"/><path d="M4 12c0-1.5 1.3-2.5 3-2.5 1 0 2 .4 2.5 1.1M20 12c0-1.5-1.3-2.5-3-2.5-1 0-2 .4-2.5 1.1M5 20c-1-1-1.3-2-1.3-3.1 0-2.6 2-4.4 4.8-4.4 1.5 0 2.8.6 3.5 1.5M19 20c1-1 1.3-2 1.3-3.1 0-2.6-2-4.4-4.8-4.4-1.5 0-2.8.6-3.5 1.5"/>',
          '<path d="M6 3.5h9l4 4V21H6zM15 3.5V8h4M9 12h7M9 16h7"/>',
          '<rect x="3.5" y="5" width="17" height="16" rx="1.5"/><path d="M7.5 3v4M16.5 3v4M4 9h16M7 12h2M12 12h2M7 16h2M12 16h2"/>',
          '<path d="M4 20V12h4v8zM10 20V7h4v13zM16 20V3h4v17z"/>',
        ];
        for (const [index, [icon, text]] of [
          ['⌂', 'Overview'],
          ['♟', 'Adoptions'],
          ['✣', 'Animals'],
          ['▤', 'People'],
          ['▦', 'Events'],
          ['▥', 'Reports'],
        ].entries()) {
          const item = util.el('div', `gnome-nav-item${text === 'Adoptions' ? ' active' : ''}`, gnav);
          const iconEl = util.el('span', 'gnome-nav-icon', item);
          iconEl.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${navIcons[index]}</svg>`;
          iconEl.setAttribute('aria-hidden', 'true');
          util.el('span', '', item, text);
        }
        Object.assign(_c, { gnav, navIcons });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        const { body, ctx, display, lr, rng, util, word } = _c;
        const { K } = S;
        const panel = util.el('aside', 'ref-panel', body);
        util.el('div', 'ref-panel-title', panel, 'Help & Tips');
        util.el('div', 'gnome-help-heading', panel, 'Adopter information');
        util.el(
          'div',
          'gnome-help-copy',
          panel,
          'Enter the adopter’s public name, city, a monthly budget and an optional job title. Other details can be added later.',
        );
        util.el('hr', 'gnome-help-rule', panel);
        util.el('div', 'gnome-help-heading', panel, 'Adoption date');
        util.el(
          'div',
          'gnome-help-copy',
          panel,
          'Select the date the adoption was completed using the calendar. You can also type a date in the format dd/mm/yyyy.',
        );
        util.el('hr', 'gnome-help-rule', panel);
        util.el('div', 'gnome-help-heading', panel, 'Profile colour');
        util.el(
          'div',
          'gnome-help-copy',
          panel,
          'Choose a colour to represent the adopter’s profile. Use the colour picker or enter a hexadecimal value.',
        );
        if (display === 'panel') {
          const heading = rng.pick(['Help & Tips']);
          panel.querySelector('.ref-panel-title').textContent = word ? word(lr.pick(K.panel)) : heading;
          util.el('div', 'ref-panel-text', panel, ctx.instruction);
          if (rng.bool(0.5)) body.classList.add('ref-panel-right');
        }
        Object.assign(_c, { panel });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const record = util.el('section', 'gnome-record', stage);
        const portrait = util.el('div', 'gnome-record-photo', record);
        const cat = util.el('img', 'gnome-cat', portrait);
        cat.src = CAT_IMAGE;
        cat.alt = 'Cat resting in a shelter bed';
        const summary = util.el('div', 'gnome-record-summary', record);
        util.el('h1', '', summary, 'New Adoption Record');
        util.el('p', '', summary, 'Add the details for a new adoption and assign a profile.');
        const facts = util.el('div', 'gnome-record-facts', summary);
        util.el('span', '', facts, 'Animal:');
        util.el('b', '', facts, 'Luna');
        util.el('span', '', facts, 'Type:');
        util.el('b', '', facts, 'Cat');
        util.el('span', '', facts, 'Age:');
        util.el('b', '', facts, '2 years');
        util.el('span', '', facts, 'ID:');
        util.el('b', '', facts, 'A-1042');
        const details = util.el('div', 'gnome-record-details', record);
        util.el('h2', '', details, '✣  Animal Details');
        util.el('div', '', details, 'Breed:　 Domestic Shorthair');
        util.el('div', '', details, 'Colour:　 Brown and White');
        util.el('div', '', details, 'Gender:　 Female');
        util.el('div', '', details, 'Status:　 Available');
        body.insertBefore(record, stage);
        Object.assign(_c, { cat, details, facts, portrait, record, stage, summary });
      },
  };

  env.site({
    name: 'design-complete-goals-event-04',
    template: 'site/base',
    design: { parts },
  });
})();
