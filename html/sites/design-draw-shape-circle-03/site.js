(function () {
  'use strict';
  const C = {
    'title': 'Dot Trace',
    'subtitle': 'Follow the shape with your mouse.',
    'accent': '#3949ab',
    'font': "Roboto, 'Segoe UI', Arial, sans-serif",
  };
  env.site({
    name: 'design-draw-shape-circle-03',
    styles: ['site.css', 'ref.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design dt' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#fff',
        panel: '#fff',
        fg: '#3f51b5',
        muted: '#757575',
        line: '#c9cfd5',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'dt-shell', body),
        head = u.el('header', 'dt-head', shell);
      const tt = u.el('div', 'dt-titles', head);
      u.el('div', 'dt-title', tt, C.title);
      u.el('div', 'dt-sub', tt, C.subtitle);
      const ic = u.el('div', 'dt-icons', head);
      const q = u.svg(
        'svg',
        { width: 40, height: 40, viewBox: '0 0 24 24', fill: 'none', stroke: '#c5cae9', 'stroke-width': 1.7 },
        ic,
      );
      u.svg('circle', { cx: 12, cy: 12, r: 9.5 }, q);
      u.svg(
        'path',
        {
          d: 'M9.3 9.5Q9.5 6.8 12 6.8Q14.7 6.9 14.6 9.3Q14.5 10.8 12.6 11.7Q12 12.2 12 13.4M12 16.2V17.4',
          'stroke-linecap': 'round',
        },
        q,
      );
      const g = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 24 24', fill: '#c5cae9' }, ic);
      u.svg(
        'path',
        {
          d: 'M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3.200h-4l-.4 2.700a7.400 7.400 0 0 0-1.700 1l-2.500-1-2 3.500L6.600 11a7.500 7.500 0 0 0 0 2l-2.100 1.600 2 3.500 2.500-1a7.400 7.400 0 0 0 1.700 1l.4 2.700h4l.4-2.700a7.400 7.400 0 0 0 1.700-1l2.500 1 2-3.500ZM13 15.500a3.500 3.500 0 1 1 0-7 3.500 3.500 0 0 1 0 7Z',
        },
        g,
      );
      const band = u.el('div', 'dt-band', shell),
        note = u.el('section', 'task-note dt-note', band);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast', 'dt-toast');
        Object.assign(note.style, {
          position: 'relative',
          inset: 'auto',
          alignSelf: 'flex-end',
          width: 'min(440px, 92%)',
          maxWidth: '92%',
          maxHeight: 'none',
          margin: '10px 3% 0',
          padding: '10px 42px 10px 14px',
          textAlign: 'left',
          background: '#fff',
          border: '1px solid #d6d9e3',
          borderLeft: '4px solid #3949ab',
          boxShadow: '0 2px 7px #0002',
          zIndex: '1',
        });
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') {
        note.classList.add('instruction-panel');
        Object.assign(note.style, {
          width: 'min(92%, 980px)',
          alignSelf: 'flex-start',
          margin: '18px 4% 0',
          padding: '10px 18px',
          textAlign: 'left',
          background: '#fff',
          borderLeft: '4px solid #3949ab',
          boxShadow: '0 2px 6px #00000014',
        });
        instruction.style.fontSize = 'clamp(17px, 1.55vw, 25px)';
        instruction.style.lineHeight = '1.3';
      }
      const stage = u.el('main', 'stage dt-stage', band);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'dt-foot', shell);
      const clr = u.el('button', 'clear dt-reset', footer, 'Reset');
      clr.type = 'button';
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const endLabels = ctx.content && ctx.content.END_LABELS;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = er.bool(0.5)
        ? 'Submit'
        : labelOf(
            er.pick(
              Array.isArray(endLabels) && endLabels.length
                ? endLabels
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
            ),
          );
      const actionGroup = u.el('div', 'dt-foot-actions', footer);
      let submit = null;
      const makeEnd = (parent, cls, text, icon) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        if (icon) {
          b.classList.add('dt-icon-submit');
        }
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') submit = makeEnd(ic, 'dt-header-submit', label, false);
        else if (placement === 'icon') submit = makeEnd(ic, 'dt-header-submit', '✓', true);
        else if (placement === 'link') {
          submit = u.el('a', 'dt-footer-link', actionGroup, label + ' ›');
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else submit = makeEnd(actionGroup, 'submit dt-submit', label, false);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const pool =
          Array.isArray(endLabels) && endLabels.length
            ? endLabels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const same = (x) => String(x).trim().toLowerCase() === label.trim().toLowerCase();
        const options = [...new Set(pool.map(labelOf).filter((x) => !same(x)))];
        if (options.length) {
          const decoyLabel = String(cr.pick(options)),
            where = cr.pick(['header', 'header', 'footer']);
          const parent = where === 'footer' ? actionGroup : ic;
          const d = u.el('button', 'dt-pq-xtra', parent, decoyLabel);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
        }
      }
      instruction.style.whiteSpace = 'normal';
      instruction.style.display = 'block';
      instruction.style.maxWidth = '94%';
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
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
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
