# Java file as bash script

---

Starting from Java 11 we can now use Java as a bash script!

It is as easy as adding java specific shebang on top of the java file:

`#!/path_to_java_folder/bin/java --source 11`
To find out path to your java open gitbash and type which java

On my computer it outputs:
```
$ which java
/d/users/my_username/DevTools/zulu11.50.19-ca-jdk11.0.12-win_x64/bin/java
```

So I use that to create an executable Java file called HelloWorld 
(important - it should not have .java extension, other extensions are fine but standard is to 
leave it without extension)

```java
#!/d/users/my_username/DevTools/zulu11.50.19-ca-jdk11.0.12-win_x64/bin/java --source 11

public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello world!");
  }
}
```

And now you can execute it as simply as typing the filename in gitbash:
```
$ ./HelloWorld
Hello World!
```

_In Linux, you would have to make the file executable first, by executing chmod +x HelloWorld_
