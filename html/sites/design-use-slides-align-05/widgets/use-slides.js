// Design on the use-slides/office template; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-align-05',
  name: 'design',
  split: 'train',
  scenarios: ['align'],
  template: 'use-slides/office',
  design: {
    uiFont: 'Arial, "DejaVu Sans", sans-serif',
    brand: 'Presentation', workspace: 'Project Update', documentTitle: 'Project Update',
    slideEyebrow: '', slideFooter: 'A Stronger Community Together', notesLabel: '', notesText: '',
    frameInset: 0, compactAt: 900, tightAt: 650, inspectorAt: 0,
    railWidth: 180, thumbnailPitch: 145, thumbnailHeight: 125,
    canvasInsetX: 0, canvasInsetY: 0, maxScale: 1.6,
    parts: {
      rail(base, S) {
        return function (main) {
          base(main);
          const workspace = main.querySelector('.as-main');
          const rail = main.querySelector('.as-rail');
          const editor = main.querySelector('.as-editor');
          const inspector = main.querySelector('.as-inspector');
          if (workspace) {
            workspace.style.setProperty('display', 'flex', 'important');
            workspace.style.setProperty('flex-direction', 'row', 'important');
            workspace.style.setProperty('position', 'relative', 'important');
            workspace.style.setProperty('min-height', '0', 'important');
          }
          if (rail) {
            rail.style.setProperty('width', '12%', 'important');
            rail.style.setProperty('height', '100%', 'important');
            rail.style.setProperty('flex', '0 0 12%', 'important');
          }
          if (editor) {
            editor.style.setProperty('width', '68%', 'important');
            editor.style.setProperty('flex', '1 1 0', 'important');
            editor.style.setProperty('min-height', '0', 'important');
          }
          if (inspector) {
            inspector.style.setProperty('position', 'absolute', 'important');
            inspector.style.setProperty('inset', '0 0 0 auto', 'important');
            inspector.style.setProperty('width', '20%', 'important');
          }
          const pane = S.refs['pane:rail'];
          const board = pane && pane.querySelector('.as-thumbs');
          if (!board) return;
          board.style.setProperty('position', 'relative', 'important');
          board.style.setProperty('display', 'flex', 'important');
          board.style.setProperty('flex-direction', 'column', 'important');
          board.style.setProperty('align-items', 'center', 'important');
          board.style.setProperty('gap', '12px', 'important');
          board.style.setProperty('width', '100%', 'important');
          board.style.setProperty('height', 'auto', 'important');
          board.style.setProperty('margin', '8px 0', 'important');
          for (const [i, card] of [...board.querySelectorAll('.as-thumb')].entries()) {
            card.style.setProperty('position', 'absolute', 'important');
            card.style.setProperty('inset', 'auto', 'important');
            card.style.setProperty('left', 'auto', 'important');
            card.style.setProperty('top', `${i * 128}px`, 'important');
            card.style.setProperty('transform', 'none', 'important');
            card.style.setProperty('translate', 'none', 'important');
            card.style.setProperty('right', 'auto', 'important');
            card.style.setProperty('bottom', 'auto', 'important');
            card.style.setProperty('display', 'block', 'important');
            card.style.setProperty('visibility', 'visible', 'important');
            card.style.setProperty('opacity', '1', 'important');
            card.style.setProperty('position', 'absolute', 'important');
            card.style.setProperty('flex', '0 0 105px', 'important');
            card.style.setProperty('width', '75%', 'important');
            card.style.setProperty('height', '90px', 'important');
          }
          document.body.querySelector(':scope > .as-rail')?.remove();
          document.body.appendChild(rail);
        };
      },
      thumbnailDecorated(base, S) {
        return function (card, slide, i) {
          base(card, slide, i);
          const u = S.ctx.util;
          u.el('span', 'catalog-thumb-title', card, slide.title);
          const mini = u.el('div', `catalog-mini catalog-mini-${i % 5}`, card);
          if (i % 5 === 1) {
            mini.innerHTML = '<svg viewBox="0 0 125 77" preserveAspectRatio="none" aria-hidden="true"><rect width="125" height="77" fill="#b9d0dd"/><path d="M0 64h125v13H0z" fill="#8f9c6b"/><path d="M12 58V30l19-10 18 10v28M45 60V23L65 8l27 15v37M89 58V30l18-10 14 10v28" fill="#e0cfae" stroke="#a78969" stroke-width="2"/><path d="M45 23h47M65 8l30 16H38z" fill="#b17e5b" stroke="#8c624e"/><path d="M59 60V39h13v21M17 37h9v13h-9zm16 0h9v13h-9zm61 0h9v13h-9zm12 0h9v13h-9z" fill="#546f85" stroke="#927255"/><path d="M0 68q25-9 45 0t40 0 40 0" fill="none" stroke="#5c754a" stroke-width="5"/></svg>';
          } else if (i % 5 === 0) {
            for (const color of ['blue', 'green', 'yellow', 'red']) u.el('i', color, mini);
          } else if (i % 5 === 3) {
            for (let n = 0; n < 4; n++) u.el('i', `bar bar-${n}`, mini);
          } else {
            for (let n = 0; n < 5; n++) u.el('i', `line line-${n}`, mini);
          }
        };
      },
      thumbnailSynced(base, S) {
        return function (el, i, m) {
          base(el, i, m);
          el.style.setProperty('top', `${m.order.indexOf(i) * 128}px`, 'important');
          el.style.setProperty('transform', 'none', 'important');
          el.style.setProperty('translate', 'none', 'important');
        };
      },
      shapeDecorated(base, S) {
        return function (el, shape, i) {
          base(el, shape, i);
          el.classList.add(`catalog-shape-${i}`);
          const label = el.textContent;
          el.replaceChildren();
          S.ctx.util.el('span', 'catalog-shape-label', el, label);
          for (const spot of ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']) S.ctx.util.el('i', `catalog-handle catalog-handle-${spot}`, el);
        };
      },
      slideHeading(base, S) {
        return function (canvas) {
          base(canvas);
          const u = S.ctx.util;
          u.el('div', 'catalog-title-rule', canvas);
          const skyline = u.el('div', 'catalog-skyline', canvas);
          skyline.innerHTML = '<svg viewBox="0 0 430 95" preserveAspectRatio="xMinYMax meet" aria-hidden="true"><g fill="none" stroke="#7d6a4c" stroke-width="1.6" opacity=".85"><path d="M2 88H429M42 84V49l23-8 20 8v35M75 84V41l25-11 25 11v43M115 84V32l22-12 25 12v52M152 84V34l60-27 60 27v50M273 84V39l34-15 28 15v45M335 84V49l25-8 27 8v35M146 31h130M165 37h93M171 78V39h81v39M188 78V40M211 78V40M235 78V40M35 84h363M10 82c3-15 0-27 10-43m0 0c-15-6-16-21 0-25 4-17 22-12 26 0 17-1 16 17 4 23 5 10-4 19-16 16l-14-14M394 83c3-21 2-32 8-50m0 0c-10-6-9-19 4-21 7-12 18-8 23 2 13 2 12 15 3 21 4 11-5 17-16 13l-14-15"/><path d="M167 84V34M180 84V31M244 84V32M257 84V35M91 80V47h20v33M128 80V43h19v37M287 80V47h19v33"/></g><g fill="none" stroke="#7d6a4c" stroke-width=".8" opacity=".8"><path d="M156 40h112M160 46h104M156 52h112M160 58h104M156 64h112M160 70h104M175 72h74M175 66h74M196 34v44M204 34v44M220 34v44M228 34v44M46 52h16M46 58h16M46 64h16M46 70h16M78 46h44M78 52h44M78 58h44M78 64h44M78 70h44M278 46h50M278 52h50M278 58h50M278 64h50M278 70h50M338 52h44M338 58h44M338 64h44M338 70h44"/><path d="M152 34l60-26 60 26M160 34l52-22 52 22M14 70c6-8 14-8 20 0M396 66c6-10 18-10 24 0M20 60c5-8 12-8 16 0M404 56c6-9 16-9 20 0"/><path d="M178 78h6v6h-6zM190 78h6v6h-6zM226 78h6v6h-6zM238 78h6v6h-6z"/></g></svg>';
        };
      },
      alignTools(base, S) {
        return function (tools) {
          base(tools);
          const u = S.ctx.util;
          const buttons = [...tools.querySelectorAll('button')];
          tools.replaceChildren();
          const group = (label, cls) => {
            const box = u.el('div', `catalog-tool-group ${cls}`, tools);
            u.el('b', 'catalog-tool-label', box, label);
            return u.el('div', 'catalog-tool-row', box);
          };
          const align = group('Align', 'catalog-align');
          const glyphs = ['▤', '⊣', '⊢', '⊤', '⊕', '⊥'];
          const R = (x, y, w, h, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${f ? ` fill="${f}"` : ''}/>`;
          const L = (a, b, c, d) => `<path d="M${a} ${b}L${c} ${d}"/>`;
          const ICONS = {
            '▤': L(4, 3, 4, 21) + R(7, 6, 13, 4) + R(7, 14, 8, 4),
            '⊣': L(12, 3, 12, 21) + R(5, 6, 14, 4) + R(8, 14, 8, 4),
            '⊢': L(20, 3, 20, 21) + R(4, 6, 13, 4) + R(9, 14, 8, 4),
            '⊤': L(3, 4, 21, 4) + R(6, 7, 4, 13) + R(14, 7, 4, 8),
            '⊕': L(3, 12, 21, 12) + R(6, 5, 4, 14) + R(14, 8, 4, 8),
            '⊥': L(3, 20, 21, 20) + R(6, 5, 4, 13) + R(14, 10, 4, 8),
            '⊞': L(3, 3, 3, 21) + L(21, 3, 21, 21) + R(9, 7, 6, 10),
            '╫': L(8, 3, 8, 21) + R(3, 8, 10, 8) + L(16, 5, 21, 5) + L(16, 19, 21, 19),
            '╪': L(3, 12, 21, 12) + R(5, 5, 4, 14) + R(15, 5, 4, 14),
            '≡': L(3, 5, 21, 5) + L(3, 19, 21, 19) + R(6, 9, 12, 6),
            '▣': R(4, 4, 10, 10, '#fff') + R(10, 10, 10, 10, '#f2c14a'),
            '▢': '<rect x="4" y="4" width="16" height="16" stroke-dasharray="2 2"/>' + L(12, 8, 12, 16) + L(8, 12, 16, 12),
          };
          const icon = (span, glyph) => { span.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[glyph] || ''}</svg>`; };
          const decorated = (button, glyph) => {
            button.replaceChildren();
            icon(u.el('span', 'catalog-glyph', button), glyph);
            return button;
          };
          const decorative = (parent, label, glyph) => {
            const b = u.el('button', 'as-tool catalog-decoration', parent);
            b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
            icon(u.el('span', 'catalog-glyph', b), glyph);
          };
          decorated(buttons[0], glyphs[0]); align.appendChild(buttons[0]);
          decorative(align, 'Align left', glyphs[1]);
          decorative(align, 'Align right', glyphs[2]);
          decorated(buttons[1], glyphs[3]); align.appendChild(buttons[1]);
          decorated(buttons[2], glyphs[4]); align.appendChild(buttons[2]);
          decorated(buttons[3], glyphs[5]); align.appendChild(buttons[3]);
          const distribute = group('Distribute', 'catalog-distribute');
          decorated(buttons[4], '⊞'); distribute.appendChild(buttons[4]);
          decorative(distribute, 'Distribute vertical', '╫');
          decorative(distribute, 'Space vertically', '╪');
          decorative(distribute, 'Align centers', '≡');
          const arrange = group('Arrange', 'catalog-arrange');
          decorative(arrange, 'Bring Forward', '▣');
          u.el('span', 'catalog-arrange-text', arrange, 'Bring Forward');
          decorative(arrange, 'Send Backward', '▣');
          u.el('span', 'catalog-arrange-text', arrange, 'Send Backward');
          decorative(arrange, 'Group', '▢');
          u.el('span', 'catalog-arrange-text', arrange, 'Group ▾');
        };
      },
      inspector(base, S) {
        return function (main) {
        const { util, spec } = S.ctx;
        const pane = util.el('aside', 'as-inspector summary-panel', main);
        util.el('h3', 'summary-heading', pane, 'Help & Tips');
        util.el('h4', 'help-title', pane, 'Align and Distribute Shapes');
        util.el('p', 'help-copy', pane, 'Use the Align buttons to line up shapes to the left, right, top, bottom or middle. Use Distribute to space shapes evenly horizontally or vertically.');
        util.el('h4', 'tips-title', pane, 'Tips');
        for (const tip of ['Select multiple shapes to align or distribute them.', 'The middle align button aligns shapes to the vertical centre of the slide.', 'Distribute Horizontally keeps the outer shapes at their current positions.']) util.el('p', 'help-tip', pane, tip);
        const comments = util.el('section', 'help-comments', pane);
        const tabs = util.el('div', 'comment-tabs', comments);
        util.el('span', 'comment-tab active', tabs, 'Comments');
        util.el('span', 'comment-tab', tabs, 'Revisions');
        util.el('div', 'comment-filter', comments, 'All Slides　⌄');
        for (const [author, body, slide, date, color] of [['Patel, A.', 'Consider a shorter title.', 'Slide 1', 'Apr 12, 1996', 'yellow'], ['Nguyen, L.', 'Add a statistic about local membership.', 'Slide 3', 'Apr 11, 1996', 'blue'], ['Collins, M.', 'Nice chart.', 'Slide 4', 'Apr 10, 1996', 'green']]) {
          const row = util.el('div', 'help-comment', comments);
          util.el('i', `comment-balloon ${color}`, row);
          const copy = util.el('div', 'comment-copy', row);
          util.el('b', '', copy, author); util.el('span', '', copy, `${slide}　 ${date}`); util.el('p', '', copy, body);
        }
        };
      },
    },
  },
});
