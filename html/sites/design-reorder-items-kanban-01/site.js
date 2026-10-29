(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-kanban-01',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design notebook';
      const shell = u.el('div', 'shell', document.body);
      const tabs = u.el('nav', 'notebook-tabs', shell);
      for (const name of ['Activity', 'Notes', 'Resources', 'Calendar', 'Help']) {
        const tab = u.el('button', 'notebook-tab' + (name === 'Activity' ? ' active' : ''), tabs, name);
        tab.type = 'button';
        tab.onclick = () => env.log('notebook-tab', { name });
      }
      const rings = u.el('div', 'binding', shell);
      rings.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 19; i++) {
        const ring = u.el('div', 'binding-ring', rings);
        ring.innerHTML =
          '<svg viewBox="0 0 72 36"><defs><linearGradient id="metal' +
          i +
          '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#42423f"/><stop offset=".3" stop-color="#999a97"/><stop offset=".52" stop-color="#d2d3cf"/><stop offset=".7" stop-color="#666763"/><stop offset="1" stop-color="#30312e"/></linearGradient></defs><ellipse cx="62" cy="17" rx="9" ry="11" fill="#333431"/><path d="M61 17C51 8 11 7 8 18C3 31 38 29 57 27" fill="none" stroke="#363732" stroke-width="12"/><path d="M61 17C51 8 11 7 8 18C3 31 38 29 57 27" fill="none" stroke="url(#metal' +
          i +
          ')" stroke-width="8"/><path d="M55 12C43 9 19 9 12 14" fill="none" stroke="#e1e1dd" stroke-width="2"/></svg>';
      }
      const page = u.el('div', 'page', shell);
      const note = u.el('header', 'task-note', page);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const endRng = ctx.rng.fork('chrome/end');
      let endPlacement = null;
      let endLabel = null;
      if (!ctx.finish) {
        const endChoice = (endRng.int(0, 9) + endRng.int(0, 9)) % 10;
        if (endChoice <= 4) {
          endPlacement = 'footer';
          endLabel = 'Submit';
        } else {
          endPlacement = endChoice <= 6 ? 'header' : endChoice === 7 ? 'link' : 'icon';
          const labels = (
            (ctx.content && ctx.content.END_LABELS) || [
              'Submit',
              'Done',
              'Finish',
              'Continue',
              'Save',
              'OK',
              'Confirm',
              'Apply',
            ]
          )
            .map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
            .filter((x) => x.trim().toLowerCase() !== 'submit');
          endLabel = endRng.pick(labels.length ? labels : ['Done', 'Finish', 'Continue']);
        }
        if (ctx.display === 'hidden' && (endPlacement === 'header' || endPlacement === 'icon')) endPlacement = 'footer';
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && (collideRng.int(0, 9) + collideRng.int(0, 9)) % 10 < 3) {
        const labels = (
          (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ]
        )
          .map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
          .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (labels.length) collide = { label: collideRng.pick(labels), where: collideRng.pick(['header', 'footer']) };
      }
      const decoy = (parent, label, colliding) => {
        const b = u.el('button', colliding ? 'notebook-xtra collide' : 'notebook-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', colliding ? { label, collide: true } : { label });
        return b;
      };
      const endControl = (parent, className, visibleLabel) => {
        const b = u.el(className === 'end-link' ? 'a' : 'button', className, parent, visibleLabel);
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      let submit = null;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'note-close', note, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close');
        close.onclick = () => {
          note.style.visibility = 'hidden';
        };
      }
      if ((endPlacement === 'header' || endPlacement === 'icon') && !note.hidden) {
        const tools = u.el('div', 'header-tools', note);
        if (collide && collide.where === 'header') decoy(tools, collide.label, true);
        submit = endControl(
          tools,
          endPlacement === 'icon' ? 'submit end-icon' : 'submit end-header',
          endPlacement === 'icon' ? '✓' : endLabel,
        );
      }
      const stage = u.el('main', 'stage', page);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', page);
      if (ctx.finish) footer.classList.add('footer-finish');
      if (collide && (collide.where === 'footer' || note.hidden)) decoy(footer, collide.label, true);
      if (endPlacement === 'footer') {
        submit = endControl(footer, 'submit', endLabel);
      } else if (endPlacement === 'link') {
        submit = endControl(footer, 'end-link', endLabel + ' ›');
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = {
        cookie: 'Privacy notice',
        toast: 'Changes saved',
        chat: 'Help',
        promo: 'Notebook news',
        banner: 'Notice',
      };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el(
        'p',
        '',
        box,
        ctx.kind === 'cookie'
          ? 'Allow optional cookies for this page?'
          : 'You can close this note to return to the activity.',
      );
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  });
})();
