(function () {
  'use strict';
  env.site({
    name: 'design-click-control-button-05',
    styles: ['site.css', 'amiga.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'amiga';
      const endR = ctx.rng.fork('chrome/end');
      const endPlacement = ctx.finish ? null : endR.pick(['frame', 'frame', 'frame', 'header', 'footer']);
      const labels = ctx.content && ctx.content.END_LABELS;
      const labelBank =
        Array.isArray(labels) && labels.length
          ? labels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = !ctx.finish && endR.bool(0.5) ? labelText(endR.pick(labelBank)) : 'Submit';
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [
          ...new Set(labelBank.map(labelText).filter((x) => x.toLowerCase() !== endLabel.toLowerCase())),
        ];
        if (options.length) collide = collideR.pick(options);
      }
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'amiga-head', shell);
      const ico = u.el('span', 'a-ico', head);
      ico.innerHTML =
        '<svg viewBox="0 0 28 28"><path fill="#171717" d="M2 2h24v24H2z"/><path fill="#9d9077" d="M9 7h9v3h3v9h-4v4H7v-7H5v-5h4z"/><path fill="#242424" d="M11 5h7v6h-4v4H8v-4h3z"/><path fill="#d5c9ac" d="M14 12h5v5h-3v3h-5v-3h3z"/></svg>';
      u.el('span', 'a-title-l', head, 'Amiga Workbench');
      u.el('span', 'a-title-c', head, 'Task Window');
      const gad = u.el('span', 'a-gads', head);
      u.el('i', '', gad);
      u.el('i', '', gad);
      const work = u.el('div', 'a-work', shell);
      const left = u.el('section', 'a-pane a-left', work);
      const lt = u.el('div', 'a-bar', left);
      u.el('b', 'a-g', lt);
      u.el('span', '', lt, 'Instructions');
      u.el('b', 'a-g r', lt);
      const lb = u.el('div', 'a-body', left);
      const row = u.el('div', 'a-instr-row', lb);
      const doc = u.el('span', 'a-doc', row);
      doc.innerHTML =
        '<svg viewBox="0 0 88 110"><path d="M3 3h66l16 16v88H3z" fill="#bbb" stroke="#001e69" stroke-width="4"/><path d="M7 7h59v17h15v78H7z" fill="#ccc" stroke="#fff" stroke-width="2"/><path d="M68 4v17h16" fill="#aaa" stroke="#001e69" stroke-width="3"/><path d="M18 24h42M18 39h54M18 54h54M18 69h54M18 84h54" stroke="#111" stroke-width="4"/></svg>';
      const note = u.el('div', 'instruction', row, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      const display = ctx.display || 'header';
      if (display === 'panel') note.classList.add('instruction-panel');
      if (display === 'toast') note.classList.add('instruction-toast');
      if (display === 'hidden') row.hidden = true;
      const hint = 'When you are ready, continue.';
      const subhint = u.el('p', 'a-sub', lb, hint);
      if (display === 'hidden') subhint.hidden = true;
      const right = u.el('section', 'a-pane a-right', work);
      const rt = u.el('div', 'a-bar', right);
      u.el('b', 'a-g', rt);
      u.el('span', '', rt, 'Your Response');
      const barTools = u.el('span', 'a-tools', rt);
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'a-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      if (collide && endPlacement === 'header') decoyBtn(barTools, collide, true);
      let submit = null;
      const endBtn = (parent, cls, label) => {
        const b = u.el('button', 'submit ' + cls, parent, label);
        b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (endPlacement === 'header') submit = endBtn(barTools, 'a-end-header', endLabel);
      u.el('b', 'a-g r', rt);
      const rb = u.el('div', 'a-body', right);
      const frame = u.el('div', 'a-frame', rb);
      const pointer = u.el('span', 'a-pointer', frame);
      pointer.setAttribute('aria-hidden', 'true');
      pointer.innerHTML =
        '<svg viewBox="0 0 42 68"><path d="M3 3v49l10-10 11 22 9-5-11-22h16z" fill="white" stroke="black" stroke-width="3" stroke-linejoin="miter"/></svg>';
      const stage = u.el('div', 'stage', frame);
      const sub = u.el('div', 'a-submit-wrap', frame);
      u.el('p', 'a-ready', sub, ctx.finish ? 'Ready to finish?' : 'Ready to submit?');
      if (ctx.finish) sub.hidden = true;
      else if (endPlacement === 'frame') submit = endBtn(sub, 'a-end-frame', endLabel);
      const foot = u.el('footer', 'a-foot', shell);
      const reset = u.el('button', 'reset-task a-ready-box', foot, 'Ready');
      reset.type = 'button';
      const footTools = u.el('span', 'a-foot-tools', foot);
      if (collide && endPlacement !== 'header') decoyBtn(footTools, collide, true);
      if (endPlacement === 'footer') submit = endBtn(footTools, 'a-end-footer', endLabel);
      u.el('span', 'a-clock', foot, 'Mon  Apr 16  1990  10:24');
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
