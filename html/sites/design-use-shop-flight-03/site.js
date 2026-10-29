(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-flight-03',
    brand: 'Flight Finder',
    tokens: {
      bg: '#f3eee4',
      panel: '#fffdf9',
      fg: '#1f1a15',
      accent: '#e8892f',
      font: 'Cantarell,sans-serif',
      line: '#d6cdbd',
      muted: '#6f675c',
    },
    menu: ['File', 'Edit', 'View', 'Help'],
    obstruction: null,
  };
  env.site({
    name: D.site,
    styles: ['gnome.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        content = ctx.content;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'gnome instruction-' + ctx.display;

      const endR = ctx.rng.fork('chrome/end');
      const rawEnds = content && content.END_LABELS;
      const ends = (
        Array.isArray(rawEnds) && rawEnds.length
          ? rawEnds
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const otherEnds = ends.filter((x) => x.trim().toLowerCase() !== 'submit');
      const endLabel = endR.bool(0.5) || !otherEnds.length ? 'Submit' : endR.pick(otherEnds);
      const placementR = ctx.rng.fork('chrome/end-placement');
      const alternatePlacement = placementR.pick(['title', 'menu', 'link']);
      const placement = ctx.finish ? null : endLabel === 'Submit' ? 'side' : alternatePlacement;
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const choices = [...new Set(ends.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
        if (choices.length) collide = collideR.pick(choices);
      }

      const shell = u.el('div', 'site-shell', document.body);
      const tb = u.el('header', 'titlebar', shell);
      const ico = u.el('span', 'ico', tb);
      ico.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="10.5"/><path d="M8 6.5a6.5 6.5 0 0 1 7.5-.4M18 10a6.5 6.5 0 0 1-3.3 7.8M9 18a6.5 6.5 0 0 1-3.4-6.7"/><circle cx="6" cy="8" r="1.7" fill="currentColor"/><circle cx="18" cy="8" r="1.7" fill="currentColor"/><circle cx="12" cy="18" r="1.7" fill="currentColor"/></svg>';
      u.el('span', 'ttl', tb, D.brand);
      const wb = u.el('div', 'wbtns', tb);
      u.el('i', '', wb);
      u.el('i', '', wb);
      u.el('i', 'x', wb);
      const mb = u.el('nav', 'menubar', shell);
      for (const m of D.menu) u.el('span', '', mb, m);
      const titleTools = u.el('div', 'title-tools', tb);
      const menuTools = u.el('div', 'menu-tools', mb);

      const body = u.el('div', 'design-body', shell);
      const main = u.el('div', 'main-col', body);
      const note = u.el('section', 'task-note', main);
      note.dataset.role = 'instruction';
      const wide = document.body.clientWidth >= 1280 && document.body.clientHeight >= 800;
      const panelMode = ctx.display === 'panel' && wide;
      document.body.classList.toggle('instruction-panel-rail', panelMode);
      const showNote = ctx.display !== 'hidden' && !panelMode;
      if (showNote) {
        if (ctx.display === 'toast') note.classList.add('toast-note');
        u.el('p', 'flight-task', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', main);
      const side = u.el('aside', 'trip', body);
      if (panelMode) {
        const panel = u.el('section', 'episode-panel', side);
        u.el('strong', '', panel, 'Your task');
        u.el('div', '', panel, ctx.instruction);
      }
      u.el('h2', '', side, 'Your trip');
      u.el('div', 'trip-route', side, '— → —');
      u.el('div', 'trip-date', side, 'One-way');
      u.el('h3', '', side, 'Selected flight');
      u.el('div', 'sel', side, 'Choose a flight from the list.');
      const book = u.el('button', 'trip-book', side, 'Book');
      book.type = 'button';
      book.disabled = true;
      u.el('div', 'lab passenger', side, 'Passenger');
      u.el('div', 'fakein', side, 'John Doe');
      u.el('div', 'lab', side, 'Contact email');
      u.el('div', 'fakein', side, 'john.doe@example.com');
      u.el('div', 'hint', side, 'You’ll confirm details on the airline’s site after booking.');

      const makeEnd = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'A') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (collide) decoy(placement === 'title' ? titleTools : menuTools, collide);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'side') submit = makeEnd(side, 'end-control', endLabel);
        else if (placement === 'title') submit = makeEnd(titleTools, 'chrome-end-title', endLabel);
        else if (placement === 'menu') submit = makeEnd(menuTools, 'chrome-end-menu', endLabel);
        else submit = makeEnd(side, 'end-link', endLabel + ' ›');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) [title, copy, label] = named;
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
