(function () {
  'use strict';
  const C = {
    title: 'Point Task',
    menus: ['File', 'Edit', 'View', 'Tools', 'Help'],
    bg: '#cdcac3',
    font: 'Helvetica, Arial, sans-serif',
  };
  env.site({
    name: 'design-click-point-midpoint-08',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design motif' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.bg,
        fg: '#111',
        muted: '#55524d',
        line: '#8c8a84',
        accent: '#111',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const win = u.el('div', 'mw', body);
      const tbar = u.el('div', 'tbar', win);
      const appIcon = u.el('span', 'ico', tbar);
      const icon = u.svg(
        'svg',
        { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: '#565650', 'stroke-width': 1 },
        appIcon,
      );
      u.svg('path', { d: 'M3 3H17V17H3ZM4 13L8 8L12 12L16 5M6 4V7M4 6H7M13 13V16M11 15H15M8 11L6 16M11 4L9 7' }, icon);
      u.el('span', 'tt', tbar, C.title);
      const wb = u.el('div', 'wb', tbar);
      for (const l of ['_', '□', '×']) {
        const b = u.el('button', '', wb, l);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label: l });
      }
      const mbar = u.el('nav', 'mbar', win);
      const pop = u.el('div', 'menu-pop', mbar);
      pop.hidden = true;
      for (const t of ['Ruler', 'Grid', 'Crosshair', '-', 'Preferences...']) {
        if (t === '-') u.el('hr', '', pop);
        else {
          const d = u.el('div', '', pop, t);
          d.onclick = () => {
            pop.hidden = true;
            tb.classList.remove('open');
          };
        }
      }
      let tb = null;
      for (const m of C.menus) {
        const b = u.el('button', '', mbar, m);
        b.type = 'button';
        if (m === 'Tools') {
          tb = b;
          b.onclick = () => {
            pop.hidden = !pop.hidden;
            b.classList.toggle('open', !pop.hidden);
          };
        }
      }
      const work = u.el('div', 'work', win);
      const note = u.el('section', 'task-note', work);
      u.el('div', 'note-label', note, '');
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') {
        note.classList.add('instruction-panel');
        note.querySelector('.note-label').textContent = 'Task Instructions';
      }
      const stage = u.el('main', 'stage', work);
      stage.dataset.role = 'stage';
      const dock = u.el('footer', 'dock', win);
      const grp = (cls, title) => {
        const g = u.el('section', 'grp ' + cls, dock);
        u.el('h4', '', g, title);
        return u.el('div', 'g-body', g);
      };
      const gi = grp('g-info', 'Pointer Info');
      const fl = u.el('div', 'fl', gi);
      const mk = (lab, val) => {
        const r = u.el('div', 'fld', fl);
        u.el('label', '', r, lab);
        const i = u.el('input', '', r);
        i.value = val;
        i.readOnly = true;
        return i;
      };
      const ix = mk('X:', '—'),
        iy = mk('Y:', '—');
      u.el('div', 'vsep', gi);
      const mkchk = (p, t, on, change) => {
        const l = u.el('label', 'chk', p);
        const b = u.el('i', '', l, on ? '✓' : '');
        u.el('span', '', l, t);
        l.onclick = () => {
          on = !on;
          b.textContent = on ? '✓' : '';
          change?.(on);
        };
      };
      mkchk(gi, 'Show coordinates', true, (on) => {
        fl.style.visibility = on ? 'visible' : 'hidden';
      });
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        ix.value = String(Math.round(e.clientX - r.left));
        iy.value = String(Math.round(e.clientY - r.top));
      });
      const gv = grp('g-view', 'View');
      const vc = u.el('div', 'vcol', gv);
      mkchk(vc, 'Show grid', false, (on) => stage.classList.toggle('show-grid', on));
      mkchk(vc, 'Show labels', true, (on) => stage.classList.toggle('hide-labels', !on));
      mkchk(vc, 'Snap to grid', false);
      const ga = grp('g-act', 'Actions');
      const clear = u.el('button', 'mb clear', ga, 'Clear');
      clear.type = 'button';
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      let submit = null;
      const gz = grp('g-zoom', 'Zoom');
      const zr = u.el('div', 'zrow', gz);
      u.el('span', '', zr, '100%');
      const sl = u.el('div', 'slider', zr);
      u.el('b', '', sl, '◀');
      const tr = u.el('div', 'tr', sl);
      u.el('div', 'th', tr);
      u.el('b', '', sl, '▶');
      const st = u.el('div', 'status', win);
      u.el('span', '', st, 'Ready.');
      u.el('span', 'grip', st);
      const endRng = ctx.rng.fork('chrome/end'),
        keep = ctx.finish ? false : endRng.bool(0.5);
      const endWords =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const wordLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const sameEnd = (a, b) => {
        const norm = (x) =>
          String(x)
            .trim()
            .toLowerCase()
            .replace(/\s+(answer|now)$/, '');
        const x = norm(a),
          y = norm(b);
        return x === y || x.startsWith(y + ' ') || y.startsWith(x + ' ');
      };
      const otherWords = endWords.map(wordLabel).filter((x) => !sameEnd(x, 'Submit'));
      const where = ctx.finish ? null : keep ? 'dock' : endRng.pick(['toolbar', 'status', 'dock']);
      const label = keep ? 'Submit' : wordLabel(endRng.pick(otherWords.length ? otherWords : endWords));
      const endHost = where === 'toolbar' ? mbar : where === 'status' ? st : ga;
      if (!ctx.finish) {
        submit = u.el(
          where === 'status' ? 'a' : 'button',
          where === 'toolbar' ? 'mb end-toolbar' : where === 'status' ? 'end-status' : 'mb submit',
          endHost,
          label,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const candidates = endWords.map(wordLabel).filter((x) => !sameEnd(x, label));
        if (candidates.length) {
          const decoyLabel = wordLabel(collideRng.pick(candidates));
          const decoyHost = collideRng.pick(['toolbar', 'dock']) === 'toolbar' ? mbar : ga;
          const d = u.el('button', decoyHost === mbar ? 'mb end-xtra' : 'mb end-xtra', decoyHost, decoyLabel);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
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
