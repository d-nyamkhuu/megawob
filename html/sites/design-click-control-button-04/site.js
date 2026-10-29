(function () {
  'use strict';
  const ICONS = {
    cursor: '<path d="M7.5 3.7 17.5 12l-5.1 1.1 2.7 6-2.2 1-2.7-6-3.2 3.3z"/>',
    text: '<path d="M5 5h14M12 5v15"/>',
    rect: '<rect x="4.5" y="4.5" width="15" height="15"/>',
    circle: '<circle cx="12" cy="12" r="8"/>',
    line: '<path d="M5 12h14"/>',
    undo: '<path d="M9 4.5 4.5 9 9 13.5M5 9h9a5.3 5.3 0 0 1 0 10.6" stroke-linejoin="round" stroke-linecap="round"/>',
    redo: '<path d="M15 4.5 19.5 9 15 13.5M19 9h-9a5.3 5.3 0 0 0 0 10.6" stroke-linejoin="round" stroke-linecap="round"/>',
    trash: '<path d="M4 6.5h16M9 6.5V3.8h6v2.7M6.3 6.5v14h11.4v-14M10 10v7M14 10v7"/>',
  };
  const TOOLS = [
    ['cursor', 6],
    ['text', 14.3],
    ['rect', 22.3],
    ['circle', 30.3],
    ['line', 38.2],
    ['undo', 48.7],
    ['redo', 55.5],
    ['trash', 64.3],
  ];
  env.site({
    name: 'design-click-control-button-04',
    styles: ['site.css', 'kinetic.css'],
    frame(ctx) {
      const u = ctx.util;
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const er = ctx.rng.fork('chrome/end');
      const keepDefault = er.bool(0.5);
      const placement = keepDefault ? 'left' : er.pick(['document', 'tool']);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const sampledEndLabel = labelOf(er.pick(labels));
      const endLabel = keepDefault ? 'Submit' : sampledEndLabel;
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) collide = cr.pick(options);
      }
      document.body.className = 'ref kin';
      const shell = u.el('main', 'kshell', document.body);
      const left = u.el('section', 'kleft', shell);
      const note = u.el('div', 'instruction', left);
      String(ctx.instruction)
        .split(/("[^"]*")/)
        .forEach((part, i) => {
          if (!part) return;
          if (i % 2) u.el('span', 'kq', note, part);
          else note.appendChild(document.createTextNode(part));
        });
      if (String(ctx.instruction).length > 34) note.classList.add('long');
      if (String(ctx.instruction).length > 80) note.classList.add('xlong');
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', left);
      let submit = null;
      if (!ctx.finish && placement === 'left') {
        submit = u.el('button', 'submit', left);
        u.el('span', 'kbutton-label', submit, endLabel);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }

      const doc = u.el('section', 'kdoc', shell);
      u.el('div', 'kdoc-name', doc, 'Untitled Document');
      const saved = u.el('div', 'kdoc-saved', doc, 'Saved just now');
      u.el('i', '', saved);
      const decoyBtn = (parent, label) => {
        const b = u.el('button', 'kin-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      if (collide && placement !== 'document') decoyBtn(saved, collide);
      if (!ctx.finish && placement === 'document') {
        submit = u.el('button', 'kin-end-document', doc, endLabel);
        submit.type = 'button';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', ctx.submit);
      }
      const paper = u.el('article', 'kpaper', doc);
      const heading = u.el('h1', 'kh1', paper);
      heading.appendChild(document.createTextNode('Pro'));
      u.el('span', 'kj', heading, 'j');
      heading.appendChild(document.createTextNode('ect Plan'));
      u.el('div', 'ksub', paper, 'A SIMPLER TOMORROW');
      const sec = (top, num, title, cls) => {
        const s = u.el('div', 'ksec', paper);
        s.style.top = top + 'vh';
        const h = u.el('div', 'ksec-h', s);
        u.el('b', '', h, num);
        u.el('span', '', h, title);
        return s;
      };
      let s = sec(30.7, '01', 'Overview');
      u.el('p', '', s, 'Define the goal, scope, and key stakeholders for this project.');
      u.el('p', '', s, 'Keep the focus on measurable outcomes and clear next steps.');
      s = sec(50.5, '02', 'Key Tasks');
      ['Research and gather requirements', 'Create initial draft', 'Review and incorporate feedback'].forEach((t) => {
        const r = u.el('div', 'kcheck', s);
        u.el('i', '', r);
        u.el('span', '', r, t);
      });
      s = sec(75.7, '03', 'Next Steps');
      u.el('p', '', s, 'Align on priorities, confirm timelines, and move into execution.');

      const strip = u.el('nav', 'kstrip', shell);
      TOOLS.forEach(([n, t], i) => {
        const b = u.el('span', 'ktool' + (i === 0 ? ' on' : ''), strip);
        b.style.top = t + 'vh';
        b.innerHTML = '<svg viewBox="0 0 24 24">' + ICONS[n] + '</svg>';
      });
      if (!ctx.finish && placement === 'tool') {
        submit = u.el('button', 'kin-end-tool', strip, '✓');
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      if (collide && placement === 'document') decoyBtn(saved, collide);
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
