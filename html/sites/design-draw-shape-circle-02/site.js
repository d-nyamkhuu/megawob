(function () {
  'use strict';
  const C = {
    'title': 'Geometry Practice',
    'menu': ['File', 'Edit', 'View', 'Help'],
    'accent': '#2685dd',
    'bg': '#d8e8f6',
    'surface': '#fff',
    'font': '"Segoe UI",Tahoma,Arial,sans-serif',
  };
  env.site({
    name: 'design-draw-shape-circle-02',
    styles: ['site.css', 'vg.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      let display = ctx.display || 'header';
      if ((display === 'panel' && innerWidth < 1260) || (display === 'toast' && innerHeight < 700)) display = 'header';
      body.className = 'design vista vg' + (display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#111820',
        muted: '#657080',
        line: '#c9cfd5',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const desk = u.el('div', 'vg-desk', body);
      // main window
      const win = u.el('div', 'vg-win', desk),
        head = u.el('header', 'vg-title', win);
      const ic = u.svg('svg', { class: 'vg-appicon', width: 20, height: 20, viewBox: '0 0 20 20' }, head);
      u.svg('circle', { cx: 10, cy: 10, r: 9, fill: '#2f86e0', stroke: '#dff0ff', 'stroke-width': 1.5 }, ic);
      u.svg('circle', { cx: 10, cy: 10, r: 4, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, ic);
      u.el('div', 'vg-title-text', head, C.title);
      const wc = u.el('div', 'vg-wc', head);
      for (const [cls, label] of [
        ['min', 'min'],
        ['max', 'max'],
        ['close', 'close'],
      ]) {
        const bt = u.el('button', 'vg-wcb ' + cls, wc);
        bt.type = 'button';
        bt.setAttribute('aria-label', label);
        bt.onclick = () => env.log('window-control', { label });
      }
      const menu = u.el('nav', 'vg-menu', win);
      for (const m of C.menu) u.el('span', '', menu, m);
      const client = u.el('div', 'vg-client', win);
      const note =
        display === 'header' || display === 'toast'
          ? u.el('section', 'vg-note task-note' + (display === 'toast' ? ' vg-toast-note' : ''), client)
          : null;
      if (note) {
        u.el('div', 'vg-instr instruction', note, ctx.instruction);
        if (display === 'header') u.el('div', 'vg-sub', note, 'Click and drag to draw. Release to finish.');
      }
      if (display === 'toast') {
        const x = u.el('button', 'vg-noteclose', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      }
      const mid = u.el('div', 'vg-mid', client);
      const stage = u.el('main', 'stage', mid);
      stage.dataset.role = 'stage';
      const side = u.el('aside', 'vg-side', mid);
      const tools = u.el('div', 'vg-sec vg-tools', side);
      u.el('h3', '', tools, 'Tools');
      const row = u.el('div', 'vg-toolrow', tools);
      const icons = {
        Pencil: 'M3 29L5 20L22 3Q23 2 24 3L29 8Q30 9 29 10L12 27ZM5 20L12 27M19 6L26 13',
        Eraser: 'M3 21L20 4L29 13L12 30H10ZM10 14L20 24',
        Clear: 'M5 7H27V10H5ZM12 7V3H20V7M7 10L9 30H23L25 10ZM12 13V26M16 13V26M20 13V26',
      };
      const btns = [];
      for (const name of ['Pencil', 'Eraser', 'Clear']) {
        const w = u.el('div', 'vg-tool', row);
        const bt = u.el('button', 'vg-toolbtn', w);
        bt.type = 'button';
        const sv = u.svg(
          'svg',
          {
            width: 30,
            height: 30,
            viewBox: '0 0 32 32',
            fill: name === 'Pencil' ? '#a7c6e7' : name === 'Eraser' ? '#a2a6ab' : '#85888c',
            stroke: name === 'Pencil' ? '#142f4f' : '#4a4e53',
            'stroke-width': 2,
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round',
          },
          bt,
        );
        u.svg('path', { d: icons[name] }, sv);
        if (name === 'Eraser')
          u.svg('path', { d: 'M3 21L10 14L20 24L12 30H10Z', fill: '#fff', stroke: '#4a4e53', 'stroke-width': 1.8 }, sv);
        u.el('span', '', w, name);
        if (name === 'Pencil') {
          bt.classList.add('on');
          w.classList.add('on');
        }
        btns.push([name, bt, w]);
        bt.onclick = () => {
          if (name === 'Clear') {
            env.widgetDef.clear?.();
            return;
          }
          env.widgetDef.setDrawingTool?.(name);
          for (const [n, b, ww] of btns) {
            if (n === 'Clear') continue;
            b.classList.toggle('on', n === name);
            ww.classList.toggle('on', n === name);
          }
        };
      }
      const opt = u.el('div', 'vg-sec vg-opt', side);
      u.el('h3', '', opt, 'Options');
      if (display === 'panel') u.el('div', 'vg-panel-instruction', opt, ctx.instruction);
      const help = u.el('div', 'vg-sec vg-help', side);
      u.el('h3', '', help, 'Help');
      u.el(
        'p',
        '',
        help,
        'Hold mouse button and draw one continuous circular stroke around the filled dot through the hollow dot, then release.',
      );
      const foot = u.el('footer', 'vg-foot', client);
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      let placement = 'footer',
        label = 'Submit';
      if (!ctx.finish && endRng.bool(0.5)) {
        placement = endRng.pick(['header', 'link']);
        const labels = ctx.content && ctx.content.END_LABELS;
        label =
          Array.isArray(labels) && labels.length
            ? endRng.pick(labels)
            : endRng.pick(['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']);
        if (typeof label !== 'string') label = label.label || label.text || label.name || String(label);
      }
      const headerActions = placement === 'header' ? u.el('div', 'vg-head-actions', menu) : null;
      const createEnd = (parent, link = false, icon = false) => {
        const b = u.el(
          link ? 'a' : 'button',
          'vg-submit submit' + (link ? ' vg-submit-link' : '') + (icon ? ' vg-submit-icon' : ''),
          parent,
          icon ? '✓' : link ? label + ' ›' : label,
        );
        b.type = link ? 'button' : 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      if (!ctx.finish) {
        submit =
          placement === 'footer'
            ? createEnd(foot)
            : placement === 'link'
              ? createEnd(foot, true)
              : createEnd(headerActions);
      }
      if (!ctx.finish && collideRng.bool(0.3)) {
        const labels = ctx.content && ctx.content.END_LABELS;
        const pool = (
          Array.isArray(labels) && labels.length
            ? labels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        )
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = collideRng.pick(pool),
            parent = placement === 'header' ? headerActions : foot,
            b = u.el('button', 'vg-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.onclick = () => env.log('decoy', { label: text, collide: true });
        }
      }
      // floating palette
      const pal = u.el('div', 'vg-pal', desk),
        pt = u.el('div', 'vg-ptitle', pal);
      u.el('span', '', pt, 'Line Style');
      const pc = u.el('button', 'vg-wcb close', pt);
      pc.type = 'button';
      pc.setAttribute('aria-label', 'close');
      pc.onclick = () => env.log('window-control', { label: 'close' });
      const pb = u.el('div', 'vg-pbody', pal),
        styles = [
          ['Solid', ''],
          ['Dashed', '7 5'],
          ['Dotted', '2 5'],
        ],
        pbs = [];
      for (const [i, [name, dash]] of styles.entries()) {
        const c = u.el('div', 'vg-style' + (i === 0 ? ' on' : ''), pb);
        const bt = u.el('button', 'vg-stylebtn', c);
        bt.type = 'button';
        const sv = u.svg('svg', { width: 44, height: 20, viewBox: '0 0 44 20' }, bt);
        u.svg(
          'path',
          {
            d: 'M1 10H43',
            stroke: '#222',
            'stroke-width': 2.4,
            'stroke-dasharray': name === 'Dotted' ? '1 8' : dash,
            fill: 'none',
            'stroke-linecap': name === 'Dotted' ? 'round' : 'butt',
          },
          sv,
        );
        u.el('span', '', c, name);
        pbs.push(c);
        bt.onclick = () => {
          pbs.forEach((x) => x.classList.remove('on'));
          c.classList.add('on');
          env.widgetDef.setLineStyle?.(dash);
        };
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el('h3', '', box, 'Product Updates Newsletter');
      u.el('p', '', box, 'Get occasional updates about new features and tips.');
      const dismiss = u.el('button', 'dismiss', box, 'Close');
      const icon = u.svg(
        'svg',
        {
          class: 'ob-icon',
          width: 64,
          height: 64,
          viewBox: '0 0 64 64',
          fill: 'none',
          stroke: C.accent,
          'stroke-width': 3,
        },
        box,
      );
      u.svg('path', { d: 'M8 14H56V50H8ZM8 14L32 34L56 14' }, icon);
      u.el('div', 'nl-input', box, 'Your email address (optional)');
      const cb = u.el('div', 'nl-check', box);
      u.el('span', 'nl-box', cb);
      u.el('span', '', cb, 'Send me product updates');
      const x = u.el('button', 'nl-x', box, '✕');
      x.type = 'button';
      x.onclick = () => dismiss.click();
      if (env.timeText) env.timeText.textContent = 'Time: Paused (starts after you close the newsletter)';
      dismiss.type = 'button';
      dismiss.onclick = () => {
        if (env.timeText) env.timeText.textContent = 'Time: Ready';
        ctx.dismiss('close');
      };
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
