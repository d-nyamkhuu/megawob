(function () {
  'use strict';
  const cfg = { 'title': 'Event Registration Form', 'theme': 'swiss', 'layout': 'swiss', 'tools': '', 'rail': '' };
  env.site({
    name: 'design-click-control-focus-09',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const brief = u.el('aside', 'brief', work);
      u.el('div', 'big-no', brief, '01');
      u.el('div', 'rule', brief);
      u.el('h2', '', brief, 'Quick task');
      u.el('p', '', brief, 'Interact with the form on the right.');
      const center = u.el('section', 'center', work);
      const viewport = ctx.size || {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
        },
        display = ctx.display || 'header',
        small = viewport.width < 1260 || viewport.height < 700,
        shown = display === 'panel' && small ? 'header' : display === 'toast' && small ? 'header' : display;
      const noteParent = shown === 'panel' ? brief : cfg.layout === 'response' ? work : center;
      const note = u.el('div', 'instruction', noteParent, ctx.instruction);
      note.dataset.display = shown;
      note.hidden = shown === 'hidden';
      if (shown === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (cfg.layout === 'console' && aside && shown !== 'toast') {
        aside.insertBefore(note, aside.children[1] || null);
      }
      const foot = u.el('footer', 'footer', shell);
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
            } else if (s === 'Notes') {
              u.el('div', 'dock-note', d, 'Follow the instruction above.');
            }
          }
        });
      } else {
        const act = u.el('div', 'act', foot);
        u.el('div', 'big-no', act, '02');
        const at = u.el('div', 'act-t', act);
        u.el('h3', '', at, 'Actions');
        u.el('p', '', at, 'Complete the task using the controls.');
      }
      const er = ctx.rng.fork('chrome/end'),
        labels = (
          (ctx.content && ctx.content.END_LABELS) || [
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
          ]
        ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x))),
        placement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'footer', 'brief', 'link', 'icon']),
        label = er.bool(0.5) ? 'Submit' : String(er.pick(labels));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [
          ...new Set(labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))),
        ].filter((x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = cr.pick(options);
      }
      const addEnd = (parent, kind) => {
        let b;
        if (kind === 'link') {
          b = u.el('a', 'submit-link', parent, label + ' ›');
          b.href = '#';
        } else if (kind === 'icon') {
          b = u.el('button', 'submit submit-icon', parent, '✓');
          b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
        } else {
          b = u.el('button', 'submit', parent, label);
          b.type = 'button';
        }
        b.dataset.role = 'submit';
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (placement === 'footer') submit = addEnd(foot, 'button');
      else if (placement === 'brief') submit = addEnd(brief, 'button');
      else if (placement === 'link') submit = addEnd(foot, 'link');
      else if (placement === 'icon') submit = addEnd(foot, 'icon');
      if (collide) {
        const b = u.el('button', 'end-xtra', foot, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const clear = u.el('button', 'clear-form', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () =>
        stage.querySelectorAll('input,textarea').forEach((input) => (input.value = '')),
      );
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
