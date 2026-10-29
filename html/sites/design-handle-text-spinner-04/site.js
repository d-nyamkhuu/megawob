(function () {
  'use strict';
  const cfg = {
    'title': 'Display Settings',
    'theme': 'beos',
    'layout': 'frame',
    'tools': 'File       Edit       Window       Help',
    'side': '',
  };
  env.site({
    name: 'design-handle-text-spinner-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const desk = u.el('nav', 'desktop-icons', document.body);
      ['Home', 'Trash', 'Disks'].forEach((n, i) => {
        const item = u.el('div', 'desk-item', desk);
        item.dataset.kind = ['home', 'trash', 'disk'][i];
        u.el('span', 'desk-glyph', item);
        u.el('span', 'desk-label', item, n);
      });
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite', 'beos'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
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
      // New episode choices use independent streams; the widget's seeded draws stay intact.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['toolbar', 'link']);
      const label = original ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      const frameTools = u.el('div', 'chrome-tools', head);
      const decoyBtn = (parent, text, collide = false) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit' + (placement === 'toolbar' ? ' end-toolbar' : placement === 'link' ? ' end-link' : ''),
          placement === 'toolbar' ? frameTools : foot,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) decoyBtn(frameTools, cr.pick(options), true);
      }
      const cancel = u.el('button', 'cancel', foot, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
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
