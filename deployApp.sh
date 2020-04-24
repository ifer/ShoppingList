#! /bin/bash

# Before user run the following commnads On the target server:
#  $ cd $TARGET_DIR
#  $ chgrp -R <$TARGET_USER><$TARGET_USER> .
#  $ chmod -R g+w .
#


if [ $# -lt 1 ]
then
	echo "Syntax: deployApp <target server>"
	exit 1
fi

TARGET_SERVER="$1"
if [ "$TARGET_SERVER" = "linode" -o  "$TARGET_SERVER" = "nike" ]
then
	TARGET_SERVER="139.162.227.243"
fi


TARGET_DIR="/var/www-shoppinglist"
TARGET_USER="ifer"
TARGET_PASSWD="Kn0nH3D0"
SOURCE_FILES="src/index.html src/index.js output"


if [ "$TARGET_SERVER" = "139.162.227.243" ]
then
	sshpass -p "$TARGET_PASSWD" ssh -p 919 $TARGET_USER@$TARGET_SERVER "rm -rf $TARGET_DIR/output.BAK  2>/dev/null"
	sshpass -p "$TARGET_PASSWD" ssh -p 919 $TARGET_USER@$TARGET_SERVER "mv $TARGET_DIR/output  $TARGET_DIR/output.BAK  2>/dev/null"
else
	sshpass -p "$TARGET_PASSWD" ssh $TARGET_USER@$TARGET_SERVER "rm -rf $TARGET_DIR/output.BAK  2>/dev/null"
	sshpass -p "$TARGET_PASSWD" ssh $TARGET_USER@$TARGET_SERVER "mv $TARGET_DIR/output  $TARGET_DIR/output.BAK  2>/dev/null"
fi


for f in `echo "$SOURCE_FILES"`
do
	echo "Copying $f.."

	if [ "$TARGET_SERVER" = "139.162.227.243" ]
	then
		sshpass -p "$TARGET_PASSWD" scp -r -P 919 "$f" $TARGET_USER@$TARGET_SERVER:$TARGET_DIR >/dev/null
	else
		sshpass -p "$TARGET_PASSWD" scp -r  "$f" $TARGET_USER@$TARGET_SERVER:$TARGET_DIR >/dev/null
	fi

	if [ $? -ne 0 ]
	then
		echo "**** ERROR COPYING $f"
	fi
done
