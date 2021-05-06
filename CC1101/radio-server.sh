#!/bin/bash
sudo g++ -lwiringPi RX_Demo.cpp cc1100_raspi.cpp -o RX_Demo
sudo chmod 755 RX_Demo
sudo ./RX_Demo -v -a3 -c1 -f868 -m100