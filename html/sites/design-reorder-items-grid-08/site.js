(function () {
  'use strict';
  const C = {
    'theme': 'library',
    'layout': 'library',
    'accent': '#6a2024',
    'bg': '#fbf7ee',
    'surface': '#fbf8f0',
    'font': "Georgia, 'Times New Roman', serif",
  };
  env.site({
    name: 'design-reorder-items-grid-08',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className =
        'design ' + C.theme + ' layout-' + C.layout + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const endFallback = [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const endLabels = (
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : endFallback
      ).map(labelOf);
      let endPlacement = 'footer',
        endLabel = 'Submit';
      if (!ctx.finish && !endRng.bool(0.5)) {
        endPlacement = endRng.pick(['bar', 'link', 'bar', 'link']);
        endLabel = endRng.pick(endLabels);
      }
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const candidates = [...new Set(endLabels)].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (candidates.length)
          collision = { label: collideRng.pick(candidates), where: collideRng.pick(['bar', 'footer']) };
      }
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#2a1a1a',
        muted: '#5a4a48',
        line: '#8a5a5a',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const brief = u.el('section', 'lib-brief', shell);
      const logo = u.el('div', 'lib-logo', brief);
      const books = u.svg(
        'svg',
        {
          width: 200,
          height: 150,
          viewBox: '0 0 200 150',
          fill: 'none',
          stroke: '#5a1a1e',
          'stroke-width': 1.6,
          class: 'lib-books',
        },
        logo,
      );
      // Reuse only the decorative engraving; the SVG viewport clips out all reference UI.
      const defs = u.svg('defs', {}, books),
        ink = u.svg('filter', { id: 'library-ink', 'color-interpolation-filters': 'sRGB' }, defs);
      u.svg('feColorMatrix', { type: 'matrix', values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -2 -2 -2 0 5.4' }, ink);
      u.svg(
        'image',
        {
          href: 'sites/design-reorder-items-grid-08/assets/library-engraving.webp',
          x: -20,
          y: -25,
          width: 1672,
          height: 941,
          filter: 'url(#library-ink)',
        },
        books,
      );
      const name = u.el('div', 'lib-name', logo);
      u.el('div', 'lib-name-big', name, 'Riverton Public Library');
      u.el('div', 'lib-motto', name, 'Books Build Brighter Minds');
      u.el('hr', 'lib-rule', brief);
      u.el('h2', 'lib-h2', brief, 'Task Briefing');
      u.el('p', '', brief, 'The tiles on the right show call numbers from our catalog, but they are out of order.');
      const briefInstruction = u.el('p', 'lib-instr', brief, ctx.instruction);
      if (ctx.display === 'hidden') briefInstruction.hidden = true;
      u.el(
        'p',
        '',
        brief,
        'Use the mouse to drag and drop the tiles into the grid on the right.',
      );
      u.el('hr', 'lib-rule thin', brief);
      const ex = u.el('div', 'lib-example', brief);
      const eh = u.el('div', 'lib-ex-h', ex);
      u.el('b', '', eh, 'Example');
      eh.append(' (for understanding order)');
      const et = u.el('div', 'lib-ex-tiles', ex);
      for (const t of ['A12', 'B07', 'C03']) u.el('span', '', et, t);
      u.el('p', 'lib-ex-note', ex, 'In the example, the tiles are in alphabetical order from left to right.');
      u.el('hr', 'lib-rule thin', brief);
      const q = u.el('div', 'lib-quote', brief);
      u.el('div', '', q, '“A library is a universe of possibilities.”');
      u.el('div', 'by', q, '— Anonymous');
      const main = u.el('div', 'lib-main', shell);
      const head = u.el('header', 'lib-head', main);
      u.el('div', 'lib-title', head, 'Riverton Public Library');
      u.el('div', 'lib-tag', head, 'Knowledge Serves a Brighter Tomorrow');
      const nav = u.el('nav', 'lib-nav', main);
      ['Catalog', 'Research Tools', 'Community', 'About'].forEach((t, i) => {
        if (i) u.el('i', '', nav, '|');
        const a = u.el('a', '', nav, t);
        a.onclick = () => env.log('nav', { label: t });
      });
      const panel = u.el('div', 'lib-panel', main);
      const bar = u.el('div', 'lib-bar', panel);
      u.el('span', '', bar, 'Arrange the Call Numbers');
      const note = u.el('section', 'task-note', panel);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', panel);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', panel);
      const left = u.el('div', 'lib-actions', footer);
      const reset = u.el('button', 'clear', left, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.widgetDef.clear?.();
      const shuf = u.el('button', 'clear', left, 'Shuffle');
      shuf.type = 'button';
      shuf.onclick = () => env.log('shuffle', {});
      const addDecoy = (parent, label, collides) => {
        const b = u.el('button', collides ? 'lib-xtra lib-pqs' : 'lib-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collides ? { label, collide: true } : { label });
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        const addSubmit = (parent, where) => {
          const b = u.el(where === 'link' ? 'a' : 'button', where === 'link' ? 'lib-endlink' : 'submit', parent);
          if (where === 'link') b.href = '#';
          else b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', endLabel);
          b.title = endLabel;
          u.el('span', 'submit-label', b, endLabel);
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (endPlacement === 'bar') submit = addSubmit(bar, 'bar');
        else if (endPlacement === 'link') submit = addSubmit(left, 'link');
        else submit = addSubmit(footer, 'footer');
      }
      if (collision) {
        const target = collision.where === 'bar' ? bar : left;
        const d = addDecoy(target, collision.label, true);
        if (collision.where === 'bar') d.classList.add('lib-bar-xtra');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Library notice',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This site stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with the catalog?',
        promo: 'Ask a librarian about new services.',
        banner: 'You are viewing the public catalog.',
      }[kind];
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
