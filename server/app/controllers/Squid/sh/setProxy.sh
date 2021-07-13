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
userid="$1"
PXYPORT="$2"
username="$3"
PXYNO="$4"
PXYDAYS="$5"
password="$6"
userid="$7"
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
    LISTOFIPID=`mysql -N -h localhost -u $MYSQLUSER  $MYSQLDB -e "SELECT IPMASTER.IPID FROM IPMASTER left join PROXYMASTER on IPMASTER.IPID = PROXYMASTER.IPID and PROXYMASTER.USERID = $userid WHERE STATUS IS FALSE and PROXYMASTER.USERID is NULL ORDER BY USED LIMIT $PXYNO;"`
    SDATE=`echo $(date +%F)`
    STIME=`echo $(date +%T)`
    EDATE=`echo $(date +%F -d "+$PXYDAYS days")`
    ETIME=`echo $(date +%T)`
    for IPID in $LISTOFIPID
    do
        mysql -h localhost -u $MYSQLUSER  $MYSQLDB -e "INSERT INTO PROXYMASTER (USERID,IPID,PORT,SDATE,STIME,EDATE,ETIME) VALUES ($userid,$IPID,$PXYPORT,'$SDATE','$STIME','$EDATE','$ETIME');"
                mysql -h localhost -u $MYSQLUSER  $MYSQLDB -e "UPDATE IPMASTER SET USED=USED+1 WHERE IPID=$IPID;"
        mysql -h localhost -u $MYSQLUSER  $MYSQLDB -e "UPDATE IPMASTER SET STATUS=1 WHERE IPID=$IPID AND MUL=USED;"
    done
	for IPID in $LISTOFIPID
	do
			IPA=`mysql -N -h localhost -u $MYSQLUSER  $MYSQLDB -e "SELECT INET_NTOA(IPADDRESS) as IP FROM IPMASTER WHERE IPID=$IPID;"`
			echo "$IPA:$PXYPORT:$username:$password"
	done

	FILENAME="${userid}.conf"
    cd ${CONFIGDIR}/conf.d/
    touch $FILENAME
    printf "http_port $PXYPORT name=$username$PXYPORT\n" >>$FILENAME
    printf "acl ${username}_${PXYPORT} myportname $username$PXYPORT\n" >>$FILENAME
    printf "acl ${username} proxy_auth $username\n" >>$FILENAME
    for IPID in $LISTOFIPID
    do
        IPA=`mysql -N -h localhost -u $MYSQLUSER  $MYSQLDB -e "SELECT INET_NTOA(IPADDRESS) as IP FROM IPMASTER WHERE IPID=$IPID;"`
        createProxyFile "$IPA" "$PXYPORT" "$username" "$password" "$FILENAME"
    done
    systemctl reload squid
}
ulimit -n 8192
checkRoot
checkOS
checkSquid
Menu_1