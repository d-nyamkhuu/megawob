(() => {
  'use strict';
  const cfg = {
    title: 'Event Planner', theme: 'flash', layout: 'planner',
    tools: 'Plan Event     Guests     Venue     Summary',
    rail: '1|Event Details|2|Guests|3|Venue|4|Catering|5|Review',
    side: 'Event Setup|Plan the details|Set the guest count|Choose a venue|Add notes|Submit when ready'
  };
  env.site({
    name: 'design-handle-text-spinner-09', styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref flash planner';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, cfg.title);
      const tools = u.el('nav', 'tools', head);
      cfg.tools.trim().split(/\s{2,}/).forEach((s, i) => {
        const tab = u.el('div', i === 0 ? 'tool-tab selected' : 'tool-tab', tools, s);
        tab.setAttribute('aria-current', i === 0 ? 'page' : 'false');
      });
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      const center = u.el('section', 'center', work);
      const appearance = u.el('section', 'appearance-heading', center);
      u.el('h2', '', appearance, 'Event Details');
      u.el('p', '', appearance, '');
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      if (ctx.display === 'panel' || ctx.display === 'toast') aside.appendChild(note);
      cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', i === 1 ? 'k' : '', aside, s));
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'ready', foot, '');
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const common = endRng.bool(0.5);
        const placement = common ? 'aside' : endRng.pick(['header', 'footer']);
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = x => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
        const label = common ? 'Submit' : labelOf(endRng.pick(labels));
        shell.dataset.endPlacement = placement;
        if (placement === 'aside') submit = u.el('button', 'submit', aside, label);
        else if (placement === 'header') submit = u.el('button', 'submit header-submit', tools, label);
        else submit = u.el('button', 'submit footer-submit', foot, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const same = x => x.trim().toLowerCase() === label.trim().toLowerCase();
          const options = [...new Set(labels.map(labelOf))].filter(x => !same(x));
          if (options.length) {
            const decoyLabel = collideRng.pick(options);
            const parent = placement === 'header' ? aside : tools;
            const decoy = u.el('button', 'xtra' + (parent === tools ? ' header-xtra' : ''), parent, decoyLabel);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
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
    }
  });
})();
