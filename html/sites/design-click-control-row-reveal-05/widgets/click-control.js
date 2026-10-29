// Design on templates/click-control/base.js: the base site's click-control widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'click-control',
  site: 'design-click-control-row-reveal-05',
  name: 'design',
  split: 'train',
  scenarios: ['row-reveal'],
  template: 'click-control/base',
  design: {
    parts: {
      frame: (base) => (ctx) => {
        // Keep the template's seeded frame draws, then size the desk to the stage.
        const frame = base(ctx);
        const { page, content, h1 } = frame;
        Object.assign(page.style, { left: '0px', top: '0px', bottom: '0px', width: ctx.size.width + 'px' });
        page.classList.add('chronicle-page');
        const nav = page.querySelector('.uc-nav');
        nav.hidden = true;
        nav.style.display = 'none';
        const body = page.querySelector('.uc-body');
        body.classList.add('chronicle-body');
        const side = page.querySelector('.uc-side');
        if (side) { side.hidden = true; side.style.display = 'none'; }
        const el = ctx.util.el;
        const tree = el('aside', 'nw-tree', body);
        el('h2', '', tree, 'Project Space');
        const project = el('div', 'nw-project', tree);
        el('span', 'nw-arrow', project, '▾');
        el('i', 'nw-folder', project);
        el('strong', '', project, 'Mercury Initiative');
        ['Project Overview', 'Planning', 'Design', 'Marketing', 'Launch', 'Archive'].forEach((label, i) => {
          const item = el('div', 'nw-folder-row' + (i === 2 ? ' selected' : ''), tree);
          el('i', 'nw-folder', item);
          el('span', '', item, label);
        });
        el('h3', '', tree, 'Other Projects');
        ['Apollo', 'Gemini', 'Orion'].forEach(label => {
          const item = el('div', 'nw-folder-row other', tree);
          el('i', 'nw-folder', item);
          el('span', '', item, label);
        });
        const help = el('aside', 'nw-help', body);
        el('h2', '', help, 'Help & Tips');
        const helpBody = el('div', 'nw-help-body', help);
        el('h3', '', helpBody, 'Working with files');
        const tips = el('ul', '', helpBody);
        ['Hover over a file row to see quick actions.', 'Use the Options menu (•••) for more actions.', 'Files sync automatically with your project team.'].forEach(t => el('li', '', tips, t));
        el('h3', '', helpBody, 'File types');
        [['word', 'Microsoft Word Document'], ['excel', 'Microsoft Excel Spreadsheet'], ['powerpoint', 'Microsoft PowerPoint Presentation'], ['pdf', 'PDF Document'], ['image', 'Image File'], ['text', 'Text Document'], ['other', 'Other File']].forEach(([type, label]) => {
          const line = el('div', 'nw-legend', helpBody);
          el('i', 'nw-file ' + type, line);
          el('span', '', line, label);
        });
        el('h3', '', helpBody, 'Common tasks');
        const tasks = el('ul', '', helpBody);
        ['Open a file to view it online.', 'Download a copy for offline use.', 'Share a file with your team.', 'Stop syncing a file if you no longer need updates.'].forEach(t => el('li', '', tasks, t));
        const main = content.parentElement;
        main.classList.add('chronicle-main');
        const crumb = main.querySelector('.uc-crumb');
        crumb.hidden = false;
        crumb.textContent = 'Mercury Initiative　 >　 Design';
        h1.classList.add('chronicle-list-title');
        h1.textContent = 'Project Files';
        main.insertBefore(h1, crumb);
        const band = ctx.util.el('div', 'chronicle-record', main);
        const reserve = 36 + ctx.spec.rows.length * 29 + 52;
        const bandHeight = Math.max(64, Math.min(244, ctx.size.height - reserve - 18));
        band.style.height = bandHeight + 'px';
        main.insertBefore(band, h1);
        content.classList.add('chronicle-content');
        return frame;
      },
      box: (base) => (ctx, content, opts) => {
        const box = base(ctx, content, opts);
        box.classList.add('chronicle-box');
        return box;
      },
      buildRowReveal: (base) => (ctx, content, up, page) => {
        const view = base(ctx, content, up, page);
        const table = content.querySelector('.uc-table');
        table.style.width = '100%';
        table.style.maxWidth = 'none';
        table.style.tableLayout = 'fixed';
        const el = ctx.util.el;
        const headers = Array.from(table.querySelectorAll('th'));
        const rowNodes = Array.from(table.querySelectorAll('tr')).filter(row => row.querySelector('td'));
        const fileTypes = ['word', 'powerpoint', 'image', 'word', 'image', 'text', 'image', 'pdf', 'image', 'word', 'excel'];
        const descriptions = { word: 'Microsoft Word Document', powerpoint: 'Microsoft PowerPoint Presentation', image: 'PNG Image', text: 'Text Document', pdf: 'SVG Image', excel: 'Microsoft Excel Spreadsheet' };
        const sizes = ['245 KB', '1.4 MB', '96 KB', '52 KB', '310 KB', '12 KB', '620 KB', '87 KB', '1.1 MB', '173 KB', '190 KB'];
        // Retain each row and its name/action elements: the template owns their listeners and anchors.
        if (headers.length >= 3) {
          headers[0].textContent = 'Name ▴';
          headers[1].textContent = 'Size';
          headers[2].textContent = 'Type';
          const headRow = headers[0].parentElement;
          const actionHeader = headers[3] || null;
          const modified = el('th', 'nw-modified', null, 'Modified');
          const author = el('th', 'nw-author', null, 'Modified By');
          headRow.insertBefore(modified, actionHeader);
          headRow.insertBefore(author, actionHeader);
          rowNodes.forEach((row, i) => {
            const cells = Array.from(row.children);
            if (cells.length < 3) return;
            const type = fileTypes[i % fileTypes.length];
            const icon = el('i', 'nw-file ' + type, null);
            cells[0].insertBefore(icon, cells[0].firstChild);
            cells[0].classList.add('nw-name');
            cells[1].textContent = sizes[i % sizes.length];
            cells[2].textContent = descriptions[type];
            const actionCell = cells[3] || null;
            const date = el('td', 'nw-modified', null, 'Apr ' + (2 + Math.floor(i / 3)) + ', 2021 ' + ['10:14 AM', '3:27 PM', '9:01 AM'][i % 3]);
            const author = el('td', 'nw-author', null, ['Dana Kim', 'Luis Ortega', 'Maya Chen', 'Pat Singh', 'Jordan Ellis'][i % 5]);
            row.insertBefore(date, actionCell);
            row.insertBefore(author, actionCell);
            if (actionCell) actionCell.classList.add('nw-row-actions');
          });
          if (actionHeader) actionHeader.classList.add('nw-action-header');
        }
        // Leave room for every row, including its concealed action buttons.
        const height = content.getBoundingClientRect().height;
        table.style.setProperty('--rowh', Math.min(40, Math.max(28, Math.floor((height - 38) / ctx.spec.rows.length))) + 'px');
        return view;
      },
    },
  },
});
