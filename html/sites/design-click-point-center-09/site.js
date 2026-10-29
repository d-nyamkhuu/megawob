(function () {
  'use strict';
  const C = {
    title: 'Geometry Task',
    accent: '#111',
    font: 'Helvetica, Arial, sans-serif',
    menu: ['File', 'Edit', 'View', 'Tools', 'Windows', 'Help'],
  };
  env.site({
    name: 'design-click-point-center-09',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body,
        W = window.innerWidth,
        H = window.innerHeight;
      let display = ctx.display;
      if (display === 'panel' && W < 1180) display = 'header';
      if (display === 'toast' && H < 680) display = 'header';
      body.className = 'design nextstep' + (display === 'toast' ? ' has-instruction-toast' : '');
      const er = ctx.rng.fork('chrome/end');
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const rawEnds = ctx.content && ctx.content.END_LABELS;
      const endLabels =
        Array.isArray(rawEnds) && rawEnds.length
          ? rawEnds.map(endText)
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const otherEnds = endLabels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = er.bool(0.5) ? 'Submit' : er.pick(otherEnds);
      const placement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'title', 'link', 'icon']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = [...new Set(endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (choices.length) collide = { text: cr.pick(choices), where: 'footer' };
      }
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#5f5f73',
        panel: '#ffffff',
        fg: '#111111',
        muted: '#444444',
        line: '#555555',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const bar = u.el('nav', 'menubar', body);
      const ap = u.el('span', 'apple', bar);
      ap.innerHTML =
        '<svg width="16" height="18" viewBox="0 0 16 18"><path d="M8 4C6 2.5 2 3.5 2 8.5C2 13 5 17 7 16C7.8 15.6 8.2 15.6 9 16C11 17 14 13 14 9C12 8 11 6 12 4.5C11 3.5 9 3.3 8 4ZM8 3.5C8 1.5 9.5 0.5 11 0.5C11 2.5 9.5 3.5 8 3.5Z" fill="#111"/></svg>';
      for (const m of C.menu) u.el('span', '', bar, m);
      u.el('span', 'clock', bar, 'Mon Mar 22   10:24 AM');
      const icon = (cls, label, svg) => {
        const d = u.el('div', 'dicon ' + cls, body);
        const w = u.el('div', '', d);
        w.innerHTML = svg;
        u.el('span', '', d, label);
        return d;
      };
      icon(
        'tl1',
        'Workspace',
        '<svg width="58" height="58" viewBox="0 0 58 58"><defs><linearGradient id="folder-shade" x2="1" y2="1"><stop stop-color="#d5d5d6"/><stop offset="1" stop-color="#a4a4a8"/></linearGradient></defs><path d="M5 13H22L26 5L30 4L33 10H55V53H5Z" fill="#9c9ca2" stroke="#191919" stroke-width="1.5"/><path d="M7 12H24L28 5H30L28 13H52V50H5V16H7Z" fill="url(#folder-shade)" stroke="#222" stroke-width="1.5"/><path d="M6 17H49V49" fill="none" stroke="#eee"/><path d="M52 14V49L49 52H6" fill="none" stroke="#555"/></svg>',
      );
      icon(
        'tl2',
        'Documents',
        '<svg width="58" height="58" viewBox="0 0 58 58"><defs><linearGradient id="doc-shade" x2="1" y2="1"><stop stop-color="#d3d3d5"/><stop offset="1" stop-color="#a8a8ab"/></linearGradient></defs><path d="M10 3H51L55 17V55H5V17Z" fill="url(#doc-shade)" stroke="#171717" stroke-width="1.6"/><path d="M10 4L7 15H52L49 4M5 18H54M6 54H51V20" fill="none" stroke="#eee"/><path d="M5 17H55M20 20H39V26H20Z" fill="#191919" stroke="#222"/><path d="M20 26H39" stroke="#eee"/><path d="M53 20V53" stroke="#555"/></svg>',
      );
      icon(
        'tr',
        'Applications',
        '<div class="tile"><svg width="76" height="74" viewBox="0 0 76 74"><g transform="rotate(-22 38 37)"><path d="M20 14H55L58 51L42 65L16 45Z" fill="#111" stroke="#ddd" stroke-width="1.4"/><path d="M20 14L16 45L42 65L43 44L55 14M16 45L43 44L58 51" fill="none" stroke="#747477"/><g fill="none" stroke="#e5e5e5" stroke-width="1.6"><path d="M23 31V18L33 31V18M36 18H47M36 24H45M36 31H47M23 34L35 47M35 34L23 47M38 34H53M45 34V48"/></g></g></svg></div>',
      );
      icon(
        'br',
        'Trash',
        '<svg width="56" height="66" viewBox="0 0 56 66"><defs><linearGradient id="trash-shade"><stop stop-color="#a6a6aa"/><stop offset=".45" stop-color="#ddd"/><stop offset="1" stop-color="#939398"/></linearGradient></defs><path d="M7 13L10 59Q28 67 46 59L49 13Z" fill="url(#trash-shade)" stroke="#222" stroke-width="1.5"/><ellipse cx="28" cy="12" rx="24" ry="6" fill="#bdbdc1" stroke="#222" stroke-width="1.5"/><path d="M22 8V5Q28 2 34 5V8M7 12Q28 19 49 12" fill="none" stroke="#222"/><path d="M13 22L15 57M21 23L22 60M29 23V61M37 23L36 60M44 22L42 57" stroke="#eee" stroke-width="3"/><path d="M13 22L15 57M21 23L22 60M29 23V61M37 23L36 60M44 22L42 57" stroke="#333" stroke-width="1.3"/></svg>',
      );
      const dlg = u.el('section', 'dialog', body);
      const tt = u.el('div', 'dtitle', dlg);
      const cl = u.el('button', 'dclose', tt, '×');
      cl.type = 'button';
      cl.onclick = () => env.log('window-control', { label: 'close' });
      u.el('span', '', tt, C.title);
      const content = u.el('div', 'dbody', dlg);
      const note = u.el('section', 'task-note', content);
      u.el('div', 'note-label', note, '');
      u.el('div', 'instruction', note, ctx.instruction);
      if (display === 'hidden') {
        note.style.visibility = 'hidden';
        note.classList.add('instruction-hidden');
      } else if (display === 'panel') {
        note.classList.add('instruction-panel');
        body.appendChild(note);
      } else if (display === 'toast') {
        note.classList.add('instruction-toast');
        body.appendChild(note);
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      }
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'dfoot', content);
      const clear = u.el('button', 'nbtn clear', footer, 'Clear');
      clear.type = 'button';
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', collides ? 'nbtn chrome-xtra chrome-pq' : 'nbtn chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'chrome-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide && collide.where === 'title') decoyBtn(tt, collide.text, true);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'title') submit = endBtn(tt, 'nbtn chrome-end chrome-title-end', label);
        else if (placement === 'footer') submit = endBtn(footer, 'nbtn submit', label);
        else if (placement === 'link') submit = endBtn(footer, 'chrome-link', label + ' ›');
        else if (placement === 'icon') {
          submit = endBtn(footer, 'nbtn submit chrome-icon', '✓');
          submit.setAttribute('aria-label', label);
          submit.title = label;
        }
        if (collide && collide.where === 'footer') decoyBtn(footer, collide.text, true);
      }
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
