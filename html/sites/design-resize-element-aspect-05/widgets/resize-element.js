// Design on templates/resize-element/base.js: the base site's resize-element widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'resize-element',
  site: 'design-resize-element-aspect-05',
  name: 'design',
  split: 'train',
  scenarios: ['aspect'],
  template: 'resize-element/base',
  design: {
    parts: {
      windowContents: (base) =>
        function (ctx, o) {
          const out = base(ctx, o);
          const { util } = ctx;
          const win = out.frame.querySelector('.wm-win');
          const head = win.querySelector('.wm-bar');
          if (win.classList.contains('mac')) {
            win.classList.remove('mac');
            win.classList.add('win');
            const l = head.querySelector('.wm-lights');
            if (l) l.remove();
            util.el('i', 'wm-app', head);
            head.insertBefore(head.lastElementChild, head.firstChild);
            const ctl = util.el('div', 'wm-ctl', head);
            ctl.style.marginLeft = 'auto';
            for (const [label, glyph] of [['Minimize', '–'], ['Maximize', '□'], ['Close', '✕']]) {
              const b = util.el('button', '', ctl, glyph);
              b.type = 'button';
              b.title = label;
              b.setAttribute('aria-label', label);
              b.addEventListener('click', () => env.log('decoy', { label }));
            }
          }
          const body = win.querySelector('.wm-body');
          body.textContent = '';
          const lock = out.lock;
          if (lock) {
            lock.style.marginLeft = '';
            lock.classList.add('w2k-lock');
            body.append(lock);
          }
          const mk = (cls, parent, text) => util.el('div', cls, parent, text);
          const left = mk('dsh-col l', body);
          const right = mk('dsh-col r', body);
          mk('dsh-h', left, 'Project Status');
          const ps = mk('dsh-pie', left);
          mk('pie', ps);
          const lg = mk('legend', ps);
          for (const [c, t, n] of [['#1a9641', 'On Track', 6], ['#f7c60f', 'At Risk', 3], ['#e31a2a', 'Delayed', 2]]) {
            const r = mk('lg', lg);
            const sw = util.el('i', '', r);
            sw.style.background = c;
            util.el('span', '', r, t);
            util.el('b', '', r, String(n));
          }
          mk('dsh-h', left, 'Task Completion');
          const bar = mk('bar', left);
          const f = util.el('i', '', bar);
          f.style.width = '66%';
          util.el('em', '', bar, '68%');
          for (const [a, b] of [['Completed Tasks', 82], ['Remaining Tasks', 38], ['Total Tasks', 120]]) {
            const r = mk('kv', left);
            util.el('span', '', r, a);
            util.el('b', '', r, String(b));
          }
          mk('dsh-h', right, 'Upcoming Milestones');
          const t = util.el('table', 'ms', right);
          const tr = util.el('tr', '', t);
          for (const h of ['Date', 'Project', 'Milestone']) util.el('th', '', tr, h);
          for (const row of [
            ['Apr 12, 2003', 'Website Redesign', 'Design Complete'],
            ['Apr 20, 2003', 'Customer Portal', 'Beta Release'],
            ['May 05, 2003', 'Inventory System', 'Requirements Review'],
            ['May 18, 2003', 'Mobile Client', 'Prototype'],
            ['Jun 01, 2003', 'HR System', 'Pilot Launch'],
          ]) {
            const r = util.el('tr', '', t);
            for (const v of row) util.el('td', '', r, v);
          }
          mk('dsh-h', right, 'Active Resources');
          const bar2 = mk('bar', right);
          const f2 = util.el('i', '', bar2);
          f2.style.width = '70%';
          util.el('em', '', bar2, '75%');
          for (const [a, b] of [['Team Members', 12], ['Contractors', 4], ['Total Resources', 16]]) {
            const r = mk('kv', right);
            util.el('span', '', r, a);
            util.el('b', '', r, String(b));
          }
          return out;
        },
    },
  },
});
