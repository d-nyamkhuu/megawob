(function () {
  'use strict';
  const preferencesHTML =
    '<section><h3>Appearance</h3><label>Theme:<span class="fake-select">Grayscale <b>▼</b></span></label><label>Text size:<span class="fake-select">12 pt <b>▼</b></span></label><label class="check"><i class="box checked"></i>Show line numbers by default</label><label class="check"><i class="box"></i>Enable sound</label><h3>Editor</h3><label>Default font:<span class="fake-select">Helvetica <b>▼</b></span></label><label class="check"><i class="box checked"></i>Wrap long lines</label><label class="check"><i class="box"></i>Show ruler</label><button class="restore">Restore Defaults</button></section><section><h3>Behavior</h3><label class="check"><i class="box checked"></i>Check spelling while typing</label><label class="check"><i class="box checked"></i>Auto-save documents</label><label class="check"><i class="box"></i>Confirm before clearing</label><h3>Workspace</h3><label class="check"><i class="box checked"></i>Remember window size</label><label class="check"><i class="box"></i>Reopen last tab</label></section>';
  const cfg = { 'title': 'Text Task', 'theme': 'nextstep', 'layout': 'console', 'side': 'Task Preview' };
  env.site({
    name: 'design-handle-text-copy-paste-2-12',
    styles: ['site.css'],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, cfg.title);
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
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = true;
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      const stage = u.el('div', 'stage', center);
      const tabs = u.el('div', 'task-tabs', center);
      const pref = u.el('button', 'tab active', tabs, 'Preferences'),
        task = u.el('button', 'tab', tabs, 'Task');
      pref.type = task.type = 'button';
      center.classList.add('task-open');
      pref.classList.remove('active');
      task.classList.add('active');
      task.addEventListener('click', () => {
        center.classList.add('task-open');
        task.classList.add('active');
        pref.classList.remove('active');
      });
      pref.addEventListener('click', () => {
        if (!center.querySelector('.preferences')) {
          const pane = u.el('div', 'preferences', center);
          pane.innerHTML = preferencesHTML;
          pane
            .querySelector('.restore')
            .addEventListener('click', () => env.log('decoy', { label: 'Restore Defaults' }));
        }
        center.classList.remove('task-open');
        pref.classList.add('active');
        task.classList.remove('active');
      });
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (aside) {
        if (ctx.display === 'panel') u.el('p', 'preview-instruction', aside, ctx.instruction);
        u.el('hr', '', aside);
        u.el('p', 'preview-lead', aside, 'The Task tab contains:');
        const list = u.el('ul', '', aside);
        ['a short text snippet with line numbers', 'an empty "Copied text" field', 'a Submit button'].forEach((t) =>
          u.el('li', '', list, t),
        );
      }
      if (cfg.layout === 'console' && aside && ctx.display !== 'toast') {
        aside.insertBefore(note, aside.children[1] || null);
      }
      if (ctx.display === 'header' || ctx.display === 'toast') {
        const n = u.el('section', 'episode-note ' + ctx.display, shell);
        u.el('header', 'episode-note-head', n, ctx.display === 'toast' ? 'Notification' : 'Task Note');
        u.el('p', '', n, ctx.instruction);
      }
      const foot = u.el('footer', 'footer', shell);
      const brief = u.el('section', 'briefing', shell);
      u.el('header', 'briefing-head', brief, 'Note');
      u.el(
        'div',
        'briefing-copy',
        brief,
        'This is a text copy task.\nOpen the Task tab to complete it.\nThe required text is visible there.',
      );
      const desk = u.el('nav', 'desktop-icons', shell);
      [
        ['▱', 'Workspace'],
        ['▤', 'Documents'],
        ['>_', 'Terminal'],
        ['▧', 'Trash'],
      ].forEach(([i, t]) => {
        const d = u.el('div', 'desktop-icon', desk);
        u.el('span', '', d, i);
        u.el('label', '', d, t);
      });
      const foot2 = foot;
      const taskbar = u.el('div', 'taskbar', foot2);
      u.el('span', 'start-icon', taskbar, '▰');
      u.el('span', 'taskbar-app', taskbar, 'Text Task');
      u.el('span', 'taskbar-time', taskbar, 'Mon Apr 12　10:24 AM');
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach((s) => {
          const d = u.el('section', 'dock-section', dock);
          const parts = s.split(/ (.+)/);
          const label = u.el('div', 'dock-copy', d);
          u.el('strong', '', label, parts[0]);
          u.el('span', '', label, parts[1] || '');
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
      if (cfg.theme === 'modernist') {
        const paths = [
          'M21 8h18l13 14v36q0 5-5 5H21q-5 0-5-5V13q0-5 5-5Z M39 8v14h13 M16 20H10q-6 0-6 6v39q0 5 5 5h23q5 0 5-5v-2',
          'M18 8h-5q-5 0-5 5v46q0 5 5 5h34q5 0 5-5V13q0-5-5-5h-7 M23 3h12q5 0 5 5v7H18V8q0-5 5-5Z',
          'M9 18h43q4 0 4 4v28q0 4-4 4H9q-5 0-5-4V22q0-4 5-4Z M13 28h4v2h-4Z M27 28h4v2h-4Z M41 28h4v2h-4Z M13 41h12v2H13Z M39 41h5v2h-5Z',
          'M30 3c-13 0-19 9-19 23v20c0 15 7 24 19 24s19-9 19-24V26C49 12 43 3 30 3Z M29 17h2v11h-2Z',
        ];
        foot.querySelectorAll('.dock-section').forEach((d, i) => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 60 76');
          svg.innerHTML = '<path d="' + paths[i] + '"/>';
          d.prepend(svg);
        });
      }
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'inspector' : er.pick(['toolbar', 'footer']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'inspector' ? aside : placement === 'toolbar' ? center : taskbar;
        submit = u.el('button', 'submit end-' + placement, parent, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
        if (placement === 'footer') taskbar.insertBefore(submit, taskbar.querySelector('.taskbar-time'));
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'end-xtra', taskbar, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          taskbar.insertBefore(decoy, taskbar.querySelector('.taskbar-time'));
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.initial) {
        const center = document.querySelector('.center');
        const task = document.querySelector('.task-tabs .tab:last-child');
        const pref = document.querySelector('.task-tabs .tab:first-child');
        const el = ctx.util.el('div', 'preferences', center);
        el.innerHTML = preferencesHTML;
        center.classList.remove('task-open');
        pref.classList.add('active');
        task.classList.remove('active');
        el.querySelector('.restore').addEventListener('click', () => env.log('decoy', { label: 'Restore Defaults' }));
        task.addEventListener('click', ctx.dismiss, { once: true });
        return { el, dismiss: task };
      }
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
