env.widget({
  task: 'use-travel',
  site: 'design-use-travel-daterange-04',
  name: 'design',
  split: 'train',
  scenarios: ['daterange'],
  template: 'use-travel/portal',
  design: {
    parts: {
      frame: (base, S) => (ctx) => {
        const P = S.P;
        const app = P.el('section', 'at-app amiga-travel-app', ctx.stage);
        app.setAttribute('aria-label', 'Travel Planner');
        S.app = app;
        S.progress = P.el('div', 'at-progress', app);
        S.content = P.el('div', 'at-content amiga-travel-content', app);
        S.footer = P.el('footer', 'at-footer', app);
      },
      main: (base, S) => (m, isResults) => {
        if (m.page === 'review' || m.page === 'manage') return base(m, isResults);
        const P = S.P;
        const content = S.content;
        const form = P.newPane(content);
        form.className = 'amiga-window amiga-booking';
        const title = P.el('div', 'amiga-window-title', form, 'Book a Hotel Stay');
        title.insertAdjacentHTML('afterbegin', '<span class="amiga-gadget">▣</span>');
        const fields = P.el('div', 'amiga-form-fields', form);
        const field = (label, value, target, icon) => {
          const row = P.el('div', 'amiga-field', fields);
          P.el('label', '', row, label);
          const b = P.button(row, value, target, 'amiga-input');
          if (icon) P.el('span', 'amiga-arrow', b, icon);
          return b;
        };
        const staticField = (label,value) => {
          const row=P.el('div','amiga-field',fields); P.el('label','',row,label);
          const b=P.el('div','amiga-input',row,value); P.el('span','amiga-arrow',b,'▼');
        };
        staticField('Destination', S.spec.dest.city);
        staticField('Passenger', S.spec.passenger);
        const dateField = (label, value) => {
          const row = P.el('div', 'amiga-field', fields);
          P.el('label', '', row, label);
          const target={control:'calendar'}, b=P.el('button','amiga-input amiga-date',row,value || '___ / ___ / ______');
          b.type='button'; P.register(target,b);
          b.addEventListener('click',()=>P.act(target));
          P.el('span', 'amiga-calendar-icon', b, '▦');
        };
        dateField('Check-in', m.start || '');
        dateField('Check-out', m.end || '');
        P.el('div', 'amiga-rule', form);
        P.el('div', 'amiga-section-label', form, 'Search options');
        const opts = P.el('div', 'amiga-options', form);
        P.el('span', '', opts, 'Guests　 1　▴▾');
        P.el('span', '', opts, 'Rooms　 1　▴▾');
        P.el('span', '', opts, 'Hotel class　 Any class　▼');
        P.el('span', '', opts, '□ Free cancellation only');
        P.el('span', '', opts, '□ Breakfast included');
        const results = P.el('section', 'amiga-window amiga-results', content);
        const rt = P.el('div', 'amiga-window-title', results, `Hotel Results – ${S.spec.dest.city}`);
        rt.insertAdjacentHTML('afterbegin', '<span class="amiga-gadget">▣</span>');
        const table = P.el('div', 'amiga-hotel-table', results);
        const head = P.el('div', 'amiga-hotel-row amiga-hotel-head', table);
        for (const h of ['','Hotel','Location','Class','Price (EUR)']) P.el('span','',head,h);
        for (const [i, hotel] of S.spec.hotels.entries()) {
          const row = P.el('div', `amiga-hotel-row${i===0?' selected':''}`, table);
          P.hotelArt(row, hotel.name);
          P.el('span','amiga-hotel-name',row,hotel.name);
          P.el('span','',row,hotel.area || 'City Centre');
          const stars=P.el('span','',row,''); for(let n=0;n<3+(S.ctx.util.hash32(hotel.name)%2);n++) stars.append('★');
          P.el('span','',row,String(hotel.price));
        }
        const scroll = P.el('div', 'amiga-scrollbar', results); scroll.textContent='▲';
        if (m.open) {
          const popup = P.newPane(form);
          popup.className = 'amiga-calendar-popup';
          const bar=P.el('div','amiga-calbar',popup);
          const prev=P.button(bar,'‹',{nav:-1},'',true); prev.setAttribute('aria-label','Previous month');
          P.el('strong','',bar,'Select check-in and check-out');
          const next=P.button(bar,'›',{nav:1},'',true); next.setAttribute('aria-label','Next month');
          const months=P.el('div','at-months amiga-months',popup);
          const [yy,mm]=m.view.split('-').map(Number), nextMonth=`${mm===12?yy+1:yy}-${String(mm===12?1:mm+1).padStart(2,'0')}`;
          for(const month of [m.view,nextMonth]) P.month(months,month,m);
        }
      },
      sidepanel: (base, S) => (m) => {
        const P=S.P, d=S.details, s=S.spec;
        S.app.querySelector(':scope > .amiga-inspector')?.remove();
        const panel=P.el('section','amiga-window amiga-inspector',S.app);
        const title=P.el('div','amiga-window-title',panel,'Hotel Details');
        title.insertAdjacentHTML('afterbegin','<span class="amiga-gadget">▣</span>');
        const body=P.el('div','amiga-inspector-body',panel);
        const h=s.hotels[0];
        P.hotelArt(body,h ? h.name : d.property);
        const summary=P.el('div','amiga-hotel-description',body);
        P.el('strong','',summary,h ? h.name : d.property);
        P.el('div','',summary,d.street+', '+s.dest.city+', Austria');
        P.el('div','amiga-stars',summary,'★★★★');
        P.el('p','',summary,`Historic hotel in the heart of ${s.dest.city}, close to the river and the old town. Restaurant, bar and conference facilities.`);
        const facts=P.el('div','amiga-inspector-facts',body);
        for(const [label,value] of [['Location',h?.area || 'City Centre'],['Distance to centre','0.2 km'],['Facilities','Wi-Fi, Restaurant, Bar, Fitness, Meeting Rooms'],['Policies','Free cancellation available (see rates)']]){
          P.el('span','',facts,label); P.el('span','',facts,value);
        }
        P.el('div','amiga-map',body,'📍');
      },
      calendar: (base, S) => (main, m) => base(main,m),
    },
  },
});
