# Remote Debugging

---

I learned this from truly awesome book How To Read Java and so all credits to the author. 
This is extremely useful if you want to debug an app deployed on another environment, for example test environment 
to debug environment specific issue.

To make your app available for a remote debugger to connect to, just run the jar with following command:

`java -jar -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:7007 name_of_your_jar.jar`

---

So I am using a demo app available [here](https://github.com/asgarov1/chuckNorrisJokesApp) in case you want 
to use it for coding along. 
- Once downloaded just build it and the run the jar with the above command:
```
mvn clean package
java -jar -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:7007 target/app-0.0.1-SNAPSHOT.jar
```
- Add a new `Remote JVM Debug` Configuration:
<img src="https://javamondays.com/wp-content/uploads/2022/04/image-1.png" alt="" class="wp-image-1035"/>
- Set it up with the same `agentlib` parameters (in Intellij all you need is to specify the port `7007`):
<img src="https://javamondays.com/wp-content/uploads/2022/04/image-2-1024x544.png" alt="" class="wp-image-1036"/>

And voila, you can run it. When connecting to an app on another machine you would just need to specify the correct host 
(instead of localhost) and make sure the port used is open.

As you can see triggering a controller method via browser correctly stopped debugger where needed:
<img src="https://javamondays.com/wp-content/uploads/2022/04/image-4-1024x607.png" alt="" class="wp-image-1038"/>

Also you need to be careful that your source code that you are using in the IDE is exactly the same 
that was used to deploy the app otherwise debugger will be stepping on lines but they might be different 
and it will just confuse you.

---

## Debugging the application running inside of Docker

This is also very easy to do, you just need to provide an environment variable to the docker container. 
This is already done in the provided Dockerfile in the project:
<img src="https://javamondays.com/wp-content/uploads/2022/04/image-14-1024x204.png" alt="" class="wp-image-1064"/>

 - So all you need to do is build the jar with `mvn clean package`
 - Then build the docker image and run it:
```
docker build -t chuck-norris-app .
docker run -p 8080:8080 -p 7007:7007 -d chuck-norris-app
```

After that you can start the same debug configuration you had and debug just the same
