@echo off
echo Controllo/esistenza cartella report...
if not exist report (
  mkdir report
  echo Cartella 'report' creata.
) else (
  echo Cartella 'report' già esistente.
)

echo.
echo Esecuzione dei test Mocha con reporter Mochawesome...
rem Il reporter di Mochawesome genera direttamente il file HTML e il JSON
npx mocha test/**/*.js --reporter mochawesome --reporter-options "reportDir=report,reportFilename=customReport" --timeout 240000

echo.
echo Report generato con successo: report\customReport.html
pause