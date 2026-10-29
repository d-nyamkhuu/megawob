env.widget({
  task: 'use-travel',
  site: 'design-use-travel-hotels-04',
  name: 'design',
  split: 'train',
  scenarios: ['hotels'],
  template: 'use-travel/portal',
  design: {
    brand: 'Hotels', workspaceWidth: 99999, inset: '8px', radius: '0px', fontSize: '16px',
      panel: '#e2e3e4', foreground: '#111214', muted: '#45474a', line: '#a4a6a8', accent: '#333538',
      starColor: '#303234', railWidth: '100%',
    parts: {
      topbar: () => () => {},
      progress: () => () => {},
      route: (base) => (app) => {
        base(app);
        const route = app.querySelector('.at-route');
        route.classList.add('ns-search');
        const title = route.querySelector('h2');
        const city = route.querySelector('.at-breadcrumb span:last-child');
        route.replaceChildren();
        const destination = document.createElement('div'); destination.className = 'ns-destination';
        const icon = document.createElement('span'); icon.className = 'ns-bed-icon'; icon.textContent = '▰'; destination.append(icon);
        const heading = document.createElement('strong'); heading.textContent = 'Hotels'; destination.append(heading);
        const divider = document.createElement('i'); destination.append(divider);
        const place = document.createElement('span'); place.className = 'ns-city'; place.textContent = `${city ? city.textContent : 'Graz'}, Austria`; destination.append(place);
        route.append(destination);
        const fields = document.createElement('div'); fields.className = 'ns-search-fields'; route.append(fields);
        for (const [label, value] of [['Check-in', 'Apr 14, 2024'], ['Check-out', 'Apr 18, 2024'], ['Guests', '1 Adult']]) {
          const field = document.createElement('div'); field.className = 'ns-search-field'; fields.append(field);
          const caption = document.createElement('b'); caption.textContent = label; field.append(caption);
          const control = document.createElement('button'); control.type = 'button'; control.textContent = value; field.append(control);
          const suffix = document.createElement('span'); suffix.textContent = label === 'Guests' ? '▾' : '▦'; control.append(suffix);
        }
        const search = document.createElement('button'); search.type = 'button'; search.className = 'ns-search-button'; search.textContent = 'Search'; fields.append(search);
      },
      worknav: () => () => {},
    },
  },
});
