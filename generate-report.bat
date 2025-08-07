@echo off
echo Control/existence of report folder...
if not exist report (
  mkdir report
  echo 'report' folder created.
) else (
  echo Already existing “report” folder.
)

echo.
echo Performing Mocha tests with Mochawesome reporter...
rem The Mochawesome reporter directly generates the HTML file and the JSON
npx mocha test/**/*.js --reporter mochawesome --reporter-options "reportDir=report,reportFilename=customReport" --timeout 240000

echo.
echo Report successfully generated: report\customReport.html
pause