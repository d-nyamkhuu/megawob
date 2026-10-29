/* use-social-feed/feed: paint parts; each part remains independently overridable. */
(function () {
  'use strict';

  function installPaint(BASE, S, structKey) {
    const { TOASTS, CONFIRM_TEXT } = env.templateLib('use-social-feed/_assets');
    // A menu's panel after its state was synced to the model (changed: the menu primitive was updated).
    BASE.menuSynced = (R, pt, want, changed) => {
      if (S.D.menuPlace === 'always' ? want !== null : S.D.menuPlace === 'unchanged' ? !changed && want !== null : false) S.P.placeMenu(R, pt.panel, pt.more);
    };
    const paintMenus = (R) => {
      if (!R.fd) return;
      for (const [p, pt] of R.fd.parts) if (pt.menu) {
        const want = R.ctx.model.menu === p ? [] : null;
        const changed = JSON.stringify(pt.menu.get()) !== JSON.stringify(want);
        if (changed) pt.menu.set(want);
        S.P.menuSynced(R, pt, want, changed);
      }
    };

    // ---------------------------------------------------------------- paint

    BASE.countText = (R, n) => (n || S.D.countZero ? R.F.helpers.formatCount(n) : '');
    BASE.paintAct = (R, p, pt, b, on) => {
      pt.acts[b].classList.toggle('on', on);
      pt.acts[b].setAttribute('aria-pressed', String(on));
      if (pt.counts[b]) {
        const n = (R.spec.posts[p].counts[b] || 0) + (on ? 1 : 0);
        pt.counts[b].textContent = S.P.countText(R, n, b);
      }
    };
    BASE.paintPost = (R, p, pt, m) => {
      if (!pt.acts) return;
      for (const b of R.F.helpers.BUTTONS) S.P.paintAct(R, p, pt, b, m.on.includes(R.F.helpers.keyOf(p, b)));
    };
    BASE.paintStart = (R, m) => {
      if (!S.D.detail) return;
      const { spec, F } = R;
      const post = spec.posts[spec.targets[0]];
      const action = spec.action;
      document.querySelector('.detail-target-author').textContent = post.handle;
      document.querySelector('.detail-post-starts-with').textContent = spec.phrase || post.text.slice(0, 70);
      document.querySelector('.detail-action').textContent = 'Click ' + (F.helpers.LABELS[action] || action) + ' on the specified post.';
      const ds = document.querySelector('.detail-status');
      const ok = m.on.length !== spec.start.length || m.on.some((k) => !spec.start.includes(k));
      ds.textContent = ok ? 'In progress' : 'Not completed';
      ds.style.color = ok ? '#b36b00' : '#d00000';
    };
    BASE.synced = () => {};
    BASE.painted = () => {};
    BASE.paintOverlays = (R, m) => {
      const { spec, F } = R;
      // Toast for the last pick.
      const last = m.picks[m.picks.length - 1];
      R.toast.hidden = !last;
      if (last) {
        R.toastT.textContent = TOASTS[last[1]](spec.posts[last[0]].handle);
        R.toastUndo.hidden = !F.helpers.PERSISTENT.includes(last[1]);
      }
      // Confirm dialog.
      R.scrim.hidden = !m.confirm;
      if (m.confirm) {
        const [h, p, ok] = CONFIRM_TEXT[m.confirm[1]](spec.posts[m.confirm[0]].handle);
        R.dlgH.textContent = h;
        R.dlgP.textContent = p;
        R.okB.textContent = ok;
      }
    };
    BASE.paintEnd = () => {};
    // Redraw everything from the model.
    BASE.paint = (R) => {
      const m = R.ctx.model;
      S.P.paintStart(R, m);
      if (structKey(R, m) !== R.builtKey) S.P.build(R, m);
      S.P.synced(R, m);
      for (const [k, t] of Object.entries(R.tabEls)) t.classList.toggle('on', m.tab === k);
      for (const [p, pt] of R.fd.parts) S.P.paintPost(R, p, pt, m);
      S.P.painted(R, m);
      R.paintMenus();
      R.markHover();
      S.P.paintOverlays(R, m);
      S.P.paintEnd(R, m);
      R.report();
    };

    return { paintMenus };
  }

  env.template('use-social-feed/_paint', () => ({ installPaint }), { uses: ['use-social-feed/_assets'] });
})();
