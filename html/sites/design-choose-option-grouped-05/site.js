(function () {
  'use strict';
  const paths = {
    booking:'<path d="M5 2h10l5 5v15H5z M15 2v6h5"/>',
    calendar:'<rect x="3" y="5" width="18" height="17" rx="1"/><path d="M3 10h18 M7 2v6 M17 2v6 M7 14h2 M12 14h2 M17 14h2 M7 18h2 M12 18h2"/>',
    clock:'<circle cx="12" cy="12" r="10"/><path d="M12 5v7l5 3"/>',
    reports:'<path d="M3 21h4v-8H3z M10 21h4V8h-4z M17 21h4V3h-4z"/>',
    hotel:'<path d="M3 5v16 M3 16h18v5 M3 11h5v5 M8 12h13v4H8z"/>',
    car:'<path d="M3 11l3-6h12l3 6v8H3z M3 11h18 M6 19v3 M18 19v3"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/>',
    shield:'<path d="M12 2l9 4v7c0 5-4 8-9 10-5-2-9-5-9-10V6z M8 12l3 3 5-6"/>',
    visa:'<path d="M5 2h10l4 4v16H5z M15 2v5h4 M8 11h8 M8 15h8 M8 19h6"/>',
    globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20 M12 2c-6 5-6 15 0 20 M12 2c6 5 6 15 0 20 M4 7h16 M4 17h16"/>',
    home:'<path d="M2 11L12 3l10 8 M5 10v12h14V10 M10 22v-7h4v7"/>',
    case:'<rect x="3" y="7" width="18" height="15" rx="1"/><path d="M8 7V4h8v3 M3 12h18"/>',
    gear:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1z"/>',
    help:'<circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 0 1 6 1c0 2-3 2-3 5 M12 19h.01"/>'
  };
  const icon = (name) => name==='plane' ? '✈' : `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
  const add = (u, tag, cls, parent, value) => u.el(tag, cls, parent, value);
  const navItem = (u, parent, glyph, text, active) => {
    const item = add(u, 'div', `sky-link${active ? ' active' : ''}`, parent);
    add(u, 'span', 'sky-link-icon', item).innerHTML=icon(glyph);
    add(u, 'span', '', item, text);
    return item;
  };
  const box = (u, parent, title, glyph) => {
    const b = add(u, 'section', 'sky-box', parent);
    const h = add(u, 'div', 'sky-box-title', b);
    if (glyph) add(u, 'span', 'sky-box-icon', h).innerHTML=icon(glyph);
    add(u, 'strong', '', h, title);
    return b;
  };
  const endButton = (u, parent, cls, label, ctx, visible) => {
    const b = add(u, 'button', cls, parent, visible);
    b.type = 'button'; b.dataset.role = 'submit'; b.title = label; b.setAttribute('aria-label', label);
    b.addEventListener('click', () => ctx.submit());
    return b;
  };
  function frame(ctx) {
    const u = ctx.util, r = ctx.rng.fork('skyways/chrome');
    document.documentElement.dataset.theme = 'skyways';
    const display = (window.innerWidth < 1200 || window.innerHeight < 680) && (ctx.display === 'panel' || ctx.display === 'toast') ? 'header' : ctx.display;
    const label = r.bool(0.5) ? 'OK' : ctx.content.endLabel(r);
    const placements = ['footer', 'footer', 'footer', 'header', 'link', 'icon'];
    const placement = ctx.finish ? null : r.pick(placements);
    const root = add(u, 'div', 'sky-app', document.body);
    const banner = add(u, 'header', 'sky-banner', root);
    const brand = add(u, 'div', 'sky-brand', banner);
    add(u, 'span', 'sky-globe', brand, '🌍');
    const wordmark = add(u, 'div', 'sky-wordmark', brand);
    const name = add(u, 'div', 'sky-brand-name', wordmark);
    add(u, 'span', 'sky-brand-blue', name, 'Sky'); add(u, 'span', 'sky-brand-green', name, 'Ways');
    add(u, 'div', 'sky-tagline', wordmark, 'TRAVEL SOLUTIONS');
    add(u, 'div', 'sky-plane', banner, '✈');
    if (display === 'header') add(u, 'div', 'sky-instruction sky-header-instruction', banner, ctx.instruction);

    const left = add(u, 'aside', 'sky-left', root);
    const trips = box(u, left, 'My Trips');
    navItem(u, trips, 'booking', 'New Booking', true);
    navItem(u, trips, 'calendar', 'Upcoming Trips');
    navItem(u, trips, 'clock', 'Past Trips');
    navItem(u, trips, 'reports', 'Travel Reports');
    const links = box(u, left, 'Quick Links');
    navItem(u, links, 'hotel', 'Hotels'); navItem(u, links, 'car', 'Car Rental');
    navItem(u, links, 'shield', 'Travel Insurance'); navItem(u, links, 'visa', 'Visa Information');
    navItem(u, links, 'globe', 'Destinations');

    const right = add(u, 'aside', 'sky-right', root);
    const summary = box(u, right, 'Trip Summary', 'reports');
    for (const [k,v] of [['Total Trips','12'],['Upcoming Trips','3'],['Past Trips','9']]) {
      const row = add(u, 'div', 'sky-summary-row', summary);
      add(u, 'span', '', row, k); add(u, 'b', '', row, v);
    }
    const recent = box(u, right, 'Recent Bookings', 'calendar');
    for (const [where,date,status] of [['Istanbul (IST)','12 Apr 2005','Confirmed'],['Paris (CDG)','3 May 2005','Confirmed'],['New York (JFK)','18 Jun 2005','Pending'],['Rome (FCO)','22 Jul 2005','Confirmed'],['Berlin (TXL)','10 Aug 2005','Cancelled']]) {
      const row = add(u, 'div', 'sky-booking', recent);
      const info = add(u, 'div', '', row);
      add(u, 'div', '', info, where); add(u, 'small', '', info, date);
      add(u, 'b', `sky-status ${status.toLowerCase()}`, row, status);
    }

    const win = add(u, 'section', 'sky-window', root);
    const titlebar = add(u, 'div', 'sky-titlebar', win);
    add(u, 'strong', '', titlebar, 'New Booking');
    const close = add(u, 'button', 'sky-close', titlebar, '×'); close.type = 'button'; close.title = 'Close';
    close.addEventListener('click', () => env.log('decoy', {label:'Close'}));
    let submit = null;
    const tools = add(u, 'div', 'sky-title-tools', titlebar);
    if (placement === 'header') submit = endButton(u, tools, 'sky-end sky-title-end', label, ctx, label);
    if (placement === 'icon') submit = endButton(u, tools, 'sky-end sky-icon-end', label, ctx, '✓');
    const body = add(u, 'div', 'sky-window-body', win);
    const form = add(u, 'div', 'sky-form', body);
    const row = (caption, cls) => {
      const line = add(u, 'div', `sky-form-row ${cls || ''}`, form);
      add(u, 'label', 'sky-form-label', line, caption);
      return add(u, 'div', 'sky-form-value', line);
    };
    const trip = row('Trip type', 'sky-trip-row');
    const radio1 = add(u, 'span', 'sky-radio-choice', trip); add(u, 'span', 'sky-radio on', radio1); add(u, 'span', '', radio1, 'Round trip');
    const radio2 = add(u, 'span', 'sky-radio-choice', trip); add(u, 'span', 'sky-radio', radio2); add(u, 'span', '', radio2, 'One way');
    add(u, 'div', 'sky-input filled', row('From'), 'London (LHR)');
    add(u, 'div', 'sky-input', row('To'));
    const service = row('Service city', 'sky-service-row');
    const stage = add(u, 'main', 'sky-stage', service);
    add(u, 'div', 'sky-input', row('Departure date'));
    add(u, 'div', 'sky-input', row('Return date'));
    add(u, 'div', 'sky-input', row('Passengers'));
    if (display === 'panel') {
      const note = box(u, left, 'Your task', 'booking');
      note.classList.add('sky-side-note');
      add(u, 'p', '', note, ctx.instruction);
    }
    if (display === 'toast') {
      const note = add(u, 'div', 'sky-toast-note', root);
      add(u, 'span', '', note, ctx.instruction);
      const x = add(u, 'button', '', note, '×'); x.type = 'button'; x.addEventListener('click', () => note.remove());
    }
    const foot = add(u, 'div', 'sky-form-footer', win);
    const footActions = add(u, 'div', 'sky-footer-actions', foot);
    const decoy = (text, collide) => {
      const b = add(u, 'button', 'sky-plain-button ref-xtra', footActions, text); b.type='button';
      b.addEventListener('click', () => env.log('decoy', collide ? {label:text,collide:true} : {label:text}));
    };
    if (!ctx.finish && r.bool(0.3)) decoy(ctx.content.collideLabel(r, label), true);
    if (!ctx.finish && r.bool(0.25)) decoy('Print', false);
    if (placement === 'footer') submit = endButton(u, footActions, 'sky-end', label, ctx, label);
    if (placement === 'link') submit = endButton(u, footActions, 'sky-end-link', label, ctx, label);
    if (!ctx.finish && !submit) submit = endButton(u, footActions, 'sky-end', label, ctx, label);

    const dock = add(u, 'nav', 'sky-dock', root);
    for (const [glyph, text] of [['home','Home'],['plane','Flights'],['hotel','Hotels'],['car','Car Rental'],['case','My Trips'],['reports','Reports'],['gear','Settings'],['help','Help']]) {
      const tab = add(u, 'div', `sky-dock-item${text === 'Flights' ? ' active' : ''}`, dock);
      add(u, 'span', 'sky-dock-icon', tab).innerHTML=icon(glyph); add(u, 'span', '', tab, text);
    }
    return {stage, submit};
  }
  function overlay(ctx) {
    const u=ctx.util, kind=ctx.kind;
    const el=add(u,'div',`sky-overlay sky-overlay-${kind}`,document.body);
    el.dataset.role='overlay';
    const inner=kind==='promo' ? add(u,'div','sky-overlay-box',el) : el;
    const copy=ctx.content.bannerText(ctx.rng,kind==='banner'?'notice':kind).text;
    if(kind==='cookie') add(u,'span','sky-cookie-icon',inner,'◉');
    add(u,'div','sky-overlay-copy',inner,copy);
    const close=add(u,'button','sky-overlay-close',inner,kind==='cookie'?'×':'×');
    close.type='button';close.title='Close';close.setAttribute('aria-label','Close');
    close.addEventListener('click',()=>ctx.dismiss(kind==='cookie'?'reject':'close'));
    if(kind==='cookie'){
      const accept=add(u,'button','sky-overlay-accept',inner,'Accept');accept.type='button';
      accept.addEventListener('click',()=>ctx.dismiss('accept'));
    }
    return {el,dismiss:close,ttlSteps:kind==='toast'?ctx.rng.int(3,5):0};
  }
  env.site({
    name: 'design-choose-option-grouped-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {parts: {frame: () => frame, overlay: () => overlay}},
  });
})();
