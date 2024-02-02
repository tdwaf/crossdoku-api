# crossdoku-api

## What is it?

`crossdoku-api` is a web appplication to facilitate the injection and deletion of data into the kusogaki-crossdoku database.

## Why do we need it?

Not everyone has the ability to use tools such as `postman` to inject or delete data from our database. As all Kusogaki members should have the ability to update the database to create a new crossdoku, a solution such as this was needed.

## Architecture

TODO: Add architecture documentation

## Development

:exclamation: **IMPORTANT**: This project is an internal project for Kusogaki and pull requests by those outside the team will not be accepted.

### Setup
```
# clone repository 
git clone https://github.com/tdwaf/crossdoku-api.git

# install packages
npm i
```

### Local Development
```
# start development server
npm run dev

# check code formatting
npm run lint
```

### Preview Environment Development

Before pushing up your changes to the repository and opening a pull request, format your code to prevent CI workflow failure. The command you can use is `npm run format`.

After you've pushed up your changes and created a pull request, cloudflare will create a comment on the pull request with the preview environment link. You can use this to preview your changes.

## Commits

### Commit Types

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

Each commit message needs to have a commit type as described in the conventional commits documentation provided above. Here are the accepted types:

| Commit Type | Title                    | Description                                                                                                 |
| ----------- | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `build`     | Builds                   | Changes that affect the build system or external dependencies                                               |
| `chore`     | Chores                   | Other changes that don't modify src or test files                                                           |
| `ci`        | Continuous Integrations  | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| `docs`      | Documentation            | Documentation only changes                                                                                  |
| `feat`      | Features                 | A new feature                                                                                               |
| `fix`       | Bug Fixes                | A bug Fix                                                                                                   |
| `perf`      | Performance Improvements | A code change that improves performance                                                                     |
| `refactor`  | Code Refactoring         | A code change that neither fixes a bug nor adds a feature                                                   |
| `revert`    | Reverts                  | Reverts a previous commit                                                                                   |
| `style`     | Styles                   | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)      |
| `test`      | Tests                    | Adding missing tests or correcting existing tests                                                           |

### General guidelines for commit messages

- Each commit needs to include a commit type provided above.

- The subject should be separate from the body with a blank line.

- Limit the subject line to 50 characters.

- Capitalize the subject line.

- Don't end the subject line with a period.

- Use the body to explain **why**, _not what and how_ (when applicable).

**Example commit message**: `docs: Fix typo in introduction to user guide`