// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      base(_c);
      if (_c.ctx.finish) { _c.wantFooter = false; return; }
      const r = _c.ctx.rng.fork('careplus/end');
      if (r.bool(0.55)) {
        _c.placement = 'footer';
        _c.wantFooter = true;
        _c.label = 'Submit';
      }
      if (_c.placement !== 'footer' && _c.placement !== 'link') _c.wantFooter = false;
    },
    'frame.header': (base, S) => function (_c) {
      base(_c);
      const { header, util } = _c;
      const top = util.el('div', 'cp-top', header);
      util.el('span', 'cp-cross', top, '+');
      util.el('strong', 'cp-brand', top, 'CarePlus EHR');
      const nav = util.el('nav', 'cp-nav', top);
      for (const name of ['Home', 'Patients', 'Scheduling', 'Orders', 'Medications', 'Results', 'Nursing', 'Bed Management', 'Reports']) {
        const a = util.el('a', name === 'Patients' ? 'cp-tab active' : 'cp-tab', nav, name);
        a.href = '#';
        a.addEventListener('click', e => { e.preventDefault(); env.log('decoy', {what: 'nav', label: name}); });
      }
      const search = util.el('span', 'cp-search', top);
      util.el('span', 'cp-search-icon', search);
      util.el('span', '', search, 'Search patient...');
      const help = util.el('span', 'cp-help', top);
      util.el('span', 'cp-help-icon', help, '?');
      util.el('span', '', help, 'Help');
      const user = util.el('span', 'cp-user', top);
      util.el('span', 'cp-user-icon', user);
      util.el('span', '', user, '⌄');
    },
    'frame.body': (base, S) => function (_c) {
      base(_c);
      const { body, ctx, util } = _c;
      const goal = ctx.instruction || '';
      const patient = (goal.match(/for ([^(;]+?)\s*\(DOB/i) || [,'Patient chart'])[1].trim();
      const dob = (goal.match(/DOB\s*(\d{4}-\d{2}-\d{2})/i) || [,''])[1];
      const side = util.el('aside', 'cp-side', body);
      const identity = util.el('div', 'cp-identity', side);
      util.el('h2', '', identity, patient);
      util.el('div', 'cp-mrn', identity, 'MRN: —');
      util.el('div', '', identity, `DOB: ${dob || '—'}`);
      util.el('div', '', identity, 'Female');
      util.el('div', '', identity, 'Allergies: No known allergies');
      util.el('div', '', identity, 'Code Status: Full Code');
      const links = util.el('nav', 'cp-side-nav', side);
      for (const name of ['Overview','Encounters','Medications','Allergies & Adverse Reactions','Problems','Results','Orders','Nursing Flowsheets','Documents','Bed Management']) {
        const a = util.el('a', name === 'Medications' ? 'active' : '', links, name);
        a.href = '#';
        a.addEventListener('click', e => { e.preventDefault(); env.log('decoy', {what:'sidebar', label:name}); });
      }
      const tips = util.el('section', 'cp-tips', side);
      const tipsHeading = util.el('h3', '', tips);
      util.el('span', 'cp-bulb', tipsHeading);
      util.el('span', '', tipsHeading, 'Tips');
      const list = util.el('ul', '', tips);
      for (const text of ['Review each home medication and choose Continue, Stop, or Modify.', 'If modifying, update the dose and select the appropriate unit.', 'Unchanged fields such as frequency remain as recorded.', 'Review the draft list to confirm all medications have been addressed.']) util.el('li', '', list, text);
      util.el('h3', 'cp-legend-title', tips, 'Legend');
      for (const [label, desc, cls] of [['Continue','Keep as home regimen','keep'],['Stop','Discontinue medication','stop'],['Modify','Adjust dose (other details unchanged)','modify']]) {
        const row = util.el('div', 'cp-legend-row', tips);
        util.el('span', `cp-legend-chip ${cls}`, row, label);
        util.el('span', '', row, desc);
      }
      if (_c.display === 'panel') {
        const note = util.el('section', 'cp-side-note', side);
        util.el('h3', '', note, 'Your task');
        util.el('div', '', note, goal);
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util, ctx } = _c;
      const stage = util.el('main', 'ref-stage', body);
      stage.style.setProperty('position', 'absolute', 'important');
      stage.style.setProperty('left', '19.1%', 'important');
      stage.style.setProperty('top', '6px', 'important');
      stage.style.setProperty('width', '80.5%', 'important');
      stage.style.setProperty('height', 'calc(100% - 12px)', 'important');
      stage.style.setProperty('min-width', '0', 'important');
      stage.style.setProperty('right', 'auto', 'important');
      stage.style.setProperty('bottom', 'auto', 'important');
      const goal = ctx.instruction || '';
      const patient = (goal.match(/for ([^(;]+?)\s*\(DOB/i) || [,'Patient chart'])[1].trim();
      const dob = (goal.match(/DOB\s*(\d{4}-\d{2}-\d{2})/i) || [,''])[1];
      stage.style.setProperty('--patient-line', JSON.stringify(`${patient}     DOB: ${dob || '—'}     Female     Allergies: No known allergies`));
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-health-records-medrec-01',
    template: 'site/base',
    design: { parts },
  });
})();
