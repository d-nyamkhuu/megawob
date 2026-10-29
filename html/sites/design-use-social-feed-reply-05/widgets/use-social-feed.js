// Design on templates/use-social-feed/feed.js: the template's pilot for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-social-feed',
  site: 'design-use-social-feed-reply-05',
  name: 'design',
  split: 'train',
  scenarios: ['reply'],
  template: 'use-social-feed/feed',
  design: {
    css: `
      .qt-reply-composer { margin:8px 0 4px; padding:10px 12px; background:#edf0f5; border:1px solid #b4bccb; }
      .qt-reply-label { display:block; margin-bottom:6px; color:#5f6a78; font-size:13px; }
      .qt-reply-text { display:block; box-sizing:border-box; width:100%; height:64px; resize:none; padding:8px 10px; border:1px solid #7d8fb0; border-radius:3px; background:#fff; color:#14233c; font:15px "Segoe UI",Arial,sans-serif; }
      .qt-reply-send { display:block; margin:8px 0 0 auto; padding:6px 16px; border:1px solid #7d8fb0; border-radius:3px; background:linear-gradient(#f4f7fb,#cdd9e7); color:#14233c; font:14px "Segoe UI",Arial,sans-serif; }
    `,
    parts: {
      headed: (base) => (R) => {
        base(R);
        // A single list needs no duplicate header; live tabs remain usable.
        if (!R.live) R.head.remove();
      },
      postDone: (base) => (R, row, post, p, parts, m) => {
        base(R, row, post, p, parts, m);
        if (!m.draft || m.draft.post !== p) return;
        const cp = R.util.el('div', 'qt-reply-composer', parts.main);
        R.util.el('small', 'qt-reply-label', cp, `Replying to ${post.handle}`);
        const ta = R.util.el('textarea', 'qt-reply-text', cp);
        ta.placeholder = 'Post your reply';
        ta.value = m.draft.text;
        ta.dataset.role = 'draft';
        ta.addEventListener('input', () => R.up({ draft: ta.value }));
        const send = R.util.el('button', 'qt-reply-send', cp, 'Send reply');
        send.type = 'button';
        send.dataset.role = 'send';
        send.addEventListener('click', () => { R.up({ send: true }); R.paint(); });
        parts.draft = ta;
        parts.send = send;
      },
      buildStart: (base) => (R, m) => {
        base(R, m);
        R.x.draftPost = m.draft ? m.draft.post : null;
      },
      paintStart: (base, S) => (R, m) => {
        base(R, m);
        if (R.x.draftPost !== (m.draft ? m.draft.post : null)) {
          S.P.build(R, m);
        }
      },
      built: (base) => (R, B, m) => {
        base(R, B, m);
        if (!m.draft || !B.rows.has(m.draft.post)) return;
        const fr = B.feed.getBoundingClientRect();
        const rr = B.rows.get(m.draft.post).getBoundingClientRect();
        if (rr.bottom > fr.bottom) B.feed.scrollTop += Math.min(rr.bottom - fr.bottom + 6, rr.top - fr.top);
        B.lbx.set({});
      },
      locateExtra: (base) => (R, t) => {
        if (t.field === 'draft' || t.send) {
          const pt = R.ctx.model.draft && R.fd.parts.get(R.ctx.model.draft.post);
          const el = pt && (t.send ? pt.send : pt.draft);
          return el ? R.util.center(el) : null;
        }
        return base(R, t);
      },
      paintAct: (base) => (R, p, pt, b, on) => {
        if (b === 'reply') on = !!R.ctx.model.draft && R.ctx.model.draft.post === p;
        base(R, p, pt, b, on);
        if (b === 'reply' && pt.counts[b]) {
          const n = (R.spec.posts[p].counts[b] || 0) + (on ? 1 : 0) + (R.ctx.model.sent || []).filter((s) => s[0] === p).length;
          pt.counts[b].textContent = n ? R.F.helpers.formatCount(n) : '';
        }
      },
      framed: (base) => (R) => {
        base(R);
        const undo = R.toastUndo.cloneNode(true);
        R.toastUndo.replaceWith(undo);
        R.toastUndo = undo;
        undo.addEventListener('click', () => {
          if (R.ctx.model.sent.length) R.up({ unsend: true });
          else {
            const n = R.ctx.model.picks.length;
            if (n && R.F.helpers.PERSISTENT.includes(R.ctx.model.picks[n - 1][1])) R.up({ undo: n - 1 });
          }
          R.paint();
        });
      },
      paintOverlays: (base) => (R, m) => {
        base(R, m);
        if (!m.sent.length) return;
        const last = m.sent[m.sent.length - 1];
        R.toast.hidden = false;
        R.toast.classList.add('wrap');
        R.toastUndo.hidden = false;
        R.toastT.textContent = R.F.helpers.replyToast(R.spec.posts[last[0]].handle, last[1]);
      },
    },
  },
});
