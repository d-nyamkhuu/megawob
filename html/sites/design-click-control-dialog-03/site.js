(function () {
  'use strict';
  const ICONS = {
    wifi: '<svg viewBox="0 0 24 24"><path d="M2 9a14 14 0 0 1 20 0l-2 2a11 11 0 0 0-16 0Zm4 4a8 8 0 0 1 12 0l-2 2a5 5 0 0 0-8 0Zm4 4a3 3 0 0 1 4 0l-2 2Z"/></svg>',
    vol: '<svg viewBox="0 0 24 24"><path d="M3 9h4l5-4v14l-5-4H3Zm13-1a5 5 0 0 1 0 8M18 5a9 9 0 0 1 0 14" stroke="#fff" stroke-width="2" fill-opacity="1"/></svg>',
    bat: '<svg viewBox="0 0 24 24"><path d="M9 2h6v2h2v18H7V4h2Z"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M5 2h9l5 5v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" fill="#f8f9fb"/><path d="M14 2v6h5M8 12h8M8 15h8M8 18h6" fill="none" stroke="#59616d" stroke-width="1.5"/></svg>',
    newdoc:
      '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v7m-3-3 3 3 3-3M9 17h6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    min: '<svg viewBox="0 0 16 16"><path d="M3 12h10" stroke="currentColor" stroke-width="1.6"/></svg>',
    max: '<svg viewBox="0 0 16 16"><path d="M3.5 3.5h9v9h-9Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    close: '<svg viewBox="0 0 16 16"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6"/></svg>',
    menu: '<svg viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.6"/></svg>',
  };
  env.site({
    name: 'design-click-control-dialog-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref gnome';
      const shell = u.el('main', 'shell', document.body);
      const top = u.el('header', 'topbar', shell);
      u.el('span', 'tb-act', top, 'Activities');
      const app = u.el('span', 'tb-app', top);
      app.innerHTML = ICONS.doc + '<b>Text Editor</b>';
      u.el('span', 'tb-clock', top, 'Apr 23  10:24');
      const ind = u.el('span', 'tb-ind', top);
      ind.innerHTML = ICONS.wifi + ICONS.vol + ICONS.bat;
      const row = u.el('div', 'work', shell);
      const win = u.el('section', 'win', row);
      const hb = u.el('div', 'headerbar', win);
      const l = u.el('div', 'hb-l', hb);
      const open = u.el('span', 'hb-btn open', l, 'Open');
      open.innerHTML = 'Open <i class="caret"></i>';
      const sv = u.el('span', 'hb-btn sq', l);
      sv.innerHTML = ICONS.newdoc;
      const t = u.el('div', 'hb-title', hb);
      u.el('b', '', t, 'Project Notes.txt');
      u.el('small', '', t, '~/Documents');
      const r = u.el('div', 'hb-r', hb);
      u.el('span', 'hb-btn', r, 'Save');
      const mn = u.el('span', 'hb-btn sq', r);
      mn.innerHTML = ICONS.menu;
      const wc = u.el('span', 'hb-wc', r);
      wc.innerHTML = '<i>' + ICONS.min + '</i><i>' + ICONS.max + '</i><i class="x">' + ICONS.close + '</i>';
      const stage = u.el('div', 'stage', win);
      const sb = u.el('div', 'statusbar', win);
      sb.innerHTML =
        '<span>Plain Text <i class="caret"></i></span><span>Tab Width: 4 <i class="caret"></i></span><span>Ln 11, Col 1</span><span>INS</span>';
      const aside = u.el('aside', 'margin', row);
      const taskHeading = u.el('h2', '', aside, 'Task');
      const note = u.el('div', 'instruction', aside, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      u.el('h2', 'notes-h', aside, 'Notes');
      const ul = u.el('ul', '', aside);
      [
        'Use the dialog box shown in the editor.',
        'Click the requested control.',
        'Do not close the app in any other way.',
      ].forEach((s, i) => u.el('li', i === 0 ? 'dialog-status-note' : '', ul, s));
      u.el('div', 'spacer', aside);
      taskHeading.hidden = ctx.display === 'hidden';
      aside.dataset.display = ctx.display;
      const END =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endR = ctx.rng.fork('chrome/end');
      const referenceLabel = labelOf(END.find((x) => labelOf(x) === 'Submit') || END[0] || 'Submit');
      const placement = ctx.finish ? null : endR.bool(0.5) ? 'margin' : endR.pick(['toolbar', 'status']);
      const label = placement === 'margin' ? referenceLabel : labelOf(endR.pick(END));
      const collideR = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [
          ...new Set(END.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (options.length) collision = { label: collideR.pick(options), where: collideR.pick(['toolbar', 'margin']) };
      }
      const endControl = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      let submit = null;
      if (placement === 'toolbar') submit = endControl(r, 'toolbar-submit', label);
      if (placement === 'status') submit = endControl(sb, 'status-submit', label, 'a');
      if (!ctx.finish && placement === 'margin') {
        u.el('hr', '', aside);
        submit = endControl(aside, 'submit', label);
      }
      if (collision) {
        if (collision.where === 'toolbar') decoy(r, collision.label);
        else decoy(u.el('li', '', ul), collision.label);
      }
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
