#!/bin/bash

DB_NAME="digital_shop"
MONGO_URI="mongodb://root:dev@mongodb/$DB_NAME?authSource=admin"
DB_DIR="$(pwd)/db"
NETWORK="digital-shop-api"

echo "Deleting database..."

docker run --rm \
  --network="$NETWORK" \
  -it mongo:8.0.0 \
  bash -c "mongosh \"$MONGO_URI\" --eval \"db.getSiblingDB('$DB_NAME').dropDatabase()\""

echo "Database deleted successfully."

echo "Importing database..."

docker run --rm \
  -v "$DB_DIR:/mongo-seed" \
  --network="$NETWORK" \
  -it mongo:8.0.0 \
  bash -c "mongorestore --uri '$MONGO_URI' --nsInclude=$DB_NAME.* /mongo-seed"

if [ $? -eq 0 ]; then
    echo "Database imported successfully."
else
    echo "Database import failed!"
fi
