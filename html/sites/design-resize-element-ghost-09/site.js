(function () {
  'use strict';
  const C = { 'title': 'Window Resize Practice', 'menu': ['File', 'Edit', 'View', 'Help'] };
  env.site({
    name: 'design-resize-element-ghost-09',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design w31' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const shell = u.el('div', 'shell', body);
      const win = u.el('div', 'win', shell);
      const head = u.el('header', 'head', win);
      const sys = u.el('div', 'sysbox', head);
      u.el('i', '', sys);
      u.el('div', 'title', head, C.title);
      const controls = u.el('div', 'window-controls', head);
      for (const [label, cls] of [
        ['', 'min'],
        ['', 'max'],
        ['', 'drop'],
      ]) {
        const bt = u.el('button', cls, controls, label);
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label: cls });
      }
      const nav = u.el('nav', 'menu', win);
      for (const label of C.menu) {
        const s = u.el('span', '', nav);
        u.el('u', '', s, label[0]);
        s.append(label.slice(1));
      }
      const content = u.el('div', 'content', win);
      const note = u.el('section', 'task-note', content);
      u.el('div', 'note-label', note, '');
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', win);
      const endRng = ctx.rng.fork('chrome/end');
      const labelValue = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
      const label = labelValue(endRng.pick(labels));
      const placement = ctx.finish
        ? null
        : endRng.pick(['footer', 'footer', 'footer', 'footer', 'menu', 'taskbar', 'menu', 'taskbar']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [
          ...new Set(labels.map(labelValue).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length) collide = labelValue(collideRng.pick(choices));
      }
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: text, collide: true });
        return b;
      };
      let submit = null;
      if (placement === 'footer') submit = u.el('button', 'submit', footer, label);
      if (placement === 'menu') submit = u.el('button', 'submit menu-submit', nav, label);
      if (placement === 'footer' && collide) decoyBtn(footer, collide);
      if (placement === 'menu' && collide) decoyBtn(nav, collide);
      if (submit) {
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = () => ctx.submit();
      }
      const bar = u.el('div', 'taskbar', shell);
      const pm = u.el('div', 'tb-item pm', bar);
      const pmIcon = u.svg('svg', { class: 'tb-icon pmicon', viewBox: '0 0 40 40', 'aria-hidden': 'true' }, pm);
      for (const [x, y] of [
        [12, 2],
        [18, 14],
        [2, 18],
      ]) {
        u.svg('rect', { x, y, width: 24, height: 21, fill: '#c0c0c0', stroke: '#000', 'stroke-width': 2 }, pmIcon);
        u.svg('path', { d: `M${x + 2} ${y + 19}V${y + 2}H${x + 22}`, fill: 'none', stroke: '#fff' }, pmIcon);
        u.svg('rect', { x: x + 4, y: y + 4, width: 16, height: 6, fill: '#000080' }, pmIcon);
        for (const dx of [5, 13])
          for (const dy of [12, 17])
            u.svg('rect', { x: x + dx, y: y + dy, width: 4, height: 3, fill: '#000080' }, pmIcon);
      }
      u.el('span', '', pm, 'Program Manager');
      const ap = u.el('div', 'tb-item app', bar);
      u.el('span', 'tb-icon appicon', ap);
      u.el('span', '', ap, C.title);
      const tray = u.el('div', 'tray', bar);
      const speaker = u.svg('svg', { class: 'spk', viewBox: '0 0 32 36', 'aria-hidden': 'true' }, tray);
      u.svg('path', { d: 'M3 13H8L16 5V31L8 23H3Z', fill: '#ffff80', stroke: '#000', 'stroke-width': 1.5 }, speaker);
      u.svg('path', { d: 'M6 14V22M12 10V27', stroke: '#fff', 'stroke-width': 2 }, speaker);
      u.svg(
        'path',
        { d: 'M20 12Q27 18 20 24M24 6Q36 18 24 30', fill: 'none', stroke: '#000', 'stroke-width': 1.5 },
        speaker,
      );
      u.el('span', '', tray, '10:24 AM');
      if (placement === 'taskbar') {
        submit = u.el('button', 'submit taskbar-submit', bar, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = () => ctx.submit();
        if (collide) decoyBtn(bar, collide);
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
