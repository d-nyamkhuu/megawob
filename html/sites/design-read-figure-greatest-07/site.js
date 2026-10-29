(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-greatest-07',
    'task': 'read-figure',
    'scenario': 'greatest',
    'style': 'carbon',
    'title': 'Number Cards - Practice',
    'menu': 'File     Edit     View     Help',
    'note': '',
    'layout': '',
    'subtitle': '',
    'aside': '',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const display =
        (ctx.display === 'panel' && document.documentElement.clientWidth < 1260) ||
        (ctx.display === 'toast' && document.documentElement.clientHeight < 700)
          ? 'header'
          : ctx.display;
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display;
      document.body.classList.toggle('episode-finish', !!ctx.finish);
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink', 'carbon'].includes(C.style)) {
        const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
        u.svg(
          'rect',
          {
            x: 3,
            y: 2,
            width: 20,
            height: 22,
            rx: C.style === 'mint' ? 0 : 3,
            fill:
              C.style === 'mint'
                ? 'none'
                : C.style === 'dark'
                  ? '#8266ce'
                  : C.style === 'electron'
                    ? '#ee8520'
                    : '#d7e2e8',
            stroke: 'currentColor',
            'stroke-width': 1.5,
          },
          icon,
        );
        u.svg(
          'path',
          { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 },
          icon,
        );
      }
      u.el('span', '', top, C.title);
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink', 'carbon'].includes(C.style)) {
        const wc = u.el('div', 'native-window-controls', top);
        for (const kind of ['min', 'max', 'close']) {
          const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
          u.svg(
            'path',
            {
              d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-width': 1.5,
            },
            svg,
          );
        }
      }
      if (C.subtitle) u.el('small', '', top, C.subtitle);
      if (C.menu) u.el('nav', 'menu', top, C.menu);
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, display === 'header' ? ctx.instruction : '');
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      if (display === 'panel' || display === 'toast') {
        const note = u.el('aside', 'episode-note ' + display, center, ctx.instruction);
        note.setAttribute('aria-label', 'Task instructions');
      }
      const help = u.el('button', 'dock-help', footer);
      help.type = 'button';
      help.setAttribute('aria-label', 'Help');
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      help.innerHTML =
        '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="15"/><text x="20" y="27" text-anchor="middle">?</text></svg><span>Help</span>';
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide'),
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
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
        const referenceEnd = er.bool(0.5),
          label = referenceEnd ? 'Submit' : String(er.pick(labels.filter((x) => x !== 'Submit')));
        const placement = referenceEnd ? 'footer' : er.pick(['header', 'dock']);
        const addButton = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', text);
          b.title = text;
          b.addEventListener('click', ctx.submit);
          return b;
        };
        if (placement === 'footer') {
          submit = addButton(footer, 'submit', label);
        } else if (placement === 'header') {
          top.classList.add('has-header-end');
          submit = addButton(top, 'submit carbon-end-header', label);
        } else {
          submit = addButton(footer, 'submit carbon-end-dock', label);
          submit.textContent = '✓';
          submit.classList.add('carbon-end-icon');
        }
        if (cr.bool(0.3)) {
          const candidates = labels
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
            .filter((x) => x && String(x).toLowerCase() !== label.toLowerCase());
          if (candidates.length) {
            const d = u.el('button', 'carbon-xtra', footer, String(cr.pick(candidates)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
