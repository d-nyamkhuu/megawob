// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function kinetic(ctx, u, body) {
    const root = document.documentElement;
    root.style.setProperty('--bg', '#1b46d6');
    root.style.setProperty('--panel', '#fff');
    root.style.setProperty('--fg', '#0c1a3a');
    root.style.setProperty('--accent', '#0b3fd8');
    root.style.setProperty('--line', '#d5def0');
    root.style.setProperty('--font', 'Inter,"Segoe UI",Arial,Helvetica,sans-serif');
    u.el('div', 'k-blob k-blob1', body);
    u.el('div', 'k-blob k-blob2', body);
    const win = u.el('div', 'kwin', body),
      side = u.el('aside', 'kside', win);
    const logo = u.el('div', 'klogo', side);
    u.el('span', '', logo, 'Write');
    u.el('em', '', logo, 'Lab');
    u.el('div', 'kbeta', side, 'BETA');
    const nav = u.el('nav', 'knav', side);
    [
      ['Text Tools', 'M6 3h8l5 5v13H6z'],
      ['Projects', 'M3 6h7l2 2h9v11H3z'],
      [
        'Settings',
        'M10 2h4l.6 3 2 .9 2.7-1.1 2 3.4-2.1 2.1.2 2.3 2.1 2-2 3.5-2.8-1-2 .9-.7 3h-4l-.6-3-2-.9-2.7 1.1-2-3.5 2.1-2-.2-2.3-2.1-2 2-3.5 2.8 1 2-.9z M16 12a4 4 0 1 0-8 0a4 4 0 1 0 8 0',
      ],
      [
        'Help',
        'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M9.5 9.5Q10 7 12 7Q14.500 7 14.500 9.500Q14.500 11 12 12V14M12 16.500v1',
      ],
    ].forEach(([t, d], i) => {
      const a = u.el('div', 'knav-i' + (i === 0 ? ' on' : ''), nav);
      const s = u.svg(
        'svg',
        {
          width: 26,
          height: 26,
          viewBox: '0 0 24 24',
          fill: i === 0 || i === 2 ? '#e8eefc' : 'none',
          stroke: '#cfd8ee',
          'stroke-width': i === 2 ? 0.3 : 1.8,
          'fill-rule': 'evenodd',
        },
        a,
      );
      u.svg('path', { d }, s);
      if (i === 0) {
        u.svg('path', { d: 'M14 3v5h5M9 12h7M9 15h7M9 18h5', stroke: '#1c315a', fill: 'none', 'stroke-width': 1.5 }, s);
      }
      u.el('span', '', a, t);
    });
    const usr = u.el('div', 'kuser', side);
    u.el('b', '', usr, 'JD');
    u.el('span', '', usr, 'Jordan Diaz');
    const main = u.el('div', 'kmain', win);
    u.el('div', 'kkicker', main, 'TEXT TOOLS');
    u.el('h1', 'ktitle', main, 'Sentence Highlighter');
    const foc = u.el('div', 'kfocus', main);
    ['Focus', 'Edit', 'Clarify'].forEach((t) => u.el('div', '', foc, t));
    const note = u.el('section', 'task-note knote', main);
    u.el('div', 'note-label', note, '');
    u.el('i', 'kring', note);
    const instruction = u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      body.classList.add('has-instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    const stage = u.el('main', 'stage', main);
    stage.dataset.role = 'stage';
    const foot = u.el('footer', 'footer kfoot', main);
    const mk = (t, d, on) => {
      const b = u.el('button', 'ktool' + (on ? ' on' : ''), foot);
      b.type = 'button';
      const s = u.svg(
        'svg',
        {
          width: 30,
          height: 30,
          viewBox: '0 0 24 24',
          fill: on ? '#0c1a3a' : 'none',
          stroke: 'currentColor',
          'stroke-width': 1.6,
        },
        b,
      );
      u.svg('path', { d }, s);
      u.el('span', '', b, t);
      return b;
    };
    const bs = mk('Select', 'M6 3L6 20L10.500 15.500L14 22L16.500 21L13 14.500L19 14Z', true);
    const bh = mk('Highlight', 'M4 20L9 19L19 9L15 5L5 15ZM13 7L17 11');
    const bc = mk('Clear', 'M4 16L13 5L20 11L13 19H8ZM9 11L16 17M12 19H21');
    const tools = [bs, bh];
    tools.forEach(
      (b) =>
        (b.onclick = () => {
          tools.forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
        }),
    );
    bc.classList.add('clear');
    bc.onclick = () => {
      env.widgetDef.clear?.();
    };
    const separator = u.el('i', 'ksep', foot);
    const endRng = ctx.rng.fork('chrome/end');
    const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
    const endLabels = ctx.content.END_LABELS.map(labelOf);
    const referenceEnd = endRng.bool(0.5);
    const placement = referenceEnd ? 'footer' : endRng.pick(['header', 'link']);
    const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels.filter((t) => t !== 'Submit'));
    let submit = null;
    if (!ctx.finish) {
      submit = u.el(
        placement === 'link' ? 'a' : 'button',
        'submit k-end-' + placement,
        placement === 'header' ? main : foot,
        endLabel,
      );
      if (placement === 'link') submit.href = '#';
      else submit.type = 'button';
      submit.dataset.role = 'submit';
      submit.title = endLabel;
      submit.setAttribute('aria-label', endLabel);
      submit.onclick = (e) => {
        e.preventDefault();
        ctx.submit();
      };
    }
    separator.hidden = ctx.finish || placement === 'header';
    const collideRng = ctx.rng.fork('chrome/collide');
    if (collideRng.bool(0.3)) {
      const options = endLabels.filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      if (options.length) {
        const label = collideRng.pick(options),
          decoy = u.el('button', 'kdecoy', main, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label, collide: true });
      }
    }
    const hw = u.el('aside', 'aside khelp', body);
    const hh = u.el('div', 'khead', hw);
    u.el('b', '', hh, 'Document Helper');
    u.el('span', '', hh, '—');
    const tabs = u.el('div', 'ktabs', hw);
    ['Guidance', 'Shortcuts', 'Notes'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', tabs, t));
    const steps = u.el('ol', 'ksteps', hw);
    [
      'Click and drag to select text.',
      'Release to highlight.',
      'Use Clear to remove a selection if needed.',
      ctx.finish ? 'Review your highlight when you’re ready.' : `Click ${endLabel} when you’re ready.`,
    ].forEach((t, i) => {
      const li = u.el('li', '', steps);
      u.el('b', '', li, String(i + 1));
      u.el('span', '', li, t);
    });
    const tip = u.el('div', 'ktip', hw);
    const ts = u.svg('svg', { width: 34, height: 44, viewBox: '0 0 28 34', fill: '#0b3fd8' }, tip);
    u.svg('path', { d: 'M14 8a8 8 0 0 0-4 15v3h8v-3a8 8 0 0 0-4-15zM10 28h8v2h-8zM12 32h4v2h-4z' }, ts);
    u.svg(
      'path',
      { d: 'M14 1v3M3 6l2 2M25 6l-2 2M1 16h3M24 16h3', fill: 'none', stroke: '#4e88ff', 'stroke-width': 1.7 },
      ts,
    );
    u.el('span', '', tip, 'Tip: Highlight the complete sentence, including its period.');
    if (ctx.display === 'panel') {
      hw.append(note);
      tip.hidden = true;
    }
    return { stage, submit };
  }
  env.site({
    name: 'design-select-text-sentence-09',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'kinetic',
        'theme': 'kinetic',
        'title': 'NorthBridge  Extranet',
        'menu': 'Home       Catalog       Orders       Invoices       Reports       Admin',
        'foot': '',
        'accent': '#173959',
        'bg': '#d3d7da',
        'surface': '#fff',
        'font': 'Verdana, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx, u } = _c;
            if (C.theme === 'kinetic') {
              return kinetic(ctx, u, body);
            }
            const shell = u.el('div', 'shell', body),
              head = u.el('header', 'head', shell);
            Object.assign(_c, { head, shell });
          },
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            const mast = u.el('div', 'mast', head),
              ttl = u.el('div', 'title', mast);
            u.el('span', 'brand', ttl, 'NorthBridge');
            u.el('span', 'sub', ttl, 'Extranet');
            const tl = u.el('div', 'toplinks', mast);
            ['Suppliers', 'Orders', 'Support', 'Account', 'Log Out'].forEach((t, i) => {
              if (i) u.el('i', '', tl, '|');
              u.el('span', '', tl, t);
            });
            const nav = u.el('nav', 'menu', head);
            C.menu.split(/\s{2,}/).forEach((t, i) => {
              const a = u.el('a', i === 0 ? 'on' : '', nav, t);
              a.href = '#';
              a.onclick = (e) => e.preventDefault();
            });
            u.el('span', 'date', nav, 'Tue, Apr 13, 1999');
            Object.assign(_c, { mast, nav, tl, ttl });
          },
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { ctx, shell, u } = _c;
            const frame = u.el('div', 'frame', shell),
              ph = u.el('div', 'ptitle', frame);
            {
              const ic = u.svg(
                'svg',
                { width: 34, height: 40, viewBox: '0 0 34 40', fill: '#fff', stroke: '#1d3557', 'stroke-width': 2 },
                ph,
              );
              u.svg('path', { d: 'M3 2H22L31 11V38H3Z M22 2V11H31 M9 17H25 M9 22H25 M9 27H25 M9 32H25' }, ic);
              u.el('b', '', ph, 'Document Review');
              u.el('span', '', ph, 'Ref: DR-4827');
            }
            u.el(
              'div',
              'hint',
              frame,
              'Read the text below. Use your mouse to highlight the requested sentence.',
            );
            const content = u.el('div', 'content', frame),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, frame, note, ph });
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { frame, u } = _c;
            const footer = u.el('footer', 'footer', frame);
            const clr = u.el('button', 'clear', footer, 'Clear Selection');
            clr.type = 'button';
            clr.onclick = () => {
              env.widgetDef.clear?.();
            };
            Object.assign(_c, { clr, footer });
          },
        'frame.26': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
            {
              const cn = u.el('button', 'cancel', footer, 'Cancel');
              cn.type = 'button';
              cn.onclick = () => env.log('cancel', {});
            }
            _c.submit = null;
          },
      },
    },
  });
})();
