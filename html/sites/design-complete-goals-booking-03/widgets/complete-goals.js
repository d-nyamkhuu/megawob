// Design of this site on the composition/sections template (templates/complete-goals/sections.js).
env.widget({
  task: 'complete-goals',
  site: 'design-complete-goals-booking-03',
  name: 'design',
  split: 'train',
  scenarios: ['booking'],
  template: 'complete-goals/sections',
  design: {
    parts: {
      frame: (base) => (ctx, look, at, W) => {
        const host = base(ctx, look, at, W);
        host.classList.add('booking-grid');
        host.dataset.count = String(ctx.spec.parts.length);
        return host;
      },
      card: (base) => (ctx, host, part, i, look) => {
        const card = base(ctx, host, part, i, look);
        card.classList.add('booking-card');
        card.dataset.kind = part.task;
        return card;
      },
      label: () => (ctx, card, part) => {
        const el = ctx.util.el;
        const head = el('div', 'booking-heading', card);
        const icon = el('div', 'booking-icon', head);
        const paths = {
          'type-text': '<circle cx="16" cy="10" r="5" fill="currentColor" stroke="none"/><path d="M6 28v-3c0-8 20-8 20 0v3Z" fill="currentColor" stroke="none"/>',
          'choose-option': '<circle cx="16" cy="16" r="12"/><ellipse cx="16" cy="16" rx="6" ry="12"/><path d="M4 16h24M6 10h20M6 22h20"/>',
          'set-date': '<rect x="6" y="7" width="21" height="22" rx="2"/><path d="M6 13h21M11 4v6M22 4v6M11 18h7M11 18v6M11 21h4"/>'
        };
        icon.innerHTML = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[part.task] || paths['choose-option']) + '</svg>';
        const text = el('div', 'booking-heading-text', head);
        const titles = { 'type-text': 'Guest Information', 'set-date': 'Stay Dates' };
        el('h2', '', text, titles[part.task] || part.spec.title || part.label);
        const subtitles = {
          'type-text': 'Tell us who’s staying.',
          'choose-option': /language/i.test(part.spec.label || '') ? 'Choose the language for captions.' : 'Choose your preferences for your stay.',
          'set-date': 'Select your check-in date and length of stay.'
        };
        el('p', '', text, subtitles[part.task] || '');
        return head;
      },
      boxWidth: (base) => (ctx, look, at) => {
        base(ctx, look, at);
        return Math.max(240, Math.floor(ctx.stage.clientWidth * .47) - 54);
      },
      section: (base) => (ctx, entry) => {
        base(ctx, entry);
        // Retain all original field elements and their bindings, while presenting
        // sampled inline/floating forms as the reference's stacked form.
        if (entry.part.task === 'type-text') {
          for (const field of entry.box.querySelectorAll('.ft-field')) {
            const label = field.querySelector('.ft-label');
            if (label) field.prepend(label);
            else {
              const input = field.querySelector('.ft-input');
              if (input) {
                const lab = ctx.util.el('label', 'ft-label', null, input.getAttribute('aria-label'));
                lab.htmlFor = input.id;
                field.prepend(lab);
              }
            }
          }
        }
        if (entry.part.task === 'set-date') {
          const card = entry.box.querySelector('.fd-card');
          if (card) {
            const details = ctx.util.el('div', 'booking-details', card);
            for (const row of card.querySelectorAll('.fd-ex,.fd-notes')) details.append(row);
          }
        }
      }
    }
  },
});
