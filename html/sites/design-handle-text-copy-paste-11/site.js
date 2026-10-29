(function () {
  'use strict';
  const cfg = {
    'title': 'Copy and Paste',
    'theme': 'minimal',
    'layout': 'docked',
    'tools': 'TaskPad  |  Simple tasks. Real progress.',
    'foot': 'Notes|Calculator|Web Search|Text Tools|Timer|Settings',
  };
  const dockIcons = [
    '<path d="M10 3h15l9 9v25H10a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" fill="currentColor" stroke="currentColor"/><path d="M25 3v10h9" stroke="#85d7bd"/><path d="M14 22h12m-12 7h12" stroke="white"/>',
    '<rect x="8" y="3" width="27" height="35" rx="3"/><path d="M8 14h27"/><path d="M14 20h1m6 0h1m6 0h1M14 26h1m6 0h1m6 0h1M14 32h1m6 0h1m6 0h1" stroke-width="3.4"/>',
    '<circle cx="21" cy="21" r="17"/><ellipse cx="21" cy="21" rx="7" ry="17"/><path d="M5 15h32M5 27h32M21 4v34"/>',
    '<path d="M10 3h17l8 8v24a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/><path d="M27 3v9h8M14 16h13M14 23h13M14 30h8"/>',
    '<circle cx="21" cy="21" r="17"/><path d="M21 10v12l9 6"/>',
    '<path d="m18 3-2 5-4 2-5-1-3 6 4 4v4l-4 4 3 6 5-1 4 2 2 5h7l2-5 4-2 5 1 3-6-4-4v-4l4-4-3-6-5 1-4-2-2-5Z"/><circle cx="21.5" cy="21" r="7"/>',
  ].map(
    (path) =>
      '<svg viewBox="0 0 43 43" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">' +
      path +
      '</svg>',
  );
  env.site({
    name: 'design-handle-text-copy-paste-11',
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
      const tools = head.querySelector('.tools');
      if (tools) head.insertBefore(tools, title);
      u.el('div', 'civic-subtitle', head, 'Follow the instruction below to complete the task.');
      u.el('div', 'civic-application', head, 'Hello, Alex  ⌄');
      u.el('div', 'civic-step', head, 'Step 2 of 3');
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      center.dataset.display = ctx.display;
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (cfg.layout === 'console' && aside && ctx.display !== 'toast') {
        aside.insertBefore(note, aside.children[1] || null);
      }
      const foot = u.el('footer', 'footer', shell);
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach((s, i) => {
          const d = u.el('section', 'dock-section', dock);
          const icon = u.el('span', 'dock-icon', d);
          icon.setAttribute('aria-hidden', 'true');
          icon.innerHTML = dockIcons[i];
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
      } else u.el('span', 'ready', foot, 'Ready.');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const reference = er.bool(0.5);
      const placement = reference ? 'form' : er.pick(['header', 'dock']);
      const label = reference ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      if (!ctx.finish) {
        const parent = placement === 'form' ? center : placement === 'header' ? head : foot;
        submit = u.el('button', 'submit end-' + placement, parent, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        const decoyLabel = cr.pick(options);
        const decoy = u.el('button', 'chrome-xtra', head, decoyLabel);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
      }
      return { stage, submit };
    },
    initialOverlay: { kind: 'chat' },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      if (ctx.kind === 'chat') {
        ctx.util.el('strong', '', el, 'Welcome to TaskPad!');
        ctx.util.el('p', '', el, 'Take a quick tour to see key features and get started.');
        const start = ctx.util.el('button', 'tour-start', el, 'Start tour');
        start.type = 'button';
        start.addEventListener('click', ctx.dismiss);
        const skip = ctx.util.el('button', 'tour-skip', el, 'Skip tour');
        skip.type = 'button';
        skip.addEventListener('click', ctx.dismiss);
        return { el, dismiss: skip };
      }
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
