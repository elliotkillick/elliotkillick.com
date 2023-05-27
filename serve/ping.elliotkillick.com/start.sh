#!/bin/sh

[ "$USER" = "root" ] && {
    echo "start.sh should not be run as root! Exiting..." >&2
    exit 1
}

sudo iptables -I INPUT -p tcp -m tcp --dport 80 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sudo iptables -I INPUT -p tcp -m tcp --dport 443 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT
sduo iptables -I INPUT -p tcp -m tcp --dport 8443 -m conntrack --ctstate NEW,ESTABLISHED -j ACCEPT

# Plausible Analytics
cd "$HOME/hosting" || exit
sudo docker-compose up -d

# Listmonk
cd "$HOME/listmonk" || exit
sudo docker-compose up -d

# rss2newsletter
cd "$HOME/rss2newsletter" || exit
./rss2newsletter.py &

# Nginx (reverse proxy)
sudo systemctl start nginx
