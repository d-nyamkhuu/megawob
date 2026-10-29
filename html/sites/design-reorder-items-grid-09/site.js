(function () {
  'use strict';
  const C = { 'accent': '#3d5f93', 'bg': '#33373e', 'surface': '#3b4049', 'font': "'Segoe UI',Arial,sans-serif" };
  const ICONS = {
    drag: 'M16 2V30M2 16H30M16 2L11 7M16 2L21 7M16 30L11 25M16 30L21 25M2 16L7 11M2 16L7 21M30 16L25 11M30 16L25 21',
    clear: 'M4 8H28M11 8V3H21V8M7 11L8 29H24L25 11M12 12V25M16 12V25M20 12V25',
    reset: 'M27 9A12 12 0 1 0 28 20M28 2V10H20',
  };
  env.site({
    name: 'design-reorder-items-grid-09',
    styles: ['site.css', 'site2.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design pc' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#e8eaee',
        muted: '#9aa1ab',
        line: '#2a2d33',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const win = u.el('div', 'cw-win', body);
      const tb = u.el('div', 'cw-title', win);
      const ic = u.el('span', 'cw-appicon', tb);
      ic.innerHTML =
        '<svg viewBox="0 0 20 20"><rect x="3" y="4" width="5" height="11" rx="1" fill="#477b97"/><rect x="9" y="2" width="5" height="11" rx="1" fill="#80a0b3"/><path d="M4 7h3M10 5h3M10 9h3" stroke="#edf4f7"/><path d="M12 14l3-2 2 4-3 2z" fill="#4a7e9a"/></svg>';
      u.el('span', 'cw-appname', tb, 'Tile Sorter');
      const wc = u.el('div', 'cw-wc', tb);
      for (const [cls, label] of [
        ['min', '−'],
        ['max', '□'],
        ['close', '×'],
      ]) {
        const b = u.el('button', 'cw-wb ' + cls, wc, label);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label });
      }
      const mb = u.el('nav', 'cw-menu', win);
      for (const t of ['File', 'Edit', 'View', 'Help']) u.el('span', '', mb, t);
      const content = u.el('div', 'cw-content', win);
      const note = u.el('section', 'task-note cw-note', content);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const right = u.el('div', 'cw-right', content);
      const panel = u.el('section', 'cw-panel', right);
      u.el('div', 'cw-phead', panel, 'Tiles');
      const stage = u.el('main', 'stage cw-stage', panel);
      stage.dataset.role = 'stage';
      const foot = u.el('footer', 'cw-foot', panel);
      const n =
        ctx.spec && ctx.spec.items
          ? ctx.spec.items.length
          : ctx.model && ctx.model.order
            ? ctx.model.order.length
            : null;
      u.el('div', 'cw-count', foot, n ? n + ' tiles' : 'Tiles');
      const tools = u.el('aside', 'cw-tools', right);
      for (const [k, label] of [
        ['drag', 'Drag'],
        ['clear', 'Clear'],
        ['reset', 'Reset'],
      ]) {
        const bt = u.el('button', 'cw-tool', tools);
        bt.type = 'button';
        const s = u.svg(
          'svg',
          {
            width: 34,
            height: 34,
            viewBox: '0 0 32 32',
            fill: 'none',
            stroke: '#e6e9ee',
            'stroke-width': 2.4,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          bt,
        );
        u.svg('path', { d: ICONS[k] }, s);
        if (k === 'drag')
          u.svg(
            'path',
            { d: 'M16 1L11 7H21Z M16 31L11 25H21Z M1 16L7 11V21Z M31 16L25 11V21Z', fill: '#e6e9ee', stroke: 'none' },
            s,
          );
        if (k === 'reset') u.svg('path', { d: 'M28 2L28 11L19 10Z', fill: '#e6e9ee', stroke: 'none' }, s);
        u.el('span', '', bt, label);
        bt.onclick =
          k === 'clear'
            ? () => env.widgetDef.clear?.()
            : k === 'reset'
              ? () => env.widgetDef.clear?.()
              : () => env.log('tool', { label });
      }
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels =
        ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS.map(labelOf)
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endR = ctx.rng.fork('chrome/end');
      const salt = Array.from(ctx.instruction || '').reduce((n, ch) => (n * 33 + ch.charCodeAt(0)) >>> 0, 5381);
      const forkPick = (list, offset) => {
        const k = list.length ? offset % list.length : 0;
        return endR.pick(list.slice(k).concat(list.slice(0, k)));
      };
      const endPick = !ctx.finish
        ? forkPick(['footer-submit', 'footer-submit', 'footer-submit', 'tools', 'link', 'footer-other'], salt)
        : null;
      const placement = endPick === 'footer-submit' || endPick === 'footer-other' ? 'footer' : endPick;
      const endLabel = endPick === 'footer-submit' ? 'Submit' : labelOf(forkPick(labels, salt >>> 3));
      const makeEnd = (parent, kind, text) => {
        const b = u.el(
          kind === 'link' ? 'a' : 'button',
          kind === 'link' ? 'cw-end-link' : 'submit cw-submit',
          parent,
          text,
        );
        if (kind === 'link') {
          b.href = '#';
        } else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (placement === 'footer') submit = makeEnd(foot, 'button', endLabel);
      else if (placement === 'link') submit = makeEnd(foot, 'link', endLabel + ' ›');
      else if (placement === 'tools') {
        submit = makeEnd(tools, 'button', '');
        submit.classList.add('cw-tool', 'cw-tool-end');
        Object.assign(submit.style, {
          width: '100%',
          minWidth: '0',
          height: 'auto',
          boxSizing: 'border-box',
          padding: '6px 0',
          fontSize: '12px',
        });
        const icon = u.svg(
          'svg',
          {
            width: 34,
            height: 34,
            viewBox: '0 0 32 32',
            fill: 'none',
            stroke: '#e6e9ee',
            'stroke-width': 2.4,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          submit,
        );
        u.svg('path', { d: 'M6 16L13 23L27 8' }, icon);
        u.el('span', '', submit, endLabel);
        submit.insertBefore(icon, submit.firstChild);
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const text = labelOf(collideR.pick(pool));
          const b = u.el('button', 'cw-xtra', foot, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
