// Keep the community sheet's layout inside the stage during the template render.
env.widget({
  task: 'click-control',
  site: 'design-click-control-rows-05',
  name: 'design',
  split: 'train',
  scenarios: ['rows'],
  template: 'click-control/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        const frame = base(ctx);
        Object.assign(frame.page.style, {
          left: '0px', top: '0px', bottom: '0px', width: ctx.size.width + 'px',
        });
        frame.page.querySelector('.uc-nav').hidden = true;
        frame.page.querySelector('.uc-nav').style.display = 'none';
        frame.page.querySelector('.uc-crumb').hidden = true;
        frame.h1.textContent = 'Files';
        Object.assign(frame.h1.style, {
          height: '77px', flex: 'none', margin: '0', padding: '16px 0 8px',
        });
        Object.assign(frame.content.parentElement.style, { minHeight: '0', gap: '0' });
        frame.content.style.padding = '0';
        const util = ctx.util;
        const head = document.querySelector('.community .head');
        if (head && !head.querySelector('.library-search')) {
          const search = util.el('div', 'library-search', head);
          const input = util.el('input', '', search);
          input.type = 'text';
          input.placeholder = 'Search files, people, subjects...';
          input.setAttribute('aria-label', 'Search files, people, subjects');
          const button = util.el('button', '', search, '⌕');
          button.type = 'button';
          button.setAttribute('aria-label', 'Search');
          button.addEventListener('click', () => env.log('search', { query: input.value }));
        }
        const center = document.querySelector('.community .center');
        if (center && !center.querySelector('.library-filters')) {
          util.el('div', 'library-heading', center, 'Files');
          const filters = util.el('div', 'library-filters', center);
          util.el('span', '', filters, 'View:');
          const view = util.el('button', 'library-choice', filters, 'All Files');
          view.type = 'button';
          view.addEventListener('click', () => env.log('view', { label: 'All Files' }));
          util.el('span', '', filters, 'Sort by:');
          const sort = util.el('button', 'library-choice', filters, 'Date Modified (Newest)');
          sort.type = 'button';
          sort.addEventListener('click', () => env.log('sort', { label: 'Date Modified (Newest)' }));
        }
        if (center) {
          const placePanelNote = () => {
            const panelNote = document.querySelector('.instruction[data-display="panel"]');
            if (!panelNote) return false;
            if (!panelNote.classList.contains('library-panel-note')) {
              center.appendChild(panelNote);
              panelNote.classList.add('library-panel-note');
            }
            return true;
          };
          if (!placePanelNote()) {
            const observer = new MutationObserver(() => { if (placePanelNote()) observer.disconnect(); });
            observer.observe(document.body, { childList: true, subtree: true });
          }
        }
        const rail = document.querySelector('.community nav.rail');
        if (rail && !rail.querySelector('.library-nav-item')) {
          for (const node of Array.from(rail.childNodes)) if (node.nodeType === 3) node.textContent = '';
          const icons = {
            Catalog: '<path d="M3 6Q12 3 21 7v25Q12 28 3 31zM21 7q9-4 18-1v25q-9-3-18 1zM21 7v25M7 11q5-2 10 0M7 16q5-2 10 0M25 11q5-2 10 0M25 16q5-2 10 0"/>',
            Files: '<path d="M9 3h17l8 8v29H9zM26 3v9h8M14 19h15M14 24h15M14 29h13"/>',
            People: '<circle cx="20" cy="11" r="5"/><circle cx="9" cy="15" r="4"/><circle cx="31" cy="15" r="4"/><path d="M11 35v-8q0-8 9-8t9 8v8zM2 34v-8q0-7 7-7M38 34v-8q0-7-7-7"/>',
            Subjects: '<path d="M3 5h18l18 18-16 16L3 19z"/><circle cx="11" cy="12" r="2"/>',
            Collections: '<path d="M8 10h28v6H8zM5 20h28v6H5zM8 30h28v6H8zM12 4h24v5H12z"/>',
            Settings: '<circle cx="21" cy="21" r="7"/><path d="M18 2h6l2 6 5 2 6-2 4 6-5 5v5l5 5-4 6-6-2-5 2-2 6h-6l-2-6-5-2-6 2-4-6 5-5v-5l-5-5 4-6 6 2 5-2z"/>'
          };
          for (const label of Object.keys(icons)) {
            const item = util.el('div', 'library-nav-item', rail);
            item.innerHTML = `<svg viewBox="0 0 42 42" aria-hidden="true">${icons[label]}</svg><span>${label}</span>`;
            item.addEventListener('click', () => env.log('decoy', { what: 'sidebar', label }));
          }
        }
        const decoratePromo = () => {
          const popup = document.querySelector('.perturb.promo');
          if (!popup) return false;
          if (popup.classList.contains('library-promo')) return true;
          popup.classList.add('library-promo');
          popup.querySelector('strong').textContent = 'Stay in the loop';
          popup.querySelector('p').textContent = 'Get the latest news, event updates, and special collections highlights delivered to your inbox.';
          const form = util.el('div', 'library-promo-form', popup);
          const email = util.el('input', '', form);
          email.type = 'email';
          email.placeholder = 'Your email address';
          email.setAttribute('aria-label', 'Your email address');
          const subscribe = util.el('button', '', form, 'Subscribe');
          subscribe.type = 'button';
          subscribe.addEventListener('click', () => env.log('decoy', { label: 'Subscribe' }));
          util.el('small', 'library-promo-caption', popup, 'No spam. Unsubscribe anytime.');
          return true;
        };
        if (!decoratePromo()) {
          const promoObserver = new MutationObserver(() => { if (decoratePromo()) promoObserver.disconnect(); });
          promoObserver.observe(document.body, { childList: true, subtree: true });
        }
        return frame;
      },
      box: (base) => (ctx, content, opts) => {
        const box = base(ctx, content, opts);
        Object.assign(box.style, {
          width: '100%', flex: '1 1 0', minHeight: '0', overflow: 'auto', padding: '0',
        });
        return box;
      },
      buildRows: (base) => (ctx, content, up) => {
        const rows = base(ctx, content, up);
        const table = content.querySelector('.uc-rows');
        const pageRoot = content.closest('.uc-page') || content.parentElement;
        const menu = Array.from(pageRoot.querySelectorAll('*')).find((el) => {
          const t = el.textContent || '';
          return t.includes('Templates') && t.includes('Overview') && t.includes('Calendar') && t.length < 150 && el.clientWidth >= 100 && el.clientWidth <= 250;
        });
        if (menu) {
          menu.style.display = 'none';
          Object.assign(content.parentElement.style, { width: '100%', marginLeft: '0', flex: '1 1 auto' });
          content.style.width = '100%';
        }
        Object.assign(table.style, { width: '100%', maxWidth: 'none', tableLayout: 'fixed' });
        const initialHeads = Array.from(table.querySelectorAll('th'));
        if (initialHeads.length >= 4) {
          initialHeads[0].textContent = 'Name  ▲';
          initialHeads[1].textContent = 'Type';
          initialHeads[2].textContent = 'Size';
          const actionHead = initialHeads[initialHeads.length - 1];
          for (const label of ['Date Modified', 'Added By', 'Subject']) {
            const th = document.createElement('th');
            th.textContent = label;
            actionHead.before(th);
          }
          const dates = ['25 Oct 2021 14:32','14 Oct 2021 09:17','11 Oct 2021 16:03','12 Oct 2021 08:55','5 Oct 2021 10:21','1 Oct 2021 13:48','28 Sep 2021 11:06','22 Sep 2021 15:20','18 Sep 2021 09:14','10 Sep 2021 12:37'];
          const by = ['E. Carter','E. Carter','L. Nguyen','M. Lawson','E. Carter','S. Patel','M. Lawson','S. Patel','L. Nguyen','E. Carter'];
          const bodies = Array.from(table.querySelectorAll('tr')).slice(1);
          bodies.forEach((row, i) => {
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length < 3) return;
            cells[2].dataset.size = ['2.4 MB','1.8 MB','3.1 MB','1.2 MB','2.7 MB','4.1 MB','2.0 MB','1.6 MB','2.3 MB','1.9 MB'][i % 10];
            const subject = cells[2].textContent;
            const actionCell = cells.find((cell) => cell.querySelector('.uc-acts')) || cells[cells.length - 1];
            for (const value of [dates[i % 10], by[i % 10], subject]) {
              const td = document.createElement('td');
              td.textContent = value;
              actionCell.before(td);
            }
            cells[0].classList.add('library-file-name');
          });
          let inspector = document.querySelector('.community .library-inspector');
          if (!inspector) inspector = ctx.util.el('aside', 'library-inspector', document.body);
          if (bodies[0]) {
            const name = bodies[0].querySelector('td')?.textContent || '';
            inspector.innerHTML = `<span class="library-inspect-icon"></span><strong></strong><i></i><span>Keynote Presentation</span><b>•</b><span>2.4 MB</span><i></i><span>Added by: E. Carter</span><i></i><span>Date modified: 25 Oct 2021 14:32</span><i></i><span></span>`;
            inspector.querySelector('strong').textContent = name;
            inspector.querySelector('span:last-child').textContent = 'Subject: ' + (bodies[0].querySelectorAll('td')[5]?.textContent || 'Correspondence');
          }
        }
        const heads = table.querySelectorAll('th');
        ['30%','15%','9%','15%','14%','17%','1px'].forEach((w,i) => { if (heads[i]) heads[i].style.width = w; });
        const compact = parseFloat(getComputedStyle(heads[0]).fontSize) <= 15;
        for (const head of heads) {
          head.style.height = compact ? '34px' : '43px';
          head.style.padding = compact ? '4px 6px' : '7px 12px';
        }
        // Reserve real space for the revealed controls; long values stay in their columns.
        const actions = table.querySelector('.uc-acts');
        const buttons = Array.from(actions.children);
        const actionWidth = buttons.reduce((sum, button) => sum + button.getBoundingClientRect().width, 0)
          + Math.max(0, buttons.length - 1) * 4 + 22;
        heads[heads.length - 1].style.width = '1px';
        for (const cell of table.querySelectorAll('td')) {
          cell.style.overflow = 'hidden';
          cell.style.padding = compact ? '0 6px' : '0 12px';
        }
        const pane = table.parentElement;
        const header = heads[0].parentElement;
        // Measure the actual pane after the instruction has taken its space.
        if (pane.clientHeight < header.getBoundingClientRect().height + ctx.spec.rows.length * 28 + 2) {
          const main = content.parentElement;
          Object.assign(main.querySelector('.uc-h1').style, {
            height: '40px', fontSize: '30px', padding: '0 0 4px',
          });
          Object.assign(main.style, { paddingTop: '4px', paddingBottom: '4px', gap: '4px' });
          for (const head of heads) Object.assign(head.style, { height: '32px', padding: '4px 6px' });
        }
        const rowHeight = Math.max(24, Math.min(40,
          Math.floor((pane.clientHeight - header.getBoundingClientRect().height - 2) / ctx.spec.rows.length)));
        table.style.setProperty('--rowh', rowHeight + 'px');
        if (rowHeight < 28) {
          for (const cell of table.querySelectorAll('td')) cell.style.fontSize = '15px';
          for (const button of table.querySelectorAll('.uc-act')) {
            Object.assign(button.style, { height: '22px', fontSize: '12px' });
          }
        }
        return rows;
      },
    },
  },
});
