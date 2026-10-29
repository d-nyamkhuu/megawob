(function () {
  'use strict';
  const cfg = {
    title: 'DisplayCal 1.2.4  -  Linux Display Calibration Utility',
    theme: 'industrial',
    layout: 'console',
    tools: 'File    Tools    Profiles    Help',
    side: 'Task|Steps:|1.  Find the dialog named above.|2.  Click the requested button in it.|3.  Do not change any settings.',
  };
  env.site({
    name: 'design-click-control-dialog-01',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body),
        head = u.el('header', 'head', shell),
        title = u.el('div', 'title', head),
        caption = u.el('span', 'title-caption', title, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      let tools = null;
      if (cfg.tools) {
        tools = u.el('div', 'tools', head);
        cfg.tools
          .trim()
          .split(/\s{2,}/)
          .forEach((label) => {
            const item = u.el('span', 'menu-label', tools);
            u.el('u', '', item, label[0]);
            u.el('span', '', item, label.slice(1));
          });
      }
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side
          .split('|')
          .forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      const display = ctx.display || 'header';
      let note = null;
      if (display !== 'hidden') {
        const parent = display === 'header' ? head : aside || center;
        note = u.el('div', 'instruction', parent, ctx.instruction);
        note.dataset.display = display;
        if (display === 'toast') note.classList.add('instruction-toast');
        if (display === 'panel' && aside) aside.insertBefore(note, aside.children[1] || null);
        if (display === 'toast' && aside) aside.insertBefore(note, aside.children[1] || null);
      }
      const stage = u.el('div', 'stage', center),
        foot = u.el('footer', 'footer', shell);
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach((s) => {
          const d = u.el('section', 'dock-section', dock);
          u.el('strong', '', d, s);
          if (cfg.theme === 'qt') {
            if (s === 'Task List') {
              ['1.  Click requested control', '2.  Review result', '3.  Submit', '4.  Finish'].forEach((t, i) =>
                u.el('div', i === 0 ? 'current-task' : 'task-row', d, t),
              );
            } else if (s === 'Status') {
              ['Current Step:     1 of 4', 'Status:    Not completed', 'Attempts:    0', 'Result:    —'].forEach((t) =>
                u.el('div', 'status-row', d, t),
              );
            } else if (s === 'Notes') u.el('div', 'dock-note', d, 'Follow the instruction above.');
          }
        });
      } else u.el('span', 'ready', foot, 'Ready.');
      const content = ctx.content || {},
        bank = Array.isArray(content.END_LABELS)
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
        labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const keep = er.bool(0.5),
        placement = ctx.finish ? null : keep ? 'aside' : er.pick(['header', 'link']);
      const label = keep ? 'Submit' : labelOf(er.pick(bank));
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const options = [...new Set(bank.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = labelOf(cr.pick(options));
      }
      const decoy = (parent, text, collides) => {
        const b = u.el('button', 'industrial-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
      };
      let submit = null;
      if (collide && tools) decoy(tools, collide, true);
      if (!ctx.finish) {
        if (placement === 'aside') {
          submit = u.el('button', 'submit', aside, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
          if (collide && !tools) decoy(aside, collide, true);
        } else if (placement === 'header') {
          submit = u.el('button', 'submit industrial-header-submit', tools || head, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        } else {
          submit = u.el('a', 'industrial-endlink', aside, label + ' ›');
          submit.href = '#';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
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
