env.widget({
  task: 'use-travel',
  site: 'design-use-travel-daterange-02',
  name: 'design',
  split: 'train',
  scenarios: ['daterange'],
  template: 'use-travel/portal',
  design: {
    brand: 'Wayfarer', appLabel: 'Book a hotel stay', accent: '#245bd2', panel: '#fff',
    foreground: '#111a3b', muted: '#68758f', line: '#d9dfeb', fontSize: '14px',
    inset: '0px', radius: '0px', workspaceWidth: 9999, summaryWidth: 0,
    parts: {
      svg: (base) => (parent, name, label) => {
        const node = base(parent, name, label);
        const filled = {
          pin:'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z',
          user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z',
          calendar:'M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 17H5V8h14v12ZM7 10h5v5H7z',
          down:'m7 10 5 5 5-5Z',
          star:'m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01Z',
          info:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z',
          hotel:'M4 2h16v20H4V2Zm3 3v2h2V5H7Zm4 0v2h2V5h-2Zm4 0v2h2V5h-2ZM7 9v2h2V9H7Zm4 0v2h2V9h-2Zm4 0v2h2V9h-2ZM7 13v2h2v-2H7Zm4 0v2h2v-2h-2Zm4 0v2h2v-2h-2Zm-4 5v4h2v-4h-2Z',
        };
        if (filled[name]) {
          node.firstChild.setAttribute('d',filled[name]);
          node.style.fill='currentColor'; node.style.stroke='none';
          node.firstChild.setAttribute('fill-rule','evenodd');
        }
        return node;
      },
      worknav: () => () => {},
      calendar: (base, S) => (main, m) => {
        const P = S.P, s = S.spec;
        if (m.open) {
          base(main, m);
          main.querySelector('.at-stayintro')?.remove();
          const search = P.button(main, 'Search hotels', {control:'review'}, 'travel-search');
          P.svg(search, 'search');
          search.disabled = !(m.start && m.end && env.taskDef.helpers.available(s, m.start, m.end));
          return;
        }
        const heading = P.el('div', 'travel-booking-heading', main);
        P.el('h2', '', heading, 'Book a hotel stay');
        P.el('p', '', heading, 'Search for hotels and compare options for your trip.');
        const form = P.el('div', 'travel-form', main);
        const field = (label, value, icon, target, cls) => {
          const wrap = P.el('div', `travel-field ${cls || ''}`, form);
          P.el('span', 'travel-label', wrap, label);
          const b = target ? P.button(wrap, '', target, 'travel-control') : P.el('div', 'travel-control', wrap);
          P.svg(b, icon);
          P.el('span', 'travel-value', b, value);
          if (!target) P.svg(b, 'close').classList.add('travel-clear');
          if (target || label === 'Passenger') P.svg(b, 'down').classList.add('travel-caret');
        };
        field('Destination', s.dest.city + (s.dest.country ? ', ' + s.dest.country : ''), 'pin', null, '');
        field('Passenger', s.passenger, 'user', null, '');
        field('Check-in', m.start ? env.taskDef.helpers.fmtDate(m.start) : 'Select check-in date', 'calendar', {control:'calendar'}, 'date');
        field('Check-out', m.end ? env.taskDef.helpers.fmtDate(m.end) : 'Select check-out date', 'calendar', {control:'calendar'}, 'date');
        const search = P.button(form, 'Search hotels', {control:'review'}, 'travel-search');
        P.svg(search, 'search');
        search.disabled = !(m.start && m.end && env.taskDef.helpers.available(s, m.start, m.end));
        const popular = P.el('section', 'travel-popular', main);
        const top = P.el('div','travel-popular-head',popular);
        P.el('strong','',top,'Explore popular destinations');
        P.el('a','',top,'View all destinations  ›');
        const cards=P.el('div','travel-cards',popular);
        const photoPaths=[
          new URL('sites/design-use-travel-daterange-02/assets/header-reference.webp',document.baseURI).href,
          new URL('/sites/design-use-travel-daterange-02/assets/header-reference.webp',location.href).href,
          new URL('assets/header-reference.webp',document.baseURI).href,
          new URL('/assets/header-reference.webp',location.href).href,
        ];
        for (const [city,country,scene,x,width] of [['Prague','Czechia','prague',183,253],['Vienna','Austria','vienna',451,251],['Budapest','Hungary','budapest',717,253],['Kraków','Poland','krakow',985,241]]) {
          const card=P.el('div',`travel-destination ${scene}`,cards);
          const photo=document.createElementNS('http://www.w3.org/2000/svg','svg');
          photo.classList.add('travel-photo'); photo.setAttribute('viewBox',`${x} 763 ${width} 153`);
          photo.setAttribute('preserveAspectRatio','none'); photo.setAttribute('aria-hidden','true'); card.append(photo);
          const bitmap=document.createElementNS('http://www.w3.org/2000/svg','image');
          bitmap.setAttribute('width','1672'); bitmap.setAttribute('height','941'); photo.append(bitmap);
          let pi=0; bitmap.onerror=()=>{if(++pi<photoPaths.length)bitmap.setAttribute('href',photoPaths[pi]);}; bitmap.setAttribute('href',photoPaths[pi]);
          P.el('strong','',card,city); P.el('span','',card,country);
        }
      },
      sidepanel: (_base, S) => () => {
        const P=S.P, side=P.el('aside','travel-tips',S.content);
        const title=P.el('h3','',side,'Tips for finding the right stay');
        P.svg(title,'info');
        for(const [icon,heading,copy] of [
          ['pin','Choose a central location','Staying near top attractions can save you time and transportation costs.'],
          ['calendar','Be flexible with dates','If your plans are flexible, try a range of dates to see more options.'],
          ['star','Check guest reviews','Read recent reviews to get a sense of the experience before you book.'],
          ['hotel','Look for free cancellation','Many properties offer flexible booking options in case your plans change.'],
        ]) { const row=P.el('div','travel-tip',side); P.svg(row,icon); const text=P.el('div','',row); P.el('strong','',text,heading); P.el('p','',text,copy); }
      },
      footer: (_base, S) => (m) => {
        const P=S.P, s=S.spec, F=env.taskDef, box=S.footer;
        const prepared=!!(m.start && m.end && F.helpers.available(s,m.start,m.end));
        if (m.page === 'review') {
          P.button(box,'Edit details',{control:'back'});
          if (!m.booked) { const b=P.button(box,'Book and pay',{control:'book'},'at-primary'); P.svg(b,'shield'); }
        }
      },
    },
  },
});
