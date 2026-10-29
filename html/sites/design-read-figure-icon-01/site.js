(function () {
  'use strict';
  env.site({
    name: 'design-read-figure-icon-01',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && window.innerWidth < 1200) display = 'header';
      body.className = 'aqua instruction-' + display + (ctx.finish ? ' finish-mode' : '');
      const app = u.el('main', 'app', body),
        top = u.el('header', 'top', app);
      const wc = u.el('div', 'native-window-controls', top);
      for (const [kind, color] of [
        ['close', '#f04d4d'],
        ['min', '#ffbd36'],
        ['max', '#34c759'],
      ]) {
        const dot = u.el('i', 'aqua-dot ' + kind, wc);
        dot.style.setProperty('--dot', color);
      }
      u.el('span', '', top, 'Icon Organizer');
      const center = u.el('div', 'center', app);
      if (display === 'header') u.el('div', 'brief', center, ctx.instruction);
      const tabs = u.el('nav', 'aqua-tabs', center);
      for (const t of ['Icons', 'List', 'Details', 'Preview'])
        u.el('span', 'aqua-tab' + (t === 'Icons' ? ' active' : ''), tabs, t);
      const stage = u.el('section', 'stage', center),
        aside = u.el('aside', 'aside', app);
      if (display === 'panel') {
        u.el('b', 'episode-title', aside, 'Task instructions');
        u.el('p', 'episode-instruction', aside, ctx.instruction);
      }
      u.el('b', '', aside, 'Icon Counts');
      const rows = [
        ['▤', 'Documents', '6'],
        ['▰', 'Folders', '8'],
        ['▧', 'Images', '7'],
        ['♫', 'Music', '6'],
        ['▥', 'Movies', '4'],
        ['🌐', 'Web Links', '5'],
        ['⚙', 'Applications', '8'],
        ['★', 'Favorites', '6'],
      ];
      for (const [ico, name, n] of rows) {
        const row = u.el('div', 'count-row', aside);
        u.el('span', 'count-icon', row, ico);
        u.el('span', '', row, name);
        u.el('span', 'count-num', row, n);
      }
      let submit = null;
      const labels = ctx.content?.END_LABELS || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const name = (x) => (typeof x === 'string' ? x : x?.label || x?.text || String(x));
      const r = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      let label = name(labels.find((x) => name(x).toLowerCase() === 'ok') || labels[0]),
        place = ctx.finish ? null : r.pick(['toolbar', 'footer', 'footer', 'icon']);
      const button = (par, cls, text, fn) => {
        const b = u.el('button', cls, par, text);
        b.type = 'button';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.onclick = fn;
        return b;
      };
      if (place === 'toolbar') submit = button(top, 'episode-toolbar', 'OK', ctx.submit);
      if (place === 'icon') submit = button(top, 'episode-icon', '✓', ctx.submit);
      if (place === 'footer') {
        const foot = u.el('footer', 'bottom', app);
        submit = button(foot, 'submit', label, ctx.submit);
      }
      if (!ctx.finish && cr.bool(0.3)) {
        const decoy = button(top, 'episode-xtra', 'All set', () =>
          env.log('decoy', { label: 'All set', collide: true }),
        );
      }
      if (display === 'toast') {
        const toast = u.el('div', 'episode-toast', body);
        u.el('b', '', toast, 'Task note');
        u.el('p', '', toast, ctx.instruction);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el(
        'span',
        '',
        el,
        ctx.kind === 'cookie'
          ? 'This app uses cookies.'
          : ctx.kind === 'chat'
            ? 'Need help?'
            : ctx.kind === 'promo'
              ? 'Discover more tools.'
              : 'An update is available.',
      );
      const b = u.el('button', '', el, 'Dismiss');
      b.onclick = ctx.dismiss;
      return { el, dismiss: b };
    },
  });
})();
