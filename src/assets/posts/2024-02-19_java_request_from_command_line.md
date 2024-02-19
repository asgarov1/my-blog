# Java Request from command line

---

## Background

Every now and again I encounter the situation where my java app correctly sends a request locally but fails on the server, 
and it isn't always possible to understand from logs what the issue is.

In this kind of situation I like to quickly check whether the problem is in SSL Certificates that Java doesn't recognize,
or something similar and for that I like to quickly call the endpoint in small Java program. (It has to be Java
because it could work in curl but like said before a certificate issue can only be replicated in Java).

Since Java 11 we can use a single Java file as a "script" of sorts, provided we do NOT specify a package name. 
In this case we don't need a `javac` step, and can simply execute the file with `java` (e.g. `java MyClass.java`).

So I create the following file and simply adjust the URL:

```java
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class JavaRequest {
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(10))
            .proxy(ProxySelector.of(new InetSocketAddress("10.11.12.13", 8080)))  // IF you have a proxy
            .build();

    public static String get(String url) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .uri(URI.create(url))
                .setHeader("Authorization", "Basic eW91ckV4dHJlbWVseVNlY3JldFRva2VuSW5CYXNlNjQ=")
                .build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        String url = "https://www.example.com/api/v1/resource";
        System.out.println(get(url));
    }
}
```

That is all there is to it, I simply call this file with `java JavaRequest`
