@echo off

set "DB_NAME=digital_shop"
set "MONGO_URI=mongodb://root:dev@mongodb/%DB_NAME%?authSource=admin"
set "DB_DIR=%cd%\db"
set "NETWORK=digital-shop-api"

if exist "%DB_DIR%" (
    echo "%DB_DIR%" directory already exists, deleting...
    rd /s /q "%DB_DIR%"
    echo "%DB_DIR%" directory deleted successfully.
)

echo Exporting database...

docker run --rm ^
  -v "%DB_DIR%:/mongo-seed/%DB_NAME%" ^
  --network="%NETWORK%" ^
  -it mongo:8.0.0 ^
  /bin/bash -c "mongodump --uri '%MONGO_URI%' -o /mongo-seed"

if %ERRORLEVEL% equ 0 (
  echo Database exported successfully.
) else (
  echo Database export failed!
)

@pause
