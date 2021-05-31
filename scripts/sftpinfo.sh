#!/bin/bash

if [ -d /home/$1/ ]
then
    if [[ ! -f /home/$1/.ssh/id_$1 ]]
    then
          PRIVATEKEY="Key does not exist"
    else
          PRIVATEKEY=$(cat /home/$1/.ssh/id_$1)
    fi
else
    PRIVATEKEY="Account does not exist"
fi 

if [ -d /home/$1/ ]
then    
    if [[ ! -f /home/$1/.ssh/id_$1.pub ]]
    then
          PUBLICKEY="Key does not exist"
    else
          PUBLICKEY=$(cat /home/$1/.ssh/id_$1.pub)
    fi
    else
        PUBLICKEY="Account does not exist"
fi
echo -e "$PUBLICKEY", "$PRIVATEKEY"