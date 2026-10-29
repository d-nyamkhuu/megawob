(function () {
  'use strict';
  const cfg = {
    'title': 'My Notebook - Practice - NoteStudio',
    'theme': 'ribbon',
    'layout': 'board',
    'tools': 'Home    Insert    Format    Tools    View    Help',
    'rail': 'Tasks|Notes|Ideas|Reference|Archive',
  };
  env.site({
    name: 'design-handle-text-unicode-03',
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
      const tl = u.el('div', 'tools', head);
      cfg.tools.split(/\s{2,}/).forEach((t, i) => {
        const item = u.el('span', 'menu-item' + (i === 0 ? ' active' : ''), tl, t);
        item.dataset.tab = t;
      });
      const ribbon = u.el('div', 'ribbon', head);
      [
        ['Clipboard', ['New Page', 'Save', 'Cut', 'Copy', 'Paste']],
        ['Text Formatting', ['Font', 'Bullets', 'Numbering', 'Increase Indent', 'Decrease Indent']],
        ['Insert', ['Picture', 'Table', 'Link']],
        ['Editing', ['Spelling', 'Find', 'Replace']],
      ].forEach((group, gi) => {
        const g = u.el('section', 'ribbon-group', ribbon);
        const row = u.el('div', 'ribbon-items', g);
        group[1].forEach((label, i) => {
          const b = u.el('div', 'ribbon-tool', row);
          const icon = u.el(
            'span',
            'ribbon-icon',
            b,
            ['▤', '▣', '✂', '▢', '▣', 'A', '☷', '≡', '⇥', '⇤', '▧', '▦', '🔗', '✓', '⌕', '♟'][
              gi === 0 ? i : gi === 1 ? i + 5 : gi === 2 ? i + 10 : i + 13
            ],
          );
          u.el('span', 'ribbon-label', b, label);
        });
        u.el('div', 'ribbon-caption', g, group[0]);
      });
      const work = u.el('div', 'work', shell);
      const rail = u.el('nav', 'rail', work);
      cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      const center = u.el('section', 'center', work);
      center.dataset.display = ctx.display;
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      u.el('div', 'sun-brand', foot, '');
      u.el('span', 'ready', foot, ''); // Episode controls use isolated streams so task sampling stays unchanged.
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (value) => (typeof value === 'string' ? value : value.label || value.text || value.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const original = endRng.bool(0.5);
      const placement = original ? 'form' : endRng.pick(['toolbar', 'footer']);
      const endLabel = original ? 'Submit' : endRng.pick(endLabels);
      const tools = u.el('div', 'episode-tools', tl);
      let submit = null;
      if (!ctx.finish) {
        const parent =
          placement === 'toolbar' ? tools : placement === 'footer' ? u.el('div', 'page-end', center) : foot;
        submit = u.el('button', 'submit end-' + placement, parent, endLabel);
        submit.dataset.placement = placement;
        submit.dataset.role = 'submit';
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const labels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (labels.length) {
          const label = collideRng.pick(labels);
          const decoy = u.el('button', 'chrome-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const clear = u.el('button', 'clear-text', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = stage.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
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
