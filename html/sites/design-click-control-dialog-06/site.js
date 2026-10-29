(function () {
  'use strict';
  const cfg = {
    theme: 'pixel',
    title: 'File Manager',
    menus: ['File', 'Edit', 'View', 'Tools', 'Help'],
    tabs: ['Instructions', 'Details'],
  };
  const CTRL =
    '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
  const FOLDER =
    '<svg class="ti" viewBox="0 0 32 30"><path d="M2 5h10l3 3h14v20H2Z" fill="#f8df75" stroke="#10234b" stroke-width="2"/><path d="M4 11h25v15H4Z" fill="#f0cb48"/><path d="M4 12h24M4 13v12" fill="none" stroke="#fff7ca" stroke-width="2"/><path d="m4 12 9-7h12l3 7" fill="#dbe9ed" stroke="#7692aa"/></svg>';
  const TASKICO =
    '<svg class="ti" viewBox="0 0 24 20"><path d="M4 1h10l4 4v14H4Z" fill="#fff" stroke="#dfe9fb"/><path d="M7 8h7M7 12h7" stroke="#2a5db0" stroke-width="2"/></svg>';
  env.site({
    name: 'design-click-control-dialog-06',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme;
      const content = ctx.content || {};
      const labels =
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endR = ctx.rng.fork('chrome/end');
      const legacy = !ctx.finish && endR.bool(0.5);
      const placement = ctx.finish ? null : legacy ? 'footer' : endR.pick(['header', 'link', 'icon']);
      const label = ctx.finish ? null : legacy ? 'Submit' : labelOf(endR.pick(labels));
      const collideR = ctx.rng.fork('chrome/collide');
      const otherLabels = [
        ...new Set(
          labels.map(labelOf).filter(
            (x) =>
              x.trim().toLowerCase() !==
              String(label || '')
                .trim()
                .toLowerCase(),
          ),
        ),
      ];
      const collide =
        !ctx.finish && otherLabels.length > 0 && collideR.bool(0.3) ? labelOf(collideR.pick(otherLabels)) : null;
      const collideWhere = collide ? collideR.pick(['header', 'footer']) : null;
      const shell = u.el('main', 'shell', document.body);
      // File Manager window
      const fm = u.el('section', 'win fm', shell);
      const t1 = u.el('div', 'titlebar', fm);
      const ic = u.el('span', 'ico', t1);
      ic.innerHTML = FOLDER;
      u.el('span', 'cap', t1, cfg.title);
      const c1 = u.el('span', 'window-controls', t1);
      c1.innerHTML = CTRL;
      const menu = u.el('div', 'menubar', fm);
      cfg.menus.forEach((m) => u.el('span', 'mi', menu, m));
      const center = u.el('div', 'center', fm);
      const stage = u.el('div', 'stage', center);
      const status = u.el('div', 'statusbar', fm);
      u.el('span', '', status, '6 items (1 selected)');
      const disk = u.el('span', 'disk', status);
      u.el('i', '', disk);
      u.el('span', '', disk, 'Local Disk (C:)');
      // Task window
      const task = u.el('aside', 'win task inspector', shell);
      task.dataset.display = ctx.display;
      const t2 = u.el('div', 'titlebar', task);
      const ic2 = u.el('span', 'ico', t2);
      ic2.innerHTML = TASKICO;
      u.el('span', 'cap', t2, 'Task');
      const c2 = u.el('span', 'window-controls', t2);
      c2.innerHTML = CTRL;
      const tabs = u.el('div', 'tabs', task);
      cfg.tabs.forEach((t, i) => u.el('span', 'tab' + (i === 0 ? ' on' : ''), tabs, t));
      const pane = u.el('div', 'pane', task);
      if (ctx.display === 'header') u.el('div', 'instruction header-note', pane, ctx.instruction);
      if (ctx.display === 'panel') u.el('div', 'instruction panel-note', pane, ctx.instruction);
      if (ctx.display === 'toast') u.el('div', 'instruction instruction-toast', pane, ctx.instruction);
      let submit = null;
      const makeEnd = (parent, kind) => {
        const el = u.el(
          kind === 'link' ? 'a' : 'button',
          'submit end-' + kind,
          parent,
          kind === 'icon' ? '✓' : kind === 'link' ? label + ' ›' : label,
        );
        if (kind === 'link') el.href = '#';
        else el.type = 'button';
        el.setAttribute('aria-label', label);
        el.title = label;
        el.addEventListener('click', (e) => {
          if (kind === 'link') e.preventDefault();
          ctx.submit();
        });
        return el;
      };
      const makeDecoy = (parent) => {
        if (!collide) return;
        const b = u.el('button', 'submit xtra', parent, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      };
      const headTools = u.el('div', 'tasktools', task);
      if (collide && collideWhere === 'header') makeDecoy(headTools);
      if (!ctx.finish && (placement === 'header' || placement === 'icon')) submit = makeEnd(headTools, placement);
      if (!ctx.finish && (placement === 'footer' || placement === 'link' || (collide && collideWhere === 'footer'))) {
        const foot = u.el('div', 'taskfoot', task);
        if (collide && collideWhere === 'footer') makeDecoy(foot);
        if (placement === 'footer' || placement === 'link') submit = makeEnd(foot, placement);
      }
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
