(function () {
  'use strict';
  let preferences = null;
  env.site({
    name: 'design-select-text-sentence-12',
    styles: ['site.css', 'xp.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design xp' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const win = u.el('div', 'xp-win', body);
      const title = u.el('div', 'xp-title', win);
      {
        const ic = u.svg('svg', { class: 'ico', viewBox: '0 0 24 24' }, title);
        u.svg('rect', { x: 10, y: 1, width: 13, height: 22, fill: '#e6dfb1', stroke: '#7886ad' }, ic);
        u.svg('rect', { x: 12, y: 3, width: 9, height: 8, fill: '#ffda55', stroke: '#fff3a8' }, ic);
        u.svg('path', { d: 'M13 14H20M13 17H20M13 20H20', stroke: '#7286aa' }, ic);
        u.svg('rect', { x: 1, y: 8, width: 11, height: 15, fill: '#c5d6ee', stroke: '#8faddb' }, ic);
        u.svg('path', { d: 'M3 10H7V15H3Z', fill: '#f74635' }, ic);
        u.svg('path', { d: 'M8 10H10V15H8Z', fill: '#ffc940' }, ic);
        u.svg('path', { d: 'M3 17H7V21H3Z', fill: '#319ad9' }, ic);
        u.svg('path', { d: 'M8 17H10V21H8Z', fill: '#77b542' }, ic);
      }
      u.el('span', '', title, 'Text Exercise');
      u.el('span', 'grow', title);
      const wb = u.el('div', 'xp-wb', title);
      u.el('span', 'mn', wb);
      u.el('span', 'mx', wb);
      u.el('span', 'x', wb);
      const menu = u.el('div', 'xp-menu', win);
      for (const t of ['File', 'Edit', 'View', 'Tools', 'Help']) u.el('span', '', menu, t);
      const main = u.el('div', 'xp-main', win),
        left = u.el('div', 'xp-left', main);
      const tabs = u.el('div', 'xp-tabs', left);
      const tPref = u.el('button', 'xp-tab on', tabs);
      tPref.type = 'button';
      const gear = (parent, id) => {
        const g = u.svg('svg', { viewBox: '0 0 64 64' }, parent),
          defs = u.svg('defs', {}, g),
          gr = u.svg('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
        u.svg('stop', { offset: '0%', 'stop-color': '#c8dfff' }, gr);
        u.svg('stop', { offset: '48%', 'stop-color': '#7398cc' }, gr);
        u.svg('stop', { offset: '100%', 'stop-color': '#264c82' }, gr);
        u.svg(
          'path',
          {
            d: 'M27 3L37 3L39 11L45 14L52 10L59 18L54 24L56 30L63 32L62 42L54 43L50 49L52 57L42 61L37 55L30 56L26 63L16 58L17 50L12 45L4 45L2 35L10 31L11 24L5 18L12 10L20 14L25 11Z',
            fill: 'url(#' + id + ')',
            stroke: '#3c5d8b',
            'stroke-width': 2,
            'stroke-linejoin': 'round',
          },
          g,
        );
        u.svg('circle', { cx: 32, cy: 33, r: 12, fill: '#fafaf6', stroke: '#55749b', 'stroke-width': 3 }, g);
        return g;
      };
      {
        gear(tPref, 'tab-gear');
        u.el('span', '', tPref, 'Preferences');
      }
      const tTask = u.el('button', 'xp-tab', tabs);
      tTask.type = 'button';
      {
        const g = u.svg('svg', { viewBox: '0 0 24 24' }, tTask);
        u.svg('path', { d: 'M5 2H15L20 7V22H5Z', fill: '#fff', stroke: '#5b7fbf', 'stroke-width': 1.5 }, g);
        u.svg('path', { d: 'M8 11H17M8 14H17M8 17H17', stroke: '#5b7fbf' }, g);
        u.el('span', '', tTask, 'Task');
      }
      const panel = u.el('div', 'xp-panel', left);
      const pane = u.el('div', 'xp-pane', panel);
      const note = u.el('section', 'task-note');
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      u.el('div', 'xp-clearrow');
      const box = u.el('div', 'xp-stagebox', pane),
        stage = u.el('main', 'xp-stage', box);
      stage.dataset.role = 'stage';
      const crow = u.el('div', 'xp-clearrow', pane);
      const clr = u.el('button', 'xp-btn clear', crow, 'Clear Selection');
      clr.type = 'button';
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      // The initial Preferences tab is scheduled and dismissed by the kit.
      let pf = null;
      const buildPreferences = () => {
        if (pf && pf.isConnected) return pf;
        pf = u.el('div', 'xp-prefs', panel);
        const ph = u.el('div', 'xp-ph', pf);
        {
          gear(ph, 'large-gear');
          const t = u.el('div', '', ph);
          u.el('h2', '', t, 'Preferences');
          u.el(
            'p',
            '',
            t,
            'Adjust how the application looks and works. Your text is not graded while this tab is open.',
          );
        }
        const pb = u.el('div', 'xp-pb', pf),
          cats = u.el('div', 'xp-cats', pb);
        const catIcon = (n, r) => {
          const g = u.svg('svg', { viewBox: '0 0 24 24', width: 28, height: 28, class: 'ci' }, r),
            defs = u.svg('defs', {}, g),
            grad = u.svg('linearGradient', { id: 'cat-' + n.replace(/ /g, ''), x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
          u.svg('stop', { offset: '0%', 'stop-color': '#c1dbff' }, grad);
          u.svg('stop', { offset: '45%', 'stop-color': '#729be0' }, grad);
          u.svg('stop', { offset: '100%', 'stop-color': '#254c9c' }, grad);
          if (n === 'General') {
            u.svg(
              'rect',
              { x: 2, y: 3, width: 20, height: 14, rx: 1.5, fill: '#cfe0ff', stroke: '#5573a1', 'stroke-width': 1.5 },
              g,
            );
            u.svg(
              'rect',
              { x: 4, y: 5, width: 16, height: 10, fill: 'url(#cat-General)', stroke: '#effaff', 'stroke-width': 0.5 },
              g,
            );
            u.svg('path', { d: 'M12 6L5 14H18V6Z', fill: '#5ac6ff', opacity: 0.6 }, g);
            u.svg(
              'path',
              { d: 'M10 17H14V20H18V22H6V20H10Z', fill: '#bac7d4', stroke: '#6a7d93', 'stroke-width': 0.8 },
              g,
            );
          } else if (n === 'Appearance') {
            u.svg(
              'text',
              {
                x: 12,
                y: 20,
                'text-anchor': 'middle',
                'font-size': 24,
                'font-weight': 'bold',
                'font-family': 'Georgia,serif',
                fill: '#1a1a2a',
              },
              g,
            ).textContent = 'A';
          } else if (n === 'Editing') {
            u.svg('path', { d: 'M4 1H15L21 7V23H4Z', fill: '#fff', stroke: '#587bb5', 'stroke-width': 1.5 }, g);
            u.svg(
              'path',
              { d: 'M15 1V7H21M7 9H17M7 12H18M7 15H18M7 18H18M7 21H18', stroke: '#8eafe3', 'stroke-width': 1 },
              g,
            );
          } else if (n === 'Auto Save') {
            u.svg(
              'rect',
              { x: 2, y: 2, width: 20, height: 20, rx: 2, fill: 'url(#cat-AutoSave)', stroke: '#1f3a7a' },
              g,
            );
            u.svg('rect', { x: 6, y: 3, width: 12, height: 7, fill: '#e8eefc', stroke: '#7591b4' }, g);
            u.svg('rect', { x: 14, y: 3, width: 3, height: 6, fill: '#799bd7' }, g);
            u.svg('rect', { x: 6, y: 14, width: 12, height: 7, rx: 1, fill: '#e3ecfb', stroke: '#52719e' }, g);
            u.svg('path', { d: 'M8 16H16M8 18H16', stroke: '#aabbd8' }, g);
          } else if (n === 'Language') {
            const rg = u.svg('radialGradient', { id: 'globe', cx: '.3', cy: '.25', r: '.75' }, defs);
            u.svg('stop', { offset: '0%', 'stop-color': '#8bffff' }, rg);
            u.svg('stop', { offset: '55%', 'stop-color': '#008bd0' }, rg);
            u.svg('stop', { offset: '100%', 'stop-color': '#004499' }, rg);
            u.svg('circle', { cx: 12, cy: 12, r: 10, fill: 'url(#globe)', stroke: '#1b4f98' }, g);
            u.svg(
              'path',
              {
                d: 'M8 3L13 3L16 5L14 7L11 7L10 10L7 12L4 10L3 7ZM15 10L19 12L18 15L15 16L14 21L11 19L11 15L9 13L11 10Z',
                fill: '#76cc1c',
                stroke: '#3a981b',
                'stroke-width': 0.4,
              },
              g,
            );
          } else {
            u.svg(
              'path',
              {
                d: 'M4 22Q1 21 3 18L13 8Q11 2 17 1L16 5L19 8L23 6Q23 13 17 12L7 22Z',
                fill: 'url(#cat-Advanced)',
                stroke: '#416590',
                'stroke-width': 1.2,
              },
              g,
            );
            u.svg('path', { d: 'M5 19L14 10', stroke: '#d5e7ff', 'stroke-width': 1.2 }, g);
          }
        };
        ['General', 'Appearance', 'Editing', 'Auto Save', 'Language', 'Advanced'].forEach((n, i) => {
          const r = u.el('div', 'xp-cat' + (i === 0 ? ' on' : ''), cats);
          catIcon(n, r);
          u.el('span', '', r, n);
        });
        const op = u.el('div', 'xp-opts', pb);
        u.el('h3', '', op, 'General Options');
        [
          ['Show welcome screen at startup', 1],
          ['Check for updates automatically', 1],
          ['Play sound when task is completed', 0],
        ].forEach(([t, c]) => {
          const r = u.el('div', 'xp-chk', op);
          u.el('b', '', r, c ? '✔' : '');
          u.el('span', '', r, t);
        });
        u.el('hr', '', op);
        u.el('h3', '', op, 'Default Font');
        {
          const r = u.el('div', 'xp-row', op);
          u.el('span', '', r, 'Font:');
          const s = u.el('div', 'xp-sel', r);
          s.style.width = '17vw';
          u.el('span', '', s, 'Tahoma');
          u.el('u', '', s, '▼');
          u.el('span', '', r, 'Size:');
          const s2 = u.el('div', 'xp-sel', r);
          s2.style.width = '8vw';
          u.el('span', '', s2, '12');
          u.el('u', '', s2, '▼');
        }
        u.el('hr', '', op);
        u.el('h3', '', op, 'Theme');
        {
          const s = u.el('div', 'xp-sel', op);
          s.style.width = '21vw';
          u.el('span', '', s, 'Windows XP (Luna)');
          u.el('u', '', s, '▼');
          const r = u.el('div', 'xp-clearrow', op);
          r.style.marginTop = '3vh';
          u.el('button', 'xp-btn', r, 'Restore Defaults').type = 'button';
        }
        pf.addEventListener('pointerdown', () => tTask.click());
        return pf;
      };
      const show = (task) => {
        if (!task) buildPreferences();
        pf?.classList.toggle('off', task);
        tTask.classList.toggle('on', task);
        tPref.classList.toggle('on', !task);
        env.log('tab', { tab: task ? 'task' : 'preferences' });
      };
      tTask.onclick = () => show(true);
      tPref.onclick = () => show(false);
      preferences = { build: buildPreferences, show, task: tTask };
      // With the obstruction disabled the working tab is already available.
      tTask.classList.add('on');
      tPref.classList.remove('on');
      // Sidebar
      const side = u.el('aside', 'xp-side', main),
        sh = u.el('div', 'xp-sh', side);
      {
        const g = u.svg('svg', { viewBox: '0 0 40 48' }, sh),
          defs = u.svg('defs', {}, g),
          gr = u.svg('linearGradient', { id: 'clip-board', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
        u.svg('stop', { offset: '0%', 'stop-color': '#fff0b6' }, gr);
        u.svg('stop', { offset: '50%', 'stop-color': '#e4ae59' }, gr);
        u.svg('stop', { offset: '100%', 'stop-color': '#bc7429' }, gr);
        u.svg(
          'rect',
          {
            x: 2,
            y: 5,
            width: 36,
            height: 41,
            rx: 4,
            fill: 'url(#clip-board)',
            stroke: '#ac6b27',
            'stroke-width': 1.5,
          },
          g,
        );
        u.svg('rect', { x: 5, y: 7, width: 30, height: 36, rx: 2, fill: 'none', stroke: '#fff4c4' }, g);
        u.svg('rect', { x: 8, y: 10, width: 24, height: 32, rx: 1, fill: '#fafafa', stroke: '#8d9cad' }, g);
        u.svg('path', { d: 'M12 19H28M12 25H28M12 31H28M12 36H28', stroke: '#7a9fd8', 'stroke-width': 1.8 }, g);
        u.svg('path', { d: 'M12 4H16V1H24V4H28V11H12Z', fill: '#9ab6db', stroke: '#426899', 'stroke-width': 1.5 }, g);
        u.svg('path', { d: 'M15 5H18V3H22V5H25V8H15Z', fill: '#e4ecfb' }, g);
        u.el('b', '', sh, 'Current Task');
      }
      side.appendChild(note);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.title = 'Dismiss task notification';
        x.setAttribute('aria-label', x.title);
        x.onclick = () => (note.hidden = true);
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      u.el('div', 'xp-pt', side, 'Passage Preview');
      const prev = u.el('div', 'xp-prev', side);
      const paras = (ctx.spec && ctx.spec.paragraphs) || [];
      paras.forEach((t, i) => u.el('p', '', prev, 'Paragraph ' + (i + 1) + ': ' + t));
      const status = u.el('div', 'xp-status', win, 'Ready');
      // Preserve the pictured sidebar Submit in half the episodes. New choices never
      // consume the widget's existing random stream.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const classic = er.bool(0.5);
      const placement = classic ? 'sidebar' : er.pick(['toolbar', 'status']);
      const label = classic ? 'Submit' : er.pick(endWords.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'sidebar' ? side : placement === 'toolbar' ? menu : status;
        submit = u.el(
          'button',
          placement === 'sidebar' ? 'submit' : 'xp-btn xp-end xp-end-' + placement,
          parent,
          label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.onclick = () => ctx.submit();
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = [...new Set(endWords)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const text = cr.pick(choices),
            b = u.el('button', 'xp-btn xp-xtra', menu, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.onclick = () => env.log('decoy', { label: text, collide: true });
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      if (ctx.initial && kind === 'promo') {
        const view = preferences,
          el = view.build(),
          dismiss = view.task;
        el.dataset.role = 'overlay';
        view.show(false);
        dismiss.onclick = () => {
          view.show(true);
          ctx.dismiss('task');
          dismiss.onclick = () => view.show(true);
        };
        return { el, dismiss };
      }
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
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss xp-btn', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const a = u.el('button', 'dismiss xp-btn', box, 'Accept optional');
        a.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
