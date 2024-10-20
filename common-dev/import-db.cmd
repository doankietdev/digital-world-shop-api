@echo off

set "NETWORK=digital-world-shop-api_digital-shop-api"
set "MONGO_URI=mongodb://root:dev@mongodb/digital_shop?authSource=admin"
set "DB_DIR=%cd%\db"

docker run --rm ^
  --network="%NETWORK%" ^
  -it mongo:8.0.0 ^
  bash -c "mongosh \"%MONGO_URI%\" --eval \"db.getSiblingDB('digital_shop').dropDatabase()\""

docker run --rm ^
  -v "%DB_DIR%:/mongo-seed" ^
  --network="%NETWORK%" ^
  -it mongo:8.0.0 ^
  bash -c "mongorestore --uri '%MONGO_URI%' --nsInclude=digital_shop.* /mongo-seed"
