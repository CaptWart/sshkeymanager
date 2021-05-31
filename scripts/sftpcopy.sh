#!/bin/bash
ACTION=$1
ACCOUNT=$2
PUBKEY=$3
PRIVKEY=$4



#1 copies both id_acctSXFR and id_acctSXFR.pub to .ssh folder
#2 Appends key to authorized_keys file
case "$1" in
    "1")
        if [ -d "/home/$ACCOUNT/.ssh" ]
        then
            if [ -f "/home/$ACCOUNT/.ssh/id_"$ACCOUNT"SXFR.pub" ]
            then
                echo "Key already exist cannot overwrite"
            else

                echo "$PUBKEY" >> /home/$ACCOUNT/.ssh/id_"$ACCOUNT"SXFR.pub
                echo "$PRIVKEY" >> /home/$ACCOUNT/.ssh/id_"$ACCOUNT"SXFR

                chmod 600 /home/$ACCOUNT/.ssh/id_"$ACCOUNT"SXFR
                chmod 644 /home/$ACCOUNT/.ssh/id_"$ACCOUNT"SXFR.pub

                echo "Key copied"
            fi
        else
            if [ -d "/home/$ACCOUNT/" ]
            then
                mkdir "/home/$ACCOUNT/.ssh"
                chmod 755 /home/$ACCOUNT/.ssh
                echo "$PUBKEY" >> /home/$ACCOUNT/.ssh/id_"$ACCOUNT"SXFR.pub
                echo "$PRIVKEY" >> /home/$ACCOUNT/.ssh/id_"$ACCOUNT"SXFR
                chmod 600 /home/$ACCOUNT/.ssh/id_"$ACCOUNT"SXFR
                chmod 644 /home/$ACCOUNT/.ssh/id_"$ACCOUNT"SXFR.pub
                echo "Key copied"
            else
                echo "Account directory does not exist"
            fi

        fi
    ;;

    "2")
        if [ -d "/home/$ACCOUNT/.ssh" ]
        then
            if [ -f "/home/$ACCOUNT/.ssh/authorized_keys" ]
            then
                if [ $(cat /home/app1/.ssh/authorized_keys | grep -c "$PUBKEY") -ge 1 ]
                then
                    echo "Key already exist"
                else
                    echo "Copied Key"
                    echo "$PUBKEY" >> /home/$ACCOUNT/.ssh/authorized_keys
                fi
            else
                echo "$PUBKEY" >> /home/$ACCOUNT/.ssh/authorized_keys
                chmod 644 /home/$ACCOUNT/.ssh/authorized_keys
                echo "Copied Key"
            fi
        else
            if [ -d "/home/$ACCOUNT/" ]
            then
                mkdir "/home/$ACCOUNT/.ssh"
                chmod 755 /home/$ACCOUNT/.ssh
                
                echo "$PUBKEY" >> /home/$ACCOUNT/.ssh/authorized_keys
                chmod 644 /home/$ACCOUNT/.ssh/authorized_keys
                echo "Copied Key"
            else
                echo "Account directory does not exist"
            fi
        fi

    ;;

esac