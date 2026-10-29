(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-kanban-03', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design notebook';
      const shell = u.el('div', 'shell', document.body);
      const bar = u.el('div', 'topbar', shell);
      const tabs = u.el('nav', 'notebook-tabs', bar);
      for (const name of ['Tasks', 'Calendar', 'Notes', 'Files', 'Contacts']) {
        const tab = u.el('button', 'notebook-tab' + (name === 'Tasks' ? ' active' : ''), tabs, name);
        tab.type = 'button';
        tab.onclick = () => env.log('notebook-tab', { name });
      }
      const links = u.el('div', 'toplinks', bar);
      ['Settings', 'Help', 'Sign Out'].forEach((t) => u.el('span', '', links, t));
      const endRng = ctx.rng.fork('chrome/end');
      const endPool = ctx.content && ctx.content.END_LABELS;
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const labels = endPool && endPool.length ? endPool.map(labelOf) : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const canonicalEnd = endRng.fork('placement').bool(0.5);
      const placement = ctx.finish ? null : canonicalEnd ? 'footer' : endRng.pick(['header', 'link']);
      const label = canonicalEnd ? 'Submit' : endRng.pick(labels);
      shell.classList.toggle('has-header-end', placement === 'header' || placement === 'link');
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = labels;
        const options = pool.filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      const page = u.el('div', 'page', shell);
      const note = u.el('header', 'task-note', page);
      if (ctx.display === 'panel' || ctx.display === 'toast') {
        u.el('div', 'note-heading', note, ctx.display === 'panel' ? 'Task details' : 'Task reminder');
      }
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const close = u.el('button', 'note-close', note, '×');
        close.type = 'button';
        close.title = 'Close reminder';
        close.setAttribute('aria-label', 'Close reminder');
        close.onclick = () => { note.style.visibility = 'hidden'; };
      }
      const stage = u.el('main', 'stage', page);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', page);
      const clear = u.el('button', 'clear-all', footer, 'Clear All');
      clear.type = 'button';
      let submit = null;
      if (!ctx.finish) {
        const target = placement === 'footer' ? footer : links;
        const cls = placement === 'link' ? 'end-link' : 'submit';
        submit = u.el('button', cls, target, label);
        submit.type = 'button'; submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.onclick = () => ctx.submit();
      }
      if (collide) {
        const decoy = u.el('button', 'end-xtra', footer, collide);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      // Fit long instructions in the reserved note strip without covering the lanes or tabs.
      const text = note.querySelector('.instruction');
      let heading = note.querySelector('.note-heading');
      let fs = parseFloat(getComputedStyle(text).fontSize);
      let available = note.clientHeight - (heading ? heading.offsetHeight : 0) - 12;
      while (!note.hidden && fs > 12 && text.offsetHeight > available) text.style.fontSize = --fs + 'px';
      // A long reminder can use the full-width header strip on compact screens.
      if (!note.hidden && text.scrollHeight > available && heading) {
        note.classList.remove('instruction-panel', 'instruction-toast');
        heading.remove();
        const close = note.querySelector('.note-close');
        if (close) close.remove();
        text.style.fontSize = '';
        fs = parseFloat(getComputedStyle(text).fontSize);
        available = note.clientHeight - 12;
        while (fs > 12 && text.scrollHeight > available) text.style.fontSize = --fs + 'px';
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = { cookie: 'Privacy notice', toast: 'Changes saved', chat: 'Help', promo: 'Notebook news', banner: 'Notice' };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el('p', '', box, ctx.kind === 'cookie' ? 'Allow optional cookies for this page?' : 'You can close this note to return to the activity.');
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    }
  });
})();
