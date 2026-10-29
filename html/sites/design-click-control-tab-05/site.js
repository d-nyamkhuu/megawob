// Paper workstation frame on the shared site template.
(function () {
  'use strict';

  const palette = {
    bg: '#f6f7f9', panel: '#fff', fg: '#111827', muted: '#4b5563', line: '#e3e6eb',
  };

  env.site({
    name: 'design-click-control-tab-05',
    template: 'site/base',
    styles: ['../base/site.css', 'ref.css'],
    design: {
      THEMES: { paper: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a5ddb'],
      LOW_ACCENTS: ['#1a5ddb'],
      parts: {
        'frame.theme': (base) => function (_c) {
          base(_c);
          document.body.className = 'ref paper';
        },
        'frame.header': () => function (_c) {
          const { util } = _c;
          const header = util.el('header', 'band', document.body);
          const lead = util.el('div', 'lead', header);
          util.el('div', 'eyebrow', lead, 'WEB NAVIGATION TASK');
          Object.assign(_c, { header, lead });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => function (_c) {
          const { ctx, display, header, lead, util } = _c;
          base({ ..._c, header: lead });
          lead.querySelector('.ref-instruction')?.classList.add('instruction');
          util.el('p', 'lede', lead,
            'Explore the tabs below for project guides, team information and the latest updates.');
          if (display !== 'panel') {
            const card = util.el('aside', 'howto', header);
            util.el('h2', '', card, 'How to complete this task:');
            [
              'Switch between the tabs.',
              'Browse the available resources.',
              'Links open related content.',
              ctx.finish ? 'Finish when you are ready.' : 'Then complete the task below.',
            ].forEach((text, i) => {
              const row = util.el('div', 'step', card);
              util.el('i', '', row, String(i + 1));
              util.el('span', '', row, text);
            });
            Object.assign(_c, { card });
          }
        },
        'frame.tools': (base) => function (_c) {
          base(_c);
          _c.headerTools.classList.add('header-actions');
          _c.headerTools.querySelectorAll('.ref-submit').forEach((el) => el.classList.add('header-submit'));
          _c.headerTools.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('xtra', 'footer-xtra'));
        },
        'frame.body': () => function (_c) {
          const { ctx, headerTools, util } = _c;
          const body = util.el('main', 'shell ref-body', document.body);
          body.classList.toggle('finish-mode', ctx.finish);
          body.classList.toggle('has-header-end', headerTools.childElementCount > 0);
          body.append(headerTools);
          Object.assign(_c, { body });
        },
        'frame.panel': (base) => function (_c) {
          if (_c.display !== 'panel') return;
          base({ ..._c, body: _c.header });
          const panel = _c.header.querySelector('.ref-panel');
          panel.classList.add('howto');
          panel.querySelector('.ref-panel-text').classList.add('panel-instruction');
        },
        'frame.stage': () => function (_c) {
          const stage = _c.util.el('div', 'stage', _c.body);
          Object.assign(_c, { stage });
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const { body, util } = _c;
          const footer = document.querySelector('.ref-foot') || util.el('footer', '', body);
          footer.classList.add('footer');
          footer.querySelector('.ref-foot-text')?.remove();
          footer.querySelectorAll('.ref-submit').forEach((el) => el.classList.add('submit'));
          footer.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('end-link'));
          footer.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('xtra', 'footer-xtra'));
          body.append(footer);
          Object.assign(_c, { footer });
        },
        'frame.floating': (base) => function (_c) {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.footer.append(dock);
            _c.submit.classList.add('submit');
          }
          const lastStep = _c.card?.querySelector('.step:last-child span');
          if (lastStep && !_c.ctx.finish) {
            const { label, placement } = _c;
            lastStep.textContent = 'Then click ' +
              (placement === 'icon' ? 'the checkmark' : 'the ' + label + (placement === 'link' ? ' link' : ' button')) +
              (placement === 'header' || placement === 'icon' ? ' above.' : ' below.');
          }
        },
      },
    },
  });
})();
