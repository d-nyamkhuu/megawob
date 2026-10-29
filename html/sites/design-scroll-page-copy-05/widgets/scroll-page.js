// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-copy-05',
  name: 'design',
  split: 'train',
  scenarios: ['copy'],
  template: 'scroll-page/longform',
  design: {
    parts: {
      frame(base, S) {
        return (st) => {
          const frame = base(st);
          if (st.spec.scenario === 'copy' && frame.layout !== 'rail') {
            frame.wrap.classList.remove(frame.layout);
            frame.wrap.classList.add('rail');
            frame.layout = 'rail';
            const rail = st.el('aside', 'ps-rail', frame.wrap);
            st.el('h4', '', rail, 'Related Records');
            const cols = st.el('div', 'ps-record-cols', rail);
            ['Date', 'Type', 'Title'].forEach((x) => st.el('span', '', cols, x));
            for (const title of ['Find Your Order Number', 'Track Your Order', 'Returns and Refunds', 'Store Pickup Orders', 'Shipping Information']) st.el('span', '', rail, title);
          }
          return frame;
        };
      },
      rail(base, S) {
        return (st, wrap) => {
          base(st, wrap);
          const rail = wrap.querySelector('.ps-rail');
          if (!rail) return;
          rail.querySelector('h4').textContent = 'Related Records';
          const firstRecord = rail.querySelector(':scope > span');
          const cols = st.el('div', 'ps-record-cols', rail);
          ['Date', 'Type', 'Title'].forEach((x) => st.el('span', '', cols, x));
          rail.insertBefore(cols, firstRecord);
          for (const title of ['Changing or Canceling an Order', 'Account Settings', 'Payment Methods', 'Using a Gift Card', 'Common Order Questions', 'Troubleshooting Order Issues', 'Contacting Customer Support']) st.el('span', '', rail, title);
        };
      },
      fieldCard(base, S) {
        return (st, parent) => {
          const card = base(st, parent);
          st.el('small', 'order-field-help', card.querySelector('.row'), 'Enter your number to view details, check status, or request help.');
          return card;
        };
      },
      toc(base, S) {
        return (st) => {
          const { spec, main, el, tocEls } = st;
          if (spec.scenario !== 'copy') return base(st);
          const nav = el('nav', 'ps-toc ps-product-tabs', main);
          const entries = spec.sections.map((section) => [section.id, section.heading]);
          if (spec.faq) entries.splice(spec.faq.at + 1, 0, ['faq', 'FAQ']);
          entries.forEach(([id, label]) => {
            const link = el('a', '', nav, label);
            link.href = '#';
            link.dataset.role = 'toc';
            link.addEventListener('click', (event) => {
              event.preventDefault();
              S.P.jump(st, id);
            });
            tocEls[id] = link;
          });
        };
      },
      spacer(base, S) {
        return (st) => {
          const spacer = base(st);
          if (st.spec.scenario !== 'copy') return spacer;
          spacer.classList.add('order-intro');
          spacer.textContent = '';
          st.el('h2', '', spacer, 'Where to find your order number');
          const list = st.el('ol', '', spacer);
          ['Check your order confirmation email.', 'Sign in to your account and view your order history.', 'Look at your receipt (in-store or store pickup).', 'Find it in the confirmation page after checkout.'].forEach((item) => st.el('li', '', list, item));
          st.el('h2', '', spacer, 'Order number formats');
          st.el('p', '', spacer, 'Order numbers are 9 digits, for example 123456789. You can find order numbers for online orders, store pickup orders, and in-store purchases in the locations below.');
          const note = st.el('div', 'order-note', spacer);
          st.el('span', 'order-info', note, 'i');
          st.el('span', '', note, 'Note: Order numbers may also be labeled as Order #, Order Number, or Receipt # depending on the type of purchase.');
          st.el('h2', 'online-orders-title', spacer, 'Online orders');
          const online = st.el('p', '', spacer, 'Your order number appears in the order confirmation email we send after your purchase. It is also listed in your account under ');
          st.el('a', '', online, 'Order History');
          online.append('.');
          return spacer;
        };
      },
      header(base, S) {
        return (st) => {
          const { el, main, spec, rng } = st;
          const serif = spec.kind === 'article' && rng.bool(0.6);
          const head = el('header', 'ps-head ps-product-head', main);
          const brand = el('div', 'web-brand', head, 'Acme Electronics');
          const nav = el('nav', 'web-nav', head);
          ['Products','Orders','Support','Account'].forEach((x) => el('span', '', nav, x));
          const search = el('div', 'web-search', head, 'Search Help');
          el('span', 'web-search-icon', search, '⌕');
          const copy = el('div', 'ps-product-copy', main);
          const crumbs = el('div', 'ps-crumbs', copy);
          el('a', '', crumbs, 'Help Center');
          el('span', '', crumbs, '›');
          el('a', '', crumbs, 'Orders');
          el('span', '', crumbs, '›');
          el('span', '', crumbs, spec.title);
          el('h1', `ps-title${serif ? ' serif' : ''}`, copy, spec.title);
          el('div', 'ps-product-subtitle', copy, 'Your order number is a 9-digit code that appears on your order confirmation email, in your account, and on your receipt.');
          const tools = el('div', 'ps-tools ps-product-tools', copy);
          for (const a of spec.tools) S.P.action(st, tools, a, 'ps-tool');
          return head;
        };
      },
    },
  },
});
