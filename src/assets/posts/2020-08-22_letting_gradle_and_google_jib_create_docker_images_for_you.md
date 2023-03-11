# Letting gradle and Google Jib create docker images for you

---

This is just too comfortable for me to not write this down :)

Add the Google Jib plugin to your list of plugins:

```
plugins { 
    ...
    id 'com.google.cloud.tools.jib' version '2.5.0'
}
```

Run `./gradlew jibDockerBuild --image=nameOfYourImage:latest`

---

Alternatively you can let gradle and SpringBoot take care of it via adding this to you gradle.build file:

```
bootBuildImage {
imageName = "arcticgreetings/${project.name}:${project.version}"
environment = ["BP_JVM_VERSION" : "11.*"]
}
```

And then run `./gradlew bootBuildImage`

*This option requires running docker privileges and might get blocked by your firewall or SELinux*
