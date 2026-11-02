# mock-settings (frozen, eval-only)

A replica of a generic SaaS workspace settings area: top bar with workspace switcher, global search, plan
badge and avatar; left navigation; breadcrumb and page title; a settings card (tabs layout) or a long page of
section cards with a sticky "unsaved changes" bar. Widget: `change-settings/workspace` (scenarios toggle,
dependent, mixed, search). No real brands, logos or trademarks. There are no `choose-option` / `type-text`
replica widgets yet.

**Frozen and eval-only.** The site and manifest are `heldout`: the widgets register only under
`<task>.heldout` and `<task>.mock-settings`, never in the training split. Do not tune the training
tasks to this site's look, and do not edit it after results have been collected against it; add a new
`mock-*` site instead. Check with `python -m megawob.check --site mock-settings --jobs 1`.
