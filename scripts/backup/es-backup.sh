#!/bin/sh
original=retro_prod
backup=retro_prod_$(date +"%d%m%Y_%H%M%S")
base=/var/backup/es

year=$(date +"%Y")
month=$(date +"%m")
day=$(date +"%d")

path=$base/$year/$month/$day
/bin/mkdir -p $path

dumpFile=$path/$backup.bz2

ERROR=$(/usr/bin/env esdump --url http://host1:9200/ --indexes $original --bzip2 --file $dumpFile 2>&1)
RESULT=$?
if [ $RESULT -eq 0 ];
then
    echo "Dumped index ${original} to file ${dumpFile}";
    exit 0;
else
    echo "Dumping index ${original} failed with error: \n\n${ERROR}\n\n";
    exit 1;
fi


#/usr/bin/env esimport --url http://localhost:9200 --index $backup --file "${path}/${backup}.bz2"
