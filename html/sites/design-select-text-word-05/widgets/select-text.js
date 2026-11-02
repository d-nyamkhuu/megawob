// Document-grid presentation; the template owns sizing, scrolling and selection.
env.widget({
  task: 'select-text',
  site: 'design-select-text-word-05',
  name: 'design',
  split: 'train',
  scenarios: ['word'],
  template: 'select-text/base',
  design: {
    parts: {
      'paragraphs.render': (base, S) => function (ctx) {
        const result = base(ctx);
        const text = ctx.stage.querySelector('.hl-text');
        if (text) {
          const titles = ['Project Ideas', 'Meeting Notes', 'Spring Planning', 'Kitchen Remodel', 'Gift Ideas', 'Book List', 'Weekend Trip', 'Budget', 'Car Maintenance', 'Health Notes'];
          const dates = ['Mar 3, 2010', 'Mar 2, 2010', 'Feb 28, 2010', 'Feb 24, 2010', 'Feb 20, 2010', 'Feb 18, 2010', 'Feb 14, 2010', 'Feb 10, 2010', 'Feb 5, 2010', 'Feb 1, 2010'];
          const previews = ['A list of possible gifts for family and friends...', 'Titles to check out at the library this month...', 'Ideas for our weekend getaway, including places to see...', 'Updated expenses and reviewed monthly budget...', 'Service schedule and notes from last visit...', 'Notes from recent checkup and follow-up items...'];
          const rows = Array.from(text.querySelectorAll(':scope > p'));
          if (!ctx.spec.pane && rows.length >= 5) text.classList.add('note-compact');
          rows.forEach((row, i) => {
            row.classList.add('note-row');
            const title = ctx.util.el('span', 'note-title', row, titles[i] || `Note ${i + 1}`);
            const date = ctx.util.el('span', 'note-date', row, dates[i] || 'Feb 2010');
            title.dataset.skip = '1';
            date.dataset.skip = '1';
          });
          if (!ctx.spec.pane && rows.length && rows[rows.length - 1].getBoundingClientRect().bottom > ctx.stage.getBoundingClientRect().bottom - 8) text.classList.add('note-compact');
          for (let i = rows.length; i < 10 && rows.length < 5; i++) {
            const row = ctx.util.el('div', 'note-row note-extra', text);
            row.dataset.skip = '1';
            ctx.util.el('span', 'note-title', row, titles[i]);
            ctx.util.el('span', 'note-date', row, dates[i]);
            ctx.util.el('span', 'note-preview', row, previews[(i - rows.length) % previews.length]);
          }
          const nh = ctx.util.el('div', 'note-head', null);
          nh.dataset.skip = '1';
          for (const t of ['Title', 'Modified', 'Content Preview']) ctx.util.el('span', '', nh, t);
          text.insertBefore(nh, text.firstChild);
          if (S.scroller) S.scroller.init(S.sel);
        }
        return result;
      },
      ensureStyle: (_base, S) => () => env.util.css('hl-style', S.CSS + `
        .bauhaus .stage .hl-card {
          flex: 1 1 0; min-width: 0; max-width: calc(100% - 60px); align-self: flex-start;
          border: 0; border-radius: 0; background: transparent; box-shadow: none;
        }
        .bauhaus .stage .hl-card:not(:has(.hl-pane)) { min-height: calc(100% - 32px); }
        .bauhaus .stage .hl-head, .bauhaus .stage .hl-foot { display: none; }
        .bauhaus .stage .hl-text {
          flex: 1; display: flex; flex-direction: column;
          padding: 0; border: 1px solid #dedbd3; background: #fffdf8;
          font: 24px/1.35 Georgia, 'Times New Roman', serif; counter-reset: hl-par;
        }
        .bauhaus .stage .hl-text::before {
          content: 'Title                    Modified                Content Preview'; white-space: pre; display: block;
          box-sizing: border-box; flex: none; height: 68px; padding: 14px 22px 12px 30px;
          background: linear-gradient(90deg,transparent 22%,#c9c0ae 22.1%,transparent 22.25%,transparent 43%,#c9c0ae 43.1%,transparent 43.25%),linear-gradient(#fffdf7,#eae4d9); border-bottom: 1px solid #bdb3a4;
          font: bold 24px/40px Georgia, 'Times New Roman', serif; color: #171513;
        }
        .bauhaus .stage .hl-text p {
          position: relative; box-sizing: border-box; flex: 0 0 80px; min-height: 80px;
          margin: 0; padding: 14px 20px 10px 43%; border-bottom: 1px solid #d8d2c7;
          text-indent: 0; color: #171513;
        }
        .bauhaus .stage .hl-text p + p { margin-top: 0; }
        .bauhaus .stage .hl-text:has(p:nth-of-type(5)) p {
          padding-top: 0; padding-bottom: 0; line-height: 1.25;
        }
        .bauhaus .stage .hl-text:has(p:nth-of-type(5))::before {
          box-sizing: border-box; height: 48px; padding-block: 8px;
          font-size: 16px; line-height: 32px;
        }
        .bauhaus .stage .hl-text:has(p:nth-of-type(5)) p::before {
          top: 0; height: 100%; font-size: inherit; line-height: inherit;
        }
        .bauhaus .stage .hl-text p:last-child { border-bottom: 0; }
        .bauhaus .stage .hl-panerow { overflow-y: auto !important; max-height: 100%; }
        .bauhaus .stage .hl-text p::before {
          content: counter(hl-par); position: absolute; left: 0; top: 0;
          box-sizing: border-box; width: 22%; height: 100%; padding: 14px 20px;
          border-right: 1px solid #d3ccbf; text-align: left;
          font: 24px/1.35 Georgia, 'Times New Roman', serif; color: #171513;
        }
        .bauhaus .stage .hl-text p::after {
          content: ''; position: absolute; left: 43%; top: 0; bottom: 0;
          border-left: 1px solid #d3ccbf; pointer-events: none;
        }
        .bauhaus .stage .hl-text::before { display: none !important; }
        .bauhaus .stage .note-head {
          position: relative; display: block; flex: none; height: 68px; box-sizing: border-box;
          background: linear-gradient(#fffdf7,#eae4d9); border-bottom: 1px solid #bdb3a4;
          font: 24px/68px Georgia, 'Times New Roman', serif; color: #171513; user-select: none;
        }
        .bauhaus .stage .note-head span { position: absolute; top: 0; padding-left: 22px; height: 100%; box-sizing: border-box; }
        .bauhaus .stage .note-head span:nth-child(1) { left: 0; width: 22%; }
        .bauhaus .stage .note-head span:nth-child(2) { left: 22%; width: 21%; border-left: 1px solid #c9c0ae; }
        .bauhaus .stage .note-head span:nth-child(3) { left: 43%; border-left: 1px solid #c9c0ae; }
        .bauhaus .stage .hl-text:has(p:nth-of-type(5)) .note-head { height: 48px; font-size: 16px; line-height: 48px; }
        @media (max-width: 1100px) {
          .bauhaus .stage .note-head { height: 48px; font-size: 16px; line-height: 48px; }
          .bauhaus .stage .hl-text::before {
            height: 48px; padding: 7px 12px; line-height: 32px; font-size: 16px;
          }
          .bauhaus .stage .hl-text p { flex-basis: 52px; min-height: 52px; padding: 5px 8px 4px 43%; font-size: 15px; line-height: 1.25; }
          .bauhaus .stage .hl-text p::before {
            left: 0; top: 0; width: 22%; height: 100%; padding: 5px 8px; font-size: 15px;
          }
        }
      `),
    },
  },
});
