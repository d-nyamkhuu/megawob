// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-privacy-05',
  name: 'design',
  split: 'train',
  scenarios: ['privacy'],
  template: 'avoid-dark-patterns/browser',
  design: {
    windowRadius: '0',
    windowShadow: 'none',
    parts: {
      frame: (base) => (ctx) => {
        const win = base(ctx);
        Object.assign(win.style, {
          left: '0px', top: '0px', border: '0',
          width: `${ctx.size.width}px`, height: `${ctx.size.height}px`,
        });
        return win;
      },
      tabs: (base, S) => (ctx) => {
        // Retain the template's random draws; this app has no browser tab strip.
        base(ctx);
        S.tabTitle.closest('.sd-tabs').remove();
      },
      addressBar: (base, S) => (ctx) => {
        const el = ctx.util.el;
        S.bar = el('div', 'nl-reading-status', S.win);
        el('span', '', S.bar, 'Northern Ledger');
        S.hostEl = el('span', '', S.bar);
        S.pathEl = el('span', '', S.bar);
      },
      header: (base, S) => (parent, model) => {
        // The masthead is already supplied by the app frame above the wall.
        if (S.spec.screens[model.screen].dialog) return null;
        return base(parent, model);
      },
      dialog: (base, S) => (parent, list, model, cls) => {
        const dlg = base(parent, list, model, cls);
        if (list.some((b) => b.t === 'check')) return dlg;
        const children = Array.from(dlg.children);
        dlg.classList.add('nl-wall');
        const el = S.ctx.util.el;
        const copy = el('div', 'nl-consent-copy', dlg);
        const choices = el('div', 'nl-consent-choices', dlg);
        for (const cls of ['nl-d-circle', 'nl-d-dot', 'nl-d-tri']) el('span', cls, dlg);
        for (const node of children) {
          if (node.classList.contains('sd-btns')) {
            for (const button of node.children) button.classList.add('nl-consent-button');
          } else {
            copy.append(node);
            if (node.classList.contains('sd-h')) node.classList.add('nl-consent-heading');
          }
        }
        dlg.append(node2(children));
        const items = [
          ['Essential cookies', 'Needed for the site to work, such as security, network management and accessibility.', 'Always on', 'M5 2h9l5 5v15H5zM14 2v5h5M8 12h8M8 16h8'],
          ['Performance cookies', 'Help us understand how people use our site, so we can make it better.', '', 'M4 21V11M10 21V4M16 21V13M22 21H2'],
          ['Advertising cookies', 'Used to show you relevant ads on and off our site.', '', 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2'],
          ['Personalisation cookies', 'Help us remember your settings and show content that’s more relevant to you.', '', 'M12 3a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM4 22v-3a6 6 0 016-6h4a6 6 0 016 6v3z'],
        ];
        for (const [title, text, tag, d] of items) {
          const row = el('div', 'nl-cookie', choices);
          const ic = el('span', 'nl-cookie-ic', row);
          ic.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#0a1230" stroke-width="1.6" stroke-linejoin="round"><path d="${d}"/></svg>`;
          const body = el('div', 'nl-cookie-body', row);
          const t = el('div', 'nl-cookie-title', body, title);
          if (tag) el('i', '', t, tag);
          el('div', 'nl-cookie-desc', body, text);
        }
        return dlg;
        function node2(list) {
          const b = list.find((n) => n.classList.contains('sd-btns'));
          b.classList.add('nl-wall-btns');
          return b;
        }
      },
      main: (base, S) => (sc, body, model) => {
        const main = base(sc, body, model);
        main.classList.add('nl-article');
        if (!S.spec.screens[model.screen].dialog) return main;
        body.style.padding = '0';
        main.style.position = 'relative';
        // The inaccessible story list sits beneath the consent wall, while its
        // teaser occupies the upper part of the photo. Keep every control intact.
        main.style.paddingTop = `${Math.round(S.ctx.size.height * .74)}px`;
        const headline = document.createElement('div');
        headline.className = 'nl-feature-title';
        headline.textContent = 'Beneath the high street, a lost passage comes to light';
        const deck = document.createElement('div');
        deck.className = 'nl-feature-deck';
        deck.textContent = 'Archaeologists uncover a forgotten route that may have linked the town’s market to the river, shedding new light on Sablefen’s medieval past.';
        main.append(headline, deck);
        return main;
      },
    },
  },
});
