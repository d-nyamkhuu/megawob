// Design on the shared scroll-page/longform template.
env.widget({
  task: 'scroll-page',
  site: 'design-scroll-page-carousel-05',
  name: 'design',
  split: 'train',
  scenarios: ['carousel'],
  template: 'scroll-page/longform',
  design: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    titleSize: 46,
    serifTitleSize: 46,
    sectionTitleSize: 22,
    bodySize: 15,
    railWidth: 325,
    radius: 0,
    parts: {
      frame: (base) => (st) => {
        const frame = base(st);
        const scrollbar = st.el('div', 'wkp-window-scroll', st.ctx.stage);
        scrollbar.setAttribute('aria-hidden', 'true');
        const style = getComputedStyle(st.ctx.stage);
        const available = st.ctx.stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        frame.wrap.style.width = Math.max(0, Math.min(1370, available - 30)) + 'px';
        frame.wrap.style.margin = '10px 0 0';
        if (frame.layout === 'rail') {
          const railWidth = Math.min(325, available * 0.3);
          frame.wrap.style.gridTemplateColumns = `minmax(0, 1fr) ${railWidth}px`;
        }
        if (frame.sideNav) frame.main.append(frame.sideNav);
        return frame;
      },
      header: (base) => (st) => {
        const head = base(st);
        st.main.prepend(head);
        head.classList.add('wkp-help-page');
        const masthead = st.el('div', 'wkp-masthead', null);
        const logo = st.el('div', 'wkp-park-logo', masthead);
        logo.setAttribute('aria-label', 'Ridgeview National Park');
        const nav = st.el('nav', 'wkp-help-nav', masthead);
        for (const label of ['Visit', 'Explore', 'Learn', 'Support']) {
          const link = st.el('button', '', nav, label);
          link.type = 'button';
          link.addEventListener('click', () => env.log('decoy', { label }));
        }
        const search = st.el('div', 'wkp-help-search', masthead);
        const input = st.el('input', '', search);
        input.placeholder = 'Search help...';
        input.setAttribute('aria-label', 'Search help');
        st.el('span', '', search, '⌕');
        const panorama = st.el('div', 'wkp-panorama', null);
        head.prepend(masthead, panorama);
        const welcome = st.el('div', 'wkp-welcome', null);
        st.el('h1', '', welcome, 'Welcome to the Help Center');
        st.el('p', '', welcome, 'Find answers, plan your visit, and get the most out of your time in Ridgeview National Park.');
        const topics = st.el('div', 'wkp-topics', welcome);
        for (const [icon, title, text] of [
          ['map', 'Planning your visit', 'Park hours, entrance fees, permits, and trip planning resources.'],
          ['tent', 'Camping and lodging', 'Campground information, reservations, and backcountry options.'],
          ['binoculars', 'Trails and safety', 'Trail maps, difficulty levels, and safety tips.'],
          ['leaf', 'Wildlife and nature', "Learn about the park’s plants, animals, and natural features."],
        ]) {
          const row = st.el('div', 'wkp-topic', topics);
          st.el('span', 'wkp-topic-icon ' + icon, row);
          const copy = st.el('div', '', row);
          st.el('strong', '', copy, title);
          st.el('span', '', copy, text);
        }
        head.insertBefore(welcome, head.querySelector('.ps-tools'));
        return head;
      },
      section: (base) => (st, section, index) => {
        base(st, section, index);
        const element = st.secEls[section.id];
        element.style.padding = '2px 0 0';
        element.querySelector('h2').style.margin = '0 0 1px';
        for (const paragraph of element.querySelectorAll(':scope > p')) paragraph.style.margin = '0 0 1px';
      },
      card: (base) => (st, list, row, width, slide) => {
        const card = base(st, list, row, width, slide);
        if (slide) {
          const coverWidth = width < 650 ? Math.min(120, width * 0.25) : 164;
          Object.assign(card.style, {
            display: 'grid', gridTemplateColumns: `${coverWidth}px minmax(0, 1fr)`,
            gridTemplateRows: 'auto auto 1fr', columnGap: '24px', rowGap: '3px',
            padding: '9px 10px 8px', minWidth: '0',
          });
          const cover = st.el('div', 'library-cover', card);
          Object.assign(cover.style, {
            gridColumn: '1', gridRow: '1 / 4', width: coverWidth + 'px', height: '178px',
            background: 'linear-gradient(160deg,#b4c0c1 0 22%,#e0d5bf 23% 48%,#887461 49% 66%,#a34c31 67%)',
            border: '1px solid #6f6255',
          });
          for (const [selector, rowNumber] of [['.t', '1'], ['.m', '2'], ['.acts', '3']]) {
            const element = card.querySelector(selector);
            element.style.gridColumn = '2';
            element.style.gridRow = rowNumber;
            element.style.minWidth = '0';
            element.style.overflowWrap = 'anywhere';
          }
          Object.assign(card.querySelector('.acts').style, { flexWrap: 'wrap', alignSelf: 'end' });
        }
        return card;
      },
      slides: (base) => (st, rec, pane, options) => {
        base(st, rec, pane, options);
        // Let every slide's identifying text and actions fit, including long labels.
        rec.list.style.height = '';
        rec.list.style.minHeight = options.height + 'px';
      },
      slideControls: (base) => (st, rec, pane) => {
        base(st, rec, pane);
        rec.box.style.paddingBottom = '48px';
        for (const [button, side] of [[rec.prev, 'left'], [rec.next, 'right']]) {
          Object.assign(button.style, {
            top: 'auto', bottom: '5px', width: 'auto', height: '36px',
            minWidth: Math.min(132, rec.pitch * 0.3) + 'px', margin: '0', padding: '3px 10px',
          });
          button.style[side] = Math.max(0, rec.pitch / 2 - Math.min(190, rec.pitch / 2)) + 'px';
        }
        const dots = rec.box.querySelector('.ps-dots');
        Object.assign(dots.style, { bottom: '17px', left: '35%', right: '35%' });
      },
      rail: (base) => (st, wrap) => {
        base(st, wrap); // retain the template's seeded draws
        const rail = wrap.querySelector('.ps-rail');
        rail.classList.add('library-rail');
        rail.style.padding = '0';
        return rail;
      },
    },
  },
});
