(function () {
  'use strict';
  const C = { site: 'design-read-figure-number-checkboxes-12' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'academic instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      u.el('strong', '', brand, 'Eastbrook College');
      u.el('span', '', brand, 'Computer Skills Practice');
      const links = u.el('nav', 'header-links', top);
      ['Home', 'Help', 'Log out'].forEach((t) => u.el('a', '', links, t));
      const banner = u.el('section', 'banner', app);
      const motto = u.el('div', 'motto', banner);
      u.el('span', '', motto, 'Learning Today');
      u.el('span', '', motto, 'A Brighter Tomorrow');
      const campus = u.el('div', 'campus', banner);
      u.el('i', 'tree', campus);
      u.el('i', 'building', campus);
      u.el('i', 'tree tree-two', campus);
      const fold = u.el('div', 'fold-tools', banner),
        toggle = u.el('button', 'tools-toggle', fold, '▶  Expand tools');
      toggle.type = 'button';
      u.el('p', 'fold-note', fold, 'Tools are hidden to keep the workspace focused.');
      const toolDetails = u.el('div', 'tool-details', fold, 'Worksheet controls are available here.');
      toggle.addEventListener('click', () => {
        const opened = document.body.classList.toggle('tools-open');
        toggle.textContent = opened ? '▼  Hide tools' : '▶  Expand tools';
        toolDetails.hidden = !opened;
      });
      toolDetails.hidden = true;
      const index = u.el('nav', 'index', app);
      for (let i = 1; i <= 10; i++) u.el('a', i === 6 ? 'current' : '', index, String(i));
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction),
        stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end'),
          labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
          labels = ctx.content.END_LABELS.map(labelOf);
        const referenceEnd = endRng.bool(0.5),
          placement = referenceEnd ? 'footer' : endRng.pick(['header', 'link']),
          label = referenceEnd ? 'Submit' : endRng.pick(labels.filter((text) => text !== 'Submit'));
        let parent = footer;
        if (placement === 'header') {
          parent = u.el('div', 'end-tools', top);
          top.insertBefore(parent, links);
        }
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit end-' + placement, parent, label);
        if (placement === 'link') {
          submit.href = '#';
          submit.addEventListener('click', (event) => {
            event.preventDefault();
            ctx.submit();
          });
        } else {
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        }
        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const choices = labels.filter((text) => text.trim().toLowerCase() !== label.trim().toLowerCase()),
            decoyLabel = collideRng.pick(choices),
            decoy = u.el('button', 'end-xtra', footer, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          if (placement === 'footer') footer.insertBefore(decoy, submit);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
