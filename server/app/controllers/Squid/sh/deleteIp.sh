#!/bin/bash
#########################################################
#                                                       #
#                               Squid Proxy Script      #
#                               Prepared By: Varun      #
#                               Version 1.0             #
#                                                       #
#########################################################

###Global Variables
OS=`uname -s`
DISTRIB=`cat /etc/*release* | grep -i DISTRIB_ID | cut -f2 -d=`
SQUID_VERSION=4.8
BASEDIR="/opt/squid"
CONFIGDIR="/etc/squid"
CONFIG_FILE="${BASEDIR}/config.cfg"
PASSWDMASTER="/etc/squid/squid.passwd"
BLACKLIST="/etc/squid/blacklist.acl"
MYSQLDB="proxy_db"
MYSQLUSER="root"
# MYSQL_PWD="root"
# MYSQL_PWD="root@2019"
MYSQL_PWD=""
IPBLK="$1"
N="$2"
S="$3"
export MYSQL_PWD

checkRoot()
{
        if [ `id -u` -ne 0 ]
        then
                echo "SCRIPT must be RUN as root user"
                exit 13
        else
                echo "USER: root" 1>/dev/null
        fi
}
checkOS()
{
        if [ "$OS" == "Linux" ] && [ "$DISTRIB" == "Ubuntu" ]
        then
                echo "Operating System = $DISTRIB $OS" 1>/dev/null
        else
                echo "Please run this script on Ubuntu Linux" 1>/dev/null
                exit 12
        fi
}
checkSquid()
{
        dpkg-query --list squid >/dev/null 2>&1
        if [ `echo $?` -eq 0 ]
        then
                echo "Squid Installed" > /dev/null
        else
                apt-get install squid apache2-utils -y
        fi
        clear
}
createProxyFile()
{
        cd ${CONFIGDIR}/conf.d/
        printf "acl $1_$2 myip $1\n" >> $5
        printf "tcp_outgoing_address $1 $1_$2\n" >>$5
        printf "http_access allow $3 $1_$2 $3_$2\n" >> $5
}
Menu_1()
{
	INT=`cat ${CONFIG_FILE} | grep INTERFACE | awk -F"=" '{print $2}'`
        J=`echo ${IPBLK} | cut -f3 -d.`
    IP=`echo ${IPBLK} | cut -f1,2 -d.`
    M=0
    I=`echo ${IPBLK} | cut -f4 -d.`
    while [ $M -lt $N ]
    do
    if [ $I -eq 256 ]; then J=$((J+1));I=0;fi
    NEWIP="$IP.$J.$I"
    I=$((I+1))
    M=$((M+1))
    netfile=`find /etc/netplan/ -name '*.yaml'`
    mysql -h localhost -u $MYSQLUSER  $MYSQLDB -e "delete from IPMASTER where IPADDRESS=INET_ATON('$NEWIP');"
    sed -i.bak "/$NEWIP/d" $netfile
    sudo netplan apply
    ip addr del $NEWIP/$S dev $INT
        rm -rf /etc/network/interfaces.d/${NEWIP} 2>/dev/null
    done
}
ulimit -n 8192
checkRoot
checkOS
checkSquid
Menu_1