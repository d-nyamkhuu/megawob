// Portal defaults cover both date and seat changes.
env.widget({
  task: 'use-travel',
  site: 'design-use-travel-change-03',
  name: 'design',
  split: 'train',
  scenarios: ['change'],
  template: 'use-travel/portal',
  design: {
    parts: {
      manage: (base, S) => (main, m) => {
        base(main, m);
        const el = (tag, cls, parent, text) => S.ctx.util.el(tag, cls, parent, text);
        const pane = main.querySelector('.at-pane');
        const box = main.querySelector('.at-manage');
        const head = box?.querySelector('.at-managehead');
        const body = box?.querySelector('.at-managebody');
        const route = body?.querySelector('.at-itinerary');
        const date = body?.querySelector(':scope > p');
        const passenger = body?.querySelector('.at-assignment');
        const edit = head?.querySelector('button');
        const services = pane?.querySelector('.at-servicegrid');
        if (!pane || !box || !head || !body || !route || !date || !passenger || !edit || !services) return;

        main.querySelector('.at-bookingtools')?.remove();
        pane.querySelector('.at-alert')?.remove();
        const layout = el('div', 'at-xp-layout', pane);
        const primary = el('div', 'at-xp-primary', layout);
        const booking = el('section', 'at-xp-booking', primary);
        const bookingHead = el('div', 'at-xp-bookinghead', booking);
        const flight = el('section', 'at-xp-flight', primary);
        const flightTitle = el('h3', 'at-xp-title', flight, '✈  Flight Details');
        const facts = el('div', 'at-xp-flightfacts', flight);
        const side = el('aside', 'at-xp-side', layout);
        const sideRouteTitle = el('h3', 'at-xp-title', side, '▤  Itinerary');
        const sideRoute = route.cloneNode(true);
        sideRoute.classList.add('at-xp-route');
        const passengerTitle = el('h3', 'at-xp-title', side, '♟  Passenger');
        const rewards = el('div', 'at-xp-rewards', side);

        const reference = head.querySelector('.at-sectionlabel');
        const referenceValue = head.querySelector('h3');
        const status = body.querySelector('.at-tagstatus');
        bookingHead.append(reference, referenceValue, status);
        const passengerLabel = el('span', 'at-xp-passenger-label', bookingHead, 'Passenger');
        const passengerName = el('strong', 'at-xp-passenger-name', bookingHead, passenger.querySelector('strong').textContent);
        facts.append(route);
        const flightMeta = el('div', 'at-xp-flightmeta', facts);
        const flightNo = el('div', '', flightMeta);
        el('span', '', flightNo, 'Flight');
        el('strong', '', flightNo, S.details.flight.no);
        const airline = el('div', '', flightMeta);
        el('span', '', airline, 'Airline');
        el('strong', '', airline, S.details.flight.airline);
        const cabin = el('div', '', flightMeta);
        el('span', '', cabin, 'Class');
        el('strong', '', cabin, 'Economy');
        const dateFact = el('div', 'at-xp-fact', facts);
        el('strong', '', dateFact, 'Departure date');
        dateFact.append(date);
        const seatFact = el('div', 'at-xp-fact', facts);
        el('strong', '', seatFact, 'Seat');
        seatFact.append(passenger.querySelector('.at-services'));
        flight.append(edit);
        side.append(sideRoute, passenger);
        el('strong', '', rewards, '▤  Frequent Flyer');
        el('span', '', rewards, 'SkyWay Rewards');
        el('span', '', rewards, `SW${String(S.details.member).padStart(7, '0')}`);
        box.remove();
        head.remove(); body.remove();
        pane.prepend(layout, services);
        main.classList.add('at-xp-manage');
        services.classList.add('at-xp-services');
        const serviceCard = services.querySelectorAll('.at-module')[1];
        if (serviceCard) {
          const title = serviceCard.querySelector('h4 span');
          if (title) title.textContent = 'In-flight services';
          const paragraphs = serviceCard.querySelectorAll('p');
          if (paragraphs[0]) paragraphs[0].textContent = 'Standard meal';
          paragraphs[1]?.remove();
          serviceCard.querySelector('svg')?.setAttribute('viewBox', '0 0 24 24');
        }
        pane.querySelector('.at-module')?.classList.add('at-xp-hide');
      },
    },
  },
});
