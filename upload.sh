#!/bin/sh

# change this based on your username, etc.
HOST=athena

rsync --del -avz ./ $HOST:www/coldbrew  \
      --include=/dist                   \
      --include='/dist/**'              \
      --include='*.html'                \
      --include=/img                    \
      --include='/img/*.ico'            \
      --exclude='*'
