(function () {
  'use strict';
  const palette = { bg: '#7589a2', panel: '#f7f8fa', fg: '#101f38', muted: '#52647b', line: '#9aa9bb' };
  function hourglass(u, note) {
    const icon = u.el('div', 'ds-hourglass', note);
    icon.innerHTML = '<svg viewBox="0 0 48 58" aria-hidden="true"><path d="M5 3h38M5 55h38M9 5c0 13 4 15 15 24C13 38 9 42 9 53m30-48c0 13-4 15-15 24 11 9 15 13 15 24" fill="none" stroke="#111820" stroke-width="4"/><path d="M15 12h18l-9 12zm0 34h18l-9-12z" fill="#111820"/></svg>';
    note.prepend(icon);
  }
  function drawData(u, content) {
      const data = u.el('section', 'ds-data', content);
      const left = u.el('div', 'ds-data-col', data);
      const panel = (parent, title) => {
        const p = u.el('section', 'ds-gridpanel', parent);
        u.el('h3', '', p, title);
        return p;
      };
      const detail = panel(left, 'Shipment Details');
      [
        ['Shipment ID:', 'SHP-10432'],
        ['Order #:', 'PO-77190'],
        ['Customer:', 'General Industrial Supply'],
        ['Ship Date:', 'Apr 15, 1999'],
        ['Requested Delivery:', 'Apr 20, 1999'],
        ['Ship To:', '1000 Commerce Blvd.\nRiverdale, IL 60827\nUSA'],
      ].forEach((row) => {
        const r = u.el('div', 'ds-detailrow', detail);
        u.el('span', '', r, row[0]);
        u.el('span', '', r, row[1]);
      });
      const approvals = panel(left, 'Approvals');
      const ah = u.el('div', 'ds-approvalrow ds-th', approvals);
      ['Role', 'Name', 'Status', 'Date'].forEach((x) => u.el('b', '', ah, x));
      [
        ['Requestor', 'J. Carter', 'Approved', 'Apr 14, 1999'],
        ['Manager', 'L. Nguyen', 'Approved', 'Apr 14, 1999'],
        ['Finance', 'R. Patel', 'Pending', '—'],
        ['Shipping', '—', 'Pending', '—'],
      ].forEach((row) => {
        const r = u.el('div', 'ds-approvalrow', approvals);
        row.forEach((x, i) => u.el('span', i === 2 ? (x === 'Approved' ? 'good' : 'pending') : '', r, x));
      });
      const right = u.el('div', 'ds-data-col', data);
      const items = panel(right, 'Items in Shipment');
      const ih = u.el('div', 'ds-itemrow ds-th', items);
      ['Line', 'Part Number', 'Description', 'Qty', 'UOM'].forEach((x) => u.el('b', '', ih, x));
      [
        ['1', 'AX-100', 'Valve Assembly', '10', 'EA'],
        ['2', 'BR-200', 'Mounting Bracket', '25', 'EA'],
        ['3', 'CS-305', 'Control Switch', '5', 'EA'],
        ['4', 'DW-410', 'Wiring Harness', '12', 'EA'],
      ].forEach((row) => {
        const r = u.el('div', 'ds-itemrow', items);
        row.forEach((x) => u.el('span', '', r, x));
      });
      const notes = panel(right, 'Notes');
      [
        'Shipment records are available for review.',
        'Please review the shipment details while you wait.',
        'All shipment quantities use the units shown above.',
        'For assistance, contact your administrator.',
      ].forEach((t) => u.el('p', '', notes, t));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const mast = u.el('header', 'ds-top', document.body);
      u.el('div', 'ds-mark', mast, '▤');
      const identity = u.el('div', 'ds-identity', mast);
      u.el('div', 'ds-brand', identity, 'Northbridge Extranet');
      u.el('div', 'ds-tagline', identity, 'SUPPLIER PARTNER NETWORK');
      const account = u.el('div', 'ds-account', mast);
      u.el('div', '', account, 'Welcome, Pat Miller　 |　 Help　 |　 Log Out');
      u.el('div', 'ds-date', account, 'Thu, Apr 15, 1999');
      const nav = u.el('nav', 'ds-menu', document.body);
      ['Home', 'Orders', 'Shipments', 'Invoices', 'Reports', 'Administration'].forEach((t, i) =>
        u.el('span', i === 2 ? 'active' : '', nav, t));
      const content = u.el('div', 'ds-content', document.body);
      const title = u.el('div', 'ds-titlebar', content);
      u.el('strong', '', title, 'Shipment Approval');
      u.el('b', '', title, 'Customer: General Industrial Supply　　Account #: 45877');
      const steps = u.el('div', 'ds-steps', content);
      ['Review Details', 'Confirm', 'Complete'].forEach((t, i) => {
        const s = u.el('div', i === 0 ? 'current' : '', steps);
        u.el('b', '', s, String(i + 1));
        u.el('strong', '', s, t);
      });
      Object.assign(_c, { content, title, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = _c.util.el('div', 'ds-instruction', note);
        text.textContent = note.firstChild.textContent;
        note.firstChild.remove();
        hourglass(_c.util, note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      // The panel note originally follows the task strip.
      const holder = _c.util.el('div', 'ds-panel-slot');
      base({ ..._c, body: holder });
      const note = holder.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-panel-note');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
        hourglass(_c.util, note);
      }
      _c.panelSlot = holder;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.content);
      if (_c.display === 'panel') _c.content.appendChild(_c.panelSlot);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        hourglass(_c.util, note);
        _c.content.insertBefore(note, _c.stage);
      }
      drawData(_c.util, _c.content);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const back = _c.util.el('button', 'ds-back', foot, 'Back');
      back.type = 'button';
      foot.prepend(back);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'promo') {
        document.body.classList.add('ds-tour-open');
        const closeTour = () => {
          document.body.classList.remove('ds-tour-open');
          ctx.dismiss('close');
        };
        const bar = u.el('header', 'ds-tourbar', el);
        u.el('b', '', bar, 'Application Tour');
        const x = u.el('button', 'ds-x', bar, '×');
        x.addEventListener('click', closeTour);
        const body = u.el('div', 'ds-tourbody', el);
        u.el('div', 'ds-infoicon', body, 'i');
        const words = u.el('div', '', body);
        u.el('strong', '', words, 'Take a quick tour?');
        u.el('p', '', words, 'Learn about shipment approval in three short steps.');
        const actions = u.el('div', 'ds-touractions', el);
        const skip = u.el('button', 'ds-skip', actions, 'Skip tour');
        skip.addEventListener('click', closeTour);
        const next = u.el('button', 'ds-nexttour', actions, 'Next >');
        next.addEventListener('click', closeTour);
        u.el('div', 'ds-tourcount', el, '1 of 3');
        return { el, dismiss: skip };
      }
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Take a quick tour?',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-delay-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-act-in-time-delay-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#14599b'],
      LOW_ACCENTS: ['#14599b'],
      parts,
    },
  });
})();
