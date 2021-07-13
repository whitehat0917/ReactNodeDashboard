
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
interface_name="$1"
staticip="$2"
gatewayip="$3"
nameserversip="$4"

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
initializeNode(){
        apt-get install nodejs
        apt-get install npm
        npm install pm2 -g
}
initializeNetplan(){
        touch /etc/netplan/01-netcfg.yaml
        cp /etc/netplan/01-netcfg.yaml /etc/netplan/01-netcfg.yaml.bk_`date +%Y%m%d%H%M`
        # Ask for input on network configuration
        echo
        cat > /etc/netplan/01-netcfg.yaml <<EOF
network:
  version: 2
  renderer: networkd
  ethernets:
    $interface_name:
      dhcp4: no
      dhcp6: yes
      addresses:
        - $staticip
      gateway4: $gatewayip
      nameservers:
          addresses: 
              - "$nameserversip"
EOF
}
 
checkRoot
checkOS
initializeNode
initializeNetplan