(function () {
  'use strict';
  const C = {
    'accent': '#6a0020',
    'bg': '#cfcfcd',
    'surface': '#e8e8e6',
    'font': "'DejaVu Sans Mono','Liberation Mono','Courier New',monospace",
  };
  env.site({
    name: 'design-select-text-sentence-02',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      let display = ctx.display || 'header';
      if ((display === 'panel' && window.innerWidth < 1260) || (display === 'toast' && window.innerHeight < 700))
        display = 'header';
      body.className = 'design lnx' + (display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#222',
        muted: '#555',
        line: '#a8a6a4',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const tb = u.el('div', 'tbar', head);
      {
        const ic = u.svg(
          'svg',
          {
            width: 28,
            height: 28,
            viewBox: '0 0 28 28',
            fill: '#d8d4d0',
            stroke: '#222',
            'stroke-width': 1.4,
            class: 'tmenu',
          },
          tb,
        );
        u.svg('path', { d: 'M1 1H27V27H1Z M5 5H23V23H5Z M7 9H21 M7 13H21 M7 17H21 M7 21H21' }, ic);
      }
      u.el('b', 'tname', tb, 'Text Calibration Utility');
      u.el('span', 'tver', tb, 'v1.3.2');
      const wc = u.el('div', 'wctl', tb);
      for (const l of ['_', '□', '×']) {
        const bt = u.el('button', '', wc, l);
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label: l });
      }
      const nav = u.el('nav', 'menu', head);
      for (const t of ['File', 'Tools', 'Options', 'Help']) {
        const a = u.el('a', '', nav, t);
        a.href = '#';
        a.onclick = (e) => e.preventDefault();
      }
      u.el('span', 'status', nav, 'Mode: Annotation   |   User: calibrator   |   2004-11-08 14:27');
      const frame = u.el('div', 'frame', shell);
      const content = u.el('div', 'content' + (display === 'panel' ? ' instr-panel' : ''), frame),
        note = u.el('section', 'task-note', content);
      u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden') note.hidden = true;
      else if (display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (display === 'panel') note.classList.add('instruction-panel');
      const board = u.el('div', 'board', content);
      const stage = u.el('main', 'stage', board);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', frame);
      const sel = u.el('div', 'selinfo', footer);
      u.el('span', '', sel, 'Selection:');
      u.el('span', 'val', sel, 'None');
      u.el('div', 'footer-copy', footer, '');
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const labels = ctx.content.END_LABELS;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels = (
        Array.isArray(labels) && labels.length
          ? labels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const keepDefault = endR.bool(0.5),
        placement = keepDefault ? 'footer' : endR.pick(['header', 'footer-link']);
      const label = keepDefault ? 'Submit' : labelOf(endR.pick(endLabels));
      let submit = null;
      const endControl = (parent, kind = 'footer') => {
        const asLink = kind === 'link';
        const b = u.el(
          asLink ? 'a' : 'button',
          asLink ? 'end-link' : kind === 'header' ? 'header-end' : 'submit',
          parent,
          label,
        );
        if (asLink) {
          b.href = '#';
          b.setAttribute('role', 'button');
        } else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      const collision =
        !ctx.finish && collideR.bool(0.3)
          ? collideR.pick(endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))
          : null;
      if (collision) {
        const d = u.el('button', 'end-xtra', nav, collision);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.onclick = () => env.log('decoy', { label: collision, collide: true });
      }
      if (!ctx.finish && placement === 'header') submit = endControl(nav, 'header');
      if (!ctx.finish && placement === 'footer') submit = endControl(footer);
      if (!ctx.finish && placement === 'footer-link') submit = endControl(footer, 'link');
      if (ctx.finish) {
        const done = u.el('span', 'finish-status', footer, 'Ready');
        done.setAttribute('aria-hidden', 'true');
      }
      const clr = u.el('button', 'clear', footer, 'Clear');
      clr.type = 'button';
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      const cn = u.el('button', 'cancel', footer, 'Quit');
      cn.type = 'button';
      cn.onclick = () => env.log('cancel', {});
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
