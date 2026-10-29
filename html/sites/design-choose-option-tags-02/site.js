(function () {
  'use strict';
  const C = { site: 'design-choose-option-tags-02' };
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        content = ctx.content || {},
        rng = ctx.rng,
        body = document.body;
      body.classList.add('irix-window');
      const title = u.el('header', 'irix-titlebar', body);
      u.el('span', 'irix-app-icon', title, '◈');
      u.el('strong', 'irix-title', title, 'World Places　—　Catalog');
      u.el('span', 'irix-win-controls', title, '−　□　×');
      const menu = u.el('nav', 'irix-menubar', body);
      ['File', 'Edit', 'View', 'Places', 'Tools', 'Window', 'Help'].forEach((x, i) => {
        const a = u.el('span', 'irix-menu-item', menu, x);
        if (i === 0) a.classList.add('first');
      });
      const toolbar = u.el('div', 'irix-toolbar', body);
      const toolset = [
        ['◉', 'Open'],
        ['▱', 'New'],
        ['▤', 'Properties'],
        ['♜', 'Delete'],
        ['⌕', 'Find'],
        ['◉◉', 'Browse'],
      ];
      toolset.forEach(([icon, text], i) => {
        if (i === 4 || i === 5) {
          const sep = u.el('i', 'irix-sep', toolbar);
        }
        const b = u.el('div', 'irix-tool', toolbar);
        u.el('span', 'irix-tool-icon', b, icon);
        u.el('span', '', b, text);
      });
      const mode0 = ctx.display || 'hidden',
        width = window.innerWidth,
        height = window.innerHeight;
      let mode = mode0;
      if (mode === 'panel' && width < 1120) mode = 'header';
      if (mode === 'toast' && height < 690) mode = 'header';
      const rngEnd = rng.fork('chrome/end'),
        rngCollide = rng.fork('chrome/collide');
      const labels = (
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const decoys = (
        Array.isArray(content.DECOY_LABELS) && content.DECOY_LABELS.length
          ? content.DECOY_LABELS
          : ['Help', 'Feedback', 'Preview', 'Save draft']
      ).map(labelOf);
      let placement = null,
        label = null;
      if (!ctx.finish) {
        if (rngEnd.bool(0.5)) {
          placement = 'header';
          label = 'Continue';
        } else {
          placement = rngEnd.pick(['header', 'footer', 'link', 'icon']);
          const alternatives = labels.filter((x) => x.toLowerCase() !== 'continue');
          label = alternatives.length ? rngEnd.pick(alternatives) : 'Done';
        }
      }
      let collide = null;
      if (!ctx.finish && rngCollide.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.toLowerCase() !== String(label).toLowerCase()))];
        if (pool.length) collide = { text: rngCollide.pick(pool), where: 'header' };
      }
      const toolButton = (parent, text, role, cls) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        if (role) {
          b.dataset.role = role;
          b.setAttribute('aria-label', text);
          b.title = text;
          b.addEventListener('click', () => ctx.submit());
        } else {
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
        return b;
      };
      const endLabels = u.el('div', 'irix-end-tools', toolbar);
      if (collide) toolButton(endLabels, collide.text, null, 'irix-button irix-xtra');
      let submit = null;
      if (!ctx.finish && placement === 'header')
        submit = toolButton(endLabels, label, 'submit', 'irix-button irix-continue');
      const tabs = u.el('nav', 'irix-tabs', body);
      ['Overview', 'Details', 'Tags', 'Media', 'Map', 'References'].forEach((x, i) => {
        const t = u.el('div', 'irix-tab', tabs, x);
        if (i === 1) t.classList.add('active');
      });
      if (mode === 'header') {
        const note = u.el('div', 'irix-instruction irix-header-note', body);
        u.el('b', '', note, 'Task');
        u.el('span', '', note, ctx.instruction);
      }
      if (mode === 'toast') {
        const note = u.el('div', 'irix-instruction irix-toast', body);
        u.el('b', '', note, 'Task');
        u.el('span', '', note, ctx.instruction);
      }
      const workspace = u.el('div', 'irix-workspace', body);
      const places = u.el('aside', 'irix-places', workspace);
      u.el('h2', 'irix-pane-title', places, 'Places');
      if (mode === 'panel') {
        const p = u.el('div', 'irix-instruction irix-panel-note', places);
        u.el('b', '', p, 'Instructions');
        u.el('span', '', p, ctx.instruction);
      }
      const list = u.el('div', 'irix-place-list', places);
      [
        'Abidjan',
        'Bangkok',
        'Barcelona',
        'Gaborone',
        'Hanoi',
        'Istanbul',
        'Johannesburg',
        'Katowice',
        'Lima',
        'Manila',
        'Nairobi',
        'Osaka',
        'Reykjavik',
        'Rotterdam',
        'Saint Petersburg',
        'Seoul',
        'Singapore',
        'Sydney',
        'Tokyo',
      ].forEach((name, i) => {
        const row = u.el('div', 'irix-place-row' + (i === 3 ? ' selected' : ''), list);
        u.el('span', 'irix-thumb', row, ['▥', '▦', '▧', '▤'][i % 4]);
        u.el('span', '', row, name);
      });
      const main = u.el('main', 'irix-main', workspace),
        stage = u.el('div', 'irix-stage', main);
      const inspector = u.el('aside', 'irix-inspector', workspace);
      u.el('h2', 'irix-pane-title', inspector, 'Properties');
      const table = u.el('div', 'irix-props', inspector);
      [
        ['Name', 'Gaborone'],
        ['Country', 'Botswana'],
        ['Type', 'City'],
        ['Population', '246,391'],
        ['Elevation', '1,008 m'],
        ['Time zone', 'UTC+2'],
        ['Coordinates', '24.6282° S, 25.9231° E'],
      ].forEach(([k, v]) => {
        const row = u.el('div', 'irix-prop-row', table);
        u.el('span', '', row, k);
        u.el('span', '', row, v);
      });
      const map = u.el('div', 'irix-map', inspector);
      u.el('span', 'irix-map-shape', map, '◈');
      u.el('i', 'irix-map-pin', map, '•');
      const footer = u.el('footer', 'irix-footer', body);
      if (!ctx.finish && placement !== 'header') {
        if (placement === 'icon') {
          submit = toolButton(footer, '✓', 'submit', 'irix-button irix-icon-end');
          submit.title = 'OK';
          submit.setAttribute('aria-label', 'OK');
        } else if (placement === 'link') {
          submit = u.el('a', 'irix-link-end', footer, label + ' ›');
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', label);
          submit.title = label;
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else submit = toolButton(footer, label, 'submit', 'irix-button irix-footer-end');
      }
      const fr = rng.fork('chrome/filler');
      if (!ctx.finish && fr.bool(0.22)) {
        const b = u.el('button', 'irix-button irix-xtra', footer, fr.pick(decoys));
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: b.textContent }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'irix-overlay irix-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'Cookies are used to preserve your catalog preferences.',
        toast: 'Catalog changes have been recorded.',
        chat: 'Catalog help　 How can we assist?',
        promo: 'Discover the new World Places collection.',
        banner: 'Catalog maintenance is scheduled for tonight.',
      };
      u.el('div', 'irix-overlay-copy', el, texts[ctx.kind]);
      const dismiss = u.el('button', 'irix-button irix-continue', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
