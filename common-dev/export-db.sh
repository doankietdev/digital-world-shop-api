#!/bin/bash

DB_NAME="digital_shop"
MONGO_URI="mongodb://root:dev@mongodb/$DB_NAME?authSource=admin"
DB_DIR="$(pwd)/db"
NETWORK="digital-shop-api"

if [ -d "$DB_DIR" ]; then
    echo "$DB_DIR directory already exists, deleting..."
    rm -rf "$DB_DIR"
    echo "$DB_DIR directory deleted successfully."
fi

echo "Exporting database..."

docker run --rm \
  -v "$DB_DIR:/mongo-seed/$DB_NAME" \
  --network="$NETWORK" \
  -it mongo:8.0.0 \
  /bin/bash -c "mongodump --uri '$MONGO_URI' -o /mongo-seed"

if [ $? -eq 0 ]; then
    echo "Database exported successfully."
else
    echo "Database export failed!"
fi
