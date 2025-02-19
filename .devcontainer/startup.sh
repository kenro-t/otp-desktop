#!/bin/bash
sudo /etc/init.d/dbus start
export XDG_RUNTIME_DIR=/run/user/$(id -u)
export DBUS_SESSION_BUS_ADDRESS=unix:path=$XDG_RUNTIME_DIR/bus
sudo mkdir -p $XDG_RUNTIME_DIR
sudo chmod 700 $XDG_RUNTIME_DIR
sudo chown $(id -un):$(id -gn) $XDG_RUNTIME_DIR
dbus-daemon --session --address=$DBUS_SESSION_BUS_ADDRESS --nofork --nopidfile --syslog-only &

# debug
# echo $XDG_RUNTIME_DIR
# echo $DBUS_SESSION_BUS_ADDRESS
# ps aux | grep dbus