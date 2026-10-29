// Keep the shared feed mechanics and supply its reply-specific visual parts.
function chirpReply(R, p, pt, m) {
  const draft = m.draft;
  if (!draft || draft.post !== p) {
    if (pt.replyUI) pt.replyUI.root.remove();
    pt.replyUI = null;
    return;
  }
  if (!pt.replyUI) {
    const u = R.util;
    const root = u.el('section', 'reply-composer', pt.main);
    root.setAttribute('aria-label', 'Reply composer');
    const label = u.el('div', 'reply-recipient', root);
    u.el('span', '', label, 'Replying to ');
    u.el('span', 'reply-handle', label, R.spec.posts[p].handle);
    const row = u.el('div', 'reply-entry', root);
    const avatar = u.el('span', 'reply-avatar', row);
    avatar.setAttribute('aria-hidden', 'true');
    const input = u.el('textarea', 'reply-draft', row);
    input.rows = 1;
    input.placeholder = ' ';
    input.setAttribute('aria-label', 'Reply');
    input.setAttribute('data-role', 'draft');
    input.addEventListener('input', () => R.up({ draft: input.value }));
    const footer = u.el('div', 'reply-footer', root);
    const media = u.el('div', 'reply-tools', footer);
    const icons = [
      ['Add photo', '<rect x="3" y="3" width="22" height="22" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="m4 21 7-8 5 5 4-4 5 6"/>'],
      ['GIF', '<rect x="2" y="3" width="24" height="22" rx="2"/><text x="14" y="18" fill="currentColor" stroke="none" text-anchor="middle" font-size="10" font-weight="bold">GIF</text>'],
      ['Emoji', '<circle cx="14" cy="14" r="11.5"/><circle cx="10" cy="11" r=".8" fill="currentColor"/><circle cx="18" cy="11" r=".8" fill="currentColor"/><path d="M8 16q6 8 12 0"/>']
    ];
    for (const [name, path] of icons) {
      const b = u.el('button', 'reply-tool', media);
      b.type = 'button'; b.title = name; b.setAttribute('aria-label', name);
      b.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
      b.addEventListener('click', () => { input.focus(); env.log('decoy', {label:name}); });
    }
    const send = u.el('button', 'reply-send', footer, 'Send reply');
    send.type = 'button'; send.addEventListener('click', () => R.up({send:true}));
    pt.replyUI = {root, input, send};
    input.focus({preventScroll:true});
    root.scrollIntoView({block:'nearest', inline:'nearest'});
    R.ctx.reanchor();
  }
  if (pt.replyUI.input.value !== draft.text) pt.replyUI.input.value = draft.text;
}
env.widget({
  task: 'use-social-feed',
  site: 'design-use-social-feed-reply-03',
  name: 'design',
  split: 'train',
  scenarios: ['reply'],
  template: 'use-social-feed/feed',
  traits: { simpleFeed: true },
  design: {
    scrollSet: 'first',
    icons: {
      reply: '<path d="M21 10.5c0 4.1-4 7.5-9 7.5H9l-5 3 1.4-5.1C3.8 14.6 3 12.7 3 10.5 3 6.4 7 3 12 3s9 3.4 9 7.5Z"/>',
      retweet: '<path d="M4 16V5m-3 3 3-3 3 3M4 16c0 2 1 3 3 3h5M20 8v11m-3-3 3 3 3-3M20 8c0-2-1-3-3-3h-5"/>',
      like: '<path d="M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.2a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"/>',
      share: '<path d="M12 3v13M7 8l5-5 5 5M4 14v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6"/>',
      more: '<circle cx="4" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="20" cy="12" r="1.6" fill="currentColor" stroke="none"/>'
    },
    parts: {
      avatar: (base) => (R, row, post, p, m) => {
        const avatar = base(R, row, post, p, m);
        const tile = R.handles.indexOf(post.handle) % 2;
        avatar.style.setProperty('background-position', (tile ? '50%' : '0%') + ' 0', 'important');
        avatar.title = post.name;
        return avatar;
      },
      ready: (base) => (R) => {
        base(R);
        // Preserve the template's label RNG draw, then use the reference's count treatment.
        R.labels = false;
      },
      postDone: (base) => (R, row, post, p, pt, m) => {
        base(R, row, post, p, pt, m);
        chirpReply(R, p, pt, m);
      },
      paintPost: (base) => (R, p, pt, m) => {
        base(R, p, pt, m);
        if (pt.main) chirpReply(R, p, pt, m);
        if (pt.counts && pt.counts.reply && m.sent) {
          const n = (R.spec.posts[p].counts.reply || 0) + m.sent.filter(([post]) => post === p).length;
          pt.counts.reply.textContent = R.F.helpers.formatCount(n);
        }
      },
      locateExtra: (base) => (R, target) => {
        const draft = R.ctx.model.draft;
        const pt = draft && R.fd.parts.get(draft.post);
        if (pt && pt.replyUI) {
          if (target.field === 'draft') return R.util.center(pt.replyUI.input);
          if (target.send) return R.util.center(pt.replyUI.send);
        }
        return base(R, target);
      },
      framed: (base) => (R) => {
        base(R);
        R.toastUndo.addEventListener('click', (event) => {
          if (R.ctx.model.sent && R.ctx.model.sent.length) {
            event.stopImmediatePropagation();
            R.up({unsend:true});
          }
        }, true);
      },
      paintOverlays: (base) => (R, m) => {
        base(R, m);
        if (m.sent && m.sent.length) {
          const [p, text] = m.sent[m.sent.length - 1];
          R.toast.hidden = false;
          R.toastT.textContent = R.F.helpers.replyToast(R.spec.posts[p].handle, text);
          R.toastUndo.hidden = !R.spec.recoverable;
        }
      }
    }
  },
});
