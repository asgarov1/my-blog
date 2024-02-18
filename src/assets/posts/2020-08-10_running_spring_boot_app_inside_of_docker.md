# Running Spring Boot App inside of Docker

---

To run you Spring Boot application you need a jar file.

Jar file will be built in `/target` folder of your application every time you run `mvn clean install` or `gradle build`. 
In order to run this in Docker you have to copy the jar file from your `/target` directory to the Docker container inner files, 
and then run it (`java -jar nameOfYourJar.jar`).

Copying the file into Docker is necessary because Docker being a container can only access files inside of its container - 
good for security.

Name of your jar can be defined in maven/gradle settings but to keep your Dockerfile generic I suggest following Dockerfile:

```dockerfile
FROM openjdk:11.0-jre
ARG JAR_FILE=/target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","app.jar"]
```

Dockerfile is a file without extension, you can create it in terminal with `nano Dockerfile` or `vi Dockerfile` or with right 
mouse click create a text file and then remove the `.txt` extension.

Every Dockerfile must start with `FROM name_of_your_base_image`. As we are only running a Java app, JRE is enough.

with `ARG JAR_FILE` you save the path to any jar file found in target as a `JAR_FILE` variable, and then you can copy it to your 
Docker inner files where it will be stored under the name app.jar.

`ENTRYPOINT` is the command that will be run on container start.

Command and it's arguments are all separated in docker without space but with commas and all surrounded by double quotes.

Place the Dockerfile next to (not inside) the `/target` directory (so in root folder of your app) and run following command in 
terminal:

`docker build -t spring-app . && docker run --rm -d -p 8080:8080 spring-app`

All done! Feel free to visit you app at` localhost:8080` - assuming your Spring Boot app is a web app and has 
Controller handling get requests to "/" path.

For a nice introduction to Docker I recommend reading this paper - it is written in a way that is very easy to follow: 
https://www.cs.ru.nl/bachelors-theses/2020/Joren_Vrancken___4593847___A_Methodology_for_Penetration_Testing_Docker_Systems.pdf
