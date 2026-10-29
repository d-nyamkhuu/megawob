(function () {
  'use strict';
  const IC = {
    file: '<svg viewBox="0 0 20 20"><path d="M5 2.5h7l4 4v11H5z M12 2.5v4h4"/></svg>',
    open: '<svg viewBox="0 0 20 20"><path d="M2.5 5h5l1.5 2h8v9h-14.5z M2.5 8h15"/></svg>',
    save: '<svg viewBox="0 0 20 20"><path d="M3 3h12l2 2v12H3z M6 3v4h7V3 M6 17v-6h8v6"/></svg>',
    print: '<svg viewBox="0 0 20 20"><path d="M6 7V3h8v4 M4 7h12v7h-2 M6 14H4V7 M6 11h8v6H6z"/></svg>',
    archive:
      '<svg viewBox="0 0 20 20"><path d="M4 7h12v10H4z" fill="#7cabc7"/><path d="M3 3h14v4H3z" fill="#e9f3fa"/><path d="M8 9h4v3H8z" fill="white" stroke="none"/></svg>',
    search: '<svg viewBox="0 0 20 20"><circle cx="9" cy="9" r="5"/><path d="m13 13 4 4"/></svg>',
    gear: '<svg viewBox="0 0 20 20"><path d="m8.5 2 3 0 .5 2.4 1.5.6 2.1-1.1 2.1 2.1-1.1 2.1.6 1.5 2.3.5v3l-2.3.5-.6 1.5 1.1 2.1-2.1 2.1-2.1-1.1-1.5.6-.5 2.3h-3l-.5-2.3-1.5-.6-2.1 1.1-2.1-2.1 1.1-2.1-.6-1.5L1 11.5v-3L3.3 8l.6-1.5-1.1-2.1 2.1-2.1L7 3.4l1.5-.6z" transform="translate(1 1) scale(.85)"/><circle cx="10" cy="10" r="2.5"/></svg>',
    x: '<svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg>',
    min: '<svg viewBox="0 0 16 16"><path d="m3 6 5 5 5-5"/></svg>',
    max: '<svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg>',
  };
  env.site({
    name: 'design-click-control-dialog-07',
    styles: ['kde.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref kde';
      const shell = u.el('main', 'shell', document.body);
      const left = u.el('section', 'leftcol', shell);
      const mode = ctx.display || 'header';
      const note = u.el('div', 'instruction', left, ctx.instruction);
      note.dataset.display = mode;
      note.hidden = mode === 'hidden';
      if (mode === 'panel') note.classList.add('instruction-panel');
      if (mode === 'toast') note.classList.add('instruction-toast');
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
      const endLabel = er.bool(0.5) ? 'Submit' : er.pick(labels);
      const endPlacement = er.pick(['bottom', 'bottom', 'bottom', 'toolbar', 'status', 'toolbar']);
      const cr = ctx.rng.fork('chrome/collide');
      const collideOptions = [...new Set(labels)].filter(
        (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
      );
      const collide = cr.bool(0.3) && collideOptions.length ? cr.pick(collideOptions) : null;
      const win = u.el('div', 'win', shell);
      const tb = u.el('div', 'titlebar', win);
      const logo = u.el('i', 'applogo', tb);
      logo.innerHTML = '<svg viewBox="0 0 20 20"><path d="M5 2h8l3 3-5 10H4z M8 4l5 1-6 7 6-2 M13 2v4h4"/></svg>';
      u.el('span', 'wtitle', tb, 'Project Plan.md — Kate');
      const wc = u.el('span', 'wctl', tb);
      wc.innerHTML = '<i>' + IC.min + '</i><i>' + IC.max + '</i><i>' + IC.x + '</i>';
      const menu = u.el('div', 'menubar', win);
      ['File', 'Edit', 'View', 'Projects', 'LSP', 'Sessions', 'Tools', 'Settings', 'Help'].forEach((t) =>
        u.el('span', 'mi', menu, t),
      );
      const tools = u.el('div', 'toolbar', win);
      [['file', 'New'], ['open', 'Open'], '|', ['save', 'Save'], '|', ['print', 'Print'], ['archive']].forEach((t) => {
        if (t === '|') {
          u.el('span', 'tsep', tools);
          return;
        }
        const b = u.el('span', 'tbtn', tools);
        b.innerHTML = IC[t[0]];
        if (t[1]) u.el('span', '', b, t[1]);
        else b.classList.add('slot');
      });
      const makeSubmit = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (collide) {
        const b = u.el('button', 'kde-xtra', tools, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      let submit = null;
      if (!ctx.finish && endPlacement === 'toolbar') submit = makeSubmit(tools, 'kde-end-toolbar', endLabel);
      const body = u.el('div', 'wbody', win);
      const doc = u.el('div', 'docarea', body);
      const tabs = u.el('div', 'tabrow', doc);
      const tab = u.el('span', 'tab', tabs);
      tab.innerHTML = IC.archive;
      u.el('span', '', tab, 'Project Plan.md');
      const tx = u.el('i', 'tabx', tab);
      tx.innerHTML = IC.x;
      const stage = u.el('div', 'stage', doc);
      const rail = u.el('div', 'toolrail', body);
      ['file', 'search', 'gear'].forEach((n) => {
        const i = u.el('i', '', rail);
        i.innerHTML = IC[n];
      });
      const st = u.el('div', 'statusbar', win);
      ['Ln 1, Col 1', 'UTF-8', 'Markdown'].forEach((t) => u.el('span', 'sseg', st, t));
      u.el('span', 'sins', st, 'INS');
      if (!ctx.finish && endPlacement === 'status') submit = makeSubmit(st, 'kde-end-status', endLabel);
      if (!ctx.finish && endPlacement === 'bottom') submit = makeSubmit(left, 'submit', endLabel);
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
