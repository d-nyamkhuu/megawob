env.widget({
  task: 'use-travel',
  site: 'design-use-travel-daterange-05',
  name: 'design',
  split: 'train',
  scenarios: ['daterange'],
  template: 'use-travel/portal',
  design: {
    titles: { daterange: 'Find a Hotel' },
    parts: {
      calendar: (base, S) => (main, model) => {
        base(main, model);
        const P = S.P, spec = S.spec;
        const form = P.el('div', 'gtk-search-form');
        const taskForm = P.el('section', 'gtk-search-task', form);
        P.el('h2', 'gtk-form-heading', taskForm, 'Hotel Search');
        if (spec.dest.city === 'Palma') form.classList.add('gtk-palma');
        const field = (label, value, select) => {
          const row = P.el('label', 'gtk-form-row', taskForm);
          P.el('span', '', row, label);
          const control = P.el('div', `gtk-form-control${select ? ' select' : ''}`, row, value);
          if (select) P.el('span', 'gtk-select-arrow', control, '▾');
          else P.el('span', 'gtk-clear-field', control, '×');
        };
        field('Destination', spec.dest.city, false);
        field('Guest', spec.passenger, true);
        P.hotelArt(taskForm, spec.dest.city, false);
        const dates = main.querySelector('.at-dates');
        if (dates) {
          main.insertBefore(form, dates); taskForm.append(dates);
          for (const button of dates.querySelectorAll('button')) {
            const row = P.el('div', 'gtk-form-row gtk-date-row', dates);
            row.append(button.querySelector('small'), button);
            const value = button.querySelector('span');
            if (value && value.textContent === 'Not selected') value.textContent = 'Select date';
            button.addEventListener('click', () => {
              const pane = S.pane, calendar = pane && pane.querySelector('.gtk-calendar-body');
              if (calendar) { pane.scrollTop = calendar.offsetTop; P.visibility(); }
            });
          }
        }
        const capacity = P.el('div', 'gtk-capacity-row', taskForm);
        for (const [label, value] of [['Rooms', '1'], ['Guests per room', '1']]) {
          const item = P.el('label', '', capacity);
          P.el('strong', '', item, label);
          const select = P.el('span', 'gtk-capacity-select', item, value); P.el('span', '', select, '▼');
        }
        const options = P.el('section', 'gtk-search-options', form);
        P.el('h2', 'gtk-form-heading', options, 'Search Options');
        const optField = P.el('label', 'gtk-option-field', options);
        P.el('span', '', optField, 'Hotel name (optional)'); P.el('span', 'gtk-option-input', optField, '');
        const priceRow = P.el('div', 'gtk-price-row', options);
        P.el('span', '', priceRow, 'Price range (per night)');
        P.el('span', 'gtk-price-select', priceRow, 'Any'); P.el('span', '', priceRow, 'to'); P.el('span', 'gtk-price-select', priceRow, 'Any');
        const checks = P.el('div', 'gtk-search-amenities', options);
        for (const label of ['Business center', 'Free breakfast', 'Internet access', 'Fitness center', 'Pool', 'Airport shuttle']) {
          const item = P.el('label', '', checks); P.el('span', 'gtk-checkbox', item); P.el('span', '', item, label);
        }
        const more = P.el('a', 'gtk-more-options', options, 'More options »'); more.href = '#';
        more.addEventListener('click', (event) => event.preventDefault());
        const results = P.el('section', 'gtk-hotel-results', main);
        if (spec.dest.city === 'Palma') results.classList.add('gtk-palma');
        const heading = P.el('div', 'gtk-results-heading', results);
        P.el('strong', '', heading, `Available Hotels in ${spec.dest.city}`);
        const sorting = P.el('div', 'gtk-results-count', heading);
        P.el('span', '', sorting, `1 - 10 of ${spec.hotels.length} hotels`);
        for (const arrow of ['◀', '▶']) { const b = P.el('button', '', sorting, arrow); b.type = 'button'; }
        const area = P.el('div', 'gtk-results-area', results);
        const filters = P.el('aside', 'gtk-result-filters', area);
        P.el('strong', '', filters, 'Filter results');
        P.el('span', 'gtk-filter-title', filters, 'Price per night');
        P.el('div', 'gtk-price-track', filters);
        P.el('span', 'gtk-price-label', filters, '$0 – $500+');
        P.el('span', 'gtk-filter-title', filters, 'Star rating');
        for (const stars of ['5 stars', '4 stars', '3 stars', '2 stars', '1 star']) P.el('span', 'gtk-filter-choice', filters, stars);
        P.el('span', 'gtk-filter-title', filters, 'Amenities');
        for (const amenity of ['Free Wi-Fi', 'Breakfast included', 'Pool', 'Airport shuttle', 'Air conditioning']) P.el('span', 'gtk-filter-choice', filters, amenity);
        const column = P.el('div', 'gtk-results-column', area);
        // Keep the template's registered, scroll-tracked calendar intact. The
        // date controls reveal it in this same native scroll pane; its resting
        // view is the hotel list, rather than an always-visible month grid.
        const pane = S.pane;
        const calendar = P.el('div', 'gtk-calendar-body');
        calendar.append(...pane.childNodes);
        column.append(pane);
        const list = P.el('div', 'gtk-results-list', pane);
        const tableHead = P.el('div', 'gtk-table-head', list);
        for (const label of ['Hotel Name', 'Location', 'Nightly Rate (USD)', 'Rating', 'Amenities']) P.el('span', '', tableHead, label);
        for (const hotel of spec.hotels.slice(0, 10)) {
          const row = P.el('article', 'gtk-hotel-row', list);
          const photo = P.el('span', 'gtk-row-photo', row);
          P.hotelArt(photo, hotel.name, false);
          const info = P.el('div', 'gtk-hotel-info', row);
          P.el('strong', '', info, hotel.name);
          info.querySelector('strong').addEventListener('click', (event) => event.preventDefault());
          P.el('div', 'gtk-hotel-stars', info, '★★★★★');
          P.el('div', 'gtk-hotel-place', info, `${spec.dest.city} · ${hotel.area}`);
          const amenities = P.el('div', 'gtk-hotel-amenities', info);
          for (const amenity of hotel.amenities.slice(0, 3)) {
            const item = P.el('span', '', amenities);
            const names = {'Free Wi-Fi':'wifi', 'Breakfast included':'coffee', 'Airport shuttle':'plane'};
            const icon = P.svg(item, names[amenity] || 'bag');
            if (amenity === 'Pool') icon.querySelector('path').setAttribute('d', 'M5 21V5a3 3 0 0 1 6 0M15 21V5a3 3 0 0 1 6 0M5 9h10M5 14h10M2 21q3-3 6 0t6 0t6 0');
            if (amenity === 'Parking') icon.querySelector('path').setAttribute('d', 'M5 21V3h8a6 6 0 0 1 0 12H5M9 7h4a2 2 0 0 1 0 4H9Z');
            if (amenity === 'Air conditioning') icon.querySelector('path').setAttribute('d', 'M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3');
            P.el('span', '', item, amenity);
          }
          const price = P.el('div', 'gtk-hotel-price', row);
          P.el('small', '', price, 'From');
          P.el('strong', '', price, `$${hotel.price}`);
          P.el('span', '', price, 'per night');
        }
        pane.append(calendar);
        const hotel = spec.hotels[0];
        const detail = P.el('aside', 'gtk-details-inspector', main);
        P.el('h3', '', detail, 'Hotel Details');
        const summary = P.el('div', 'gtk-detail-summary', detail);
        P.hotelArt(summary, hotel.name, false);
        const description = P.el('div', '', summary);
        P.el('strong', '', description, hotel.name); P.el('span', 'gtk-detail-stars', description, '★★★★☆');
        P.el('span', '', description, hotel.area || 'Historic Center');
        P.el('span', '', description, spec.dest.city);
        P.el('p', '', description, `Colonial-style hotel in the heart of ${spec.dest.city} with comfortable rooms and a rooftop terrace with city views.`);
        const detailAmenities = P.el('section', 'gtk-detail-amenities', detail);
        P.el('strong', '', detailAmenities, 'Property Amenities');
        const amenityList = P.el('div', '', detailAmenities);
        for (const label of [...hotel.amenities.slice(0, 4), 'Business center', 'Airport shuttle (surcharge)', 'Non-smoking rooms', 'Laundry service']) P.el('span', '', amenityList, `•　${label}`);
        P.el('strong', 'gtk-rate-title', detail, 'Room Types & Rates (per night)');
        const rates = P.el('div', 'gtk-room-rates', detail);
        for (const label of ['Room Type', 'Max Guests', 'Rate (USD)', 'Standard Room', '2', `$${hotel.price}`, 'Superior Room', '2', `$${hotel.price + 20}`, 'Suite', '3', `$${hotel.price + 60}`]) P.el('span', '', rates, label);
        const passenger = document.querySelector('.gtk-passenger-row > span');
        if (passenger) passenger.textContent = spec.passenger;
      },
    },
  },
});
