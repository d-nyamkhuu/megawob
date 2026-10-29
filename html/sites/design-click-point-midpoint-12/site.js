(function () {
  'use strict';
  const C = {
    'theme': 'pastel',
    'title': 'GeoPractice',
    'subtitle': 'Simple geometry exercises',
    'accent': '#7c5cdb',
    'bg': '#dfdcf7',
    'surface': '#f4f8f7',
    'font': "Arial, 'Segoe UI', sans-serif",
  };
  env.site({
    name: 'design-click-point-midpoint-12',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design ' + C.theme + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#111a2e',
        muted: '#5d6676',
        line: '#d7e4de',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const logo = u.svg(
        'svg',
        {
          class: 'logo',
          width: 24,
          height: 24,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: '#cf72b3',
          'stroke-width': 2,
          'stroke-linejoin': 'round',
        },
        head,
      );
      u.svg('path', { d: 'M12 3L22 20H2Z' }, logo);
      u.svg('path', { d: 'M12 9L17 18H7Z', stroke: '#b398d6', 'stroke-width': 1.3 }, logo);
      u.el('div', 'title', head, C.title);
      u.el('div', 'subtitle', head, C.subtitle);
      const controls = u.el('div', 'window-controls', head);
      for (const [label, d] of [
        ['minimize', 'M3 12H17'],
        ['maximize', 'M4 4H16V16H4Z'],
        ['close', 'M3 3L17 17M17 3L3 17'],
      ]) {
        const bt = u.el('button', '', controls);
        bt.type = 'button';
        bt.setAttribute('aria-label', label);
        const s = u.svg(
          'svg',
          {
            width: 20,
            height: 20,
            viewBox: '0 0 20 20',
            fill: 'none',
            stroke: '#1b2236',
            'stroke-width': 1.7,
            'stroke-linejoin': 'round',
          },
          bt,
        );
        u.svg('path', { d }, s);
        bt.onclick = () => env.log('window-control', { label });
      }
      const content = u.el('div', 'content', shell),
        main = u.el('div', 'main', content);
      const note = u.el('section', 'task-note', main);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden' || ctx.display === 'panel') {
        note.hidden = true;
      } else if (ctx.display === 'toast') {
        u.el('div', 'note-placeholder', main);
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      }
      const stage = u.el('main', 'stage', main);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'aside', content);
      const view = u.el('section', 'card view', aside);
      u.el('h3', '', view, 'View Options');
      for (const [text, on] of [
        ['Show grid', true],
        ['Show coordinates', false],
        ['Snap to grid', false],
      ]) {
        const l = u.el('label', 'opt', view);
        const input = u.el('input', '', l);
        input.type = 'checkbox';
        input.checked = on;
        input.dataset.option = text;
        input.onchange = () => {
          if (text === 'Show grid') stage.classList.toggle('grid-hidden', !input.checked);
          if (text === 'Show coordinates') stage.classList.toggle('coordinates-shown', input.checked);
        };
        u.el('span', '', l, text);
      }
      const save = u.el('button', 'save', view, 'Save view');
      save.type = 'button';
      save.onclick = () => env.log('save-view', {});
      u.el('div', 'save-note', view, 'Saves only presentation preferences.');
      const task = u.el('section', 'card task', aside);
      u.el('h3', '', task, 'Your Task');
      u.el(
        'p',
        '',
        task,
        ctx.display === 'hidden' ? 'Find the point that answers the task shown for this exercise.' : ctx.instruction,
      );
      const tip = u.el('div', 'tip', task);
      const cur = u.svg(
        'svg',
        {
          width: 34,
          height: 40,
          viewBox: '0 0 32 38',
          fill: 'none',
          stroke: '#1b2236',
          'stroke-width': 2,
          'stroke-linejoin': 'round',
        },
        tip,
      );
      u.svg('path', { d: 'M5 3V29L12 23L17 34L22 32L17 21H26Z' }, cur);
      u.el('span', '', tip, 'Use your mouse to click on the correct point.');
      const clear = u.el('button', 'clear', task, 'Clear');
      clear.type = 'button';
      clear.onclick = () => env.widgetDef.clear?.();
      const ep = ctx.rng.fork('chrome/end'),
        cp = ctx.rng.fork('chrome/collide');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = labelOf(ep.pick(labels)),
        placement = ep.pick(['bottom', 'bottom', 'toolbar', 'task-action']);
      let collide = null;
      if (cp.bool(0.3)) {
        const choices = [...new Set(labels.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) collide = cp.pick(choices);
      }
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'end-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: text, collide: true });
      };
      const endBtn = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.onclick = () => ctx.submit();
        return b;
      };
      const toolbar = u.el('div', 'end-toolbar', head);
      let submit = null;
      if (collide) decoyBtn(toolbar, collide);
      if (!ctx.finish && placement === 'toolbar') submit = endBtn(toolbar, 'submit toolbar-submit');
      const taskAction = u.el('div', 'task-action', task);
      taskAction.hidden = ctx.finish || placement !== 'task-action';
      task.insertBefore(taskAction, tip);
      if (collide && placement === 'task-action') decoyBtn(taskAction, collide);
      if (!ctx.finish && placement === 'task-action') submit = endBtn(taskAction, 'submit');
      if (!ctx.finish && placement === 'bottom') submit = endBtn(task, 'submit');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
