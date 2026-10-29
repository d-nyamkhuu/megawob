(function () {
  'use strict';
  env.site({
    name: 'design-click-control-dialog-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const originalEnd = endRng.bool(0.5);
      const placement = originalEnd ? 'original' : endRng.pick(['toolbar', 'footer', 'link']);
      const endLabel = originalEnd ? 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const otherLabels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && otherLabels.length ? collideRng.pick(otherLabels) : null;
      document.body.className = 'ref risograph';
      const shell = u.el('main', 'shell', document.body);
      const overview = u.el('header', 'overview', shell);
      let tools = null;
      const overviewTools = () => tools || (tools = u.el('div', 'overview-actions', overview));
      u.el('h1', 'project-title', overview, 'Project Files');
      u.el('p', 'project-subtitle', overview, 'Work materials for the summer campaign.');
      u.el('span', 'item-count', overview, '4 items');
      const table = u.el('table', 'project-files', overview);
      const head = u.el('thead', '', table);
      const hr = u.el('tr', '', head);
      ['Name ▲', 'Modified', 'Size', 'Type'].forEach((t) => u.el('th', '', hr, t));
      const rows = u.el('tbody', '', table);
      [
        ['Campaign Plan.docx', 'Jun 3, 2015', '120 KB', 'Word document', 'word'],
        ['Budget.xlsx', 'Jun 2, 2015', '88 KB', 'Excel spreadsheet', 'excel'],
        ['Images', 'May 28, 2015', '—', 'Folder', 'folder'],
        ['Notes.txt', 'May 26, 2015', '4 KB', 'Text document', 'text'],
      ].forEach((data, i) => {
        const row = u.el('tr', i === 1 ? 'selected' : '', rows);
        const name = u.el('td', 'file-name', row);
        const icon = u.el('span', 'file-icon ' + data[4], name);
        icon.innerHTML =
          data[4] === 'folder'
            ? '<svg viewBox="0 0 36 40"><path fill="#eab45a" d="M2 10q0-3 3-3h10l4 5h13q2 0 2 3v20H2Z"/><path fill="#f0c06c" d="M2 15h32v20H2Z"/><path stroke="#fff7de" d="M3 14h29"/></svg>'
            : '<svg viewBox="0 0 36 40"><path fill="currentColor" d="M4 2h19l9 9v27H4Z"/><path fill="#ffffff80" d="M23 2v9h9Z"/><path stroke="#fff" stroke-width="1.5" d="M10 15h15M10 20h16M10 25h16M10 30h16"/></svg>';
        u.el('span', '', name, data[0]);
        data.slice(1, 4).forEach((t) => u.el('td', '', row, t));
      });
      const illustration = u.el('aside', 'folder-illustration', overview);
      illustration.innerHTML =
        '<svg viewBox="0 0 300 280" aria-hidden="true"><defs><filter id="ink-grain"><feTurbulence type="fractalNoise" baseFrequency=".38" numOctaves="2" seed="11"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2 0 0 0 -1.1"/><feComposite in2="SourceAlpha" operator="in"/><feBlend in="SourceGraphic" mode="screen"/></filter></defs><g transform="translate(20,-9) scale(1.06)" filter="url(#ink-grain)"><path fill="#773147" d="m184 18 69 10q7 1 7 8v82l-13-3V43l-69-13v-5q0-8 6-7Z"/><path fill="#773147" d="m145 41 88 15q7 1 7 9v64l-103-25-1-54q0-11 9-9Z"/><path fill="#2c6870" d="m52 66 67 10q8 1 8 8l2 10 23 4q9 1 9 9v99l-14 5-1-102-102-18V74q0-10 8-8Z"/><path fill="#2c6870" d="m16 94 114 19q9 1 9 11v105L17 202q-9-2-9-12L5 105q0-13 11-11Z"/></g></svg><p>Keep<br>your files<br>organized</p>';
      const work = u.el('section', 'work', shell);
      const task = u.el('section', 'task-panel', work);
      const eyebrow = u.el('div', 'task-eyebrow', task, 'YOUR TASK');
      const note = u.el('div', 'instruction', task, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.instruction.length > 100) note.classList.add('long-instruction');
      eyebrow.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const steps = u.el('ol', 'task-steps', task);
      steps.hidden = ctx.display === 'hidden';
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? overviewTools() : placement === 'original' ? task : work;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit end-' + placement, parent, endLabel);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.dataset.placement = placement;
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (collide) {
        const decoy = u.el('button', 'chrome-xtra', overviewTools(), collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const stage = u.el('div', 'stage', work);
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
