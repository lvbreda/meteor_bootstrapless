#!/bin/sh

rm -rf build

mkdir -p build/img
mkdir -p build/less
mkdir -p build/js

cd lib/bootstrap
git checkout v2.0.4
make bootstrap
cd ../..

cp lib/bootstrap/bootstrap/js/bootstrap.js build/js

touch build/less/bootstrap.less
cat lib/bootstrap/less/reset.less |grep -v @import >> build/less/bootstrap.less
cat lib/bootstrap/less/bootstrap.less |grep -v @import >> build/less/bootstrap.less

for f in `ls lib/bootstrap/less/*.less | grep -v "bootstrap\.less" | grep -v "reset\.less"`
do
 echo "Processing $f"
 cat `pwd`/$f |grep -v @import >> build/less/bootstrap.less
done

cat lib/bootstrap-override.less >> build/less/bootstrap.less

cp lib/bootstrap/img/glyphicons-halflings.png build/img
cp lib/bootstrap/img/glyphicons-halflings-white.png build/img

cd lib/bootstrap
git reset --hard HEAD
git checkout master
cd ../..

rm -rf lib/bootstrap/bootstrap
