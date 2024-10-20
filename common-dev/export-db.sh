#!/bin/bash

NETWORK="digital-world-shop-api_digital-shop-api"
MONGO_URI="mongodb://root:dev@mongodb/digital_shop?authSource=admin"
DB_DIR="$(pwd)/db"

if [ -d "$DB_DIR" ]; then
    rm -rf "$DB_DIR"
fi

docker run --rm \
  -v "$DB_DIR:/mongo-seed/digital_shop" \
  --network="$NETWORK" \
  -it mongo:8.0.0 \
  /bin/bash -c "mongodump --uri '$MONGO_URI' -o /mongo-seed"
