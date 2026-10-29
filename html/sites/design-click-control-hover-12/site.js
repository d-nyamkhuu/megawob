(function () {
  'use strict';
  const NOTES = [
    'The blue square will move to different positions within the area.',
    'The time only counts while your mouse is over the square.',
    'You do not need to click.',
    'If the layout looks wrong, click “Use default layout” to restore the task.',
    'Keep hovering until you reach 3.0 seconds.',
  ];
  env.site({
    name: 'design-click-control-hover-12',
    styles: ['site.css', 'px.css'],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref px';
      const shell = u.el('main', 'pxshell', document.body);
      const head = u.el('header', 'pxhead', shell);
      const brand = u.el('div', 'pxbrand', head);
      brand.innerHTML =
        '<svg viewBox="0 0 40 40" width="40" height="40" shape-rendering="crispEdges"><path d="M2 0h23v19H2z" fill="#a9d6fa"/><path d="M5 19h20v3H5z" fill="#3577a8"/><path d="M28 6h11v17H28z" fill="#67cece"/><path d="M0 18h9v16H0zM12 23h22v17H12z" fill="#ffe227"/><path d="M9 20h25v3H9v17H6V20z" fill="#1a80a4"/></svg>';
      u.el('span', 'pxname', brand, 'Task Trainer');
      u.el('div', 'pxuser', head, 'User: guest   |   Mon Apr 18, 2005   10:24 AM');
      const tabs = u.el('nav', 'pxtabs', shell);
      ['Task', 'Settings', 'Help', 'About'].forEach((t, i) => u.el('span', i === 0 ? 'pxtab on' : 'pxtab', tabs, t));
      const work = u.el('div', 'pxwork', shell);
      const doc = u.el('section', 'pxdoc', work);
      u.el('h1', 'pxh1', doc, 'Mouse Control Practice');
      let shownDisplay = ctx.display;
      let placement = null,
        label = 'Submit',
        collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        placement = er.pick(['side', 'side', 'header', 'link']);
        if (er.bool(0.5)) label = 'Submit';
        else {
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
          const alternatives = labels
            .map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
            .filter((x) => x.toLowerCase() !== 'submit');
          if (alternatives.length) label = er.pick(alternatives);
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
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
          const alternatives = labels
            .map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (alternatives.length) collide = cr.pick(alternatives);
        }
      }
      let note = null;
      if (shownDisplay === 'header') {
        note = u.el('div', 'instruction px-instruction-header', doc, ctx.instruction);
      } else if (shownDisplay === 'panel' || shownDisplay === 'toast') {
        note = u.el(
          'div',
          'instruction ' + (shownDisplay === 'toast' ? 'px-instruction-toast' : 'px-instruction-panel'),
          doc,
          ctx.instruction,
        );
      }
      const stage = u.el('div', 'stage', doc);
      const cursor = u.el('div', 'pxpointer', doc);
      cursor.innerHTML =
        '<svg viewBox="0 0 32 52" width="32" height="52" shape-rendering="crispEdges"><path d="M2 2v40l9-9 9 18 7-4-9-17 12-1Z" fill="white" stroke="#111" stroke-width="2.5"/><path d="M5 8v27l7-8 12 1Z" fill="#f7f7f7"/></svg>';
      u.el('div', 'pxhint', doc, 'Move the mouse around inside this area.');
      const side = u.el('aside', 'pxside', work);
      const copy = u.el('div', 'pxcopy', side);
      if (note) copy.appendChild(note);
      if (note) note.dataset.display = shownDisplay;
      if (note) u.el('hr', 'pxrule', copy);
      u.el('h2', 'pxnotes', copy, 'Notes:');
      const ul = u.el('ul', 'pxlist', copy);
      NOTES.forEach((t) => u.el('li', '', ul, t));
      const actions = u.el('div', 'pxactions', side);
      if (!ctx.finish && placement !== 'header') u.el('hr', 'pxrule lower', actions);
      let submit = null;
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (collide) {
        const b = u.el('button', 'px-pq', actions, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (!ctx.finish) {
        if (placement === 'side') {
          submit = endButton(actions, 'submit', label);
        } else if (placement === 'header') {
          submit = endButton(head, 'px-header-end', label);
        } else {
          const a = u.el('a', 'px-endlink', actions, label);
          a.href = '#';
          a.title = label;
          a.setAttribute('aria-label', label);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          submit = a;
        }
      }
      // Only the explanatory copy can shrink. Completion controls keep fixed, visible
      // anchors, including after the widget supplies seeded color/duration/label text.
      side.fitNotes = () => {
        const items = [...copy.querySelectorAll('.instruction,.pxnotes,.pxlist')];
        for (const item of items) item.style.removeProperty('font-size');
        if (copy.scrollHeight <= copy.clientHeight + 1) return;
        const sizes = items.map((item) => parseFloat(getComputedStyle(item).fontSize));
        const apply = (scale) =>
          items.forEach((item, i) =>
            item.style.setProperty('font-size', Math.max(11, sizes[i] * scale) + 'px', 'important'),
          );
        let lo = 0.35,
          hi = 1;
        for (let pass = 0; pass < 9; pass++) {
          const mid = (lo + hi) / 2;
          apply(mid);
          if (copy.scrollHeight <= copy.clientHeight) lo = mid;
          else hi = mid;
        }
        apply(lo);
      };
      side.fitNotes();
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'perturb pxdialog ' + ctx.kind, document.body);
      const bar = u.el('div', 'pxdbar', el);
      u.el('span', '', bar, 'Layout Error');
      const x = u.el('button', 'pxdx', bar, '×');
      x.type = 'button';
      x.addEventListener('click', ctx.dismiss);
      const body = u.el('div', 'pxdbody', el);
      body.innerHTML =
        '<svg class="pxwarn" viewBox="0 0 44 44" width="88" height="88" shape-rendering="crispEdges"><path d="M20 2h5v3h2v4h2v4h2v4h3v4h2v4h2v4h2v4h2v7H1v-7h2v-4h2v-4h2v-4h2v-4h2v-4h2V9h2V5h3V2z" fill="#0b285a"/><path d="M21 5h3v4h2v4h2v4h2v4h2v4h2v4h3v4h2v4H4v-4h2v-4h2v-4h2v-4h2v-4h2v-4h2V9h3V5z" fill="#ffdf22"/><path d="M20 12h4v11h-1v4h-2v-4h-1zM20 31h4v4h-4z" fill="#09295d"/></svg>';
      const txt = u.el('div', 'pxdtxt', body);
      u.el('strong', '', txt, 'Layout could not be restored.');
      u.el('p', '', txt, 'Your previous layout could not be restored due to a settings error.');
      u.el('p', '', txt, 'This may affect how the page is displayed. Do you want to use the default layout?');
      const btns = u.el('div', 'pxdbtns', txt);
      const dismiss = u.el('button', 'dismiss primary', btns, 'Use default layout');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      const keep = u.el('button', 'keep', btns, 'Keep current layout');
      keep.type = 'button';
      keep.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
