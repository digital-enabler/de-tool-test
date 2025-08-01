# Automatic Test Rule Manager

## Getting Started

Set username and password in `/.env.template` and then delete .template extension.

`.env` file communicates with `/utils/constants.js` file. This file communicates with `/helpers/auth.js` where there is the function that is used in `/helpers/initHomePageSession.js` that is called in every test to log into the page.

## Execution of test file

### Single test file

Launch

```bash
npx mocha test/FileName
```

in console.
The result is visible in console.

### All test file simultaneously

Launch

```bash
.\report\generate-report.bat
```

in console.
This command generate "customReport.html" report file in "report" folder.
It's possible to see the summary with default template of mochawesome there.

## Authors

-   **Nicolò Romano** - _Initial work_ - [nicromano00](https://github.com/nicromano00)
