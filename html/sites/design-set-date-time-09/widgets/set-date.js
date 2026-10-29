// This design adds ride locations and segmented time text to the shared time form.
(function () {
  const PIN = '<svg viewBox="0 0 24 32" aria-hidden="true"><path fill="currentColor" d="M12 1a10 10 0 0 0-10 10c0 7 10 19 10 19s10-12 10-19A10 10 0 0 0 12 1z"/><circle cx="12" cy="11" r="3.8" fill="white"/></svg>';

  env.widget({
    task: 'set-date',
    site: 'design-set-date-time-09',
    name: 'design',
    split: 'train',
    scenarios: ['time'],
    template: 'set-date/calendar',
    design: {
      title: 'Book a Ride',
      timeParts: ['fd-time-part', 'fd-time-colon', 'fd-time-part', 'fd-time-part fd-time-ap'],
      parts: {
        bodyStart: (base, S) => (ctx, extras) => {
          base(ctx, extras);
          const { util } = ctx;
          const { card } = S;
          [
            ['Pickup location', '1250 Market St, San Francisco, CA'],
            ['Drop-off location', 'San Francisco International Airport (SFO)'],
          ].forEach(([label, value]) => {
            const row = util.el('div', 'fd-location', card);
            util.el('div', 'fd-label', row, label);
            const box = util.el('div', 'fd-location-value', row);
            box.insertAdjacentHTML('beforeend', PIN);
            util.el('span', '', box, value);
          });
        },
        staticCreated: (base, S) => (parent, row, label, value, util) => {
          base(parent, row, label, value, util);
          row.classList.add('fd-extra');
        },
      },
    },
  });
})();
