# Apache Wicket 101

---

### Intro

Apache Wicket is there to provide a server generated web app solution, and it is primary difference to
other solutions like JSP or JSF is that it basically keeps htmls absolutely logic free (only markup)
and aims to keep ALL the logic inside of Java.

So if JSP might have looked like this:

```html
<table>
  <tr>
    <c:forEach var="item" items="${sessionScope.list}">
      <td>
        <c:out value="item.name"/>
      </td>
    </c:forEach>
  </tr>
</table>
```

the Apache Wicket looks like this (literally no logic except marking tags with ids):

```html

<table>
    <tr>
        <td wicket:id="list">
            <span wicket:id="name"/>
        </td>
    </tr>
</table>
```

*Examples taken from Wicket in Action book*

---

## Project 1 - Hello World with Wicket

###### TLDR: check out the project on [GitHub](https://github.com/asgarov1/wicket-demo/tree/helloWorld)

So lets start by creating a maven project, we will use the war packaging and deploy it with tomcat, cause
feeling nostalgic :)

our `pom.xml` will look fairly minimalistic:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.asgarov</groupId>
  <artifactId>wicket-demo</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>

  <properties>
    <maven.compiler.source>11</maven.compiler.source>
    <maven.compiler.target>11</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.apache.wicket</groupId>
      <artifactId>wicket-core</artifactId>
      <version>9.14.0</version>
    </dependency>
  </dependencies>

  <build>
    <resources>
      <resource>
        <directory>src/main/webapp/pages</directory>
      </resource>
    </resources>
  </build>
</project>
```

As you can see we literally have only one dependency for wicket, and we specified `src/main/webapp/pages`
directory as the directory where wicket can find our `html` files.

---
The structure of the project should look like this:

```
.
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com
        │       └── asgarov
        │           └── wicket
        │               └── demo
        │                   ├── HelloWorldApplication.java
        │                   └── HelloWorld.java
        └── webapp
            ├── pages
            │   └── com
            │       └── asgarov
            │           └── wicket
            │               └── demo
            │                   └── HelloWorld.html
            └── WEB-INF
                └── web.xml
```

The `web.xml` content is fairly minimal as well:

```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://www.oracle.com/webfolder/technetwork/jsc/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0">

    <display-name>WicketDemo</display-name>

    <filter>
        <filter-name>wicket.demo</filter-name>
        <filter-class>org.apache.wicket.protocol.http.WicketFilter</filter-class>
        <init-param>
            <param-name>applicationClassName</param-name>
            <param-value>com.asgarov.wicket.demo.HelloWorldApplication</param-value>
        </init-param>
    </filter>

    <filter-mapping>
        <filter-name>wicket.demo</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
```

This is relatively standard/minimal definition of `web.xml` and a filter for our webapp

---

Last but not least we just need to define the Java classes:

- `HelloWorldApplication`
```java
package com.asgarov.wicket.demo;

import org.apache.wicket.Page;
import org.apache.wicket.protocol.http.WebApplication;

public class HelloWorldApplication extends WebApplication {
    @Override
    public Class<? extends Page> getHomePage() {
        return HelloWorld.class;
    }
}
```

- `HelloWorld`
```java
public class HelloWorld extends WebPage {
  public HelloWorld() {
    add(new Label("hello", String.format("Hello World from J | %s | %s", getCurrentDate(), getCurrentTime())));
  }

  private static String getCurrentDate() {
    return LocalDate.now().format(new DateTimeFormatterBuilder().appendPattern("MM/dd").toFormatter());
  }

  private static String getCurrentTime() {
    return LocalTime.now().format(new DateTimeFormatterBuilder().appendPattern("HH:mm:ss").toFormatter());
  }
}
```

- And the corresponding `html` file - `HelloWorld.html`:
```html
<html xmlns:wicket="http://www.w3.org/1999/xhtml">
  <body>
    <span wicket:id="hello">this text will get replaced</span>
  </body>
</html>
```

---

### Setting up local deployments
- [Download Tomcat](https://tomcat.apache.org/download-90.cgi) and extract it to the folder of your choosing
- In Intellij go to `Edit Configurations`
- Press the `+` button and select `Tomcat Server` -> `Local`
- For the `Application Server` configure the folder where you extracted Tomcat to
- For the before launch add a maven goal `clean package` AND `Build wicket-demo:war artifact`
- At the deployment tab add for `Deploy at the Server Startup`: `wicket-demo:war`

<img src="assets/images/wicket/tomcat1.png" width="40%">
<img src="assets/images/wicket/tomcat2.png" width="40%">
<br/>
<br/>

That is all, you can start the tomcat with the build war from Intellij.

---

## Project 2 - Stateful Counter Page

###### TLDR checkout project [on GitHub](https://github.com/asgarov1/wicket-demo/tree/linkCounter)

First we need to define our Application and WebPage classes, just like in the last example:

- `LinkCounterApplication` class
```java
public class LinkCounterApplication extends WebApplication {
    @Override
    public Class<? extends Page> getHomePage() {
        return MyCounter.class;
    }
}
```

- `MyCounter` class
```java
public class MyCounter extends WebPage {

  int counter = 0;

  public MyCounter() {
    add(new Link<Void>("counter-link") {
      @Override
      public void onClick() {
        counter++;
      }
    });
    add(new Label("counter-label", () -> counter));
  }
} 
```

- The corresponding `MyCounter.html` page
```html
<html xmlns:wicket="http://www.w3.org/1999/xhtml">
<body>
<a href="/counter" wicket:id="counter-link">Click</a>
<br/>
Was clicked <span wicket:id="counter-label"></span> times
</body>
</html> 
```

- And last but not least the `web.xml`
```xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://www.oracle.com/webfolder/technetwork/jsc/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0">

    <display-name>WicketDemo</display-name>

    <filter>
        <filter-name>wicket.demo.counter</filter-name>
        <filter-class>org.apache.wicket.protocol.http.WicketFilter</filter-class>
        <init-param>
            <param-name>applicationClassName</param-name>
            <param-value>com.asgarov.wicket.demo.counter.LinkCounterApplication</param-value>
        </init-param>
    </filter>


    <filter-mapping>
        <filter-name>wicket.demo.counter</filter-name>
        <url-pattern>/counter/*</url-pattern>
    </filter-mapping>
</web-app>
```

Now that you open the page, you will that clicking the link increments the counter. All of the behavior is defined in
`MyCounter` class, where `onClick` method defines the behavior of the link click and `counter` variable is passed to the Model
as a `IModel` implementation, with the following lambda `() -> counter` 
