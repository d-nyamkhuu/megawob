(function () {
  'use strict';
  const cfg = { title: 'Guest Setup', theme: 'gem', layout: 'stack', tools: 'File   Edit   Options   Help' };
  env.site({
    name: 'design-handle-text-spinner-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const tools = u.el('div', 'tools', head);
      tools.innerHTML =
        '<div class="gem-menu"><span>File</span><span>Edit</span><span>Options</span><span>Help</span></div><div class="gem-toolbar"><div><b class="gem-new"></b><span>New</span></div><div><b class="gem-open"></b><span>Open</span></div><div><b class="gem-save"></b><span>Save</span></div><div><b class="gem-print"></b><span>Print</span></div></div>';
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      center.dataset.display = ctx.display;
      const appearance = u.el('section', 'appearance-heading', center);
      u.el('h2', '', appearance, 'Text Appearance');
      u.el('p', '', appearance, 'Adjust the document formatting below.');
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'ready', foot, 'Ready.');
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tools.querySelector('.gem-toolbar') : foot;
        submit = u.el('button', 'submit end-' + placement, parent, endLabel);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
        if (placement === 'link') foot.classList.add('footer-link');
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const alternatives = labels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (alternatives.length) {
          const label = cr.pick(alternatives);
          const decoy = u.el('button', 'chrome-xtra', tools.querySelector('.gem-toolbar'), label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
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
