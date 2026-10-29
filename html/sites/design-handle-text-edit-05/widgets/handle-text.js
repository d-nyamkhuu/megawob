// Design on templates/handle-text/base.js: the base site's handle-text widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-edit-05',
  name: 'design',
  split: 'train',
  scenarios: ['edit'],
  template: 'handle-text/base',
  design: {
    parts: {
      buildEdit: (base) =>
        function (ctx, look) {
          const out = base(ctx, look);
          const stage = ctx.stage;
          const bar = stage.querySelector('.ut-bar');
          const body = stage.querySelector('.ut-edit .ut-body');
          if (bar) bar.textContent = 'Edit Task';
          if (!body) return out;
          body.classList.add('wt');
          const u = ctx.util;
          const top = document.createElement('div');
          top.className = 'wt-top';
          const tabs = u.el('div', 'wt-tabs', top);
          ['General', 'Details', 'Resources', 'Predecessors', 'Comments'].forEach((t, i) => u.el('span', 'wt-tab' + (i ? '' : ' on'), tabs, t));
          const cal = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="#fff" stroke="#3c5f8f" stroke-width="1.5"/><path d="M3 9h18" stroke="#3c5f8f" stroke-width="3"/><path d="M7 12h2m3 0h2m3 0h1M7 15h2m3 0h2m3 0h1M7 18h2m3 0h2" stroke="#6c86ad" stroke-width="1.3"/></svg>';
          const form = u.el('div', 'wt-form', top);
          form.innerHTML =
            '<div class="wt-r"><b>Task Name:</b><i class="wt-in wide">Prepare regional rollout plan</i></div>' +
            '<div class="wt-r"><b>Project:</b><i class="wt-in sel">Product Launch<s></s></i></div>' +
            '<div class="wt-r"><b>Start Date:</b><i class="wt-in date">May 12, 2005</i><em class="wt-cal">' + cal + '</em><b class="gap">Due Date:</b><i class="wt-in date">May 27, 2005</i><em class="wt-cal">' + cal + '</em></div>' +
            '<div class="wt-r right"><b>Priority:</b><i class="wt-in sel">Medium<s></s></i><b class="gap">Status:</b><i class="wt-in sel">In Progress<s></s></i></div>';
          body.insertBefore(top, body.firstChild);
          const sub = body.querySelector('.ut-sub');
          if (sub) sub.style.display = 'none';
          return out;
        },
    },
  },
});
