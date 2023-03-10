#!/usr/bin/env bash

ng build -c production;
ssh -i ~/Documents/keys/blog.pem ubuntu@ec2-3-75-240-39.eu-central-1.compute.amazonaws.com "rm -rf ./blog/*";
scp -r -i ~/Documents/keys/blog.pem ./dist/blog/* ubuntu@ec2-3-75-240-39.eu-central-1.compute.amazonaws.com:/home/ubuntu/blog/;
ssh -i ~/Documents/keys/blog.pem ubuntu@ec2-3-75-240-39.eu-central-1.compute.amazonaws.com "sudo rm -rf /var/www/html/blog/*";
ssh -i ~/Documents/keys/blog.pem ubuntu@ec2-3-75-240-39.eu-central-1.compute.amazonaws.com "sudo cp -r ./blog/* /var/www/html/blog/";
