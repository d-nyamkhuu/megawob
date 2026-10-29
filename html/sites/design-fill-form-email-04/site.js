(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-email-04',
    'brand': 'Mail',
    'title': 'Add Contact',
    'instruction': 'right',
    'rail': '',
    'menu': 'Reply|Reply All|Forward|Delete|Flag',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg viewBox="0 0 96 66"><path d="M3 11v47q24-4 45 5 22-9 45-5V11" fill="none" stroke="#c6ba94" stroke-width="3"/><path d="M9 7v47q21-2 39 9 19-11 39-9V7" fill="#f6edcc" stroke="#a2946e" stroke-width="2"/><path d="M16 3q19-1 32 12Q61 2 80 3v46q-20 1-32 14-13-13-32-14Z" fill="#efe8cd" stroke="#b7a981" stroke-width="2"/><path d="M48 15v48M13 7v43M83 7v43" fill="none" stroke="#958b67" stroke-width="2"/></svg>';
      const bt = u.el('span', 'ds-brand', top);
      u.el('b', '', bt, 'Riverton Public Library');
      u.el('i', '', bt, 'Catalog System');
      const tn = u.el('span', 'ds-topnav', top);
      ['Search', 'Add Record', 'Reports', 'Help'].forEach((t) => u.el('span', '', tn, t));
      const book =
        '<path d="M4 5q9-3 16 2 7-5 16-2v25q-9-2-16 2-7-4-16-2Z"/><path d="M20 7v25M1 7v26q11-1 19 2 8-3 19-2V7"/>';
      const glyphs = {
        'New Record': book,
        'MARC View': book,
        'Open': '<path d="M5 9V5h12l3 4h15v26H5Z"/><path d="M5 14h30"/>',
        'Save':
          '<path d="M4 3h32v34H4Z" fill="currentColor"/><path d="M10 3h18v12H10ZM10 23h21v13H10Z" fill="#f5f2eb"/><path d="M23 5v7"/>',
        'Delete': '<path d="M8 7l25 26M33 7L8 33" stroke-width="4"/>',
        'Cut':
          '<path d="M6 3h17l10 11v21H6Z" fill="#a3a3a2" stroke="#a3a3a2"/><path d="M23 3v12h10M15 13h18v24H15Z" fill="#c2c2be" stroke="#8c8c8a"/>',
        'Copy':
          '<path d="M7 4h16l9 10v22H7Z"/><path d="M23 4v10h9M14 10h15l7 8v21H14Z" fill="#f5f2eb"/><path d="M29 10v8h7"/>',
        'Paste':
          '<path d="M10 7h21v28H10Z" fill="currentColor"/><path d="M17 4h8v5h-8Z"/><path d="M16 14h20v24H16Z" fill="#f5f2eb"/><path d="M20 18h11"/>',
        'Find': '<circle cx="24" cy="15" r="11"/><path d="M16 24L4 36" stroke-width="3"/>',
        'Advanced Search':
          '<path d="M7 16h9v19H4V24ZM24 16h9l4 8v11H24Z" fill="currentColor"/><path d="M10 8h6v8h-9ZM24 8h6l3 8h-9ZM16 21h8M16 27h8"/><path d="M13 5h5M23 5h5"/>',
        'Authority Look-up': '<path d="M5 4h31v32H5Z"/><path d="M10 12h3M10 20h3M10 28h3M17 12h14M17 20h14M17 28h14"/>',
        'Print': '<path d="M10 4h21v13H10ZM4 17h33v16H4ZM11 28h20v10H11Z"/><path d="M27 9h1M28 22h4"/>',
        'Preferences':
          '<path d="M16 3h8l1 5 5 2 4-2 4 7-4 3v5l4 3-4 7-5-2-4 2-1 5h-8l-1-5-5-2-4 2-4-7 4-3v-5l-4-3 4-7 5 2 4-2Z" fill="currentColor" stroke="none"/><circle cx="20" cy="20" r="6" fill="#f5f2eb" stroke="none"/>',
      };
      const rib = u.el('nav', 'ds-ribbon', document.body);
      [
        ['Catalog', ['New Record', 'Open', 'Save', 'Delete']],
        ['Edit', ['Cut', 'Copy', 'Paste']],
        ['Tools', ['Find', 'Advanced Search', 'Authority Look-up']],
        ['View', ['MARC View', 'Print']],
        ['Options', ['Preferences']],
      ].forEach((g) => {
        const grp = u.el('div', 'ds-grp', rib);
        u.el('h4', '', grp, g[0]);
        const row = u.el('div', 'ds-btns', grp);
        g[1].forEach((t) => {
          const b = u.el('div', 'ds-tool' + (t === 'Delete' ? ' dis' : ''), row);
          b.addEventListener('click', () => env.log('decoy', { label: t }));
          const ico = u.el('span', 'ds-ico', b);
          ico.innerHTML =
            '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">' +
            glyphs[t] +
            '</svg>';
          u.el('span', '', b, t);
        });
      });
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      let mode = ctx.display || 'header';
      if ((mode === 'panel' || mode === 'toast') && document.body.clientWidth <= 1100) mode = 'header';
      content.dataset.instruction = mode;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const main = u.el('div', 'ds-main', content);
      if (mode === 'header' || mode === 'panel')
        briefing(main, 'ds-brief' + (mode === 'panel' ? ' ds-panel-note' : ''));
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready.');
      const clr = u.el('button', 'ds-clear', foot, 'Clear Form');
      clr.type = 'button';
      clr.addEventListener('click', () => env.log('decoy', { label: 'Clear Form' }));
      // Keep the reference footer and label in half of episodes; independent streams preserve task seeds.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['header', 'link']);
      const label = original ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit ds-end-' + placement,
          placement === 'header' ? tn : foot,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        const text = cr.pick(options);
        const decoy = u.el('button', 'ds-xtra', foot, text);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        foot.insertBefore(decoy, clr);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
