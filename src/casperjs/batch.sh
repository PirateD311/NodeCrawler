#!/bin/bash

i=1
echo 'Begin To ShuaLiang'
while [ $i -le 1000 ]
   do
        casperjs shualiang.js --proxy=http://http-dyn.abuyun.com:9020 --proxy-auth=H7A4R89161P4195D:D67A6F4DB1F79931;
        echo '----------------------------  Request Ok !! Count:'$i'  ----------------------------'
       i=`expr $i + 1`
   done