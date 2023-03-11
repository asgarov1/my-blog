# Rest Calls with Vanilla Java 11 and 8

For a couple of scripts I needed to implement REST calls in Java only. The Authorization header is for the sake of example on how to set headers, 
if your endpoint is not protected you don't need that.

## in Java 11 it is easy

```
package com.asgarov.demo;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class JavaElevenHttpClient {

    private static final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public static String get(String url, String token) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .GET()
                .uri(URI.create(url))
                .setHeader(&quot;Authorization&quot;, &quot;Bearer &quot; + token)
                .build();
        HttpResponse&lt;String&gt; response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }

    public static int postComment(String body, String url, String token) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .uri(URI.create(url))
                .setHeader(&quot;Authorization&quot;, &quot;Bearer &quot; + token)
                .build();
        HttpResponse&lt;String&gt; response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        return response.statusCode();
    }
}
```

## Java 8 solution

With Java 8 you have to deal with SSL certificates issue 
- either install the certificate as described 
<a href="https://stackoverflow.com/questions/9619030/resolving-javax-net-ssl-sslhandshakeexception-sun-security-validator-validatore" target="_blank" rel="noreferrer noopener">
here
</a> 
- or on a trusted network you could just turn the certificate validation off, like I did in this demo:

```
package com.asgarov.demo;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;

import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.stream.Collectors.joining;

public class JavaEightConnectionUtil {

    static {
        try {
            turnCertificateValidationOff();
        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            e.printStackTrace();
        }
    }

    public static String get(String path, String gitlabToken) throws IOException {
        HttpURLConnection con = createConnection(&quot;GET&quot;, path, gitlabToken);
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(con.getInputStream(), UTF_8))) {
            String response = reader.lines().collect(joining(&quot;&quot;));
            return response;
        }
    }

    public static int postComment(String path, String gitlabToken) throws IOException {
        HttpURLConnection con = createConnection(&quot;POST&quot;, path, gitlabToken);
        return con.getResponseCode();
    }

    private static HttpURLConnection createConnection(String httpMethod, String path, String token) throws IOException {
        URL url = new URL(path);
        HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
        connection.setRequestMethod(httpMethod);
        connection.setRequestProperty(&quot;Authorization&quot;, &quot;Bearer &quot; + token);
        return connection;
    }

    /**
     * Turns SSL Certificate validation off - same thing that curl scripts are doing with `curl --insecure ...`
     */
    private static void turnCertificateValidationOff() throws NoSuchAlgorithmException, KeyManagementException {
        SSLContext sc = SSLContext.getInstance(&quot;SSL&quot;);
        sc.init(null, new TrustManager[]{createTrustManager()}, new SecureRandom());
        HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
    }

    private static TrustManager createTrustManager() {
        return new X509TrustManager() {
            public X509Certificate[] getAcceptedIssuers() {
                return null;
            }

            public void checkClientTrusted(X509Certificate[] certs, String authType) {
            }

            public void checkServerTrusted(X509Certificate[] certs, String authType) {
            }
        };
    }
}
```

### Turning off SSL (should only be done for local development/testing)

you can turn off SSL by defining the following methods in code

```
  private static SSLContext getSSLContext() {
        try {
            SSLContext sslContext = SSLContext.getInstance(&quot;TLS&quot;);
            sslContext.init(null, trustAllCerts(), new SecureRandom());
            return sslContext;
        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            throw new RuntimeException(e);
        }
    }

    private static TrustManager[] trustAllCerts() {
        return new TrustManager[]{
                new X509TrustManager() {
                    public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }

                    public void checkClientTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {
                    }

                    public void checkServerTrusted(
                            java.security.cert.X509Certificate[] certs, String authType) {
                    }
                }
        };
    }
```

and then call it in your HTTP Client definition:

```
private static final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(10))
            .proxy(ProxySelector.of(new InetSocketAddress(&quot;10.11.12.13&quot;, 8080))) //in case you use proxy
            .sslContext(getSSLContext())
            .build();
```
