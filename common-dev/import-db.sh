#!/bin/bash

NETWORK="digital-world-shop-api_digital-shop-api"
MONGO_URI="mongodb://root:dev@mongodb/digital_shop?authSource=admin"
DB_DIR="$(pwd)/db"

docker run --rm \
  -v "$DB_DIR:/mongo-seed" \
  --network="$NETWORK" \
  -it mongo:8.0.0 \
  /bin/bash -c "mongorestore --uri '$MONGO_URI' --nsInclude=digital_shop.* /mongo-seed"
