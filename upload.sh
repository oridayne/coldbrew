#!/bin/sh

rsync --del -avz ./ athena:www/coldbrew \
      --include=/dist                   \
      --include='/dist/**'              \
      --include='*.html'                \
      --exclude='*'
