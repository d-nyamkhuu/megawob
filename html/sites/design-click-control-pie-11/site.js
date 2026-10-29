(function () {
  'use strict';
  const cfg = {
    title: 'Task Studio',
    theme: 'memphis',
    layout: 'board',
    obstacle: 'BIG NEWS!',
    copy: 'We’re building an even brighter workspace experience.|Explore what’s coming soon and be part of it!',
    dismiss: 'Collapse announcement',
  };
  env.site({
    name: 'design-click-control-pie-11',
    initialOverlay: { kind: 'banner' },
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref memphis board';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, cfg.title);
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      const brand = u.el('span', 'ready', foot);
      brand.innerHTML =
        '<svg viewBox="0 0 64 64"><path d="M32 8A27 27 0 0 0 5 36L32 32Z" fill="#ff8e98" stroke="#10162e" stroke-width="3"/><path d="M5 36A27 27 0 0 0 32 61V32Z" fill="#ffe47b" stroke="#10162e" stroke-width="3"/><path d="M32 4A28 28 0 0 1 32 60Z" fill="#bca1f1" stroke="#10162e" stroke-width="3"/></svg><strong>Task<br>Studio</strong><small>SMALL TASKS<br>BRIGHTER DAYS</small>';
      let submit = null;
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end');
        const pool = ctx.content.END_LABELS;
        const labels = (
          Array.isArray(pool) && pool.length
            ? pool
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        ).map((x) => String(typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || x));
        const submitLabel = labels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit';
        const alternatives = labels.filter((x) => x.trim().toLowerCase() !== submitLabel.toLowerCase());
        const label = r.bool(0.5) || !alternatives.length ? submitLabel : r.pick(alternatives);
        const place = r.pick(['footer', 'footer', 'header', 'link']);
        const parent = place === 'header' ? work : foot;
        submit = u.el(
          place === 'link' ? 'a' : 'button',
          place === 'header' ? 'submit work-submit' : place === 'link' ? 'submit end-link' : 'submit',
          parent,
          label + (place === 'link' ? ' ›' : ''),
        );
        if (place === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const choices = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
          if (choices.length) {
            const decoy = u.el('button', 'submit end-xtra', foot, cr.pick(choices));
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
          }
        }
      }
      const obstacle = u.el('section', 'design-obstacle', shell);
      obstacle.hidden = true;
      u.el('h2', '', obstacle, cfg.obstacle);
      cfg.copy.split('|').forEach((t) => u.el('p', '', obstacle, t));
      const close = u.el('button', 'dismiss-design', obstacle, cfg.dismiss);
      close.type = 'button';
      close.addEventListener('click', () => {
        obstacle.hidden = true;
      });
      const art = u.el('div', 'announcement-art', obstacle);
      art.innerHTML =
        '<svg viewBox="0 0 300 200"><g stroke="#0c1232" stroke-width="7" stroke-linejoin="round"><path d="M73 129 91 179Q92 183 86 185L68 189Q63 191 61 185L46 139Z" fill="#0c1232"/><path d="M64 95 39 104Q18 111 23 132Q28 153 50 146L74 141Z" fill="#c7a5fa"/><path d="M61 95 157 22 188 146 74 141Q65 122 61 95Z" fill="#fcf9ee"/><ellipse cx="175" cy="83" rx="16" ry="65" transform="rotate(-14 175 83)" fill="#c7a5fa"/><path d="m198 33 18-23m-8 55 24-10m-18 44 23 4" fill="none" stroke-linecap="round"/></g><path d="m5 46 26-31" stroke="#c7a5fa" stroke-width="13" stroke-linecap="round"/></svg>';
      const burst = u.el('div', 'announcement-burst', obstacle);
      burst.innerHTML =
        '<svg viewBox="0 0 60 80"><path d="m7 26 29-22M9 42l44 4M8 61l12 12" fill="none" stroke="#c7a5fa" stroke-width="8" stroke-linecap="round"/></svg>';
      const squiggle = u.el('div', 'announcement-squiggle', obstacle);
      squiggle.innerHTML =
        '<svg viewBox="0 0 150 60"><path d="M5 45C18 13 28 62 43 30S65 51 80 20 104 40 119 13Q127 3 145 16" fill="none" stroke="#0c1232" stroke-width="7" stroke-linecap="round"/></svg>';
      u.el('i', 'little-dot', center);
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.kind === 'banner') {
        const source = document.querySelector('.design-obstacle');
        const el = source.cloneNode(true);
        el.hidden = false;
        el.classList.add('episode-announcement');
        document.body.appendChild(el);
        const dismiss = el.querySelector('.dismiss-design');
        dismiss.addEventListener('click', () => {
          source.hidden = true;
          ctx.dismiss();
        });
        return { el, dismiss };
      }
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer' }[ctx.kind] ||
          'Service notice',
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
        }[ctx.kind] || 'A new update is available.',
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
