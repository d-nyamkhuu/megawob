// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-roach-01',
  name: 'design',
  split: 'train',
  scenarios: ['roach'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '15px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    windowRadius: '10px',
    windowShadow: '0 2px 5px rgba(15, 28, 44, .12), 0 12px 28px rgba(15, 28, 44, .2)',
    colors: { '--b': '#0074dd', '--bs': '#e8f3fc', '--bfg': '#fff', '--ad': '#17a34a' },
    parts: {
      main: (base, S) => (sc, parent, model) => {
        const { ctx } = S;
        const el = ctx.util.el;
        const root = el('section', 'sd-main bp-subwindow', parent);
        const title = el('h2', 'bp-subwindow-title', root, 'Your Subscription');
        const card = el('div', 'bp-membership-card', root);
        const product = el('div', 'bp-product', card);
        const icon = el('div', 'bp-book-icon', product);
        icon.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 13c9-4 17-2 24 4v37C24 48 16 46 8 50V13zm48 0c-9-4-17-2-24 4v37c8-6 16-8 24-4V13z" fill="none" stroke="white" stroke-width="3.5" stroke-linejoin="round"/><path d="M13 17v28m38-28v28" fill="none" stroke="white" stroke-width="2"/></svg>';
        const copy = el('div', 'bp-product-copy', product);
        const name = el('div', 'bp-product-name', copy, 'Brightpage Books');
        const plan = el('div', 'bp-product-plan', copy, 'Monthly Membership');
        const description = el('div', 'bp-product-description', copy, 'Unlimited access to our eBook library, exclusive member content and special offers.');
        const details = el('div', 'bp-details', card);
        const content = el('div', 'bp-task-content', details);
        S.P.blocks(sc.blocks, content, model);

        // Reserve room for every task control before adding the decorative header.
        // All measurements and adjustments happen during render, before anchoring.
        const limit = Math.min(root.clientHeight || parent.clientHeight || ctx.size.height, ctx.size.height);
        const px = (node, key) => parseFloat(getComputedStyle(node)[key]) || 0;
        const spacing = (node) => px(node, 'paddingTop') + px(node, 'paddingBottom') + px(node, 'borderTopWidth') + px(node, 'borderBottomWidth');
        const budget = () => limit - spacing(root) - title.offsetHeight - px(title, 'marginTop') - px(title, 'marginBottom') - spacing(card) - spacing(details) - content.offsetHeight;
        card.style.overflow = 'visible';
        if (budget() < 150) {
          root.style.padding = '8px';
          card.style.padding = '12px';
          title.style.fontSize = '24px';
          title.style.margin = '0 0 8px';
          details.style.paddingTop = '8px';
        }
        let room = budget();
        if (room < 150) {
          description.remove();
          name.style.fontSize = '22px';
          plan.style.fontSize = '18px';
          const iconSize = Math.max(40, Math.min(76, room - 10));
          Object.assign(icon.style, { width: `${iconSize}px`, height: `${iconSize}px` });
          icon.firstElementChild.style.width = '80%';
          icon.firstElementChild.style.height = '80%';
          product.style.gap = '14px';
        }
        product.style.minHeight = '0';
        product.style.paddingBottom = '8px';
        if (product.offsetHeight > room || room < 60) product.remove();
        if (root.scrollHeight > limit) {
          title.remove();
          product.remove();
          root.style.padding = '0';
          root.style.border = '0';
          card.style.padding = '0';
          card.style.border = '0';
          details.style.padding = '0';
        }
        return root;
      },
      decorated: (base, S) => (ctx) => {
        const el = ctx.util.el;
        const stage = ctx.stage;
        const head = el('div', 'bp-pagehead', stage);
        el('div', 'bp-title', head, 'Account');
        const tabs = el('div', 'bp-tabs', head);
        for (const [i, label] of ['Overview', 'Purchase History', 'Membership', 'Personal Details'].entries()) {
          el('span', i === 0 ? 'bp-tab active' : 'bp-tab', tabs, label);
        }
        const library = el('section', 'bp-library', stage);
        el('h2', 'bp-library-title', library, 'Library');
        const books = el('div', 'bp-book-list', library);
        for (const [title, author, art] of [
          ['The Silent Shore', 'A. R. Shaw', 'shore'],
          ['Deep Peaks', 'Laura McKay', 'peaks'],
          ['The Last Horizon', 'Daniel Gray', 'horizon'],
        ]) {
          const item = el('div', 'bp-book-item', books);
          el('div', `bp-cover bp-cover-${art}`, item);
          el('div', 'bp-book-title', item, title);
          el('div', 'bp-book-author', item, author);
        }
      },
    }
  },
});
