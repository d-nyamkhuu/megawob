// Flow feed design. Reply UI uses the task's draft/sent state and the
// template's rendering/locator hooks; existing feed mechanics remain intact.
env.widget({
  task: 'use-social-feed',
  site: 'design-use-social-feed-reply-04',
  name: 'design',
  split: 'train',
  scenarios: ['reply'],
  traits: { simpleFeed: true },
  template: 'use-social-feed/feed',
  design: {
    timeFormat: 'ago',
    scrollSet: 'first',
    icons: {
      like: '<path d="M20.8 4.6c-2.5-2.5-6.4-1.7-8.8 1-2.4-2.7-6.3-3.5-8.8-1C.5 7.3 2 11.3 4.5 14L12 21l7.5-7c2.5-2.7 4-6.7 1.3-9.4Z"/>',
      reply: '<path d="M21.5 11.3c0 5-4.4 8.7-9.7 8.7-1.7 0-3.3-.3-4.8-1L2 22l1.7-5.6a8.3 8.3 0 0 1-1.6-5c0-5 4.4-9 9.7-9s9.7 3.9 9.7 8.9Z"/>',
    },
    parts: {
      avatar: (base) => (R, row, post, p, m) => {
        const avatar = base(R, row, post, p, m);
        const index = R.handles.indexOf(post.handle) % 9;
        const positions = [207,283,359,434,509,585,668,751,829];
        avatar.style.setProperty('--portrait-y', (-positions[index] * 66 / 56) + 'px');
        return avatar;
      },
      paintEnd: (base) => (R, m) => {
        base(R, m);
        const old = R.x.composer;
        const draft = m.draft;
        if (old && (!draft || old.post !== draft.post || !old.node.isConnected)) {
          old.node.remove();
          R.x.composer = null;
        }
        let opened = false;
        if (draft && !R.x.composer) {
          const row = R.fd.rows.get(draft.post);
          if (row) {
            const u = R.util;
            const node = u.el('section', 'flow-composer', row);
            node.setAttribute('aria-label', 'Replying to ' + R.spec.posts[draft.post].handle);
            u.el('span', 'flow-reply-avatar', node);
            const box = u.el('div', 'flow-compose-box', node);
            const field = u.el('textarea', 'flow-draft', box);
            field.placeholder = 'Write a reply...';
            field.setAttribute('aria-label', 'Replying to ' + R.spec.posts[draft.post].handle);
            field.rows = 2;
            field.addEventListener('input', () => { R.up({ draft: field.value }); });
            const bar = u.el('div', 'flow-compose-tools', box);
            for (const [label, path] of [
              ['Add photo', '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8" cy="9" r="1"/><path d="m4 17 5-5 4 3 4-5 4 5"/>'],
              ['Emoji', '<circle cx="12" cy="12" r="9"/><path d="M8 14q4 6 8 0M8 8h.1M16 8h.1"/>'],
              ['GIF', '<rect x="2" y="4" width="20" height="16" rx="3"/><text x="5" y="15" fill="currentColor" stroke="none" font-size="8" font-family="Arial">GIF</text>']
            ]) {
              const tool = u.el('button', 'flow-compose-tool', bar);
              tool.type = 'button';
              tool.title = label;
              tool.setAttribute('aria-label', label);
              tool.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>';
              tool.addEventListener('click', () => env.log('compose-tool', { label }));
            }
            const send = u.el('button', 'flow-send', bar, 'Send');
            send.type = 'button';
            send.setAttribute('aria-label', 'Send reply');
            send.addEventListener('click', () => { R.up({ send: true }); R.paint(); });
            R.x.composer = { node, field, send, post: draft.post };
            opened = true;
          }
        }
        if (draft && R.x.composer && R.x.composer.field.value !== draft.text) R.x.composer.field.value = draft.text;
        for (const [p, parts] of R.fd.parts) {
          if (parts.acts?.reply) parts.acts.reply.setAttribute('aria-expanded', String(draft?.post === p));
          if (parts.counts?.reply) parts.counts.reply.textContent = R.F.helpers.formatCount((R.spec.posts[p].counts.reply || 0) + (m.sent || []).filter(item => item[0] === p).length);
        }
        if (!R.x.replyNotice) {
          const notice = R.util.el('div', 'flow-reply-notice', R.col);
          notice.setAttribute('role', 'status');
          const text = R.util.el('span', '', notice);
          const undo = R.util.el('button', '', notice, 'Undo');
          undo.type = 'button';
          undo.addEventListener('click', () => { R.up({ unsend: true }); R.paint(); });
          R.x.replyNotice = { notice, text, undo };
        }
        const last = (m.sent || []).at(-1);
        R.x.replyNotice.notice.hidden = !last;
        if (last) R.x.replyNotice.text.textContent = R.F.helpers.replyToast(R.spec.posts[last[0]].handle, last[1]);
        if (!R.x.initialScrollApplied) {
          R.x.initialScrollApplied = true;
          const ids = R.F.helpers.feedOf(R.spec, m);
          const row = R.fd.rows.get(ids[m.scroll || 0]);
          if (row && m.scroll) R.fd.feed.scrollTop += row.getBoundingClientRect().top - R.fd.feed.getBoundingClientRect().top;
        }
        if (opened) {
          const bottom = R.x.composer.node.getBoundingClientRect().bottom;
          const edge = R.fd.feed.getBoundingClientRect().bottom;
          if (bottom > edge - 12) R.fd.feed.scrollTop += bottom - edge + 12;
          R.fd.lbx.set({});
        }
      },
      locateExtra: (base) => (R, target) => {
        if (target.field === 'draft' && R.x.composer) return R.util.center(R.x.composer.field);
        if (target.send && R.x.composer) return R.util.center(R.x.composer.send);
        if (target.undo === 'toast' && R.ctx.model.sent?.length) return R.util.center(R.x.replyNotice.undo);
        return base(R, target);
      },
    },
  },
});
