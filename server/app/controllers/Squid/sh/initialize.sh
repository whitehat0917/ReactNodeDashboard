#!/bin/bash
#####################################################################
#######            Initialize Script                        #########
#####################################################################

###Global Variables
OS=`uname -s`
DISTRIB=`cat /etc/*release* | grep -i DISTRIB_ID | cut -f2 -d=`
SQUID_VERSION=4.8
CONFIG_FILE="config.cfg"
BASEDIR="/opt/squid"
PRIMARYKEY=18000
echo >${CONFIG_FILE}

checkRoot()
{
        if [ `id -u` -ne 0 ]
        then
                echo "SCRIPT must be RUN as root user"
                exit 13
        else
                echo "USER: root"
        fi
}
checkOS()
{
        if [ "$OS" == "Linux" ] && [ "$DISTRIB" == "Ubuntu" ]
        then
                echo "Operating System = $DISTRIB $OS"
        else
                echo "Please run this script on Ubuntu Linux"
                exit 12
        fi
       
}
getInterface()
{
        INTERFACES=`ls -l /sys/class/net/ | grep -v lo | grep -v total | awk '{print $9}'`
        COUNT=`echo $INTERFACES | wc -w`
		while true
		do
        echo "Interfaces found"
        if [ $COUNT -eq 1 ]
        then
                INTERFACE=`echo $INTERFACES`
                echo $INTERFACES
				break
        else
                echo "Interfaces found"
                COUNT=1
                for INTERFACE in $INTERFACES
                do
                        LINK=`ethtool $INTERFACE | grep Link`
                        echo "$COUNT. $INTERFACE -- Status: $LINK"
                        COUNT=$((COUNT+1))
                done
                read -p "Enter the INTERFACE to be used:" ANSWER
				echo $INTERFACES | grep -q $ANSWER
				if [ $(echo $?) -eq 0 ]
				then
					INTERFACE=$ANSWER
					break
				else
					echo "Please Enter the INTERFACE name [ex: eth0 or ens18 ]"
				fi
        fi
		done
        echo "Setting INTERFACE: $INTERFACE"
        echo "INTERFACE=$INTERFACE" >> ${BASEDIR}/${CONFIG_FILE}
}
installSquid()
{
		apt install aptitude -y
		sed -Ei 's/^# deb-src /deb-src /' /etc/apt/sources.list
		apt-get update -y
		apt-get install build-essential libltdl-dev -y
		aptitude build-dep squid
		apt-get update -y
		apt-get install perl -y
		apt-get install binutils -y
		apt-get install c++11 -y
		apt-get install wget -y
		apt-get install apache2 apache2-utils -y
		wget http://www.squid-cache.org/Versions/v4/squid-4.10.tar.gz
        tar -zxf squid-4.10.tar.gz
		cd squid-4.10
		apt-get install automake autoconf libtool -y
		./bootstrap.sh
		./configure --prefix=/usr --includedir=${prefix}/include --mandir=${prefix}/share/man --infodir=${prefix}/share/info --sysconfdir=/etc --localstatedir=/var --libexecdir=${prefix}/lib/squid --disable-maintainer-mode --disable-dependency-tracking --disable-silent-rules --enable-async-io --enable-icmp --enable-delay-pools --enable-useragent-log --enable-snmp --enable-http-violation --datadir=/usr/share/squid --sysconfdir=/etc/squid --libexecdir=/usr/lib/squid --mandir=/usr/share/man --enable-inline --enable-storeio=ufs,aufs,diskd,rock --enable-cache-digests --enable-icap-client  --enable-follow-x-forwarded-for --with-swapdir=/var/spool/squid --with-logdir=/var/log/squid --with-pidfile=/var/run/squid.pid --with-filedescriptors=65536  --with-large-files --with-default-user=proxy --enable-build-info="Ubuntu linux" --enable-linux-netfilter CXXFLAGS="-DMAXTCPLISTENPORTS=4096"
		make
		make install
        mkdir /var/log/squid 2>/dev/null
        mkdir /var/cache/squid 2>/dev/null
        mkdir /var/spool/squid 2>/dev/null
		touch /var/log/squid/access.log
		touch /var/log/squid/error.log
		touch /var/log/squid/cache.log
		chmod 777 /var/log/squid/access.log
		chmod 777 /var/log/squid/error.log   
		chmod 777 /var/log/squid/cache.log
		cd ..
}
initializeFiles()
{
		mkdir -p ${BASEDIR}
        cp proxy.sh ${BASEDIR}/proxy.sh
        cp monitor.sh ${BASEDIR}/monitor.sh
        cp initdb.sql ${BASEDIR}/initdb.sql
        echo "OS=$OS" >> ${BASEDIR}/${CONFIG_FILE}
        echo "DISTRIBUTION=$DISTRIB" >>${BASEDIR}/${CONFIG_FILE}
        echo "BASEDIR=${BASEDIR}" >> ${BASEDIR}/${CONFIG_FILE}
        echo "PRIMARYKEY=${PRIMARYKEY}" >> ${BASEDIR}/${CONFIG_FILE}
        cd ${BASEDIR}
        chmod +x proxy.sh
        >/etc/squid/squiddb
        >/etc/squid/squid.passwd
        mkdir -p /etc/squid/conf.d/
        touch /etc/squid/conf.d/sample.conf
}
installMariadb()
{
        apt-get install -y mysql-server
		clear
		echo "Initialize Database structure. Please enter Password as <root> when prompted"
		echo
        read -p "press any key to continue" ANS
		systemctl enable mysql
		systemctl start mysql
		clear
		echo "The initial password is blank. Please set the new password as <root> if prompted. Press Enter to continue"
		/usr/bin/mysql_secure_installation
			
}
initializeDB()
{
        echo "Initialize Database structure. Please enter Password as <root> when prompted"
        cat initdb.sql | mysql -u root -p
}
initializeNode(){
        apt-get install nodejs
        apt-get install npm
        npm install pm2 -g
}
setconfig()
{
        cp /etc/squid/squid.conf /etc/squid/squid.conf.orig
        > /etc/squid/squid.conf
		wget https://raw.githubusercontent.com/revathivarun13/squidproxy/master/squid.conf
		cp -f squid.conf /etc/squid/squid.conf
		wget https://raw.githubusercontent.com/revathivarun13/squidproxy/master/squid.init
		cp squid.init /etc/init.d/squid
		chmod +x /etc/init.d/squid
		wget https://raw.githubusercontent.com/revathivarun13/squidproxy/master/squid.service
		cp squid.service /etc/systemd/system/squid.service
		systemctl daemon-reload
		systemctl enable squid
        systemctl start squid
}

checkRoot
checkOS
getInterface
installSquid
initializeFiles
installMariadb
initializeDB
initializeNode
setconfig
ln -s /opt/squid/proxy.sh /usr/bin/proxy
touch /etc/squid/blacklist.acl
clear
echo "Proxy Setup Completed. Please run the command \"proxy\" to start creating proxies"