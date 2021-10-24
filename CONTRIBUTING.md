[comment]: <> (# Contributing to foundrynet/dnd5e)

[comment]: <> (Code and content contributions are accepted. Please feel free to submit issues to the issue tracker or submit merge requests for code/content changes. Approval for such requests involves code and &#40;if necessary&#41; design review by the Maintainers of this repo. Please reach out on the [Foundry Community Discord]&#40;https://discord.gg/foundryvtt&#41; with any questions.)

[comment]: <> (Please ensure there is an open issue about whatever contribution you are submitting. Please also ensure your contribution does not duplicate an existing one.)

[comment]: <> (## Developer Tooling)

[comment]: <> (Cloning this repository and either placing it in or symlinking it to your `Data/systems/dnd5e` user data directory is all that is necessary to run this within Foundry VTT. However, if you want to make changes to either the LESS stylesheets or the compendia, there are some developer tools which will make your life easier.)

[comment]: <> (This repository leverages [gulp]&#40;https://gulpjs.com/&#41; to run automated build tasks. If your system supports `npm`, you can run the following commands from the root of the project to get set up:)

[comment]: <> (### `npm install`)

[comment]: <> (Installs all dependencies needed to run developer tooling scripts.)

[comment]: <> (### `npm run build` / `gulp buildAll`)

[comment]: <> (Runs all relevant build scripts:)

[comment]: <> (- Converts LESS -> CSS)

[comment]: <> (- Converts JSON -> DB &#40;compendia&#41;)

[comment]: <> (### `npm run build:css` / `gulp css`)

[comment]: <> (Converts the LESS in `./less` to the final `dnd5e.css`.)

[comment]: <> (### `npm run build:watch` / `gulp`)

[comment]: <> (Runs the LESS -> CSS builder in watch mode so that changes made to the LESS files will automatically compile to CSS.)

[comment]: <> (### Compendia as JSON)

[comment]: <> (This repository includes some utilities which allow the Compendia included in the System to be maintained as JSON files. This makes contributions which include changes to the compendia considerably easier to review.)

[comment]: <> (Please remember to compile any pack whose JSON your contribution touches before submitting an MR.)

[comment]: <> (#### Compiling Packs)

[comment]: <> (Compile the source JSON files into compendium packs.)

[comment]: <> (```text)

[comment]: <> (npm run build:db)

[comment]: <> (gulp compilePacks)

[comment]: <> (```)

[comment]: <> (- `gulp compilePacks` - Compile all JSON files into their NEDB files.)

[comment]: <> (- `gulp compilePacks --pack classes` - Only compile the specified pack.)

[comment]: <> (#### Extracting Packs)

[comment]: <> (Extract the contents of compendium packs to JSON files.)

[comment]: <> (```text)

[comment]: <> (npm run build:json)

[comment]: <> (gulp extractPacks)

[comment]: <> (```)

[comment]: <> (- `gulp extractPacks` - Extract all compendium NEDB files into JSON files.)

[comment]: <> (- `gulp extractPacks --pack classes` - Only extract the contents of the specified compendium.)

[comment]: <> (- `gulp extractPacks --pack classes --name Barbarian` - Only extract a single item from the specified compendium.)

[comment]: <> (#### Cleaning Packs)

[comment]: <> (Cleans and formats source JSON files, removing unnecessary permissions and flags and adding the proper spacing.)

[comment]: <> (```text)

[comment]: <> (npm run build:clean)

[comment]: <> (gulp extractPacks)

[comment]: <> (```)

[comment]: <> (- `gulp cleanPacks` - Clean all source JSON files.)

[comment]: <> (- `gulp cleanPacks --pack classes` - Only clean the source files for the specified compendium.)

[comment]: <> (- `gulp cleanPacks --pack classes --name Barbarian` - Only clean a single item from the specified compendium.)

[comment]: <> (## Issues)

[comment]: <> (Check that your Issue isn't a duplicate &#40;also check the closed issues, as sometimes work which has not been released closes an issue&#41;.)

[comment]: <> (Issues which are assigned to a Milestone are considered "Prioritized." This assignment is not permanent and issues might be pushed out of milestones if the milestone is approaching a releaseable state without that work being done.)

[comment]: <> (### Bugs)

[comment]: <> (- Ensure that the bug is reproducible with no modules active. If the bug only happens when a module is active, report it to the module's author instead.)

[comment]: <> (- Provide hosting details as they might be relevant.)

[comment]: <> (- Provide clear step-by-step reproduction instructions, as well as what you expected to happen during those steps vs what actually happened.)

[comment]: <> (### Feature Requests)

[comment]: <> (Any feature request should be considered from the lens of "Does this belong in the core system?")

[comment]: <> (- Do the Rules as Written &#40;RAW&#41; support this feature? If so, provide some examples.)

[comment]: <> (- Is the missing feature in the System Reference Document? If not, it might still be supportable, but it is worth mentioning in the request.)

[comment]: <> (- Does this feature help a GM run a fifth edition game in Foundry VTT?)

[comment]: <> (## Content)

[comment]: <> (All Content released with this system must come from the WotC [5e System Reference Document]&#40;https://dnd.wizards.com/articles/features/systems-reference-document-srd&#41; &#40;aka SRD&#41;.)

[comment]: <> (If there is missing content, please open an issue detailing what is missing.)

[comment]: <> (In general, content contributions will take the shape of fixing typos or bugs in the configuration of the existing items in the included compendia JSON files, which are then compiled into the appropriate db file.)

[comment]: <> (Every MR which contributes content must change both the source JSON file and the db file.)

[comment]: <> (### Translations)

[comment]: <> (Non-English languages are not contained within the core dnd5e system, but instead they are managed by specialized [localization modules]&#40;https://foundryvtt.com/packages/tag/translation&#41;.)

[comment]: <> (Instead of opening an MR with translation files, create one of these modules &#40;or contribute to an existing one!&#41;.)

[comment]: <> (## Code)

[comment]: <> (Here are some guidelines for contributing code to this project.)

[comment]: <> (To contribute code, [fork this project]&#40;https://docs.gitlab.com/ee/user/project/repository/forking_workflow.html&#41; and submit a [merge request &#40;MR&#41;]&#40;https://docs.gitlab.com/ee/user/project/merge_requests/getting_started.html&#41; against the correct development branch.)

[comment]: <> (### Style)

[comment]: <> (Please attempt to follow code style present throughout the project. An ESLint profile is included to help with maintaining a consistent code style. All warnings presented by the linter should be resolved before an MR is submitted.)

[comment]: <> (- `gulp lint` or `npm run lint` - Run the linter and display any issues found.)

[comment]: <> (- `gulp lint --fix` or `npm run lint:fix` - Automatically fix any code style issues that can be fixed.)

[comment]: <> (### Linked Issues)

[comment]: <> (Before &#40;or alongside&#41; submitting an MR, we ask that you open a feature request issue. This will let us discuss the approach and prioritization of the proposed change.)

[comment]: <> (If you want to work on an existing issue, leave a comment saying you're going to work on the issue so that other contributors know not to duplicate work. Similarly, if you see an issue is assigned to someone, that member of the team has made it known they are working on it.)

[comment]: <> (When you open an MR it is recommended to [link it to an open issue]&#40;https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically&#41;. Include which issue it resolves by putting something like this in your description:)

[comment]: <> (```text)

[comment]: <> (Closes #32)

[comment]: <> (```)

[comment]: <> (### Priority of Review)

[comment]: <> (Please appreciate that reviewing contributions constitutes a substantial amount of effort and our resources are limited. As a result of this, Merge Requests are reviewed with a priority that roughly follows this:)

[comment]: <> (#### High Priority)

[comment]: <> (- Bug Fix)

[comment]: <> (- Small Features related to issues assigned to the current milestone)

[comment]: <> (#### Medium Priority)

[comment]: <> (- Large Features related to issues assigned to the current milestone)

[comment]: <> (- Small Features which are out of scope for the current milestone)

[comment]: <> (#### Not Prioritized)

[comment]: <> (- Large Features which are out of scope for the current milestone)

[comment]: <> (### Merge Request Review Process)

[comment]: <> (MRs have a few phases:)

[comment]: <> (0. **Prioritization.** If the MR relates to the current milestone, it is assigned to that milestone.)

[comment]: <> (1. **Initial Review from the 5e contributor team.** This lets us spread out the review work and catch some of the more obvious things that need to be fixed before final review. Generally this talks about code style and some methodology.)

[comment]: <> (2. **Final Review from the Maintainers.** Atropos and Kim have final review and are the only ones with merge permission.)

[comment]: <> (#### MR Size)

[comment]: <> (Please understand that large and sprawling MRs are exceptionally difficult to review. As much as possible, break down the work for a large feature into smaller steps. Even if multiple MRs are required for a single Issue, this will make it considerably easier and therefore more likely that your contributions will be reviewed and merged in a timely manner.)

[comment]: <> (## Releases)

[comment]: <> (This repository includes a Gitlab CI configuration which automates the compilation and bundling required for a release when a Tag is pushed or created with the name `release-x.x.x`.)

[comment]: <> (### Prerequisites)

[comment]: <> (If either of these conditions are not met on the commit that tag points at, the workflow will error out and release assets will not be created.)

[comment]: <> (- The `system.json` file's `version` must match the `x.x.x` part of the tag name.)

[comment]: <> (- The `system.json` file's `download` url must match the expected outcome of the release CI artifact. This should simply be changing version numbers in the url to match the release version.)

[comment]: <> (```text)

[comment]: <> (https://gitlab.com/foundrynet/dnd5e/-/releases/release-1.4.3/downloads/dnd5e-release-1.4.3.zip)

[comment]: <> (                                              └─ Tag Name ──┘               └─ Tag Name ──┘)

[comment]: <> (```)

[comment]: <> (### Package Repository)

[comment]: <> (This workflow uses the [Generic Package Repository]&#40;https://docs.gitlab.com/ee/user/packages/generic_packages/&#41; to host the latest system manifest. Doing so allows us to have a stable url for a `latest` manifest as each CI run updates this package. By doing this, we avoid the 2 minute delay between release creation and file availability in which a user might hit 'update' and get an error.)

[comment]: <> (As such, the stable url to the "Latest" system manifest &#40;as updated by the CI workflow&#41; is:)

[comment]: <> (```text)

[comment]: <> (https://gitlab.com/api/v4/projects/foundrynet%2Fdnd5e/packages/generic/dnd5e/latest/system.json)

[comment]: <> (```)

[comment]: <> (### Process for Release)

[comment]: <> (`master` is to be kept as the "most recently released" version of the system. All work is done on development branches matching the milestone the work is a part of. Once the work on a milestone is complete, the following steps will create a system release:)

[comment]: <> (0. [ ] Verify the `NEEDS_MIGRATION_VERSION` is correct.)

[comment]: <> (1. [ ] `system.json` `version` and `download` fields are updated on the development branch &#40;e.g. `1.5.x`&#41;.)

[comment]: <> (2. [ ] A Tag is created at the tip of the development branch with the format `release-x.x.x`, triggering the CI workflow &#40;which takes ~2 mins to complete&#41;.)

[comment]: <> (3. [ ] Development Branch is merged to `master` after the workflow is completed.)

[comment]: <> (4. [ ] The Foundryvtt.com admin listing is updated with the `manifest` url pointing to the `system.json` attached to the workflow-created release.)
