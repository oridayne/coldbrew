#!/bin/sh

rsync --del -avz ./ athena:www/coldbrew \
      --include=/dist                   \
      --include='/dist/**'              \
      --include='*.html'                \
      --include='/img/favicon.ico'      \
      --exclude='*'
