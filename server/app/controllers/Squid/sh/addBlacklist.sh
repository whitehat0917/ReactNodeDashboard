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
MYSQL_PWD=""
# MYSQL_PWD="root@2019"
blackurl="$1"
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
        echo ".${blackurl}" >> $BLACKLIST
        systemctl reload squid
}
ulimit -n 8192
checkRoot
checkOS
checkSquid
Menu_1