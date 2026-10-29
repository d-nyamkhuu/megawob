// Design on the use-slides/office template; defaults reproduce the scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-reorder-01',
  name: 'design',
  split: 'train',
  scenarios: ['reorder'],
  template: 'use-slides/office',
  design: {
    parts: {
      layout: (base, P) => (ctx) => {
        base(ctx);
        const band = ctx.util.el('section', 'ol-summary', P.root);
        const mark = ctx.util.el('div', 'ol-mark', band);
        mark.innerHTML = '<i></i><i></i><i></i><i></i>';
        const info = ctx.util.el('div', 'ol-summary-main', band);
        ctx.util.el('strong', '', info, 'Project Update');
        ctx.util.el('span', '', info, `${ctx.spec.slides.length} slides　　Modified: 12 Mar 1992　10:24　　Format: Presentation (1.0)`);
        const counts = ctx.util.el('div', 'ol-counts', band);
        ctx.util.el('span', '', counts, `Slides:　　 ${ctx.spec.slides.length}`);
        ctx.util.el('span', '', counts, 'Comments:　 0');
        ctx.util.el('span', '', counts, 'Revisions:　 0');
        P.root.insertBefore(band, P.root.firstChild);
        const ribbon = ctx.util.el('div', 'ol-ribbon', P.root);
        ribbon.innerHTML = '<button>New Slide ▾</button><button>Layout ▾</button><i></i><button>Lucida ▾</button><button>24 ▾</button><button class="ol-bold">B</button><button><em>I</em></button><button><u>U</u></button><button class="ol-swatch">　</button><button>☰</button><button>☷</button><button>▤</button><button>▣</button><button>▢</button><button>▣</button><i></i><button>Align ▾</button><button>Distribute ▾</button>';
        P.root.insertBefore(ribbon, P.root.children[1]);
        const work = P.root.querySelector('.as-work'), wrap = P.root.querySelector('.as-slidewrap'), canvas = P.root.querySelector('.as-canvas');
        P.P.fit(work, wrap, canvas);
        const sx = Math.min(1.5, (work.clientWidth - 36) / Math.max(1, 720 * P.scale));
        const sy = Math.min(1.18, (work.clientHeight - 8) / Math.max(1, 400 * P.scale));
        wrap.style.width = `${720 * P.scale * sx * sy}px`;
        wrap.style.height = `${400 * P.scale * sy}px`;
        canvas.style.transform = `scale(${P.scale * sx * sy}, ${P.scale * sy})`;
      },
      deck: (base, P) => (main) => {
        const editor = P.ctx.util.el('div', 'as-editor', main);
        const work = P.ctx.util.el('div', 'as-work', editor);
        const wrap = P.ctx.util.el('div', 'as-slidewrap', work);
        const canvas = P.ctx.util.el('div', 'as-canvas', wrap);
        P.slideArt = P.ctx.util.el('div', '', canvas);
        Object.assign(P.slideArt.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
        P.P.slideHeading(canvas);
        P.spec.shapes.forEach((shape, i) => {
          const el = P.shapeEls[i] = P.P.shape(canvas, shape, i);
          P.P.shapeBehavior(el, i);
        });
        P.P.fit(work, wrap, canvas);
        const rail = P.ctx.util.el('aside', 'as-rail ol-rail', main);
        Object.assign(rail.style, { order: '1', width: '100%', height: '164px', minHeight: '164px', flex: 'none' });
        P.ctx.util.el('div', 'as-cap', rail, 'Slides');
        const pane = P.P.register(P.ctx.util.el('div', 'as-scroll ol-scroll', rail), 'pane:rail');
        const board = P.ctx.util.el('div', 'as-thumbs ol-thumbs', pane), cards = {};
        Object.assign(board.style, { height: '140px', margin: '8px 18px' });
        const pitch = board.clientWidth / P.spec.slides.length;
        const cardWidth = Math.max(1, pitch - 20);
        P.spec.slides.forEach((slide, i) => {
          const card = cards[i] = P.P.thumbnail(board, slide, i);
          Object.assign(card.style, { width: `${cardWidth}px`, height: '136px', padding: '0', overflow: 'visible' });
          Object.assign(card.querySelector('.as-preview').style, { position: 'absolute', left: '16px', right: '0', top: '0', height: '132px' });
        });
        P.sortable = env.ui.sortable(board, { order: P.ctx.model.order, items: cards,
          slotRect: (i) => ({ x: i * pitch, y: 0, w: cardWidth, h: 136 }), axis: 'x', activeClass: 'dragging',
          onChange: (order) => P.P.commit({ order }), label: 'slide thumbnails' });
        // All slots share one visible row; mirror their actual vertical bounds.
        P.P.scrolling(pane, 'rail', Object.values(cards), 0);
      },
    },
  },
});
