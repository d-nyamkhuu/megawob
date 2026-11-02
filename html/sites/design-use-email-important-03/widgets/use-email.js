// GTK mail design with taller rows, a surface search box and an important-message status indicator.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-important-03',
    name: 'design',
    split: 'train',
    scenarios: ['important'],
    template: 'use-email/mail',
    design: {
      rowHeight: 93,
      searchIn: 'root',
      searchPlaceholder: 'Search emails...',
      parts: {
        toolsStart: (base, S) => (d) => {
          base(d);
          d.actionMenu = S.el('details', 'message-actions', d.tools);
          S.el('summary', '', d.actionMenu, 'Message actions');
        },
        docOp: (base, S) => (tools, label, op, i) =>
          base(S.els.d.actionMenu, label, op, i),
        locateAction: (base, S) => (t) => {
          const menu = S.els.d.actionMenu;
          const button = S.els.reg.get('action:' + t.action);
          if (t.action && menu && button && menu.contains(button) && !menu.open)
            return S.center(menu.querySelector('summary'));
          return base(t);
        },
        docMeta: (base, S) => (meta, e, i, m, d) => {
          S.el('h2', '', meta, e.subject);
          S.el('div', '', meta, 'From: ' + e.name + ' <' + e.addr + '>');
          S.el('div', '', meta, 'To: ' + S.spec.me.name + S.cc(e));
          S.el('div', '', meta, e.time);
          S.el('div', 'imp-state', d.tools);
        },
        docFlags: (base, S) => (m, i) => {
          base(m, i);
          const st = S.els.docInside.querySelector('.imp-state');
          if (st) {
            const on = !!m.flags[i].important;
            st.classList.toggle('on', on);
            st.innerHTML = S.P.icon('star') + '<span>' + (on ? 'Important' : 'Not important') + '</span>';
          }
        },
      },
    },
  });
})();
