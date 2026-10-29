/* wizard / signup: input-step builder; spec and fields are documented in logic.js. */
(function () {
  'use strict';
  const { C, F, person, emailFor, phoneOf, passwordOf, usernameOf, countryNames, LANGUAGES } = env.taskOf('complete-wizard').lib;

  env.scenario('complete-wizard', {
    name: 'signup',
    sample(rng, spec) {
      const p = person(rng, spec);
      const ood = spec.ood;
      const pw = passwordOf(rng);
      const steps = [];
      const acct = [F('username', 'text', { fmt: 'username', target: usernameOf(rng, p) }),
        F('email', 'text', { fmt: 'email', target: emailFor(rng, p) }),
        F('password', 'text', { fmt: 'password', target: pw, hint: 'At least 8 characters' }),
        F('confirmPw', 'text', { fmt: 'match', of: 'password', target: pw, ask: null })];
      steps.push({ title: rng.pick([
        'Account', 'Sign-in details', 'Create account', 'Registration', 'Credentials'
      ]), fields: acct });
      const langs = rng.sample(LANGUAGES, rng.int(3, 4));
      const countries = C.sample(rng, countryNames(), ood ? 9 : rng.int(5, 7), spec);
      const prof = [F('displayName', 'text', { fmt: 'name', target: rng.bool(0.5) ? p.full : p.first }),
        F('country', 'select', { options: countries, target: rng.pick(countries) })];
      if (ood || rng.bool(0.6)) prof.push(F('language', 'choice', { options: langs, target: rng.pick(langs), initial: langs[0] }));
      steps.push({ title: rng.pick([
        'Profile', 'About you', 'Personal info', 'Introduction', 'Basics'
      ]), fields: prof });
      const prefs = [F('newsletter', 'check', { required: false, target: rng.bool(0.4), initial: rng.bool(0.5) }),
        F('updates', 'check', { required: false, target: rng.bool(0.5), initial: rng.bool(0.5) })];
      if (ood || rng.bool(0.5)) prefs.push(F('theme', 'choice', { options: ['Light', 'Dark', 'System'], target: rng.pick(['Light', 'Dark', 'System']), initial: 'System' }));
      steps.push({ title: rng.pick([
        'Preferences', 'Notifications', 'Settings', 'Customize', 'Experience'
      ]), fields: prefs });
      if (ood) {
        const p2 = [F('phone', 'text', { fmt: 'phone', required: false, target: phoneOf(rng) }),
          F('company', 'text', { fmt: 'name', required: false, target: '' })];
        steps.push({ title: 'Recovery', fields: p2 });
      }
      return steps;
    },
  });
})();
