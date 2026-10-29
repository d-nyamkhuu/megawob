(function () {
  'use strict';
  env.site({
    name: 'design-click-control-hover-03',
    styles: ['site.css', 'wood.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref wood';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'app-icon', title);
      u.el('span', 'title-text', title, 'Focus Test');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const endRng = ctx.rng.fork('chrome/end');
      const endPlacement = ctx.finish ? null : endRng.pick(['dock', 'dock', 'menu', 'title']);
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const sampledEndLabel = labelText(endRng.pick(labels));
      const endLabel = endPlacement === 'dock' ? 'Submit' : sampledEndLabel;
      const collideRng = ctx.rng.fork('chrome/collide');
      let collideLabel = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [...new Set(labels.map(labelText))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) collideLabel = labelText(collideRng.pick(choices));
      }
      const menubar = u.el('div', 'native-menu', head);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((label) => u.el('span', '', menubar, label));
      let submit = null;
      const makeSubmit = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const makeDecoy = (parent, text) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      if (collideLabel) makeDecoy(menubar, collideLabel);
      if (endPlacement === 'menu') submit = makeSubmit(menubar, 'menu-submit', endLabel);
      if (endPlacement === 'title') submit = makeSubmit(controls, 'title-submit', '✓');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el(
        'div',
        'instruction' + (ctx.display === 'panel' ? ' instruction-panel' : ''),
        center,
        ctx.instruction,
      );
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      ['tl', 'tr', 'bl', 'br'].forEach((c) => u.el('i', 'screw ' + c, foot));
      const dock = u.el('div', 'dock-sections', foot);
      const s1 = u.el('section', 'dock-section motion', dock);
      u.el('strong', '', s1, 'Motion Area');
      const m = u.el('div', 'motion-body', s1);
      u.el('span', 'motion-icon', m);
      u.el('p', '', m, 'The square will move around inside this area. Keep your mouse over it to add time.');
      const s2 = u.el('section', 'dock-section progress', dock);
      u.el('strong', '', s2, 'Progress');
      const bar = u.el('div', 'pbar', s2);
      u.el('i', '', bar);
      u.el('div', 'ptxt', s2, 'Elapsed time shown in the area');
      const s3 = u.el('section', 'dock-section opts', dock);
      u.el('strong', '', s3, 'Controls');
      [
        ['Sound cues', true],
        ['Show area boundary', false],
      ].forEach(([t, on]) => {
        const l = u.el('label', 'opt', s3);
        const i = u.el('input', '', l);
        i.type = 'checkbox';
        i.checked = on;
        u.el('span', '', l, t);
        if (t === 'Show area boundary')
          i.addEventListener('change', () => stage.classList.toggle('boundary-emphasis', i.checked));
      });
      if (endPlacement === 'dock') {
        const s4 = u.el('section', 'dock-section end', dock);
        submit = makeSubmit(s4, 'submit', endLabel);
      } else dock.classList.add('without-end');
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
