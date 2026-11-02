// XP presentation around the shared feed, with its inline reply composer.
env.widget({
  task: 'use-social-feed',
  site: 'design-use-social-feed-reply-01',
  name: 'design',
  split: 'train',
  scenarios: ['reply'],
  template: 'use-social-feed/feed',
  traits: { simpleFeed: true },
  design: {
    parts: {
      framed: (base, S) => function (R) {
        base(R);
        R.toastUndo.addEventListener('click', () => {
          if (R.spec.scenario === 'reply' && R.ctx.model.sent.length) {
            R.up({ unsend: true });
            R.paint();
          }
        });
      },
      paintOverlays: (base, S) => function (R, m) {
        base(R, m);
        if (R.spec.scenario === 'reply' && m.sent.length) {
          R.toast.hidden = false;
          R.toastUndo.hidden = false;
          const [post, message] = m.sent[m.sent.length - 1];
          R.toastT.textContent = R.F.helpers.replyToast(R.spec.posts[post].handle, message);
        }
      },
      inView: (base, S) => function (R, p, row, rect, top, height) {
        if (base(R, p, row, rect, top, height)) return true;
        const action = row.querySelector('.as-act.reply');
        if (!action) return false;
        const r = action.getBoundingClientRect();
        return r.top >= top - 0.5 && r.bottom <= top + height + 0.5;
      },
      postDone: (base, S) => function (R, row, post, p, parts, m) {
        base(R, row, post, p, parts, m);
        if (!m.draft || m.draft.post !== p) return;
        const box = R.util.el('div', 'as-composer', parts.main);
        R.util.el('small', '', box, 'Replying to ' + post.handle);
        const field = R.util.el('textarea', '', box);
        field.dataset.role = 'draft';
        field.setAttribute('aria-label', 'Reply');
        field.placeholder = 'Post your reply';
        field.value = m.draft.text || '';
        field.addEventListener('input', () => R.up({ draft: field.value }));
        const send = R.util.el('button', '', box, 'Send reply');
        send.type = 'button';
        send.dataset.role = 'send';
        send.addEventListener('click', () => { R.up({ send: true }); R.paint(); });
        parts.draft = field;
        parts.send = send;
      },
      painted: (base, S) => function (R, m) {
        base(R, m);
        const draftPost = m.draft ? m.draft.post : null;
        const first = R._draftPost === undefined;
        if (first && draftPost === null) { R._draftPost = draftPost; return; }
        if (!first && R._draftPost === draftPost) return;
        R._draftPost = draftPost;
        if (!first) S.P.build(R, m);
        if (m.draft) {
          const feed = R.fd.feed;
          const pt = R.fd.parts.get(m.draft.post);
          if (pt && pt.draft) {
            const pane = feed.getBoundingClientRect();
            const row = pt.main.parentElement.getBoundingClientRect();
            if (row.bottom > pane.bottom) feed.scrollTop += row.bottom - pane.bottom + 6;
            const cb = pt.draft.parentElement.getBoundingClientRect();
            if (cb.bottom > pane.bottom) feed.scrollTop += cb.bottom - pane.bottom + 6;
            else if (cb.top < pane.top) feed.scrollTop -= pane.top - cb.top + 6;
            R.fd.lbx.set({});
          }
        }
        if (first) return;
        R.paint();
        R.ctx.reanchor?.();
      },
      locateExtra: (base, S) => function (R, target) {
        if (target?.field === 'draft' || target?.send) {
          const draft = R.ctx.model.draft;
          const pt = draft && R.fd.parts.get(draft.post);
          return pt ? R.util.center(target.send ? pt.send : pt.draft) : null;
        }
        return base(R, target);
      },
    },
  },
});
