(function () {
  'use strict';
  const C = {
    site: 'design-solve-puzzle-hot-cold-07',
    task: 'solve-puzzle',
    scenario: 'hot-cold',
    style: 'office',
    title: 'Project Notes - Contoso.docx - Contoso Word',
    layout: 'word-canvas',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const placement = er.pick(['reference', 'reference', 'toolbar', 'status']);
      const endLabel = placement === 'reference' ? 'Submit' : er.pick(labels);
      const viewport = document.documentElement;
      const display =
        (ctx.display === 'panel' && viewport.clientWidth < 1200) ||
        (ctx.display === 'toast' && viewport.clientHeight < 700)
          ? 'header'
          : ctx.display;
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg(
        'rect',
        { x: 3, y: 2, width: 20, height: 22, rx: 2, fill: '#e9f3ff', stroke: '#234f86', 'stroke-width': 1.5 },
        icon,
      );
      u.svg(
        'path',
        { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: '#234f86', 'stroke-width': 1.5 },
        icon,
      );
      u.el('span', 'window-title', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const [kind, label] of [
        ['min', '−'],
        ['max', '□'],
        ['close', '×'],
      ])
        u.el('button', 'win-' + kind, wc, label).setAttribute('aria-label', kind);
      const tabs = u.el('nav', 'menu', app);
      for (const tab of ['File', 'Home', 'Insert', 'Page Layout', 'References', 'Mailings', 'Review', 'View']) {
        const b = u.el('span', 'ribbon-tab' + (tab === 'Home' ? ' active' : ''), tabs, tab);
        if (tab === 'File') b.classList.add('file-tab');
      }
      const endTools = u.el('div', 'end-tools', tabs);
      const ribbon = u.el('section', 'ribbon', app);
      const groups = [
        ['Clipboard', '📋', 'Paste', '✂', 'Cut', '▣', 'Copy', 'Format Painter'],
        ['Font', 'Calibri (Body)　⌄', '11　⌄', 'B　 I　 U', 'A̲', '🖍'],
        ['Paragraph', '☷', '≡', '↕', 'A↧Z', '¶'],
        ['Styles', 'AaBbCcDd', 'Normal　 Heading 1　 Heading 2　 Title'],
        ['Editing', '🔍', 'Find　⌄', 'Replace', 'Select　⌄'],
      ];
      for (const [name, ...items] of groups) {
        const g = u.el('div', 'ribbon-group', ribbon);
        const row = u.el('div', 'ribbon-tools', g);
        items.forEach((s, i) => u.el('span', 'ribbon-item item-' + i, row, s));
        u.el('div', 'group-caption', g, name);
      }
      const center = u.el('div', 'center', app),
        brief = u.el('div', 'brief', center, display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const footer = u.el('footer', 'bottom', app);
      u.el('span', 'status-page', footer, 'Page 1 of 1');
      u.el('span', 'status-words', footer, 'Words: 0');
      const statusSpacer = u.el('span', 'status-spacer', footer, '');
      u.el('span', 'status-view', footer, '▣　▤　▤　100%　−　━━━━●━━　＋');
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? endTools : footer;
        submit = u.el(
          placement === 'status' ? 'a' : 'button',
          'submit' + (placement === 'reference' ? '' : ' end-' + placement),
          parent,
          endLabel,
        );
        if (placement === 'status') footer.insertBefore(submit, statusSpacer);
        if (placement === 'status') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options),
            decoy = u.el('button', 'end-xtra', footer, label);
          footer.insertBefore(decoy, statusSpacer);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
