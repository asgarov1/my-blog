# Everything about Java Modules

---

## Why do we need modules?

What are Java modules and why do we care? So first off you absolutely do not have to 
know or care about modules to program with Java 11 or 17, you can just happily ignore 
them and keep coding normally with maven. So what is the benefit of using Java Modules then?

Let's say you are writing a very simple library with 2 classes in 2 different packages:

- foo.bar.service.WeatherService
- foo.bar.internal.InternalWeatherService

Naturally as a library developer you know how much pain in the ass it can be to fix bugs 
or make changes within your library without affecting existing clients of your library. 
Therefore, naturally you don't want anyone to access and therefore rely on methods inside 
InternalWeatherService which is meant only for internal calls within your library and 
therefore subject to change, and you want other people to only be able to use the defined 
API in WeatherService.

But without modules there is absolutely no way for you to enforce that. All public classes 
and their public methods are available for everyone. You could of course try to use as much 
package-protected and protected visibility as possible but that is limiting. This is where 
modules help. By simple adding module-info.java and specifying which package should be 
visible to the outside you can enforce which classes can be called from outside:

```java
// module-info.java
module foo.bar.xyz {
    exports foo.bar.service;
}
```

Another good reason is being able to use jlink to create custom (minified) JRE with 
optional launchers for your specific program - we will get to this at the end of the post

## Rules for module-info.java

