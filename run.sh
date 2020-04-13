#!/bin/bash
if [ $(id -u) -ne 0 ]; then
   echo "please run server as root so the server can sniff packets." 
   exit 1
fi
echo "when the server is running, refresh the page."
sleep 3;
sudo -u $SUDO_USER xdg-open http://localhost:5000 &
sudo python3 main.py
