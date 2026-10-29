(function () {
  'use strict';
  const cfg = { title: 'Event Registration Form', theme: 'carbon', layout: 'carbon' };
  env.site({
    name: 'design-click-control-focus-08',
    styles: ['site.css', 'carbon.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref carbon carbon-layout';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      title.innerHTML =
        '<svg class="app-ico" viewBox="0 0 28 28"><defs><linearGradient id="app-blue" x2="0" y2="1"><stop stop-color="#9db6c8"/><stop offset=".45" stop-color="#37688e"/><stop offset="1" stop-color="#1b3047"/></linearGradient></defs><rect x="1" y="1" width="26" height="26" rx="3" fill="#111820" stroke="#9ba6af"/><rect x="3" y="3" width="22" height="22" rx="2" fill="url(#app-blue)"/><path d="M7 11h6v12H7zM16 7h6v14h-6z" fill="#d2e1ec" stroke="#43515f"/><path d="M8 13h4m-4 3h4m5-6h4m-4 3h4m-4 3h4" stroke="#41739a"/><circle cx="13" cy="12" r="3" fill="#e7d8c0" stroke="#4a5156"/><path d="M9 23v-6q4-5 8 0v6" fill="#a5c5df" stroke="#344b67"/><path d="m18 4 2 3 3-1-1 4-3 1-2-3z" fill="#eee9dc"/></svg>';
      u.el('span', '', title, 'Customer Records');
      const wc = u.el('span', 'window-controls', title);
      wc.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menu = u.el('div', 'menubar', head);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((s) => u.el('span', '', menu, s));

      let display = ctx.display || 'header';
      const work = u.el('div', 'work', shell);
      const left = u.el('div', 'col-left', work);
      const tp = u.el('section', 'panel task-panel', left);
      u.el('h2', '', tp, 'Task');
      const note = u.el('div', 'instruction', tp, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'hidden') tp.remove();
      if (display === 'toast') note.classList.add('instruction-toast');
      const ip = u.el('section', 'panel info-panel', left);
      u.el('h2', '', ip, 'Customer Information');
      const stage = u.el('div', 'stage', ip);
      const foot = u.el('footer', 'footer', ip);
      const clear = u.el('button', 'clear-form', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => shell.querySelectorAll('input,textarea').forEach((i) => (i.value = '')));

      const aside = u.el('aside', 'panel details', work);
      u.el('h2', '', aside, 'Details');
      if (display === 'panel') {
        note.classList.add('instruction-panel');
        aside.appendChild(note);
        tp.remove();
      }
      [
        ['Record Type', 'New Customer'],
        ['Required Fields', '—'],
        ['Status', 'Not submitted'],
      ].forEach((r) => {
        const d = u.el('div', 'kv', aside);
        u.el('span', 'k', d, r[0]);
        u.el('span', 'v' + (r[0] === 'Required Fields' ? ' field-count' : ''), d, r[1]);
      });

      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labelRng = er.fork('label');
        const placementRng = er.fork('placement');
        const raw = ctx.content && ctx.content.END_LABELS;
        const labels = (
          Array.isArray(raw) && raw.length
            ? raw
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        let label = 'Submit';
        if (labelRng.bool(0.5)) {
          const choices = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
          if (choices.length) label = labelRng.pick(choices);
        }
        const placement = placementRng.pick(['link', 'footer', 'header', 'footer']);
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const choices = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (choices.length) collide = { label: cr.pick(choices), where: cr.pick(['footer', 'header']) };
        }
        const makeEnd = (parent, cls, text, link) => {
          const b = u.el(link ? 'a' : 'button', cls, parent, text);
          if (link) b.href = '#';
          else b.type = 'button';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'header') {
          menu.classList.add('has-end');
          submit = makeEnd(menu, 'carbon-header-end', label, false);
        } else if (placement === 'link') {
          submit = makeEnd(foot, 'carbon-end-link', label + ' ›', true);
        } else {
          submit = makeEnd(foot, 'submit', label, false);
        }
        if (collide) {
          const parent = collide.where === 'header' ? menu : foot;
          const b = u.el('button', 'xtra-end', parent, collide.label);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
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
