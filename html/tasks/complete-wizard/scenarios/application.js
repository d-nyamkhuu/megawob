/* wizard / application: input-step builder; spec and fields are documented in logic.js. */
(function () {
  'use strict';
  const { C, F, person, emailFor, phoneOf, labelOf, DATE_FMTS, randomDate } = env.taskOf('complete-wizard').lib;

  env.scenario('complete-wizard', {
    name: 'application',
    sample(rng, spec) {
      const p = person(rng, spec);
      const ood = spec.ood;
      const steps = [];
      const personal = [F('firstName', 'text', { fmt: 'name', target: p.first }), F('lastName', 'text', { fmt: 'name', target: p.last }),
        F('email', 'text', { fmt: 'email', target: emailFor(rng, p) })];
      if (ood || rng.bool(0.6)) personal.push(F('phone', 'text', { fmt: 'phone', target: phoneOf(rng) }));
      steps.push({ title: rng.pick([
        'Personal details', 'About you', 'Contact information', 'Your identity'
      ]), fields: personal });
      const expr = [F('employer', 'text', { fmt: 'name', target: C.pick(rng, C.COMPANIES, spec) }),
        F('jobTitle', 'text', { fmt: 'name', target: labelOf(C.pick(rng, C.JOB_TITLES, spec)) }),
        F('years', 'text', { fmt: 'number', min: 0, max: 40, target: String(rng.int(1, 22)), placeholder: '0-40' })];
      if (ood) expr.push(F('linkedin', 'text', { fmt: 'free', required: false, target: '' }));
      steps.push({ title: rng.pick([
        'Experience', 'Work history', 'Background', 'Employment', 'Career path', 'Role basics'
      ]), fields: expr });
      const dateFmt = rng.pick(DATE_FMTS);
      const avail = [F('startDate', 'text', { fmt: 'date', dateFmt, target: randomDate(rng, 2026, 2028), placeholder: dateFmt }),
        F('workMode', 'choice', { options: ['Remote', 'Hybrid', 'On-site'], target: rng.pick(['Remote', 'Hybrid', 'On-site']) })];
      if (ood || rng.bool(0.6)) avail.push(F('relocate', 'check', { required: false, target: rng.bool(0.5) }));
      steps.push({ title: rng.pick(['Availability', 'Preferences', 'Logistics', 'Flexibility']), fields: avail });
      if (ood || rng.bool(0.5)) {
        const cons = [F('consent', 'check', { required: true, target: true, ask: rng.bool(0.5) ? 'tick the accuracy statement' : null })];
        if (ood || rng.bool(0.5)) cons.push(F('alerts', 'check', { required: false, target: rng.bool(0.4), initial: rng.bool(0.5) }));
        steps.push({ title: rng.pick([
          'Consent', 'Declaration', 'Final details', 'Accuracy', 'Your signoff', 'Permissions'
        ]), fields: cons });
      }
      return steps;
    },
  });
})();
