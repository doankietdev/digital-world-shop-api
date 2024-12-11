@echo off

set "DB_NAME=digital_shop"
set "MONGO_URI=mongodb://root:dev@mongodb/%DB_NAME%?authSource=admin"
set "DB_DIR=%cd%\db"
set "NETWORK=digital-shop-api"

echo Deleting database...

docker run --rm ^
  --network="%NETWORK%" ^
  -it mongo:8.0.0 ^
  bash -c "mongosh \"%MONGO_URI%\" --eval \"db.getSiblingDB('%DB_NAME%').dropDatabase()\""

echo Database deleted successfully.

echo Importing database...

docker run --rm ^
  -v "%DB_DIR%:/mongo-seed" ^
  --network="%NETWORK%" ^
  -it mongo:8.0.0 ^
  bash -c "mongorestore --uri '%MONGO_URI%' /mongo-seed"

if %ERRORLEVEL% equ 0 (
    echo Database imported successfully.
) else (
    echo Database import failed!
)

@pause
