// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-nag-05',
  name: 'design',
  split: 'train',
  scenarios: ['nag'],
  template: 'avoid-dark-patterns/browser',
  design: {
    parts: {
      main: (base, S) => function (sc, body, m) {
        const main = base(sc, body, m);
        const el = S.ctx.util.el;
        const heading = main.querySelector(':scope > .sd-h');
        const list = main.querySelector(':scope > .sd-list');
        const media = main.querySelector(':scope > .sd-media');
        const choices = main.querySelector(':scope > .sd-chips');
        if (!list && !media && !choices) return main;
        main.classList.add('rq-detail');
        const hero = el('section', 'rq-hero', main);
        const photograph = el('div', 'rq-photograph', hero);
        if (media) photograph.appendChild(media);
        else { const img = el('img', '', photograph); img.src = 'sites/design-avoid-dark-patterns-nag-05/assets/bakery.png'; img.alt = ''; }
        const info = el('div', 'rq-information', hero);
        if (heading && !list) info.appendChild(heading);
        else {
          const first = list && list.querySelector('b, strong, .t');
          el('h1', 'sd-h', info, first ? first.textContent : heading ? heading.textContent : S.app.name);
        }
        const title = info.querySelector('.sd-h').textContent.trim();
        const bakery = title === 'The Glasshouse Bakery';
        el('div', 'rq-category', info, bakery ? 'Bakery　·　Café　·　Edinburgh, Scotland' : 'Places　·　Discoveries　·　Collections');
        const rating = el('div', 'rq-rating', info);
        el('span', '', rating, '★★★★☆');
        el('small', '', rating, '4.6 (128 reviews)');
        el('p', 'rq-description', info, bakery ? 'A much-loved independent bakery in a converted glasshouse, known for sourdough, seasonal pastries and excellent coffee. A peaceful stop near the Botanics, with indoor and garden seating.' : 'Find inspiration for your next adventure. Explore favourite discoveries and keep them in your personal collections, with room for the details you want to remember.');
        const contact = el('div', 'rq-contact', info);
        const contactIcons = ['<path d="M12 22S4 13 4 9a8 8 0 0 1 16 0c0 4-8 13-8 13Z" fill="#8a8f9a"/><circle cx="12" cy="9" r="3" fill="white"/>', '<circle cx="12" cy="12" r="10" fill="#eee"/><path d="M12 5v7l5 2"/>', '<path d="m5 2 4 5-3 3c2 4 4 6 8 8l3-3 5 4c-1 5-5 5-10 2C5 17 1 10 2 6Z" fill="#9297a2"/>', '<circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="5" ry="10"/><path d="M2 12h20M4 6h16M4 18h16"/>'];
        let contactIndex = 0;
        for (const text of (bakery ? ['12 Arboretum Place, Edinburgh EH3 5NB','Open daily 8:00 am – 5:00 pm','0131 555 0199','www.glasshousebakery.co.uk'] : ['Discover places and local favourites','Available in your personal library','Plan a visit and add your own notes','Explore your collections'])) {
          const row = el('div', '', contact);
          const icon = el('span', '', row); icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + contactIcons[contactIndex++] + '</svg>';
          el('span', '', row, text);
        }
        const tabs = el('nav', 'rq-detail-tabs', main);
        for (const label of ['Overview', 'Photos', 'Reviews', 'Details']) {
          const tab = el('button', label === 'Overview' ? 'active' : '', tabs, label);
          tab.type = 'button'; tab.addEventListener('click', () => env.log('decoy', { what: 'detail-tab', label }));
        }
        const lower = el('section', 'rq-save-area', main);
        const caption = main.querySelector(':scope > .sd-h2');
        if (caption) lower.appendChild(caption);
        else if (heading && list) { heading.className = 'sd-h2'; lower.appendChild(heading); }
        else el('h2', 'sd-h2', lower, 'Places');
        const split = el('div', 'rq-save-split', lower);
        const options = el('div', 'rq-options', split);
        if (choices) {
          options.appendChild(choices);
          for (const button of choices.querySelectorAll('.sd-b')) {
            const name = button.textContent.trim();
            const record = { 'All Places': ['folder', '248'], 'City breaks': ['city', '12'], 'Scenic drives': ['mountain', '18'], 'Food & drink': ['food', '27'], 'Weekend ideas': ['weekend', '9'] }[name];
            if (record) { button.style.setProperty('--collection-icon', 'url("sites/design-avoid-dark-patterns-nag-05/assets/' + record[0] + '.png")'); button.dataset.count = record[1]; }
          }
        }
        if (list) options.appendChild(list);
        const preview = el('div', 'rq-preview', split);
        const image = el('img', 'rq-preview-image', preview); image.src = 'sites/design-avoid-dark-patterns-nag-05/assets/recent-2.png'; image.alt = '';
        const selected = choices && choices.querySelector('.on');
        const name = selected ? selected.textContent.trim() : 'Collections';
        el('strong', '', preview, name);
        el('div', 'rq-preview-count', preview, name === 'City breaks' ? '12 places' : 'Personal places');
        el('p', '', preview, name === 'City breaks' ? 'Short trips to great cities, with highlights for eating, exploring and culture.' : 'Favourite discoveries, with highlights for eating, exploring and culture.');
        const notes = el('label', 'rq-notes', preview);
        const check = el('input', '', notes); check.type = 'checkbox'; check.checked = true;
        el('span', '', notes, 'Also add personal notes');
        const note = el('textarea', 'rq-notes-input', preview); note.setAttribute('aria-label', 'Personal notes');
        const actions = el('div', 'rq-actions', lower);
        for (const child of Array.from(main.children)) {
          if (child === hero || child === tabs || child === lower) continue;
          actions.appendChild(child);
        }
        return main;
      },
    },
  },
});

