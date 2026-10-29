(function () {
  'use strict';
  const C = {
    site: 'design-choose-option-chips-01',
    brand: 'Team Directory',
    menu: 'File|Edit|View|Tools|Help',
    rail: 'People|Projects|Calendar|Reports|Settings',
  };
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
        rng = ctx.rng;
      document.body.classList.add('gem-window');
      const shell = u.el('div', 'gem-shell', document.body);
      const top = u.el('header', 'ds-top', shell);
      const sys = u.el('button', 'gem-system', top, '☰');
      sys.type = 'button';
      sys.setAttribute('aria-label', 'System menu');
      u.el('span', 'ds-brand', top, C.brand);
      const win = u.el('div', 'gem-window-controls', top);
      ['—', '□', '×'].forEach((x, i) => {
        const b = u.el('button', '', win, x);
        b.type = 'button';
        b.setAttribute('aria-label', ['Minimize', 'Maximize', 'Close'][i]);
      });
      const nav = u.el('nav', 'ds-menu', shell);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', shell),
        rail = u.el('aside', 'ds-rail', body);
      const icons = [
        '<circle cx="16" cy="9" r="5"/><circle cx="7" cy="13" r="3.5"/><circle cx="25" cy="13" r="3.5"/><path d="M6 28c0-6 4-10 10-10s10 4 10 10v2H6zM1 28c0-4 2-7 6-8M31 28c0-4-2-7-6-8"/>',
        '<path d="M2 9h12l4 4h12v16H2z"/><path d="M2 9V6h12l4 4"/>',
        '<rect x="3" y="3" width="26" height="27"/><path d="M3 10h26M10 3v27M18 3v27M3 18h26"/>',
        '<rect x="5" y="2" width="22" height="28"/><path d="M10 9h12M10 14h12M10 19h12M10 24h9"/>',
        '<circle cx="16" cy="16" r="6"/><path d="M14 1h4l1 4 3 1 3-2 3 3-2 3 1 3 4 1v4l-4 1-1 3 2 3-3 3-3-2-3 1-1 4h-4l-1-4-3-1-3 2-3-3 2-3-1-3-4-1v-4l4-1 1-3-2-3 3-3 3 2 3-1z"/>',
      ];
      C.rail.split('|').forEach((t, i) => {
        const item = u.el('div', 'gem-nav-item' + (i === 0 ? ' selected' : ''), rail);
        const box = u.el('span', 'gem-nav-icon', item);
        box.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true">' + icons[i] + '</svg>';
        u.el('span', '', item, t);
      });
      const contentRoot = u.el('div', 'ds-content', body),
        width = window.innerWidth,
        height = window.innerHeight;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'header';
      if ((mode === 'panel' && width < 1100) || (mode === 'toast' && height < 700)) mode = 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') {
        const note = briefing(shell, 'ds-header-note');
        shell.insertBefore(note, body);
      }
      if (mode === 'toast') briefing(contentRoot, 'gem-toast');
      const main = u.el('div', 'ds-main', contentRoot),
        stage = u.el('main', 'ds-stage', main);
      const staticForm = u.el('div', 'gem-form-static', main);
      const field = (parent, title, cls) => {
        const f = u.el('div', 'gem-static-field ' + (cls || ''), parent);
        u.el('label', '', f, title);
        const box = u.el('div', 'gem-static-control', f);
        if (cls === 'arrow') u.el('span', 'gem-arrow', box, '');
        return f;
      };
      const primary = u.el('div', 'gem-primary', staticForm),
        row1 = u.el('div', 'gem-static-row', primary),
        row2 = u.el('div', 'gem-static-row', primary);
      field(row1, 'Name');
      field(row1, 'Role', 'arrow');
      field(row2, 'Department', 'arrow');
      field(row2, 'Location', 'arrow');
      u.el('div', 'gem-divider', staticForm);
      const secondary = u.el('div', 'gem-secondary', staticForm);
      const avail = field(secondary, 'Availability', 'arrow');
      avail.querySelector('.gem-static-control').insertAdjacentText('afterbegin', 'Any');
      const emp = field(secondary, 'Employment Type', 'arrow');
      emp.querySelector('.gem-static-control').insertAdjacentText('afterbegin', 'Any');
      const panel = u.el('aside', 'gem-help', main),
        ph = u.el('div', 'gem-help-head', panel);
      u.el('strong', '', ph, 'Expertise');
      const book = u.el('span', 'gem-book', ph);
      book.innerHTML =
        '<svg viewBox="0 0 40 32" aria-hidden="true"><path d="M3 4c7-2 13 0 17 4v21c-4-4-10-6-17-4zM37 4c-7-2-13 0-17 4v21c4-4 10-6 17-4z"/><path d="M20 8v21"/></svg>';
      const helpBody = u.el('div', 'gem-help-body', panel);
      if (mode === 'panel') {
        briefing(helpBody, 'gem-panel-instruction');
      } else {
        u.el(
          'p',
          'gem-help-intro',
          helpBody,
          'Choose one or more areas of expertise to match people with relevant experience.',
        );
      }
      u.el('div', 'gem-rule', helpBody);
      u.el('h2', '', helpBody, 'About this field');
      u.el(
        'p',
        'gem-help-copy',
        helpBody,
        'Select all areas that apply. You can choose multiple options. The selected expertise will appear as chips in the field above.',
      );
      const tip = u.el('div', 'gem-tip', panel),
        bulb = u.el('span', 'gem-bulb', tip);
      bulb.innerHTML =
        '<svg viewBox="0 0 40 48" aria-hidden="true"><path d="M20 3a13 13 0 0 0-8 23c2 2 3 4 3 7h10c0-3 1-5 3-7A13 13 0 0 0 20 3zM15 36h10M16 40h8M18 44h4"/><path d="M20 0v-3M4 8 1 5M36 8l3-3M3 20H0M37 20h3"/></svg>';
      const tiptext = u.el('div', '', tip);
      u.el('strong', '', tiptext, 'Tip');
      u.el(
        'p',
        '',
        tiptext,
        'You can select multiple options. The chosen expertise will appear as chips in the field above.',
      );
      const endRng = rng.fork('chrome/end'),
        collideRng = rng.fork('chrome/collide');
      const labels = (
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const decoyLabels = (
        Array.isArray(content.DECOY_LABELS) && content.DECOY_LABELS.length
          ? content.DECOY_LABELS
          : ['Help', 'Feedback', 'Preview', 'Save draft', 'Reset view']
      ).map(labelOf);
      let placement = null,
        label = null;
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'footer';
          label = 'OK';
        } else {
          placement = endRng.pick(['footer', 'link', 'header']);
          const alternatives = labels.filter((x) => !['ok', 'submit'].includes(x.trim().toLowerCase()));
          label = alternatives.length ? endRng.pick(alternatives) : 'Done';
        }
      }
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (pool.length) collide = { text: collideRng.pick(pool), where: collideRng.pick(['header', 'footer']) };
      }
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'gem-button gem-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'gem-endlink' ? 'a' : 'button', cls, parent, text);
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
      const foot = u.el('footer', 'ds-footer', shell);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          let tools = document.querySelector('.gem-header-tools');
          if (!tools) tools = u.el('div', 'gem-header-tools', top);
          if (collide && collide.where === 'header') decoyBtn(tools, collide.text, true);
          submit = endBtn(tools, 'gem-button gem-submit-head', label);
        } else {
          if (collide && collide.where === 'header') {
            const tools = u.el('div', 'gem-header-tools', top);
            decoyBtn(tools, collide.text, true);
          }
          if (collide && collide.where === 'footer') decoyBtn(foot, collide.text, true);
          submit =
            placement === 'link'
              ? endBtn(foot, 'gem-endlink', `${label} ›`)
              : endBtn(foot, 'gem-button gem-submit', label);
        }
        if (placement === 'footer' && label === 'OK' && !collide) decoyBtn(foot, 'Check', false);
      }
      const fillerRng = rng.fork('chrome/filler');
      if (!ctx.finish && fillerRng.bool(0.22)) decoyBtn(foot, fillerRng.pick(decoyLabels), false);
      if (mode === 'header' && shell.querySelector('.ds-header-note'))
        shell.querySelector('.ds-header-note').classList.add('gem-header-mode');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
