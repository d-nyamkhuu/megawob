(function () {
  'use strict';

  env.site({
    name: 'design-click-control-collapsible-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref paper';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const menu = u.el('span', 'hamb', head);
      menu.innerHTML = '<svg viewBox="0 0 30 22"><path d="M0 2h30M0 11h30M0 20h20"/></svg>';
      u.el('div', 'title', head, 'Project Workspace');
      u.el('div', 'acct', head, 'A');

      const card = u.el('section', 'card', shell);
      card.dataset.display = ctx.display;
      const note = u.el('div', 'instruction', card);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const ic = u.el('span', 'info', note);
      ic.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"/><circle cx="12" cy="6.8" r="1.4" fill="#f5f8ff"/><path d="M12 11.5v5.8" stroke="#f5f8ff" stroke-width="2.5" stroke-linecap="round"/></svg>';
      u.el('span', 'itext', note, ctx.instruction);
      if (ctx.instruction.length > 75) note.classList.add('long-instruction');

      const endRng = ctx.rng.fork('chrome/end');
      const labels = ctx.content && ctx.content.END_LABELS;
      const labelText = (item) => typeof item === 'string' ? item : item && (item.label || item.text || item.name) || String(item);
      const endLabel = endRng.bool(0.5) ? 'Submit' : labelText(endRng.pick(labels && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']));
      const placement = endRng.pick(['footer', 'footer', 'footer', 'header', 'header', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const possible = (labels && labels.length ? labels : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']).map(labelText).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = !ctx.finish && possible.length && collideRng.bool(0.3) ? { label: collideRng.pick(possible), where: placement === 'header' ? 'header' : 'footer' } : null;

      const endControl = (parent, kind, text) => {
        const el = u.el(kind === 'link' ? 'a' : 'button', kind === 'link' ? 'end-link' : 'submit', parent, text);
        if (el.tagName === 'BUTTON') el.type = 'button';
        else el.href = '#';
        el.setAttribute('aria-label', endLabel);
        el.title = endLabel;
        el.addEventListener('click', (e) => { e.preventDefault(); ctx.submit(); });
        return el;
      };
      const decoy = (parent, label) => {
        const b = u.el('button', 'end-xtra', parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      };

      const stage = u.el('div', 'stage', card);
      const foot = u.el('footer', 'footer', card);
      const cancel = u.el('button', 'cancel', foot, 'Cancel');
      cancel.type = 'button';
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          const tools = u.el('div', 'head-end-tools', head);
          if (collide && collide.where === 'header') decoy(tools, collide.label);
          submit = endControl(tools, 'button', endLabel);
        } else {
          const tools = u.el('div', 'footer-end-tools', foot);
          if (collide && collide.where === 'footer') decoy(tools, collide.label);
          submit = endControl(tools, placement === 'link' ? 'link' : 'button', placement === 'link' ? `${endLabel} ›` : endLabel);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind]);
      ctx.util.el('p', '', el, { cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.' }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
