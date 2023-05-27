#!/bin/sh

if [ -f "/etc/debian_version" ]; then
    sudo apt-get -y install python3-feedparser
else
    sudo dnf -y install python3-feedparser
fi
