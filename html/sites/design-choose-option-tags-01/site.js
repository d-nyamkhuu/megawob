(function () {
  'use strict';
  const C = {
    site: 'design-choose-option-tags-01',
    brand: 'People Directory',
    title: 'Edit Person',
    instruction: 'header',
    rail: '',
    menu: '',
    briefTitle: 'Instructions',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const links = u.el('nav', 'ds-links', top);
      ['New Person', 'Import', 'Help'].forEach((t, i) => {
        if (i) u.el('i', '', links, '|');
        const a = u.el('a', '', links, t);
        a.href = '#';
      });
      const width = window.innerWidth,
        height = window.innerHeight;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : C.instruction;
      if ((mode === 'panel' && width < 1260) || (mode === 'toast' && height < 700)) mode = 'header';
      const contentRoot = u.el('div', 'ds-content', document.body);
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(contentRoot, 'ds-header-note');
      const body = u.el('div', 'ds-body', contentRoot);
      const people = u.el('aside', 'ds-people', body);
      u.el('h2', '', people, 'All People (24)');
      const list = u.el('div', 'ds-person-list', people);
      [
        'Adams, Karen',
        'Bell, Thomas',
        'Carter, Monica',
        'Chen, Daniel',
        'Davis, Ruth',
        'Evans, Paul',
        'Foster, Linda',
        'Garcia, Miguel',
        'Harris, Naomi',
        'Jackson, Robert',
        'Kim, Alice',
        'Lee, Steven',
        'Martin, Patricia',
        'Nguyen, Hannah',
        'Patel, Arjun',
        'Roberts, Julia',
        'Ross, Kevin',
        'Turner, Lisa',
        'Walker, Brian',
        'White, Angela',
        'Wilson, Derek',
        'Young, Rachel',
        'Zhang, Wen',
        'Clark, Nathan',
      ].forEach((n, i) => {
        const a = u.el('a', i === 8 ? 'selected' : '', list, n);
        a.href = '#';
      });
      const center = u.el('section', 'ds-window', body);
      u.el('h2', 'ds-window-title', center, 'Edit Person');
      const fake = u.el('div', 'ds-fake-form', center);
      [
        ['First name', 'Naomi'],
        ['Last name', 'Harris'],
        ['Email', 'naomi.harris@company.com'],
        ['Phone', '(415) 555-0198'],
        ['Department', 'People Operations'],
        ['Title', 'Recruiter'],
        ['Location', 'San Francisco'],
      ].forEach((r, i) => {
        const row = u.el('div', 'ds-fake-row', fake);
        u.el('label', '', row, r[0] + ':');
        const val = u.el('div', 'ds-fake-value', row, r[1]);
        if (i === 4 || i === 6) val.classList.add('select');
      });
      const stage = u.el('main', 'ds-stage', center);
      const notes = u.el('div', 'ds-fake-notes', center);
      u.el('label', '', notes, 'Notes:');
      u.el('div', '', notes, 'Focuses on technical hiring and candidate experience.');
      const recent = u.el('aside', 'ds-recent', body);
      u.el('h2', '', recent, 'Recent People');
      [
        ['Harris, Naomi', 'Apr 12, 1994'],
        ['Kim, Alice', 'Apr 10, 1994'],
        ['Garcia, Miguel', 'Apr 08, 1994'],
        ['Evans, Paul', 'Apr 05, 1994'],
        ['Carter, Monica', 'Apr 02, 1994'],
      ].forEach((r) => {
        const row = u.el('div', 'ds-recent-row', recent);
        const a = u.el('a', '', row, r[0]);
        a.href = '#';
        u.el('span', '', row, r[1]);
      });
      if (mode === 'panel') {
        const note = briefing(recent, 'ds-brief');
        recent.insertBefore(note, recent.children[1] || null);
      }
      if (mode === 'toast') briefing(recent, 'ds-toast');
      const dock = u.el('nav', 'ds-dock', contentRoot);
      ['◉　 People', '▦　 Departments', '▤　 Jobs', '▦　 Interviews', '▣　 Reports'].forEach((t) =>
        u.el('button', '', dock, t),
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
          label = 'Submit';
        } else {
          placement = endRng.pick(['footer', 'link', 'header']);
          const alternatives = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
          label = alternatives.length ? endRng.pick(alternatives) : 'Done';
        }
      }
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))];
        if (pool.length) collide = { text: collideRng.pick(pool), where: collideRng.pick(['header', 'footer']) };
      }
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
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
      const foot = u.el('footer', 'ds-footer', contentRoot);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          let tools = document.querySelector('.ds-header-note');
          if (!tools) {
            tools = u.el('div', 'ds-header-tools', top);
            top.classList.add('ds-tools-visible');
          }
          if (collide && collide.where === 'header') decoyBtn(tools, collide.text, true);
          submit = endBtn(tools, 'ds-submit ds-submit-head', label);
        } else {
          if (collide && collide.where === 'header') {
            const tools = u.el('div', 'ds-header-tools', top);
            top.classList.add('ds-tools-visible');
            decoyBtn(tools, collide.text, true);
          }
          if (collide && collide.where === 'footer') decoyBtn(foot, collide.text, true);
          submit = placement === 'link' ? endBtn(foot, 'ds-endlink', `${label} ›`) : endBtn(foot, 'ds-submit', label);
        }
      }
      // Optional non-colliding filler controls use their own deterministic stream.
      const fillerRng = rng.fork('chrome/filler');
      if (!ctx.finish && fillerRng.bool(0.22)) decoyBtn(foot, fillerRng.pick(decoyLabels), false);
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
