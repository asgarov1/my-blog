# Logging Filter that reads and passes request further

---

This solves `Required request body is missing after reading request` in Filter.

So I had an issue where I wanted to log every request in debug mode. 
Here is how to solve this:

## 1. Create a logging filter

```
@Slf4j
@Component
public class LoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        var cachedRequest = new CachedBodyHttpServletRequest(request);
        log.info("PROCESSING REQUEST: " + request.getMethod() + " " + request.getRequestURI()
                + getParameters(request));
        filterChain.doFilter(cachedRequest, response);
    }

    @SneakyThrows
    private String getParameters(HttpServletRequest request) {
        String body = new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        return body.isEmpty() ? "" : ", with following body: " + body;
    }
}
```

So far everything is simple. Spring allows us to extend `OncePerRequestFilter`, which is 
a handy implementation from Spring that is guaranteed to be called only once for each 
request. Due to the issue that inputStream can only be read one we wrap it into 
`CachedBodyHttpServletRequest` which we will be implementing next. As you will see, 
`CachedBodyHttpServletRequest` will save the inputStream into a byte array which will 
allow us to keep reading it.

## 2. Create cacheable implementation of HttpServletRequestWrapper

```
public class CachedBodyHttpServletRequest extends HttpServletRequestWrapper {

    private final byte[] cachedBody;

    public CachedBodyHttpServletRequest(HttpServletRequest request) throws IOException {
        super(request);
        this.cachedBody = StreamUtils.copyToByteArray(request.getInputStream());
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        return new CachedBodyServletInputStream(this.cachedBody);
    }

    @Override
    public BufferedReader getReader() throws IOException {
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(this.cachedBody);
        return new BufferedReader(new InputStreamReader(byteArrayInputStream));
    }
}
```

Relatively straight forward class that saves the inputStream into the byte array and 
lets you `getInputStream` by returning a `ServletInputStream` implementation of our 
`CachedBodyServletInputStream`.

## 3. Create ServletInputStream implementation
```
public class CachedBodyServletInputStream extends ServletInputStream {
    private final InputStream cachedBodyInputStream;

    public CachedBodyServletInputStream(byte[] cachedBody) {
        this.cachedBodyInputStream = new ByteArrayInputStream(cachedBody);
    }

    @Override
    public int read() throws IOException {
        return cachedBodyInputStream.read();
    }

    @SneakyThrows
    @Override
    public boolean isFinished() {
        return cachedBodyInputStream.available() == 0;
    }

    @Override
    public boolean isReady() {
        return true;
    }

    @Override
    public void setReadListener(ReadListener readListener) {
        throw new RuntimeException("Breaks Liskov`s substitution principle :(");
    }
}
```

This class is also relatively easy to follow. It overrides all the necessary methods 
but also has to override setReadListener for which we have no use in our simple example. 
While I followed the shortcut of throwing a runtime exception I should warn you that 
this is a bad style as it breaks [Liskov`s Substituion Principle](https://www.baeldung.com/java-liskov-substitution-principle) 
because this specific implementation is no longer substitutable with the base type 
(it breaks the contract).

[Link to GitHub](https://github.com/asgarov1/loggingFilterExample)

### Useful resources

Read inputStream multiple times: https://www.baeldung.com/spring-reading-httpservletrequest-multiple-times

This article achieved similar effect with @ControllerAdvice https://frandorado.github.io/spring/2018/11/15/log-request-response-with-body-spring.html. 
I haven`t tested this solution.
