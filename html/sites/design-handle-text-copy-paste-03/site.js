(function () {
  'use strict';
  const cfg = {
    'title': 'Text Practice - OS/2 Workplace Shell',
    'theme': 'os2',
    'layout': 'workplace',
    'tools': 'File     Edit     View     Insert     Format     Tools     Help',
  };
  env.site({
    name: 'design-handle-text-copy-paste-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite', 'os2'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
      const tools = head.querySelector('.tools');
      if (tools) head.insertBefore(tools, title);
      const ribbon = u.el('div', 'os2-ribbon', head);
      [
        ['New', '▯'],
        ['Open', '▱'],
        ['Save', '▤'],
        ['Print', '▥'],
        ['Cut', '✂'],
        ['Copy', '▤'],
        ['Paste', '▣'],
        ['Undo', '↶'],
        ['Redo', '↷'],
        ['Find', '♧'],
        ['Replace', '▧'],
        ['Help', '?'],
      ].forEach((x, i) => {
        const b = u.el('div', 'os2-tool' + ([3, 8, 10].includes(i) ? ' divider' : ''), ribbon);
        u.el('span', 'os2-icon', b, x[1]);
        u.el('span', '', b, x[0]);
      });
      const work = u.el('div', 'work', shell);
      const tabs = u.el('nav', 'os2-tabs', work);
      ['Task', 'Notes', 'Reference'].forEach((x, i) => u.el('div', i === 0 ? 'active' : '', tabs, x));
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stageFrame = u.el('div', 'os2-stage-frame', center);
      const stage = u.el('div', 'stage', stageFrame);
      const foot = u.el('footer', 'footer', shell);
      u.el('span', 'os2-app', foot, 'Workplace Shell');
      u.el('span', 'ready', foot, 'Ready.');
      u.el('span', 'os2-date', foot, 'Apr 24, 1994');
      u.el('span', 'os2-time', foot, '10:17 AM');
      u.el('span', 'os2-lang', foot, '▦　 EN');
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'form' : er.pick(['toolbar', 'status']);
      const label = original ? 'Submit' : er.pick(endWords);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'form' ? stageFrame : placement === 'toolbar' ? ribbon : foot;
        submit = u.el('button', 'submit end-' + placement, parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = [...new Set(endWords)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const decoyLabel = cr.pick(pool);
          const decoy = u.el('button', 'os2-xtra', tabs, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
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
