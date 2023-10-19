# Linux Cheatsheet

Just some commands that I often end up using/looking up - this list will keep getting updated 

---

### Copying to server with scp
`scp [filename] username@domain:/path/to/copy/to`

e.g. `scp test.txt asgarov@servername:/home/asgarov`


### Check which ports are being used
`sudo lsof -i -P -n | grep LISTEN`

### get number of lines in file
`wc -l file1.txt`

### Save SSL certificate from remote host
`keytool -printcert -rfc -sslserver my.domain.com > dydomain.cer`

### Add SSL certificate to the JDK:
`$JDK_HOME/bin/keytool -importcert -file ./path/to/$CERT_NAME -alias my-alias -keystore $JDK_HOME/lib/security/cacerts -storepass changeit`

### Find service name with grep
On some Linux OS (I am looking at you Redhat), 
nginx is called differently (something like `rh-nginx116-nginx.service`) 
so in order to control it with `systemctl` you first need to find exact name with:
`systemctl list-units --type=service | grep nginx`

#### Adjust nginx config
`sudo vim /etc/nginx/sites-available/some.conf`

### Nginx config example:
```
location /api/ {
    gzip on;
    gzip_min_length 1000;
    gzip_buffers 4 32k;
    gzip_proxied any;
    gzip_types text/plain application/javascript application/x-javascript text/javascript text/xml text/css;
    gzip_vary on;
    
            proxy_set_header  Host              $host;
            proxy_set_header  X-Real-IP         $remote_addr;
            proxy_set_header  X-Forwarded-For   $remote_addr;
            proxy_pass        http://127.0.0.1:8100;
            proxy_set_header Proxy "";
}
```

### Find something recursively in the logs
`sudo grep -ir 'out of memory' /var/log/`

### Find duplicate files
`find . ! -empty -type f -exec md5sum {} + | sort | uniq -w32 -dD`

### REPLACE a with b in all files recursively
`find . -type f -name "*.java" -print0 | xargs -0 sed -i '' -e 's/import javax.xml.bind/import jakarta.xml.bind/g'`

### List files inside of jar
`unzip -l <jar-file-name>.jar`

### Display file contents inside of jar
`unzip -p archive.zip file1.txt`

### Delete unwanted file from jar
`zip -d file.jar unwanted_file.txt`

### Run different main class from Spring Boot Jar
`java -cp ./target/my-jar-0.0.1-SNAPSHOT.jar -Dloader.main=at.foo.Bar org.springframework.boot.loader.PropertiesLauncher some-argument`

see [here](https://stackoverflow.com/questions/5474666/how-to-run-a-class-from-jar-which-is-not-the-main-class-in-its-manifest-file) for more info

---
## Ubuntu

### List linux kernels
`dpkg --list | grep linux-image`

### Remove linux kernel
`sudo apt-get remove --purge [kernel-name]`

### List nvidia drivers
`apt-cache search nvidia | grep -P '^nvidia-(driver-)?[0-9]+\s'`

### Purge (remove) nvidia drivers
`sudo apt remove --purge nvidia-*`

### Install nvidia driver

After getting the driver name with [List nvidia drivers](#List-nvidia-drivers) you can install the specific driver with:

`sudo apt-get install [nvidia-driver-name]`

---
## Installing tools:

###  Intellij Idea

- Open Console and change the directory `cd /opt/`
- Extract the file `sudo tar -xvzf ~/Downloads/jetbrains-toolbox-1.xx.xxxx.tar.gz`
- Rename the folder (not mandatory, but it's easier for later use) 
`sudo mv jetbrains-toolbox-1.xx.xxxx jetbrains`
- Open JetBrains Toolbox `jetbrains/jetbrains-toolbox`

*If you can't open the file you need to install libfuse2:* `sudo apt install libfuse2`

### Nodejs and Npm

Using NVM (update the version in script as applicable)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.bashrc
nvm list-remote
nvm install v18.18.2
node -v && npm -v
```

---
## Cronjob
### To save logs from cronjob
`* * * * * /install/deploy/deploy.py >> /install/deploy/deploy.log 2>&1`

