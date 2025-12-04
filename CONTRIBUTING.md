# Contributing to jtljac/me5e
Code and content contributions are accepted. Please feel free to submit issues to the issue tracker or submit merge
requests for code/content changes. Approval for such requests involves code and (if necessary) design review by the
Maintainers of this repo.

[//]: # (Please reach out on the [Foundry Community Discord]&#40;https://discord.gg/foundryvtt&#41; with any questions.)

Please ensure there is an open issue about whatever contribution you are submitting. Please also ensure your
contribution does not duplicate an existing one.

## Developer Tooling
Cloning this repository and either placing it in or symlinking it to your `Data/systems/me5e` user data directory is all
that is necessary to run this within Foundry VTT. However, if you want to make changes to either the LESS stylesheets or
the compendia, there are some developer tools which will make your life easier.

If your system supports `npm`, you can run the following commands from the root of the project to get set up:
### Install Dependencies
```shell
# Install all dependencies needed to run the developer tooling scripts
# This will also compile the CSS and DB files
npm install
```

### Build
```shell
# Run all build scripts
# Converts LESS -> CSS
# Converts JSON -> DB (compendia)
npm run build
```

```shell
# Converts the LESS in `./less` to the final `me5e.css`.
npm run build:css
```

```shell
# Runs the LESS -> CSS builder in watch mode so that changes made to the LESS files will automatically compile to CSS.
npm run build:watch
```

### Compendia as JSON
This repository includes some utilities which allow the Compendia included in the System to be maintained as JSON files.
This makes contributions which include changes to the compendia considerably easier to review.

```shell
# Compile the source JSON files into compendium packs.
npm run build:db
```

```shell
# Compile all JSON files into their LevelDB files.
npm run build:db
```

```shell
# Only compile the specified pack.
npm run build:db -- classes
```

#### Extracting Packs
Sometimes you need to convert the LevelDB compendiums back into JSON:
```shell
# Extract the contents of compendium packs to JSON files.
npm run build:json
```
```shell
# Only extract the contents of the specified compendium.
npm run build:json -- classes
```

```shell
# Only extract a single item from the specified compendium.
npm run build:json -- classes Barbarian
```

#### Cleaning Packs
```shell
# Cleans and formats all source JSON files, removing unnecessary permissions and flags and adding the proper spacing.
npm run build:clean
```

```shell
# Only clean the source files for the specified compendium.
npm run build:clean -- classes
```

```shell
# Only clean a single item from the specified compendium.
npm run build:clean -- classes Barbarian
```

## Issues
Check that your Issue isn't a duplicate (also check the closed issues, as sometimes work which has not been released
closes an issue).
Issues which are assigned to a Milestone are considered "Prioritized." This assignment is not permanent and issues might
be pushed out of milestones if the milestone is approaching a releasable state without that work being done.

### Bugs
- Ensure that the bug is reproducible with no modules active. If the bug only happens when a module is active, report it
  to the module's author instead.
- Provide hosting details as they might be relevant.
- Provide clear step-by-step reproduction instructions, as well as what you expected to happen during those steps vs
  what actually happened.

### Feature Requests
Any feature request should be considered from the lens of "Does this belong in the core system?"

- Do the Rules as Written (RAW) support this feature? If so, provide some examples.
- Is the missing feature on the [ME5e website](https://www.n7.world/)? If not, it might still be supportable, but it is
  worth mentioning in the request.
- Does this feature help a GM run the system in Foundry VTT?

## Content
All Content released with this system must come from the [ME5e website](https://www.n7.world/).

If there is missing content, please open an issue detailing what is missing.

In general, content contributions will take the shape of fixing typos or bugs in the configuration of the existing items
in the included compendia JSON files, which are then compiled into the appropriate db file.

### Translations
We welcome translations! Feel free to create a new one, or contribute to an existing one.

## Code
Here are some guidelines for contributing code to this project.

To contribute code, [fork this project](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and submit a
[pull request (PR)](https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-a-pull-request)
against the development branch.

### Style
Please attempt to follow code style present throughout the project. An ESLint profile is included to help with
maintaining a consistent code style. All warnings presented by the linter should be resolved before a PR is submitted.

```shell
# Run the linter and display any issues found.
npm run lint
```
```shell
# Automatically fix any code style issues that can be fixed.
npm run lint:fix
```

### Linked Issues
Before (or alongside) submitting an PR, we ask that you open a feature request issue. This will let us discuss the
approach and prioritization of the proposed change.

If you want to work on an existing issue, leave a comment saying you're going to work on the issue so that other
contributors know not to duplicate work. Similarly, if you see an issue is assigned to someone, that member of the team
has made it known they are working on it.

When you open an PR it is recommended to
[link it to an open issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).
Include which issue it resolves by putting something like this in your description:

```text
Closes #32
```

### PR Size
Please understand that large and sprawling PRs are exceptionally difficult to review. As much as possible, break down
the work for a large feature into smaller steps. Even if multiple PRs are required for a single Issue, this will make it
considerably easier and therefore more likely that your contributions will be reviewed and merged in a timely manner.

## Releases
This repository includes a GitHub Actions configuration which automates the compilation and bundling required for a
release when a Tag is pushed or created with the name `release-x.x.x`.

### Prerequisites
If either of these conditions are not met on the commit that tag points at, the workflow will error out and release
assets will not be created.
- The `system.json` file's `version` must match the `x.x.x` part of the tag name.
- The `system.json` file's `download` url must match the expected outcome of the release CI artifact. This should simply
  be changing version numbers in the url to match the release version.

```text
https://github.com/foundryvtt/me5e/releases/download/release-1.6.3/me5e-1.6.3.zip
                                                     └─ Tag Name ──┘    └─ V ─┘ (version)
```

### Process for Release

`master` is to be kept as the "most recently released" version of the system. All work is done on development branches
matching the milestone the work is a part of. Once the work on a milestone is complete, the following steps will create
a system release:
0. [ ] Pull Request create to merge `develop` into master
1. [ ] Validation:
   1. [ ] Verify the `NEEDS_MIGRATION_VERSION` is correct.
   2. [ ] `system.json` `version` and `download` fields are updated.
   3. [ ] Final code review
3. [ ] PR merged
4. [ ] A tag is created at the tip of the `master` branch with the format `release-x.x.x`, triggering the CI workflow
       (which takes ~2 mins to complete).
