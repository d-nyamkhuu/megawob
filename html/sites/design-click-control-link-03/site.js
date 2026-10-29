(function () {
  'use strict';
  const cfg = { title: 'Readme.txt', menus: ['Desk', 'File', 'Edit', 'Search', 'Options', 'Help'], clock: '10:24 AM' };
  let iconId = 0;
  const S = (p) => {
    const id = 'gem-icon-' + iconId++;
    return (
      '<svg viewBox="0 0 48 48" fill="none" stroke="#111" stroke-width="2" stroke-linejoin="miter" stroke-linecap="square"><defs><pattern id="' +
      id +
      '" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M-1 1 1-1M0 3 3 0M2 4 4 2" stroke="#aaa" stroke-width=".55"/></pattern></defs>' +
      p.replaceAll('HATCH', 'url(#' + id + ')') +
      '</svg>'
    );
  };
  const tools = [
    [
      'Open',
      S(
        '<path d="M6 15V10h16l3 6" fill="#eee"/><path d="M3 17h40v24H3Z" fill="#eee"/><path d="M6 20h34v18H6Z" fill="HATCH" stroke="#777" stroke-width="1"/><path d="M7 12h13" stroke="#fff"/>',
      ),
    ],
    [
      'New',
      S(
        '<path d="M9 3h20l10 10v30H9Z" fill="#eee"/><path d="M29 3v11h10M15 11h10M15 19h17M15 26h17M15 33h17M15 39h17" stroke="#888" stroke-width="1"/><path d="M11 5v36" stroke="#fff"/>',
      ),
    ],
    [
      'Save',
      S(
        '<path d="M5 3h32l5 5v35H5Z" fill="#ddd"/><path d="M11 3v15h24V3M12 43V28h23v15" fill="#eee"/><path d="M26 6h5v9h-5Z" fill="#ccc" stroke-width="1"/><path d="M7 5v36M14 30h18" stroke="#fff" stroke-width="1"/><path d="M16 32h15v8H16Z" fill="HATCH" stroke="none"/>',
      ),
    ],
    [
      'Find',
      S(
        '<path d="m29 30 13 13" stroke="#eee" stroke-width="9"/><path d="m29 30 13 13" stroke="#111" stroke-width="6"/><circle cx="20" cy="19" r="14" fill="#eee"/><circle cx="20" cy="19" r="11" fill="HATCH" stroke="#fff" stroke-width="1"/>',
      ),
    ],
    [
      'Print',
      S(
        '<path d="M13 3h21v15H13Z" fill="#eee"/><path d="M16 5h15v11H16Z" fill="HATCH" stroke="none"/><path d="M5 15h36v20H5Z" fill="#eee"/><path d="M8 18h30v14H8Z" fill="HATCH" stroke="#777" stroke-width="1"/><path d="M12 28h23v15H12Z" fill="#eee"/><path d="M15 31h17v10H15Z" fill="#d9e7e9" stroke="#537986" stroke-width="1"/><path d="M17 34h13M17 37h13M17 40h13" stroke="#537986" stroke-width=".8"/><path d="M10 20h3"/>',
      ),
    ],
  ];
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: 'design-click-control-link-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref gem';
      const er = ctx.rng.fork('chrome/end');
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endLabels = endBank.map(labelOf);
      const placement = ctx.finish ? null : er.pick(['dock', 'dock', 'dock', 'menubar', 'titlebar', 'titlebar']);
      const label =
        placement === 'dock'
          ? endLabels.find((x) => x.toLowerCase() === 'submit') || endLabels[0]
          : labelOf(er.pick(endBank));
      let submit = null;
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = labelOf(cr.pick(options));
      }
      const shell = u.el('main', 'shell', document.body);
      const bar = u.el('header', 'menubar', shell);
      cfg.menus.forEach((m) => u.el('span', 'menu', bar, m));
      u.el('span', 'sp', bar);
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.dataset.role = 'submit';
        if (cls === 'end-title')
          b.innerHTML =
            '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m4 10 4 4 8-9"/></svg>';
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const decoyButton = (parent, text) => {
        const b = u.el('button', 'xtra ' + (parent === bar ? 'menu-xtra' : 'dock-xtra'), parent, text);
        b.type = 'button';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (placement === 'menubar') submit = endButton(bar, 'end-menu', label);
      if (collide && placement === 'menubar') decoyButton(bar, collide);
      const ic = u.el('span', 'clock-ic', bar);
      u.el('span', 'clock', bar, cfg.clock);
      const desk = u.el('div', 'desk', shell);
      const win = u.el('section', 'window', desk);
      const tb = u.el('div', 'titlebar', win);
      u.el('i', 'gadget close', tb).innerHTML = '<b></b>';
      if (placement === 'titlebar') submit = endButton(tb, 'end-title', label);
      if (collide && placement === 'titlebar') decoyButton(tb, collide);
      u.el('span', 'hatch', tb);
      u.el('span', 'wtitle', tb, cfg.title);
      u.el('span', 'hatch', tb);
      u.el('i', 'gadget full', tb).innerHTML = '<b></b>';
      const body = u.el('div', 'wbody', win);
      const center = u.el('div', 'center', body);
      const note = u.el('div', 'instruction', center);
      const noteText = u.el('span', 'instruction-text', note, ctx.instruction);
      let display = ctx.display || 'header';
      if (display === 'panel' && shell.clientWidth < 1260) display = 'header';
      if (display === 'toast' && shell.clientHeight < 700) display = 'header';
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      if (display === 'panel') note.classList.add('instruction-panel');
      center.dataset.display = display;
      const stage = u.el('div', 'stage', center);
      const sb = u.el('div', 'vscroll', body);
      u.el('i', 'arr up', sb);
      u.el('div', 'vtrack', sb).innerHTML = '<b></b>';
      u.el('i', 'arr down', sb);
      const dock = u.el('footer', 'footer', shell);
      const strip = u.el('div', 'strip', dock);
      tools.forEach((t) => {
        const b = u.el('div', 'tool', strip);
        b.innerHTML = t[1];
        u.el('span', '', b, t[0]);
      });
      const dockPlacement = placement === 'dock';
      if (dockPlacement && collide) decoyButton(dock, collide);
      if (dockPlacement) u.el('span', 'vsep', dock);
      if (placement === 'dock') submit = endButton(dock, 'submit', label);
      // Fit the seeded instruction inside the reference's fixed-height note before
      // the task stage is measured. This changes presentation only, never its text.
      if (display === 'header') {
        let size = parseFloat(getComputedStyle(note).fontSize);
        const ns = getComputedStyle(note);
        const room = note.clientHeight - parseFloat(ns.paddingTop) - parseFloat(ns.paddingBottom);
        while (noteText.getBoundingClientRect().height > room + 1 && size > 18) {
          size -= 1;
          note.style.fontSize = size + 'px';
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
