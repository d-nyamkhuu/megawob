// Design on templates/site/form-pick-autocomplete-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-choose-option-tags-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/choose-option-autocomplete-01',
    design: {
      parts: {
        'frame.29': (base) => c => {
          base(c);
          if (c.placement === 'footer' && c.label === 'Submit') { c.placement = 'header'; c.label = 'Continue'; }
        },
        frame: (base) => ctx => {
          const result = base(ctx), u = ctx.util;
          const svg = (path, cls, parent, fill = 'none') => {
            const box = u.el('span', cls, parent);
            box.innerHTML = '<svg viewBox="0 0 48 48" fill="' + fill + '" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
            return box;
          };
          const top = document.querySelector('.ds-top');
          const keep = [...document.querySelectorAll('.ds-header-tools .ds-xtra, .ds-submit-head, .ds-header-note > .ds-xtra')];
          top.replaceChildren();
          const brand = u.el('div', 'hz-brand', top);
          svg('<path stroke="none" fill="#a8f52e" d="M4 41C0 19 13 3 32 3h12v12c0 21-17 29-33 27l17-17-3-3L6 41z"/>', 'hz-leaf', brand);
          u.el('span', '', brand, 'Horizon');
          const tools = u.el('div', 'hz-tools', top);
          const paths = [
            '<circle cx="20" cy="20" r="13"/><path d="m30 30 12 12"/>',
            '<circle cx="24" cy="24" r="19"/><path d="M18 17c0-8 15-8 13 1-1 5-7 4-7 10"/><circle cx="24" cy="35" r="1" fill="currentColor" stroke="none"/>',
            '<circle cx="24" cy="24" r="22" fill="#f2f3f3" stroke="none"/><circle cx="24" cy="18" r="7" fill="#8f9496" stroke="none"/><path d="M12 37v-3c0-10 24-10 24 0v3z" fill="#8f9496" stroke="none"/>'
          ];
          paths.forEach((p, i) => {
            const b = u.el('button', 'hz-tool', tools); b.type = 'button'; b.setAttribute('aria-label', ['Search', 'Help', 'Profile'][i]);
            svg(p, '', b); b.addEventListener('click', () => env.log('decoy', { label: ['Search', 'Help', 'Profile'][i] }));
          });
          keep.forEach(el => tools.append(el));
          const stage = result.stage;
          const main = document.querySelector('.ds-main');
          const work = u.el('section', 'hz-work', main);
          main.insertBefore(work, stage); work.append(stage);
          const marker = stage.querySelector('.ds-swiss-label'); marker.replaceChildren();
          work.append(marker);
          u.el('h1', '', marker, 'Create a Listing');
          const row = u.el('div', 'hz-title-row', work);
          const titleLabel = u.el('label', 'hz-label', row, 'Title'); titleLabel.htmlFor = 'listing-title';
          const title = u.el('input', 'hz-static-input', row); title.id = 'listing-title'; title.type = 'text'; title.value = 'Weekend Ideas';
          const description = u.el('div', 'hz-description-row', work);
          const descriptionLabel = u.el('label', 'hz-label', description, 'Description'); descriptionLabel.htmlFor = 'listing-description';
          const area = u.el('textarea', 'hz-description', description); area.id = 'listing-description';
          const tips = u.el('aside', 'hz-tips', main);
          u.el('h2', '', tips, 'Tips');
          const help = [
            ['<path d="M7 7h15l20 20a4 4 0 0 1 0 5L30 44a4 4 0 0 1-5 0L5 24V10a3 3 0 0 1 2-3z"/><circle cx="14" cy="16" r="2" fill="currentColor"/>', 'Add up to a few topics\nto help people find\nyour listing.'],
            ['<circle cx="20" cy="20" r="14"/><path d="m31 31 12 12"/>', 'Start typing to see\nmatching topics, then\nselect the ones you want.'],
            ['<circle cx="24" cy="12" r="8"/><circle cx="12" cy="36" r="8"/><circle cx="36" cy="36" r="8"/>', 'You can choose\nmultiple topics.']
          ];
          help.forEach(([p, text]) => { const item = u.el('div', 'hz-tip', tips); svg(p, 'hz-tip-icon', item); u.el('p', '', item, text); });
          const note = document.querySelector('.ds-brief'); if (note) document.querySelector('.ds-content').append(note);
          const toast = document.querySelector('.ds-toast'); if (toast) tips.append(toast);
          document.querySelector('.ds-travel-cancel')?.remove();
          document.body.classList.toggle('hz-has-header-note', !!document.querySelector('.ds-header-note'));
          return result;
        },
        overlay: (base) => ctx => {
          const result = base(ctx);
          if (ctx.kind === 'banner') {
            const above = document.querySelector('.ds-header-note') || document.querySelector('.ds-top');
            result.el.style.top = above.getBoundingClientRect().bottom + 'px';
            const icon = ctx.util.el('span', 'hz-announcement-icon', result.el);
            icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h5l10-5v16L9 15H4zM7 15l2 6h4l-2-5M21 8v8"/></svg>';
            result.el.prepend(icon);
          }
          return result;
        }
      }
    },
  });
})();
