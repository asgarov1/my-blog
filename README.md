# MyBlog

Blog written with Angular that reads files from markdown files and uses no backend. 

## Deployment
```
ng build -c production;
ssh -i /poth/to/key.pem ubuntu@ec2-1-2-3-4.eu-central-1.compute.amazonaws.com "rm -rf ./blog/*";
scp -r -i /poth/to/key.pem ./dist/blog/* ubuntu@ec2-1-2-3-4.eu-central-1.compute.amazonaws.com:/home/ubuntu/blog/;
ssh -i /poth/to/key.pem ubuntu@ec2-1-2-3-4.eu-central-1.compute.amazonaws.com "sudo rm -rf /var/www/html/blog/*";
ssh -i /poth/to/key.pem ubuntu@ec2-1-2-3-4.eu-central-1.compute.amazonaws.com "sudo cp -r ./blog/* /var/www/html/blog/";
```

