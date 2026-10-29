(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-scroll-text-12',
    styles: ['site.css'],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const endPlacement = referenceEnd ? 'form' : endRng.pick(['toolbar', 'footer']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels.filter((x) => x !== 'Submit'));
      document.body.className = 'ref carbon ledger';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      title.innerHTML =
        '<svg class="app-glyph" viewBox="0 0 18 18" aria-hidden="true"><rect x="1" y="1" width="16" height="16" rx="2"/><path d="M4 4h10v8H4zM6 14h2"/></svg><span>LedgerDoc 2.3</span>';
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i>−</i><i>□</i><i>×</i>';
      const menu = u.el('nav', 'menurow', head);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => {
        const item = u.el('span', 'menuitem', menu);
        u.el('u', '', item, x[0]);
        item.appendChild(document.createTextNode(x.slice(1)));
      });
      const toolbar = u.el('div', 'toolbar', head);
      const icons = [
        '<path d="M4 1h11l5 5v17H4z"/><path d="M15 1v6h5"/>',
        '<path d="M2 7h8l2 2h10v11H2z"/><path d="M2 9l2-4h7l2 4"/>',
        '<path d="M3 2h15l3 3v17H3z"/><path d="M7 2v7h10V2M7 22v-8h10v8"/>',
        '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
        '<path d="M4 7h14l-3-3M20 17H6l3 3"/><path d="M18 7l3-3M6 17l-3 3"/>',
        '<path d="M4 2h12l4 4v16H4z"/><path d="M16 2v5h4M8 12h8M8 16h8"/>',
      ];
      [
        ['New', 0],
        ['Open', 1],
        ['Save', 2],
        ['Find', 3],
        ['Replace', 4],
        ['Go To', 5],
      ].forEach((x) => {
        const item = u.el('div', 'tool-item', toolbar);
        const icon = u.el('b', '', item);
        icon.innerHTML =
          '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="tool-silver-' +
          x[1] +
          '" x2="0.8" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#aab3bb"/></linearGradient><linearGradient id="tool-gold-' +
          x[1] +
          '" x2="0" y2="1"><stop stop-color="#ffe7a0"/><stop offset="1" stop-color="#c59125"/></linearGradient><linearGradient id="tool-blue-' +
          x[1] +
          '" x2="0" y2="1"><stop stop-color="#a8c2ed"/><stop offset="1" stop-color="#484a99"/></linearGradient></defs>' +
          icons[x[1]] +
          '</svg>';
        u.el('span', '', item, x[0]);
        item.addEventListener('click', () => env.log('decoy', { label: x[0] }));
      });
      const toolbarTools = u.el('div', 'toolbar-tools', toolbar);
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const label = collideRng.pick(endLabels.filter((x) => x !== endLabel));
        const decoy = u.el('button', 'chrome-xtra', toolbarTools, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      }
      const tabs = u.el('div', 'tabrow', head);
      u.el('div', 'filetab', tabs, 'notes.txt');
      u.el('span', 'tabclose', tabs, '×');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      const task = u.el('section', 'taskpanel', aside);
      u.el('h2', 'panel-title', task, '-  Task');
      const note = u.el('div', 'instruction', task, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      task.dataset.display = ctx.display;
      const fieldslot = u.el('div', 'fieldslot', task);
      u.el('section', 'preview-panel', aside);
      const ph = u.el('div', 'preview-head', aside.lastChild);
      u.el('span', '', ph, '-  Preview');
      const previewControls = u.el('span', 'preview-controls', ph);
      u.el('span', 'preview-minimize', previewControls, '−');
      u.el('span', '', previewControls, '×');
      u.el('div', 'preview-content', aside.lastChild);
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'ready', foot, 'Ready');
      u.el('span', 'status-mid', foot, 'Ln 30, Col 62　 |　 UTF-8　 |　 INS');
      const status = u.el('span', 'status-right', foot);
      const statusIcons = u.el('span', 'status-icons', status);
      statusIcons.innerHTML =
        '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 10h5l6-5v18l-6-5H3z"/><path class="sound-wave" d="M18 8q6 6 0 12M22 4q10 10 0 20"/></svg><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M2 8h9l3-4h11v20H2z"/></svg>';
      const clock = u.el('span', 'status-clock', status);
      u.el('span', '', clock, '10:24 AM');
      u.el('span', '', clock, 'Apr 24, 2009');
      let submit = null;
      if (!ctx.finish) {
        const parent = endPlacement === 'toolbar' ? toolbarTools : endPlacement === 'footer' ? foot : task;
        submit = u.el('button', 'submit end-' + endPlacement, parent, endLabel);
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', ctx.submit);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        ctx.kind === 'banner'
          ? 'Unsaved layout changes'
          : { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer' }[
              ctx.kind
            ],
      );
      if (ctx.kind === 'banner') {
        const icon = ctx.util.el('span', 'warning-icon', el);
        icon.innerHTML =
          '<svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="warning-gold" x2="0" y2="1"><stop stop-color="#ffe884"/><stop offset="1" stop-color="#edbd1f"/></linearGradient></defs><path d="M23.5 3.5Q26-1 28.5 3.5L50 44Q52 49 47 49H5Q0 49 2 44Z" fill="url(#warning-gold)" stroke="#99751e"/><rect x="23" y="15" width="6" height="18" rx="2" fill="#182028"/><circle cx="26" cy="41" r="3" fill="#182028"/></svg>';
        const msg = ctx.util.el('p', '', el);
        msg.innerHTML = '<b>You have unsaved layout changes.</b><br>If you continue, your layout changes will be lost.';
      } else
        ctx.util.el(
          'p',
          '',
          el,
          {
            cookie: 'Choose your preferences to continue.',
            toast: 'Your workspace is ready.',
            chat: 'How can we help?',
            promo: 'Explore the latest tools.',
          }[ctx.kind],
        );
      const dismiss = ctx.util.el(
        'button',
        'dismiss',
        el,
        ctx.kind === 'banner' ? 'Continue without saving' : ctx.kind === 'cookie' ? 'Accept' : 'Close',
      );
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      if (ctx.kind === 'banner') {
        const cancel = ctx.util.el('button', 'dismiss cancel', el, 'Cancel');
        cancel.type = 'button';
        cancel.addEventListener('click', ctx.dismiss);
      }
      return { el, dismiss };
    },
  });
})();
