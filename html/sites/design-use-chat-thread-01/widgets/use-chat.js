// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-thread-01',
  name: 'design',
  split: 'train',
  scenarios: ['thread'],
  template: 'use-chat/workspace',
  design: {
    parts: {
      // Photo avatars: the site paints the portrait sheet (--avatar-image) behind every avatar.
      avatar: (base, S) => (parent, person, cls = '') => {
        const slot = parent.children.length;
        const el = base(parent, person, cls);
        el.textContent = '';
        el.style.background = '';
        el.style.color = '';
        el.classList.add('ref-avatar-photo');
        el.dataset.portrait = String((env.util.hash32(person.full) + slot) % 4);
        Object.assign(el.style, { flex: '0 0 48px', width: '48px', height: '48px', minWidth: '48px', fontSize: '0' });
        return el;
      },
    },
  },
});
