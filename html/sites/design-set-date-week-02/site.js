(function () {
  'use strict';
  const C = { site: 'design-set-date-week-02' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const glyph = (key, parent, cls) => {
        const paths = {
          home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
          chart: '<path d="M5 20V12M12 20V5M19 20V9"/>',
          calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
          check: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 12 3 3 7-7"/>',
          people:
            '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
          list: '<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
          search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
          bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
        };
        const e = u.el('span', cls, parent);
        e.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          paths[key] +
          '</svg>';
        return e;
      };
      const body = u.el('div', 'ds-body', document.body);
      const side = u.el('aside', 'ds-sidebar', body);
      const brand = u.el('div', 'ds-brand', side);
      u.el('span', 'ds-mark', brand, 'E');
      u.el('b', '', brand, 'FlowForge');
      const nav = u.el('nav', 'ds-nav', side);
      [
        ['home', 'Workspace'],
        ['chart', 'Roadmap'],
        ['calendar', 'Sprints'],
        ['check', 'Tasks'],
        ['chart', 'Reports'],
        ['people', 'Team'],
      ].forEach(([icon, label], i) => {
        const row = u.el('div', 'ds-nav-item' + (i === 2 ? ' active' : ''), nav);
        glyph(icon, row, 'ds-nav-icon');
        u.el('span', '', row, label);
      });
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      let note = null;
      if (ctx.display !== 'hidden') {
        note = u.el(
          'aside',
          'ds-task-note ' +
            (ctx.display === 'toast' ? 'ds-toast' : ctx.display === 'panel' ? 'ds-panel-note' : 'ds-header-note'),
          content,
        );
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      if (note && ctx.display === 'header') content.insertBefore(note, main);
      const stage = u.el('main', 'ds-stage', main);
      const rail = u.el('aside', 'ds-rail', main);
      if (note && ctx.display === 'panel') rail.appendChild(note);
      const h = u.el('div', 'ds-help-head', rail);
      u.el('span', 'ds-calendar-icon', h, '▢');
      u.el('h2', '', h, 'About sprint weeks');
      u.el(
        'p',
        'ds-help-copy',
        rail,
        'A sprint week represents a full Monday–Sunday week. Select the week that contains the date you have in mind.',
      );
      u.el('hr', '', rail);
      u.el('h3', '', rail, 'Examples');
      [
        ['Jul 1, 2024', 'Week of Jul 1, 2024'],
        ['Jul 29, 2024', 'Week of Jul 29, 2024'],
        ['Aug 12, 2024', 'Week of Aug 12, 2024'],
      ].forEach((x) => {
        const row = u.el('div', 'ds-example', rail);
        u.el('span', '', row, x[0]);
        u.el('span', '', row, '→');
        u.el('span', '', row, x[1]);
      });
      u.el('hr', '', rail);
      u.el('h3', '', rail, 'Tips');
      const tips = u.el('ul', 'ds-tips', rail);
      [
        'You can type a date, such as Jul 29, 2024, to find the week quickly.',
        'Weeks always run from Monday to Sunday.',
        'The selected week will be used for sprint reporting and capacity planning.',
      ].forEach((x) => u.el('li', '', tips, x));
      const dock = u.el('footer', 'ds-footer', content);
      [
        ['search', 'Home'],
        ['list', 'My work'],
        ['calendar', 'Sprints'],
        ['people', 'People'],
        ['chart', 'Reports'],
      ].forEach((x, i) => {
        const item = u.el('div', 'ds-dock-item' + (i === 2 ? ' active' : ''), dock);
        glyph(x[0], item, 'ds-dock-icon');
        u.el('span', '', item, x[1]);
      });
      glyph('bell', dock, 'ds-bell');
      u.el('span', 'ds-avatar', dock, 'JD');
      const endRng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Continue';
      if (!ctx.finish) {
        if (endRng.bool(0.5)) placement = 'footer';
        else {
          const alternatives = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
          if (alternatives.length) label = endRng.pick(alternatives);
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const make = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
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
      if (placement === 'footer') submit = make(dock, 'ds-submit', label, false);
      else if (placement === 'header') submit = make(content, 'ds-end-header', label, false);
      else if (placement === 'link') submit = make(dock, 'ds-end-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (words.length) {
            const t = cr.pick(words),
              d = u.el('button', 'ds-xtra', dock, t);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: t, collide: true }));
          }
        }
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
