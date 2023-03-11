# Deploying SpringBoot to AWS Beanstalk

---

The whole process is actually rather easy. I used to deploy on self configured EC2 instances 
and must say Beanstalk really makes our job easier to the point where we don't have 
to worry about deployments and can focus on coding.

## Agenda:
- Create SpringBoot application and package it into jar
- Upload jar to Beanstalk

Optional additional steps:
- Purchase and set up personal domain
- Issue and set up SSL certificate in AWS Certificate Manager
- Make necessary redirects in Route53

## Creating and packaging your app

You can of course use your own app or if you just want to follow along, you can download 
mine [here](https://github.com/asgarov1/myApp) (a single page chuck norris generating joke app). Once you have downloaded it 
just run mvn package to create a jar in your target folder.

## Upload jar to Beanstalk
1. Login to AWS Management Console and go to Elastic Beanstalk. There press create new.
2. Choose web server environment and press next
3. Choose Managed Platform, pick Java, upload the jar you have created and press create environment

