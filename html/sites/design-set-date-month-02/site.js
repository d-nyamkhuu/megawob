(function () {
  'use strict';
  env.site({
    name: 'design-set-date-month-02',
    styles: ['site.css', 'gtk.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = u.el('div', 'ds-body', document.body);
      const win = u.el('div', 'gtk-window', body);
      const bar = u.el('header', 'gtk-titlebar', win);
      const appIcon = u.el('span', 'gtk-appicon', bar);
      appIcon.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5 12 2l9 3v14l-9 3-9-3z" fill="#e6edf4" stroke="#526b83"/><path d="M7 11 12 7l5 4v6H7z" fill="#647c92" stroke="#344b62"/><path d="M10 13h4v4h-4z" fill="#f2f4f6"/></svg>';
      u.el('strong', 'gtk-brand', bar, 'Riverside Properties');
      const controls = u.el('div', 'gtk-window-controls', bar);
      ['−', '□', '×'].forEach((x, i) => u.el('span', 'gtk-winbtn' + (i === 2 ? ' close' : ''), controls, x));
      const menu = u.el('nav', 'gtk-menubar', win);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const head = u.el('div', 'gtk-tasknote', win);
      if (ctx.display === 'header') u.el('div', 'gtk-instruction', head, ctx.instruction);
      const shell = u.el('div', 'gtk-shell', win);
      const rail = u.el('aside', 'gtk-rail', shell);
      const navItems = ['Properties', 'Tenants', 'Leases', 'Maintenance', 'Reports'];
      const navIcons = [
        '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M3 16 18 4l15 12M7 14v17h22V14M15 31V20h7v11" fill="#f8f8f6" stroke="#344d68" stroke-width="2.3" stroke-linejoin="round"/><path d="M10 18h3v4h-3zm13 0h3v4h-3z" fill="#7293ad"/></svg>',
        '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M7 3h15l8 8v22H7z" fill="#fff" stroke="#d7e3ef" stroke-width="1.5"/><path d="M22 3v8h8" fill="#b7cee3" stroke="#d7e3ef"/><path d="M12 17h13M12 22h13M12 27h10" stroke="#8eb2d2" stroke-width="2"/></svg>',
        '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M8 5h20v27H8z" fill="#f8f7f3" stroke="#344d68" stroke-width="2"/><path d="M13 4h10v5H13z" fill="#d3d9dd" stroke="#344d68" stroke-width="1.5"/><path d="M12 14h12M12 19h12M12 24h9" stroke="#8394a4" stroke-width="1.8"/></svg>',
        '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M21 5a9 9 0 0 0-10 11L3 24l8 8 8-8a9 9 0 0 0 11-10l-6 5-7-7z" fill="#aebdca" stroke="#344d68" stroke-width="2" stroke-linejoin="round"/><circle cx="25" cy="10" r="2" fill="#f7f7f5"/></svg>',
        '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M3 31h31" stroke="#364e67" stroke-width="2"/><path d="M6 18h7v13H6z" fill="#5687bc" stroke="#344d68"/><path d="M16 10h7v21h-7z" fill="#6c9b56" stroke="#344d68"/><path d="M26 4h7v27h-7z" fill="#db8a35" stroke="#344d68"/></svg>',
      ];
      navItems.forEach((name, i) => {
        const n = u.el('div', 'gtk-navitem' + (i === 1 ? ' active' : ''), rail);
        const icon = u.el('span', 'gtk-navicon', n);
        icon.innerHTML = navIcons[i];
        u.el('span', '', n, name);
      });
      const work = u.el('main', 'gtk-work', shell);
      const editor = u.el('section', 'lease-editor', work);
      u.el('div', 'lease-editor-title', editor, 'Edit Lease');
      const editorBody = u.el('div', 'lease-editor-body', editor);
      const stage = u.el('section', 'gtk-stage', editorBody);
      const table = u.el('div', 'tenant-backdrop', work);
      u.el('h1', 'gtk-section-title', table, 'Tenants');
      const grid = u.el('div', 'tenant-grid', table);
      const th = u.el('div', 'tenant-row tenant-head', grid);
      u.el('span', '', th, 'Name');
      u.el('span', '', th, 'Property');
      [
        ['Adams, Peter', 'Maple Apartments'],
        ['Chen, Liling', 'Oak Terrace'],
        ['Davis, Jordan', 'Riverside Manor'],
        ['Garcia, Maria', 'Pine View'],
        ['Khan, Aamir', 'Cedar Ridge'],
        ['Lopez, Teresa', 'Maple Apartments'],
        ['Miller, Chris', 'Oak Terrace'],
        ['Nguyen, Han', 'Riverside Manor'],
        ['Patel, Rina', 'Pine View'],
        ['Robinson, Daniel', 'Cedar Ridge'],
        ['Smith, Allison', 'Maple Apartments'],
        ['Torres, Miguel', 'Oak Terrace'],
      ].forEach((r, i) => {
        const row = u.el('div', 'tenant-row' + (i === 2 ? ' selected' : ''), grid);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const help = u.el('aside', 'lease-help', editorBody);
      u.el('h3', '', help, 'About lease dates');
      u.el('p', '', help, 'Select the month and year the lease starts. You can also set when the lease ends.');
      u.el('hr', '', help);
      u.el('h3', '', help, 'Tips');
      [
        'Click the field to choose a month from the calendar.',
        'You can also type a month and year, such as Jul 2024.',
        'The end date can be left blank for a month-to-month lease.',
      ].forEach((t) => u.el('p', 'gtk-tip', help, '•　' + t));
      if (ctx.display === 'panel') {
        const note = u.el('aside', 'gtk-side-note', rail);
        u.el('b', '', note, 'About this task');
        u.el('div', '', note, ctx.instruction);
      }
      if (ctx.display === 'toast') {
        const note = u.el('aside', 'gtk-toast', head);
        u.el('span', '', note, ctx.instruction);
      }
      const footer = u.el('footer', 'gtk-footer', win);
      const endRng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Save';
      if (!ctx.finish) {
        if (endRng.bool(0.5)) placement = 'footer';
        else {
          const alts = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
          if (alts.length) label = endRng.pick(alts);
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const button = (p, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, p, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'footer') submit = button(footer, 'gtk-save', label, false);
      if (placement === 'header') submit = button(bar, 'gtk-header-end', label, false);
      if (placement === 'link') submit = button(footer, 'gtk-link-end', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const text = cr.pick(options),
              d = u.el('button', 'gtk-xtra', footer, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new service.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
