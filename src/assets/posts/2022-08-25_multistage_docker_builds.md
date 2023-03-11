# Multistage Docker Builds

---

Multistage docker builds are very easy to do, and they are much more efficient than 
single stage build for because they allow us to discard all but last image which makes 
our image leaner.

So for example say we want to run a java program. We could just use the following Dockerfile:

```
FROM openjdk
RUN echo 'class HelloWorld { public static void main(String[] args) { System.out.println("Hello World"); }}' >> HelloWorld.java
RUN javac HelloWorld.java
CMD java HelloWorld
```

After running it with `docker build . -t single_stage && docker run single_stage`, 
if you look inside of it with `docker run single_stage ls`, we will see:

```
HelloWorld.class
HelloWorld.java
bin
boot
...
```

So as you can see we:

1. first of all are still using JDK in our image even though after initial build we 
only need JRE
2. and second of all we still have source files (.java files) lying around.

## Enter Multistage Build:

```
FROM openjdk:11 AS buildstage
RUN echo 'class HelloWorld { public static void main(String[] args) { System.out.println("Hello World"); }}' >> HelloWorld.java
RUN javac HelloWorld.java

FROM openjdk:11-jre-slim
RUN mkdir /myapp
COPY --from=buildstage /HelloWorld.class /myapp
WORKDIR /myapp
CMD java HelloWorld
```

Run it with `docker build . -t multi_stage && docker run multi_stage`

This time if we look inside of our container (docker run multi_stage ls) we will only find:

`HelloWorld.class`

And the container itself is lighter since only JRE needed to be packed.

---

*In case it wasn't clear, CMD part of Dockerfile specifies the default command and when 
we enter `ls` after `docker run IMAGE_NAME` we are replacing the default command with 
our `ls` command - that is why we get list of all files in the current (`WORKDIR`) directory 
of the container.*
