#!/bin/sh

rsync --del -avz ./ lisadeng@ftp.dialup.mit.edu:/mit/lisadeng/coldbrew-test \
      --include=/dist                   \
      --include='/dist/**'              \
      --include='*.html'                \
      --include='/img/favicon.ico'      \
      --exclude='*'
