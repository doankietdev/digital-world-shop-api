@echo off

set "NETWORK=digital-world-shop-api_digital-shop-api"
set "MONGO_URI=mongodb://root:dev@mongodb/digital_shop?authSource=admin"
set "DB_DIR=%cd%\db"

if exist "%DB_DIR%" (
    rd /s /q "%DB_DIR%"
)

docker run --rm ^
  -v "%DB_DIR%:/mongo-seed/digital_shop" ^
  --network="%NETWORK%" ^
  -it mongo:8.0.0 ^
  /bin/bash -c "mongodump --uri '%MONGO_URI%' -o /mongo-seed"
