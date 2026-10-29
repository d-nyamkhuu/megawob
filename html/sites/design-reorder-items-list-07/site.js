(function () {
  'use strict';
  const C = {
    'accent': '#9bff7e',
    'bg': '#0a1016',
    'surface': '#111820',
    'font': "'DejaVu Sans Mono','Menlo','Consolas',monospace",
  };
  env.site({
    name: 'design-reorder-items-list-07',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design memphis devstrip' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#e6edf6',
        muted: '#8a97aa',
        line: '#1d2838',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head panel', shell);
      const ic = u.el('div', 'app-icon', head);
      const svg = u.svg(
        'svg',
        {
          width: '100%',
          height: '100%',
          viewBox: '0 0 48 48',
          fill: 'none',
          stroke: C.accent,
          'stroke-width': 3.4,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        ic,
      );
      u.svg(
        'path',
        { d: 'M11 12H37Q42 12 42 17V40Q42 44 38 44H10Q6 44 6 40V17Q6 12 11 12ZM6 22H42M15 5V15M33 5V15' },
        svg,
      );
      for (const [x, y] of [
        [17, 27],
        [24, 27],
        [31, 27],
        [17, 34],
        [24, 34],
      ])
        u.svg('circle', { cx: x, cy: y, r: 1.6, fill: C.accent, stroke: 'none' }, svg);
      const tt = u.el('div', 'titles', head);
      u.el('div', 'kicker', tt, 'Task');
      u.el('h1', 'brief-title', tt, 'Month Ordering');
      u.el('p', 'brief-copy', tt, 'Arrange the months into chronological order.');
      const meta = u.el('div', 'meta', head);
      for (const [k, v] of [
        ['Items', String(ctx.spec && ctx.spec.items ? ctx.spec.items.length : 12)],
        ['Order', 'Earliest month first'],
        ['Method', 'Drag and drop'],
      ]) {
        u.el('span', 'mk', meta, k);
        u.el('span', 'mv', meta, v);
      }
      const content = u.el('div', 'content panel', shell),
        top = u.el('div', 'top', content),
        note = u.el('section', 'task-note', top);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'panel') {
        note.classList.add('instruction-panel');
        const label = u.el('div', 'panel-label', note, 'Task instructions');
        note.insertBefore(label, instruction);
      } else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => {
          note.style.visibility = 'hidden';
          env.log('note-close');
        };
      }
      const hint = u.el('div', 'hintbox', top);
      const hi = u.svg(
        'svg',
        {
          width: 26,
          height: 26,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: '#9aa7ba',
          'stroke-width': 1.6,
          class: 'hint-ic',
        },
        hint,
      );
      u.svg('circle', { cx: 12, cy: 12, r: 9.5 }, hi);
      u.svg('path', { d: 'M12 11V17M12 7.5V8.5', 'stroke-linecap': 'round' }, hi);
      u.el('span', '', hint, 'Drag the items using the handle on the left to arrange them in the correct order.');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer panel', shell);
      const reset = u.el('button', 'ghost reset', footer, '');
      reset.type = 'button';
      const ri = u.svg(
        'svg',
        {
          width: 22,
          height: 22,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: '#a8b7c7',
          'stroke-width': 1.8,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        reset,
      );
      u.svg('path', { d: 'M3 10A9 9 0 0 1 20 8M20 4V9H15M21 14A9 9 0 0 1 4 16M4 20V15H9' }, ri);
      u.el('span', '', reset, 'Reset list');
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
      u.el('div', 'footer-copy', footer, '');
      const cancel = u.el('button', 'ghost cancel', footer, 'Cancel');
      cancel.type = 'button';
      cancel.onclick = () => env.log('cancel', {});
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = ctx.content && ctx.content.END_LABELS;
        const labelIndex = labels && labels.length ? er.int(0, labels.length - 1) : 0,
          label = labels && labels.length ? labels[labelIndex] : 'Submit';
        const endText =
          typeof label === 'string' ? label : (label && (label.label || label.text || label.name)) || 'Submit';
        const placement = ['footer', 'footer', 'link', 'icon'][labelIndex % 4];
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        const pool =
          labels && labels.length
            ? labels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
        if (cr.bool(0.3)) {
          const options = [
            ...new Set(
              pool.map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x))),
            ),
          ].filter((x) => x.trim().toLowerCase() !== endText.trim().toLowerCase());
          if (options.length) collide = options[cr.int(0, options.length - 1)];
        }
        const tools = u.el('div', 'footer-tools', footer);
        if (collide) {
          const d = u.el('button', 'ghost pqs-xtra', tools, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.onclick = () => env.log('decoy', { label: collide, collide: true });
        }
        if (placement === 'link') {
          submit = u.el('a', 'end-link', tools, endText + ' ›');
          submit.href = '#';
          submit.setAttribute('aria-label', endText);
          submit.title = endText;
          submit.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
        } else {
          submit = u.el(
            'button',
            'submit' + (placement === 'icon' ? ' end-icon' : ''),
            tools,
            placement === 'icon' ? '✓' : endText,
          );
          submit.type = 'button';
          submit.title = endText;
          submit.setAttribute('aria-label', endText);
          submit.dataset.role = 'submit';
          submit.onclick = () => ctx.submit();
        }
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
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
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
