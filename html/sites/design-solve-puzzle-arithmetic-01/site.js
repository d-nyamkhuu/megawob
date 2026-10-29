(function () {
  'use strict';
  const C = {
    'site': 'design-solve-puzzle-arithmetic-01',
    'task': 'solve-puzzle',
    'scenario': 'arithmetic',
    'style': 'homepage',
    'title': 'Maple Creek',
    'menu': 'Notes  *  Friends  *  Photos  *  Little Things  *  A Brighter Day',
    'note': 'My Personal Homepage',
    'layout': 'notebook',
    'subtitle': 'My Personal Homepage',
    'aside': 'Home\nJournal\nFriends\nPhotos\nFun\nLinks',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      if (['mint', 'qt', 'dark', 'electron', 'motif', 'human', 'beos', 'gtk', 'eink'].includes(C.style)) {
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
      if (['qt', 'dark', 'electron', 'motif', 'human', 'gtk', 'eink'].includes(C.style)) {
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
      let display = ctx.display || 'header';
      if (
        (display === 'panel' && window.innerWidth < 1180) ||
        (display === 'toast' && (window.innerWidth < 1180 || window.innerHeight < 700))
      )
        display = 'header';
      document.body.classList.add('episode-' + display);
      const center = u.el('div', 'center', app),
        brief =
          display === 'hidden'
            ? null
            : u.el(
                'div',
                'brief ' + (display === 'panel' ? 'note-panel' : display === 'toast' ? 'note-toast' : 'note-header'),
                center,
                ctx.instruction,
              );
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, C.note);
      u.el('p', 'aside-copy', aside, C.aside);
      const footer = u.el('footer', 'bottom', app);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = (ctx.content && ctx.content.END_LABELS) || [
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
          ];
        const baseline = er.bool(0.5),
          placement = baseline ? 'footer' : er.pick(['badge', 'link', 'footer']),
          alternatives = labels
            .map((x) => String((x && x.label) || x))
            .filter((x) => x.trim().toLowerCase() !== 'submit'),
          chosen = baseline ? 'Submit' : er.pick(alternatives),
          label = String((chosen && chosen.label) || chosen);
        const cr = ctx.rng.fork('chrome/collide');
        let collision = null;
        if (cr.bool(0.3)) {
          const same = (x) =>
              String(x.label || x)
                .trim()
                .toLowerCase() === label.trim().toLowerCase(),
            choices = [
              ...new Set(
                labels
                  .map((x) => String(x.label || x))
                  .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()),
              ),
            ];
          if (choices.length) collision = { label: cr.pick(choices), where: cr.pick(['header', 'footer']) };
        }
        if (placement !== 'badge' || (collision && collision.where === 'footer'))
          footer.classList.add('has-end-control');
        const spot =
          placement === 'badge' ? u.el('div', 'end-spot badge-spot', top) : u.el('div', 'end-spot footer-spot', footer);
        const make = (parent, text, cls, active) => {
          const b = u.el(active && placement === 'link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'A') b.href = '#';
          else b.type = 'button';
          if (active) {
            b.setAttribute('aria-label', text);
            b.title = text;
            b.addEventListener('click', (e) => {
              e.preventDefault();
              ctx.submit();
            });
          } else {
            b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
          return b;
        };
        if (collision && collision.where === (placement === 'badge' ? 'header' : 'footer'))
          make(spot, collision.label, 'chrome-xtra', false);
        submit = make(spot, label, placement === 'link' ? 'chrome-end-link' : 'chrome-end', true);
        if (collision && collision.where !== (placement === 'badge' ? 'header' : 'footer')) {
          const other =
            collision.where === 'header'
              ? u.el('div', 'end-spot badge-spot', top)
              : u.el('div', 'end-spot footer-spot', footer);
          make(other, collision.label, 'chrome-xtra', false);
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
