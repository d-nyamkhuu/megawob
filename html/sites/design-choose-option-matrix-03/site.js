(function () {
  'use strict';
  const C = { site: 'design-choose-option-matrix-03' };
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
        W = innerWidth,
        H = innerHeight;
      const frame = u.el('div', 'wb-frame', document.body);
      const top = u.el('header', 'wb-titlebar', frame);
      u.el('span', 'wb-appicon', top, '⌘');
      u.el('span', 'wb-appname', top, 'Course Manager');
      u.el('span', 'wb-winbtn', top, '▁');
      u.el('span', 'wb-winbtn wb-close', top, '×');
      const menu = u.el('nav', 'wb-menubar', frame);
      ['Project', 'Edit', 'View', 'Records', 'Tools', 'Window', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const body = u.el('div', 'wb-body', frame),
        rail = u.el('aside', 'wb-rail', body);
      [
        ['▣', 'Courses'],
        ['▤', 'Feedback'],
        ['♟', 'Students'],
        ['▥', 'Reports'],
        ['⚙', 'Settings'],
      ].forEach((x, i) => {
        const a = u.el('div', 'wb-navitem' + (i === 1 ? ' selected' : ''), rail);
        u.el('b', '', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const records = u.el('section', 'wb-records', body),
        rt = u.el('div', 'wb-pane-title', records, 'Feedback Records'),
        list = u.el('div', 'wb-record-list', records);
      const names = [
        'Anderson, Lisa',
        'Brown, Mark',
        'Chen, Wei',
        'Davis, Pat',
        'Evans, Robin',
        'Fisher, Alex',
        'Garcia, Maria',
        'Hall, James',
        'Harris, Elise',
        'Ito, Ken',
        'Jackson, Paula',
        'Kim, Daniel',
        'Lewis, Nora',
        'Martin, Chris',
        'Nguyen, Anh',
        'Patel, Ravi',
        'Roberts, Sam',
        'Taylor, Morgan',
        'Thomas, Jordan',
        'White, Casey',
      ];
      names.forEach((n, i) => {
        const row = u.el('div', 'wb-record' + (i === 4 ? ' selected' : ''), list);
        u.el('b', '', row, '▤');
        u.el('span', '', row, n);
        u.el('time', '', row, `${((12 + i * 2 - 1) % 31) + 1} ${i < 10 ? 'Mar' : 'Apr'} 1990`);
      });
      const contentRoot = u.el('div', 'wb-workspace', body),
        width = W,
        height = H;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : W < 1260
                ? 'hidden'
                : 'header';
      if ((mode === 'panel' && width < 1260) || (mode === 'toast' && height < 700)) mode = 'header';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'wb-brief') u.el('h2', '', b, 'Instructions');
        u.el('div', 'wb-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(contentRoot, 'wb-header-note');
      if (mode === 'panel') briefing(records, 'wb-brief');
      const summary = u.el('section', 'wb-summary', contentRoot);
      u.el('div', 'wb-pane-title', summary, 'Course Feedback');
      const summ = u.el('div', 'wb-summary-body', summary);
      u.el('div', 'wb-grad', summ, '🎓');
      const meta = u.el('div', 'wb-course-meta', summ);
      u.el('strong', '', meta, 'Introduction to Computer Graphics');
      u.el('span', '', meta, 'Course Code:  CG101');
      u.el('span', '', meta, 'Dates:  12 Mar 1990 – 16 Mar 1990');
      u.el('span', '', meta, 'Instructor:  Thomas Blake');
      const student = u.el('div', 'wb-student-meta', summ);
      u.el('span', '', student, 'Student:   Evans, Robin');
      u.el('span', '', student, 'Date:      20 Mar 1990');
      u.el('span', '', student, 'Location:  Lab 3');
      u.el('span', '', student, 'Format:    In person');
      const task = u.el('section', 'wb-task', contentRoot);
      u.el('div', 'wb-pane-title', task, 'Your Feedback');
      const stage = u.el('main', 'ds-stage', task);
      if (mode === 'toast') {
        const note = briefing(contentRoot, 'ds-toast');
        contentRoot.insertBefore(note, task);
      }
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
          label = 'Continue';
        } else {
          placement = endRng.pick(['footer', 'link', 'header']);
          const alternatives = labels.filter((x) => x.trim().toLowerCase() !== 'continue');
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
      const foot = u.el('footer', 'ds-footer', frame);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') {
          let tools = document.querySelector('.wb-header-note');
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
