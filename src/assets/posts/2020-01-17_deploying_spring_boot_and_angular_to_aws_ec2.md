# Deploying Spring Boot + Angular Rest application on AWS EC2

---

### Requirements:

- A Java Spring Boot Rest application - if you don't have yours ready you 
can use mine for the sake of practice from [here](https://github.com/asgarov1/chuckNorrisRestApp)
- Angular Front End app - my version can be found [here](https://github.com/asgarov1/chuckNorrisRestApp)

So first of all launch and EC2 instance and connect to it. 
I am using Ubuntu 18.04 Small.

Once you are connected we will need to run few installations:

## Installing Java
sudo apt update
sudo apt install default-jdk -y

once this is done check for installed java version with `java -version`  

<img src="assets/images/ec2/ec2_1.png">  

## Download Spring Boot project on EC2
Go to your repository, right click on Download Code -> Download Zip and copy the link address  

<img src="assets/images/ec2/ec2_2.png">

After that just use the link but change zip for tar.gz because of linux
`wget --no-check-certificate https://github.com/asgarov1/chuckNorrisRestApp/archive/refs/heads/main.tar.gz`

Now unpack it:
`tar -xf main.tar.gz`

Now if you run ls you will see your folder unarchived
<img src="assets/images/ec2/ec2_3.png">

## Installing maven
`sudo apt-get install maven -y`

After installing it, check that it works with `mvn -v`
<img src="assets/images/ec2/ec2_4.png">

Once you execute `mvn clean install` you should have no problem running your application `mvn spring-boot:run`

You also now have a jar created in you `/target` folder. Copy the path to 
it to some notepad. In my case it is 
`/home/ubuntu/chuckNorrisRestApp-main/chuckNorrisJokesApp-backend/target/app-0.0.1-SNAPSHOT.jar`

## Creating executable service

Create a `start_server.sh` with `sudo nano start_server_sh`

In there type only:

```
#!/bin/bash

java -jar /path/to/your-app.jar
```

save it and make it executable with `sudo chmod +x start_server.sh.`
now type `sudo nano /etc/systemd/system/myserver.service` and paste following contents in there:

```
[Unit]
Description=My Shell Script

[Service]
ExecStart=/path/to/start_server.sh

[Install]
WantedBy=multi-user.target
```

Run `sudo systemctl daemon-reload` to reload changes.

After that you can run and check status of your server with:

```
sudo systemctl start myserver.service
sudo systemctl status myserver.service
```

You should see something like this:
<img src="assets/images/ec2/ec2_5.png">

Press q to exit logs. You can check for running processes with the 
following command:

`sudo lsof -i -P -n | grep LISTEN`

Half way there - your backend is running as a background process on port 8080.

## Install npm and Angular
```
cd ~
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install -y nodejs
sudo npm install -g @angular/cli
```

After installing this change to the frontend folder of your download project 
and run npm i to install all the dependencies.

After that update all your links to use the ip address of your EC2 instance.
In my case I always referred to environment file so that is the only place 
I need to update it in with `sudo nano src/environments/environment.prod.ts`:

```
export const environment = {
  production: true,
  apiUrl: '217.03.123.154:8080'
};
```

Once that is done build it for prod with `ng build --prod`

## Setting up Apache2 as web server for Angular

```
sudo apt install apache2 -y
sudo systemctl status apache2
```

Second line should show Apache as running. Now navigate to your 
Frontend app and copy the created dist folder to apache with 
`sudo cp -r ./dist/your_frontend_app_name/ /var/www/dist`

Now that is done create a configuration for your new website that will 
also direct proxies with `sudo nano /etc/apache2/sites-available/myconf.conf`. 
Inside there paste the following:

```
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    ServerName localhost
    ServerAlias localhost
    DocumentRoot /var/www/dist
    <Directory "/var/www/dist">
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Now activate your configuration, turn off the default one and reload apache:

```
sudo a2ensite myconf.conf
sudo a2dissite 000-default.conf
sudo systemctl reload apache2
```

That is it. Big breath and go check your website live and working by 
typing your EC2 instance public ip address:
<img src="assets/images/ec2/ec2_6.png">

## Things to improve:
1. Hide backend in Virtual Network behind API Gateway so that only Frontend is exposed
2. Upgrade to SSL
3. Configure Route 53 with custom domain

But all these things are beyond the scope of this simple tutorial whose objective was to explain basics of Spring Boot + Angular deployment.

Setting up SSL and custom domain are shown in another tutorial 
<a href="/?post=2021-05-02_deploying_spring_boot_to_aws_beanstalk.md">here</a>
, if you want to check it out
