/* use-project-board/_controls: View controls, detail drawer and committed action updates.
 * install(BASE, W) retains the workspace's design parts; W is its live per-page state. */
(function () {
  'use strict';
  function install(BASE, W) {
    BASE.say = (text) => {
      W.hint.replaceChildren(); W.P.icon(W.hint, text ? 'flag' : 'info'); W.u.el('span', '', W.hint, text || W.normalHint); W.hint.classList.toggle('warn', !!text);
    };

    BASE.currentViewReset = () => {
      return W.filter !== 'All work' || W.grouping !== 'Project section' || !!W.drawer || !!W.menu;
    };

    BASE.resetView = () => {
      W.filter = 'All work'; W.grouping = 'Project section';
      if (W.drawer) { W.drawer.remove(); W.drawer = null; }
      if (W.menu) { W.menu.remove(); W.menu = null; }
      W.filterBtn.classList.remove('on'); W.groupBtn.classList.remove('on');
      W.filterBtn.querySelector('span').textContent = 'Filter'; W.groupBtn.querySelector('span').textContent = W.isBoard ? 'Team' : 'Section';
      W.clearBtn.style.display = 'none'; W.P.refreshView(); W.P.mirror();
    };

    BASE.showMenu = (title, options, select) => {
      if (W.menu) { W.menu.remove(); W.menu = null; W.clearBtn.style.display = W.P.currentViewReset() ? '' : 'none'; W.P.mirror(); return; }
      W.menu = W.u.el('div', 'pj-menu', W.main); W.u.el('h4', '', W.menu, title);
      W.clearBtn.style.display = '';
      for (const option of options) W.P.button(W.menu, option, 'check').onclick = () => {
        select(option); W.menu.remove(); W.menu = null; W.clearBtn.style.display = W.P.currentViewReset() ? '' : 'none'; W.P.refreshView(); W.P.mirror();
      };
      W.P.mirror();
    };

    BASE.controls = () => {
      W.filterBtn.onclick = () => W.P.showMenu('Filter work', ['All work', 'Open work', 'Completed work'], (v) => {
        W.filter = v; W.filterBtn.classList.toggle('on', v !== 'All work'); W.filterBtn.querySelector('span').textContent = v === 'All work' ? 'Filter' : v;
      });
      W.groupBtn.onclick = () => W.P.showMenu('Group work by', ['Project section', 'Assignee'], (v) => {
        W.grouping = v; W.groupBtn.classList.toggle('on', v !== 'Project section'); W.groupBtn.querySelector('span').textContent = v === 'Project section' ? (W.isBoard ? 'Team' : 'Section') : 'Assignee';
      });
      W.findBtn.onclick = () => W.P.showMenu('Quick find', ['Current sprint', 'Related projects', 'Open work'], (v) => {
        if (v === 'Open work') W.filter = v;
        else W.P.drawer(v);
      });
      W.notifications.onclick = () => W.P.drawer('Inbox: 3 unread'); W.details.onclick = () => W.P.drawer('Project details'); W.policies.onclick = () => W.P.drawer('Policies');

      W.clearBtn.onclick = () => W.P.resetView();
    };

    BASE.drawer = (kind, it) => {
      if (W.drawer) W.drawer.remove();
      W.drawer = W.u.el('aside', 'pj-drawer', W.main); W.drawer.setAttribute('aria-label', kind);
      const dh = W.u.el('div', 'pj-drawer-head', W.drawer); W.u.el('span', 'pj-grow', dh, kind);
      const close = W.P.button(dh, '', 'close', 'icon'); close.setAttribute('aria-label', 'Close details');
      close.onclick = () => { W.drawer.remove(); W.drawer = null; W.clearBtn.style.display = W.P.currentViewReset() ? '' : 'none'; W.P.mirror(); };
      const db = W.u.el('div', 'pj-drawer-body', W.drawer);
      if (it) {
        W.u.el('div', 'pj-muted', db, `DLV-${it.number || 301 + W.related.indexOf(it)} / ${it.related ? 'Related work' : 'Current sprint'}`);
        W.u.el('h3', '', db, it.title); W.P.detailField(db, 'Assignee', it.owner);
        W.P.detailField(db, 'Status', W.isBoard && !it.related ? W.s.columns[W.ctx.model.cards[it.id].column] : it.state);
        if (W.isBoard && !it.related) W.P.detailField(db, 'Team', W.s.lanes[W.ctx.model.cards[it.id].lane]);
        W.P.detailField(db, 'Effort', `${it.points} pts`);
        if (!W.isBoard) { const b = it.related ? it : W.ctx.model.bars[it.id]; W.P.detailField(db, 'Start date', W.F.helpers.date(W.s, b.start)); W.P.detailField(db, 'Duration', `${b.duration} days`); }
        W.P.detailField(db, 'Project', W.s.project); W.P.detailField(db, 'Priority', 'Medium');
      } else if (kind === 'Policies') {
        W.u.el('h3', '', db, 'Project policies'); W.P.detailField(db, 'Calendar', 'Calendar days'); W.P.detailField(db, 'Dependency', 'Finish-to-start'); W.P.detailField(db, 'Current WIP', 'In progress: maximum 2');
        W.u.el('p', '', db, 'A predecessor must finish before its successor begins. Next-sprint backlog items are outside current WIP limits.');
      } else {
        W.u.el('h3', '', db, kind === 'Project details' ? W.s.project : kind);
        W.P.detailField(db, 'Owner', W.s.items[0].owner); W.P.detailField(db, 'Health', 'On track'); W.P.detailField(db, 'Visibility', 'Delivery team');
        for (const [i, text] of ['updated the release checklist', 'added a note to the weekly plan', 'shared a project status update'].entries()) {
          const a = W.u.el('div', 'pj-activity', db); W.P.avatar(a, W.active[i].owner, W.active[i].color);
          W.u.el('span', '', a, `${W.active[i].owner} ${text}. ${i + 1}h ago`);
        }
      }
      W.clearBtn.style.display = ''; W.P.mirror();
    };

    BASE.detailField = (parent, label, value) => {
      const r = W.u.el('div', 'pj-detail-row', parent); W.u.el('span', 'label', r, label); W.u.el('span', '', r, value);
      return r;
    };

    BASE.update = (action) => {
      const result = W.F.helpers.apply(W.ctx.model, W.s, action);
      if (result.reason) { W.P.say(result.reason); W.ctx.log('project-blocked', { reason: result.reason }); return false; }
      W.ctx.update(result.model); W.P.say(''); W.P.paint(W.ctx.model); W.ctx.reanchor(); return true;
    };
  }
  env.template('use-project-board/_controls', () => ({ install }));
})();
