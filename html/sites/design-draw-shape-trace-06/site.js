// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function webFrame(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design web2' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    const root = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#fff',
      panel: '#fff',
      fg: '#1d2b3a',
      muted: '#5d6b7c',
      line: '#c5d9ea',
      accent: '#2f8a1e',
    }))
      root.style.setProperty('--' + k, v);
    root.style.setProperty('--font', '"Trebuchet MS", "Segoe UI", Tahoma, sans-serif');
    const shell = u.el('div', 'shell', body);
    const head = u.el('header', 'head', shell);
    const lg = u.svg('svg', { class: 'logo', width: 54, height: 54, viewBox: '0 0 54 54' }, head);
    u.svg('circle', { cx: 27, cy: 27, r: 25, fill: '#f4f7fa', stroke: '#c9d3dc', 'stroke-width': 2 }, lg);
    u.svg(
      'path',
      {
        d: 'M38 3C30 13 19 8 15 23C10 36 20 41 28 33C38 24 35 12 38 3Z',
        fill: '#4f9b2a',
        stroke: '#3f7621',
        'stroke-width': 1,
      },
      lg,
    );
    u.svg('path', { d: 'M22 46C21 32 25 23 32 14', stroke: '#468225', 'stroke-width': 2, fill: 'none' }, lg);
    const br = u.el('div', 'brand', head);
    u.el('div', 'app', br, 'SkillTrack');
    u.el('div', 'tag', br, 'Practice Today  Build Tomorrow');
    const nav = u.el('nav', 'tabs', head);
    for (const t of ['Home', 'Practice', 'Reports', 'Settings']) {
      const b = u.el('button', 'gtab' + (t === 'Practice' ? ' on' : ''), nav, t);
      b.type = 'button';
      b.onclick = () => env.log('decoy', { label: t });
    }
    const hl = u.el('div', 'hlinks', head);
    u.el('span', '', hl, 'Help');
    u.el('i', '', hl, '|');
    u.el('span', '', hl, 'Sign Out');
    const cols = u.el('div', 'cols', shell);
    const left = u.el('aside', 'panel tools', cols);
    u.el('h3', 'ph', left, 'Tools');
    const ic = {
      pen: 'M2 30L5 21L23 2Q25 1 27 3L30 6Q31 8 29 10L11 28ZM5 21L11 28M20 5L27 12M2 30L7 28',
      eraser: 'M3 21L21 2Q23 1 25 3L30 8Q31 10 29 12L12 30H3ZM10 13L20 22',
      trash: 'M2 8H30V11H2ZM10 8V3H22V8M4 11L5 31H27L28 11M10 15V27M16 15V27M22 15V27',
    };
    const mk = (name, path, cb, on) => {
      const b = u.el('button', 'tool' + (on ? ' on' : ''), left);
      b.type = 'button';
      const s = u.svg(
        'svg',
        {
          width: 30,
          height: 30,
          viewBox: '0 0 32 32',
          fill: '#f6f8fa',
          stroke: '#193654',
          'stroke-width': 1.8,
          'stroke-linejoin': 'round',
        },
        b,
      );
      u.svg('path', { d: path }, s);
      u.el('span', '', b, name);
      b.onclick = cb;
      return b;
    };
    mk('Draw Path', ic.pen, () => {}, true);
    mk('Eraser', ic.eraser, () => {
      env.widgetDef.clear?.();
    });
    mk('Clear', ic.trash, () => {
      env.widgetDef.clear?.();
    });
    u.el('hr', '', left);
    u.el('div', 'lbl', left, 'Line Style');
    const sel = u.el('div', 'sel', left);
    u.el('div', 'bar', sel);
    u.el('div', 'caret', sel, '▼');
    u.el('div', 'lbl w', left, 'Line Width');
    const sl = u.el('div', 'slider', left);
    u.el('div', 'track', sl);
    u.el('div', 'knob', sl);
    u.el('span', 'val', sl, '4');
    const mid = u.el('section', 'panel center', cols);
    u.el('h3', 'ph', mid, 'Trace the Path');
    const note = u.el('div', 'task-note', mid);
    const instruction = u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.type = 'button';
      x.onclick = () => (note.style.visibility = 'hidden');
    }
    const stage = u.el('main', 'stage', mid);
    stage.dataset.role = 'stage';
    const right = u.el('div', 'rcol', cols);
    const info = u.el('section', 'panel info', right);
    u.el('h3', 'ph', info, 'Task Info');
    const dl = u.el('dl', '', info);
    for (const [k, v] of [
      ['Task', 'Trace the path'],
      ['Input', 'Mouse only'],
      ...(ctx.display === 'hidden' ? [] : [['Goal', 'Follow the path from start to the arrow tip.']]),
    ]) {
      u.el('dt', '', dl, k);
      u.el('dd', '', dl, v);
    }
    if (ctx.display === 'panel') {
      note.classList.add('instruction-panel');
      info.append(note);
      dl.hidden = true;
    }
    const tips = u.el('section', 'panel tips', right);
    u.el('h3', 'ph', tips, 'Tips');
    const ul = u.el('ul', '', tips);
    for (const lines of [
      ['Keep your mouse on', 'the dashed line.'],
      ['Follow the curve carefully.'],
      ['You can use Clear to', 'start over.'],
    ]) {
      const li = u.el('li', '', ul);
      lines.forEach((text, i) => {
        if (i) u.el('br', '', li);
        u.el('span', 'tip-line', li, text);
      });
    }
    // New frame choices have independent streams; task and existing frame draws stay untouched.
    const er = ctx.rng.fork('chrome/end'),
      cr = ctx.rng.fork('chrome/collide');
    const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
    const labels = ctx.content.END_LABELS.map(labelOf);
    const referenceEnd = er.bool(0.5);
    const placement = referenceEnd ? 'right' : er.pick(['header', 'link']);
    const endLabel = referenceEnd ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
    let submit = null,
      toolActions = null;
    const actions = () => toolActions || (toolActions = u.el('div', 'tool-actions', left));
    if (!ctx.finish) {
      const parent = placement === 'right' ? right : placement === 'header' ? head : actions();
      submit = u.el(
        placement === 'link' ? 'a' : 'button',
        'submit' + (placement === 'right' ? '' : ' submit-' + placement),
        parent,
        endLabel,
      );
      if (placement === 'link') submit.href = '#';
      else submit.type = 'button';
      if (placement === 'header') hl.hidden = true;
      submit.dataset.role = 'submit';
      submit.title = endLabel;
      submit.setAttribute('aria-label', endLabel);
      submit.onclick = (e) => {
        e.preventDefault();
        ctx.submit();
      };
    }
    if (cr.bool(0.3)) {
      const label = cr.pick(
        [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()),
      );
      const decoy = u.el('button', 'end-xtra', actions(), label);
      decoy.type = 'button';
      decoy.dataset.role = 'xtra';
      decoy.onclick = () => env.log('decoy', { label, collide: true });
    }
    return { stage, submit };
  }
  env.site({
    name: 'design-draw-shape-trace-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'split-level',
        'theme': 'vista',
        'title': 'Path Tracer',
        'menu': 'File    Edit    View    Tools    Help',
        'foot': '',
        'accent': '#2685dd',
        'bg': '#d8e8f6',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
        'ob': 'newsletter',
      },
      parts: {
        frame: (base, S) =>
          function (ctx) {
            return webFrame(ctx);
          },
        'overlay.7': (base, S) =>
          function (_c) {
            const { kind, o } = _c;
            if (o === 'update') {
              _c.title = 'A new version is available';
              _c.text = 'Get the latest features and security fixes.';
              _c.label = 'Remind me later';
            } else if (o === 'privacy') {
              _c.title = 'We’d like your consent';
              _c.text =
                'We use optional analytics to improve this application. You can change this setting at any time in the Options menu.';
              _c.label = 'Reject optional';
            } else if (o === 'tips') {
              _c.title = 'Tip of the day';
              _c.text = 'The midpoint is the point that is the same distance from both marked points.';
              _c.label = 'Close';
            } else if (o === 'newsletter') {
              _c.title = 'Product Updates Newsletter';
              _c.text = 'Get occasional updates about new features and tips.';
              _c.label = 'Close';
            } else if (o === 'notifications') {
              _c.title = 'Notifications (5)';
              _c.text =
                'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
              _c.label = 'Dismiss all';
            } else if (o === 'survey') {
              _c.title = 'Quick Survey';
              _c.text = 'Please take a moment to give us some feedback.\nHow easy is this training task?';
              _c.label = 'Close survey';
            } else {
              _c.title = {
                cookie: 'Your privacy',
                toast: 'Changes saved',
                chat: 'Support',
                promo: 'Workspace update',
                banner: 'Service notice',
              }[kind];
              _c.text = {
                cookie: 'This application stores optional cookies.',
                toast: 'Your changes have been saved.',
                chat: 'Need a hand with this workspace?',
                promo: 'Explore the latest workspace features.',
                banner: 'You are viewing a shared workspace.',
              }[kind];
              _c.label = kind === 'cookie' ? 'Reject optional' : 'Close';
            }
          },
        'overlay.13': (base, S) =>
          function (_c) {
            const { box, ctx, dismiss, o, u } = _c;
            if (o === 'newsletter') {
              u.el('div', 'nl-input', box, 'Your email address (optional)');
              const cb = u.el('div', 'nl-check', box);
              u.el('span', 'nl-box', cb);
              u.el('span', '', cb, 'Send me product updates');
              const x = u.el('button', 'nl-x', box, '✕');
              x.type = 'button';
              x.onclick = () => dismiss.click();
              if (env.timeText) env.timeText.textContent = 'Time: Paused (starts after you close the newsletter)';
            }
            dismiss.type = 'button';
            dismiss.onclick = () => {
              if (env.timeText) env.timeText.textContent = 'Time: Ready';
              ctx.dismiss('close');
            };
          },
        'overlay.14': () => () => {},
      },
    },
  });
})();
