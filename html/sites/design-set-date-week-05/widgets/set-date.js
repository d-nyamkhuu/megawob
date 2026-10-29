// Design on templates/set-date/base.js: the base site's set-date widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'set-date',
  site: 'design-set-date-week-05',
  name: 'design',
  split: 'train',
  scenarios: ['week'],
  template: 'set-date/base',
  design: {
    parts: {
      buildCalendar: (base, S) => function (ctx, range) {
        base(ctx, range);
        if (ctx.spec.scenario !== 'week') return;
        const u = ctx.util;
        const card = S.card;
        u.el('span', 'gtk-close', card, '×');
        const details = u.el('section', 'gtk-details', card);
        u.el('div', 'gtk-field-label', details, 'Name');
        u.el('div', 'gtk-name', details, 'Family Meals');
        u.el('div', 'gtk-field-label gtk-notes-label', details, 'Notes');
        u.el('div', 'gtk-notes', details, 'Simple and healthy meals for the week.');
        u.el('div', 'gtk-table-title', details, 'Planned Meals');
        const table = u.el('table', 'gtk-meals', details);
        const head = u.el('thead', '', table);
        const heading = u.el('tr', '', head);
        ['Day', 'Breakfast', 'Lunch', 'Dinner'].forEach(v => u.el('th', '', heading, v));
        const body = u.el('tbody', '', table);
        [
          ['Mon', 'Oatmeal', 'Turkey Sandwich', 'Grilled Chicken'],
          ['Tue', 'Pancakes', 'Veggie Wrap', 'Spaghetti'],
          ['Wed', 'Yogurt & Fruit', 'Tomato Soup', 'Stir Fry'],
          ['Thu', 'Eggs & Toast', 'Chicken Salad', 'Tacos'],
          ['Fri', 'Cereal', 'Leftovers', 'Pizza'],
          ['Sat', 'Bagels', 'Grilled Cheese', 'Salmon'],
          ['Sun', 'French Toast', 'Tuna Sandwich', 'Roast Chicken'],
        ].forEach(values => {
          const row = u.el('tr', '', body);
          values.forEach(v => u.el('td', '', row, v));
        });
        const list = u.el('section', 'gtk-plan-list', ctx.stage);
        u.el('div', 'gtk-selected-nav', ctx.stage, 'Meal Plans');
        u.el('div', 'gtk-panel-head', list, 'Meal Plans');
        ['May 4, 2009', 'May 11, 2009', 'May 18, 2009', 'May 25, 2009',
          'June 1, 2009', 'June 8, 2009', 'June 15, 2009', 'June 22, 2009'].forEach((date, i) =>
          u.el('div', 'gtk-plan-row' + (i === 0 ? ' selected' : ''), list, date));
        const side = u.el('aside', 'gtk-plan-side', ctx.stage);
        const summary = u.el('section', 'gtk-side-panel gtk-summary', side);
        u.el('div', 'gtk-panel-head', summary, 'Plan Summary');
        [['Meals:', '21'], ['Recipes:', '18'], ['Ingredients:', '34']].forEach(([name, count]) => {
          const row = u.el('div', 'gtk-summary-row', summary);
          u.el('span', '', row, name);
          u.el('span', '', row, count);
        });
        const upcoming = u.el('section', 'gtk-side-panel gtk-upcoming', side);
        u.el('div', 'gtk-panel-head', upcoming, 'Upcoming Plans');
        [['May 11, 2009', 'Family Favorites'], ['May 18, 2009', 'Quick and Easy'],
          ['May 25, 2009', 'Vegetarian Week'], ['June 1, 2009', 'Grilling'],
          ['June 8, 2009', 'Summer Meals']].forEach(([date, name]) => {
          const row = u.el('div', 'gtk-upcoming-row', upcoming);
          u.el('div', '', row, date);
          u.el('div', '', row, name);
        });
      },
    },
  },
});
