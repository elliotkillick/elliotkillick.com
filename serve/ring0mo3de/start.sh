#!/bin/sh

[ "$USER" = "root" ] && {
    echo "start.sh should not be run as root! Exiting..." >&2
    exit 1
}

sudo iptables -I INPUT -p tcp -m tcp --dport 80 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -I INPUT -p tcp -m tcp --dport 443 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT

sudo sysctl -w net.ipv4.ip_unprivileged_port_start=80

cd "$HOME/serve" || exit
serve &
