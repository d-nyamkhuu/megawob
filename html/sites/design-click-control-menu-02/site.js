(function () {
  'use strict';
  const D = {
    school: 'Riverton College',
    sub: 'Mail System',
    heading: 'Recent Messages',
    cols: ['From', 'Subject', 'Date'],
    rows: [
      ['Pat Lee', 'Meeting Tomorrow', 'Apr 22, 1995'],
      ['Registrar', 'Course Update', 'Apr 21, 1995'],
      ['Dana Ruiz', 'Re: Notes', 'Apr 21, 1995'],
      ['IT Office', 'System Maintenance', 'Apr 20, 1995'],
    ],
    nav: ['Home', 'Mail', 'Calendar', 'Contacts', 'Help'],
    empty: ['No message selected.', 'Use the menu above to find the item with the envelope icon.'],
  };
  env.site({
    name: 'design-click-control-menu-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const originalEnd = endRng.bool(0.5);
      const placement = originalEnd ? 'footer' : endRng.pick(['header', 'link']);
      const endLabel = originalEnd ? 'Submit' : endRng.pick(endWords);
      const collideRng = ctx.rng.fork('chrome/collide');
      const otherWords = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && otherWords.length ? collideRng.pick(otherWords) : null;
      const logDecoy = (el, label) => el.addEventListener('click', () => env.log('decoy', { label }));
      document.body.className = 'ref acad';
      // overflow:hidden still permits focus to scroll the document. A reset must
      // not inherit an earlier episode's viewport offset.
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
      const shell = u.el('main', 'shell', document.body);
      const ov = u.el('section', 'overview', shell);
      const left = u.el('div', 'ov-main', ov);
      const brand = u.el('div', 'brand', left);
      const a = u.el('a', 'school', brand, D.school);
      a.href = '#';
      a.addEventListener('click', (e) => e.preventDefault());
      logDecoy(a, D.school);
      u.el('div', 'subtitle', brand, D.sub);
      u.el('hr', 'rule', left);
      u.el('h2', 'recent', left, D.heading);
      const t = u.el('table', 'msgs', left);
      const hr = u.el('tr', '', t);
      D.cols.forEach((c) => u.el('th', '', hr, c));
      D.rows.forEach((r) => {
        const tr = u.el('tr', '', t);
        r.forEach((c, i) => {
          const td = u.el('td', '', tr);
          if (i === 1) {
            const l = u.el('a', '', td, c);
            l.href = '#';
            l.addEventListener('click', (e) => e.preventDefault());
            logDecoy(l, c);
          } else td.textContent = c;
        });
      });
      const nav = u.el('nav', 'links', ov);
      D.nav.forEach((n) => {
        const l = u.el('a', '', nav, n);
        l.href = '#';
        l.addEventListener('click', (e) => e.preventDefault());
        logDecoy(l, n);
      });
      u.el('div', 'splitter', shell);
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el(ctx.display === 'panel' ? 'aside' : 'div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.setAttribute('aria-label', 'Instructions');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        note.setAttribute('role', 'status');
      }
      u.el('hr', 'rule2', center);
      const stage = u.el('div', 'stage', center);
      const result = u.el('div', 'result', center);
      D.empty.forEach((s) => u.el('p', '', result, s));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit end-' + placement,
          placement === 'header' ? brand : center,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (collide) {
        const decoy = u.el('button', 'end-xtra', center, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
