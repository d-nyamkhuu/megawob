// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
function motifChannelScroll(U, parent, pane, disabled = false) {
  const rail = U.el('div', 'motif-scrollbar', parent);
  const up = U.el('button', 'motif-scroll-arrow', rail, '▲');
  const track = U.el('div', 'motif-scroll-track', rail);
  const thumb = U.el('div', 'motif-scroll-thumb', track);
  const down = U.el('button', 'motif-scroll-arrow', rail, '▼');
  up.type = down.type = 'button';
  up.setAttribute('aria-label', 'Scroll up'); down.setAttribute('aria-label', 'Scroll down');
  const sync = () => {
    const available = track.clientHeight;
    const height = Math.min(available, Math.max(26, available * pane.clientHeight / Math.max(pane.scrollHeight, 1)));
    thumb.style.height = height + 'px';
    thumb.style.top = (pane.scrollHeight > pane.clientHeight ? (available - height) * pane.scrollTop / (pane.scrollHeight - pane.clientHeight) : 0) + 'px';
    rail.classList.toggle('motif-scroll-disabled', disabled || pane.scrollHeight <= pane.clientHeight);
  };
  up.addEventListener('click', () => { pane.scrollTop -= pane.clientHeight * .8; sync(); });
  down.addEventListener('click', () => { pane.scrollTop += pane.clientHeight * .8; sync(); });
  track.addEventListener('click', e => {
    if (e.target === thumb) return;
    pane.scrollTop = (e.clientY - track.getBoundingClientRect().top) / Math.max(1, track.clientHeight) * (pane.scrollHeight - pane.clientHeight);
    sync();
  });
  pane.addEventListener('scroll', sync);
  pane.addEventListener('input', sync);
  rail.motifSync = sync;
  return rail;
}
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-channel-04',
  name: 'design',
  split: 'train',
  scenarios: ['channel'],
  template: 'use-chat/workspace',
  design: {
    panel: '#c5c2ba', bg: '#c5c2ba', fg: '#111111', muted: '#505050',
    line: '#808080', accent: '#294780', font: 'Arial, Helvetica, sans-serif',
    fontSize: '20px', inset: '0', radius: '0', brand: 'TeamTalk',
    parts: {
      // Global navigation belongs to the Motif window, rather than a second workspace bar.
      topbar: () => () => {},
      channelTabs: () => () => {},
      chatHeader: (base, S) => (m) => {
        const U = S.ctx.util, P = S.P;
        const head = U.el('div', 'ch-head motif-heading', S.main);
        U.el('span', 'motif-channel-hash', head, '#');
        const title = U.el('div', 'motif-heading-copy', head);
        U.el('h2', '', title, m.name);
        U.el('p', '', title, m.topic);
        const tools = U.el('div', 'motif-channel-tools', head);
        P.button(tools, 'Settings...', 'settings', { settings: true }, 'motif-settings');
        const count = U.el('div', 'motif-member-count', tools);
        P.icon(count, 'people', 22);
        U.el('span', '', count, m.members.length);
      },
      composer: (base, S) => (parent, isThread, m) => {
        const U = S.ctx.util, P = S.P;
        const box = U.el('div', 'ch-compose motif-composer', parent);
        const toolbar = U.el('div', 'motif-editor-toolbar', box);
        P.button(toolbar, 'A', null, null, 'motif-format-button').title = 'Formatting';
        P.iconButton(toolbar, 'clip', 'Attach file', null, null, 'motif-editor-button');
        P.iconButton(toolbar, 'smile', 'Insert reaction', null, null, 'motif-editor-button');
        P.button(toolbar, isThread && m.replies[m.thread] ? 'Update reply' : 'Send',
          isThread ? 'send' : 'channelSend', isThread ? { send: true } : { channelSend: true }, 'motif-send');
        const field = P.field(box, isThread ? 'draft' : 'channelDraft',
          isThread ? m.draft : m.channelDraft,
          isThread ? 'Reply in thread...' : `Message #${m.name}`, true);
        field.classList.add('motif-editor-input');
        const inputWrap = U.el('div', 'motif-input-wrap', box);
        inputWrap.appendChild(field);
        motifChannelScroll(U, inputWrap, field, false);
      },
      feed: (base, S) => (channel, m) => {
        // Begin history at its first complete row; subsequent paints preserve the user's scroll.
        if (S.offsets.messages === undefined) S.offsets.messages = 0;
        base(channel, m);
        const feed = channel.querySelector('[data-chat-pane="messages"]');
        const wrap = S.ctx.util.el('div', 'motif-scroll-wrap', channel);
        feed.before(wrap); wrap.appendChild(feed);
        motifChannelScroll(S.ctx.util, wrap, feed);
      },
      painted: (base, S) => (m) => {
        base(m);
        S.app.querySelectorAll('.motif-scrollbar').forEach(rail => rail.motifSync());
      },
      avatar: (base, S) => (parent, person, cls = '') => {
        const avatar = base(parent, person, cls);
        avatar.title = person.full;
        avatar.setAttribute('aria-label', person.full);
        avatar.textContent = '';
        S.ctx.util.el('i', 'motif-portrait-head', avatar);
        S.ctx.util.el('i', 'motif-portrait-body', avatar);
        return avatar;
      },
    },
  },
});
