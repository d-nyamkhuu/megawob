(function () {
  'use strict';
  const C = { foot: 'Ready.', date: 'Mon Apr 6, 1987', time: '10:24 AM' };
  const ICONS = {
    Select:
      'M7 3H18L25 10V29H7Z M18 3V10H25 M10 8H14 M10 11H14 M10 14H14 M10 17H14 M10 20H14 M10 23H14 M10 26H14 M17 14H22 M17 17H22 M17 20H22 M17 23H22 M17 26H22',
    Copy: 'M3 1H17L21 5V24H3Z M6 5H14 M6 8H14 M6 11H10 M10 7H21L28 14V30H10Z M21 7V14H28 M13 16H24 M13 19H24 M13 22H24 M13 25H24 M13 28H24',
    Cut: 'M10 24L21 1L18 15L10 24 M22 24L11 1L14 15L22 24 M11 26C11 20 4 20 4 26C4 32 11 32 11 26Z M22 26C22 20 29 20 29 26C29 32 22 32 22 26Z',
    Paste:
      'M6 6H26V31H6Z M11 4H21V9H11Z M14 4V2Q16 -1 18 2V4 M9 11H23 M9 14H23 M9 17H23 M9 20H23 M9 23H23 M9 26H23 M9 29H23',
    Clear: 'M3 4H29V30H3Z M7 9H25 M7 13H25 M7 17H25 M7 21H25 M7 25H25',
  };
  env.site({
    name: 'design-select-text-sentence-10',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design gem-body-root' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const er = ctx.rng.fork('chrome/end');
      const endMode = ctx.finish ? null : er.pick(['original', 'original', 'menu', 'status']);
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = endMode === 'original' ? 'Submit' : labelOf(er.pick(endLabels));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = [
          ...new Set(endLabels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (choices.length) collide = labelOf(cr.pick(choices));
      }
      const gem = u.el('div', 'gem', body);
      const menu = u.el('div', 'gem-menu', gem);
      {
        const ic = u.svg(
          'svg',
          { class: 'ico', viewBox: '0 0 42 34', fill: '#fff', stroke: '#000', 'stroke-width': 1.5 },
          menu,
        );
        u.svg(
          'path',
          { d: 'M2 2L21 3L25 1L35 4L40 11V32H21L2 31Z M21 3V32 M4 5L18 6V29 M24 4L33 6L38 12V29H24Z', fill: '#fff' },
          ic,
        );
        u.svg('path', { d: 'M25 5L34 7L39 13V31H25Z', fill: '#151515' }, ic);
        u.svg('path', { d: 'M28 19L33 16L35 20L32 24L35 27 M28 27L32 27 M33 8V13H38', stroke: '#fff' }, ic);
      }
      u.el('a', 'app-name', menu, 'Text Works');
      for (const t of ['File', 'Edit', 'Search', 'Options', 'Help']) {
        const a = u.el('a', '', menu, t);
        a.href = '#';
        a.onclick = (e) => e.preventDefault();
      }
      const buildEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.onclick = () => ctx.submit();
        return b;
      };
      let submit = null;
      u.el('span', 'clock', menu, C.date + '   ' + C.time);
      const main = u.el('div', 'gem-body', gem);
      const left = u.el('div', 'gem-left', main);
      const lt = u.el('div', 'gem-title', left);
      u.el('span', '', lt, 'Document: Notes.txt');
      const stage = u.el('main', 'stage', left);
      stage.dataset.role = 'stage';
      const right = u.el('div', 'gem-right', main);
      const tp = u.el('div', 'gem-panel gem-task', right);
      const taskTitle = u.el('div', 'gem-title', tp);
      u.el('span', '', taskTitle, 'Task');
      if (endMode === 'menu') submit = buildEnd(taskTitle, 'gem-menu-submit', endLabel);
      const note = u.el('section', 'task-note', tp);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'header') note.classList.add('instruction-header');
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const tools = u.el('div', 'gem-panel gem-tools', right);
      u.el('div', 'gem-title', tools).append(Object.assign(document.createElement('span'), { textContent: 'Tools' }));
      const row = u.el('div', 'tools', tools);
      for (const name of ['Select', 'Copy', 'Cut', 'Paste', 'Clear']) {
        const b = u.el('button', 'gem-tool', row);
        b.type = 'button';
        const box = u.el('span', 'box', b);
        const s = u.svg('svg', { viewBox: '0 0 32 32', fill: 'none', stroke: '#000', 'stroke-width': 2 }, box);
        u.svg('path', { d: ICONS[name] }, s);
        u.el('span', '', b, name);
        b.onclick = () => {
          if (name === 'Clear') env.widgetDef.clear?.();
          else env.log('tool', { name });
        };
      }
      const info = u.el('div', 'gem-panel gem-info', right);
      const infoTitle = u.el('div', 'gem-title', info);
      u.el('span', '', infoTitle, 'Document Info');
      if (collide) {
        const b = u.el('button', 'gem-title-xtra', infoTitle, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      u.el('div', 'rows', info, 'File:  Notes.txt\nSize:  312 bytes\nModified:  Apr 6, 1987   10:14 AM');
      const foot = u.el('div', 'gem-foot', right);
      if (endMode === 'original') submit = buildEnd(foot, 'submit', endLabel);
      const st = u.el('div', 'gem-status', gem);
      u.el('span', '', st, C.foot);
      if (endMode === 'status') submit = buildEnd(st, 'gem-status-submit', endLabel);
      u.el('span', '', st, 'Ln 1, Col 1');
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