1. `module-info.java` must be placed in default package (for typical maven structure that means `src/main/java/module-info.java`
2. it must use the keyword module (and not class, interface or whatever)
3. module name follows same rules as class naming and allows additionally dots or dashes:
   1. so you can use small or capital letters
   2. numbers and dollar sign (but not for the first letter)
   3. dots and dashes

## Compiling and running modular projects

The project used in the following examples can be found in https://github.com/asgarov1/modules-demo.

As you may have noticed, `module-info.java` is also a java file. 
That means that like every other file it should be specified to be compiled and that 
will result in `module-info.class`.

Given the following project structure:
<img src="assets/images/jpms/jpms_1.png">

And being located in project root directory, we can use the following command to 
compile our project files and `module-info.java`

`javac -d mods/com.asgarov.greeting com.asgarov.greeting/src/main/java/com/asgarov/greeting/*.java com.asgarov.greeting/src/main/java/com/asgarov/greeting/internal/*.java com.asgarov.greeting/src/main/java/module-info.java`

This will result in compiling all of our files and as you probably guessed `-d` specified 
the output directory and in this case places compiled classes in target folder:
<img src="assets/images/jpms/jpms_2.png">

Now let's create a dependent module that will depend on the GreetingService:
<img src="assets/images/jpms/jpms_3.png">

But once we try to call our GreetingService from module `com.asgarov.greeting` we are 
going to get compile errors, saying that we need to add requires:
<img src="assets/images/jpms/jpms_4.png">

So provided the `com.asgarov.greeting` exports `com.asgarov.greeting`:
<img src="assets/images/jpms/jpms_5.png">

we solve this by doing what Intellij suggests and adding requires:
<img src="assets/images/jpms/jpms_6.png">

We will not however be able to call the internal GreetingGenerator because it is in a different package that is not being exported:
<img src="assets/images/jpms/jpms_7.png">

Now we can compile and run our second project `com.asgarov.demo` that is dependent on 
`com.asgarov.greeting` like so:

`javac -p mods -d mods/com.asgarov.demo com.asgarov.demo/src/main/java/com/asgarov/demo/*.java com.asgarov.demo/src/main/java/*.java`

And when we run it specifying the module it relies on in module path (with `-p`), we get:
<img src="assets/images/jpms/jpms_8.png">

You might be wondering why do all of this via commandline when maven could do it for us. 
That is a fair question, I like to study how things work with manual steps before I let 
automation take over in order to maximize understanding - but you should feel free to 
ignore that and just let maven do the heavy lifting. The demo files are available https://github.com/asgarov1/modules-demo.

## Packaging Modules as jars

There is no special logic to packaging, except that you provide module-path 
for dependencies with `-p`:

```bash
// Compile first project: 
javac com.asgarov.greeting/src/main/java/com/asgarov/greeting/*.java com.asgarov.greeting/src/main/java/com/asgarov/greeting/internal/*.java com.asgarov.greeting/src/main/java/module-info.java

// Package first project: 
jar -cvf jar-mods/com.asgarov.greeting.jar -C ./com.asgarov.greeting/src/main/java .


// Compile second project (depends on first project): 
javac -p jar-mods com.asgarov.demo/src/main/java/com/asgarov/demo/*.java com.asgarov.demo/src/main/java/*.java

// Package second project: 
jar -cvf jar-mods/com.asgarov.greeting.jar -C ./com.asgarov.greeting/src/main/java .
```

Afterwards we have the following jars as modules:
<img src="assets/images/jpms/jpms_9.png">

And now we can run our application from module:
<img src="assets/images/jpms/jpms_10.png">

To recap `-p` is short for `--module-path` which allows us to specify dependency modules, 
same way class path would be used to specify dependencies for class path. `-m` allows us 
to specify which module to run where we specify both module name ("com.asgarov.demo") and 
fully qualified main class ("com.asgarov.demo.App")

## Service Loader / Provider on module path

Java had a way to dynamically lookup ServiceLoader since Java 6 with the help of 
`ServiceLoader`. In our application we can create one more module that defines an 
interface that we will load:
<img src="assets/images/jpms/jpms_11.png">

We also add the look-up to our App class:
<img src="assets/images/jpms/jpms_12.png">

now to compile `com.asgarov.demo` we need to add requires `com.asgarov.tours.api` and for 
the look-up we need uses `com.asgarov.tours.api.Tour`.
<img src="assets/images/jpms/jpms_13.png">

Without `uses` you would get `ServiceConfigurationError`:

```java
Exception in thread "main" java.util.ServiceConfigurationError: com.asgarov.tours.api.Tour: module com.asgarov.demo does not declare `uses`
        at java.base/java.util.ServiceLoader.fail(ServiceLoader.java:589)
        at java.base/java.util.ServiceLoader.checkCaller(ServiceLoader.java:575)
        at java.base/java.util.ServiceLoader.<init>(ServiceLoader.java:504)
        at java.base/java.util.ServiceLoader.load(ServiceLoader.java:1692)
        at com.asgarov.demo/com.asgarov.demo.App.findAllTours(App.java:20)
        at com.asgarov.demo/com.asgarov.demo.App.main(App.java:16)
```

If we run it now, we will get 0 Tour implementations found:
<img src="assets/images/jpms/jpms_14.png">

So now we need to provide an implementation. For that we crease a provider:
<img src="assets/images/jpms/jpms_15.png">

And important line is to specify that this module provides the implementation:
<img src="assets/images/jpms/jpms_16.png">

Once we package it we can just rerun the com.asgarov.demo.App and we will get a different result even though we didn't have to recompile com.asgarov.demo:
<img src="assets/images/jpms/jpms_17.png">

---
## Useful CLI commands for modules
### a) Describing a module
When we look at the module-info.java we see what is inside of it
<img src="assets/images/jpms/jpms_18.png">

To describe a module that is already packaged you can use `-d` (short for `--describe-module`):
<img src="assets/images/jpms/jpms_19.png">

The reason that the description is a bit different from the way we defined module-info.java is that java.base is always implicitly required and contains specifies packages that are in the module but are not exported.

Another way to describe a module is with jar command (-f is short for --file and specifies file target):
<img src="assets/images/jpms/jpms_20.png">

Only main difference is that with JAR command module-info.class is specified in the file path in the first line, not that it makes any difference

### b) Listing modules
To list modules you use `--list-modules`:

```
C:\Users\extre\OneDrive\Documents\Projects\personal\modules-demo>java -p mods --list-modules                     
java.base@11.0.12
java.compiler@11.0.12
java.datatransfer@11.0.12
...
com.asgarov.demo file:///C:/Users/extre/OneDrive/Documents/Projects/personal/modules-demo/mods/com.asgarov.demo.jar
com.asgarov.greeting file:///C:/Users/extre/OneDrive/Documents/Projects/personal/modules-demo/mods/com.asgarov.greeting.jar
com.asgarov.tours.api file:///C:/Users/extre/OneDrive/Documents/Projects/personal/modules-demo/mods/com.asgarov.tours.api.jar
com.asgarov.tours.provider file:///C:/Users/extre/OneDrive/Documents/Projects/personal/modules-demo/mods/com.asgarov.tours.provider.jar
```

### c) Showing module resolution

You can add `--show-module-resolution` to your run command to see output of how modules 
are resolved:

```
C:\Users\extre\OneDrive\Documents\Projects\personal\modules-demo>java --show-module-resolution -p mods -m com.asgarov.demo/com.asgarov.demo.App
root com.asgarov.demo file:///C:/Users/extre/OneDrive/Documents/Projects/personal/modules-demo/mods/com.asgarov.demo.jar
com.asgarov.demo requires com.asgarov.greeting file:///C:/Users/extre/OneDrive/Documents/Projects/personal/modules-demo/mods/com.asgarov.greeting.jar
com.asgarov.demo requires com.asgarov.tours.api file:///C:/Users/extre/OneDrive/Documents/Projects/personal/modules-demo/mods/com.asgarov.tours.api.jar
java.base binds jdk.zipfs jrt:/jdk.zipfs
...
java.base binds jdk.charsets jrt:/jdk.charsets
com.asgarov.demo binds com.asgarov.tours.provider file:///C:/Users/extre/OneDrive/Documents/Projects/personal/modules-demo/mods/com.asgarov.tours.provider.jar
com.asgarov.tours.provider requires com.asgarov.tours.api file:///C:/Users/extre/OneDrive/Documents/Projects/personal/modules-demo/mods/com.asgarov.tours.api.jar
jdk.security.auth requires java.naming jrt:/java.naming
...
Hello there...
Found tours: 1
```

### d) Analyzing dependencies with jdeps
<img src="assets/images/jpms/jpms_21.png">

jdeps can be very useful to understand which dependencies does your module have. 
Specifically if you are trying to look for internal calls to jdk that are deprecated or 
no longer allowed you can use it with `--jdk-internals` parameter

---

## JLink to create custom app
Perhaps the coolest thing about the modular applications is that it allows you to use 
`jlink` to create custom (minified) JREs and even add a launcher to it. So for our 
application it is as simple as running:

`jlink --launcher mylauncher=com.asgarov.demo/com.asgarov.demo.App -p mods --add-modules com.asgarov.demo --output myApp`

And this will create the custom jre with the launcher in `myApp/bin/mylauncher.bat`. 
And it runs perfectly from the commandline:
<img src="assets/images/jpms/jpms_22.png">

---

## Command Line Glossary
- `--module-path`	    `-p`	    allows to specify module path, e.g. java -p mods ...
- `--module`	        `-m`	    when we run a modular application we specify the module with 
`--module` command, e.g. `java -p mods -m com.asgarov.demo/com.asgarov.demo.App`
- `--describe-module`	`-d`	    prints the contents of module-info.java
- `--list-modules`		          lists all the modules used
- `--show-module-resolution`		parameter used with java command to show resolution
of modules when they are being ran
