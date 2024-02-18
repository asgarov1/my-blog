# Spring Security CORS and CSRF Configuration with Stateless JWT Application

---

## CORS Background Info

CORS (Cross-Origin Resource Sharing) is a security measure (enforced by browsers) that allow (or block) requesting
resources from a different domain (different from the current domain you see in the browser URL).

It is important to note, that different means different in either:
- scheme (http or https)
- hostname (www.example.com)
- port (443)

That means `example.com` and `api.example.com` are two different domains and will therefore require CORS setting.

### Why do we need CORS?
Without this protection mechanism, any website you visit for example, could run some javascript that would 
request you data from some website you are logged in (for example facebook), and since there is no "origin check"
facebook would only rely on the fact that your browser is logged in, which it is and return all the data to the 
javascript on the malicious website you happen to visit.

Thanks to CORS, your browser will block the request, and will only let it through for javascript from domains that 
the server returning the data (in this case facebook server) allows. These allowed domains are communicated in the 
response header `Access-Control-Allow-Origin`.

### Spring Security Configuration - CORS 
- We need to define a `CorsConfiguratinoSource`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of(allowedOrigin));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

- and then use it in `HttpSecurity` to set up CORS:
```java
 @Bean
public SecurityFilterChain apiFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
  return http
    .cors(c -> c.configurationSource(corsConfigurationSource))
    // ... other settings
    .build();
} 
```

Now we can easily sent a request from the frontend:
```typescript
  getResource(): Observable<string> {
      return this.httpClient.get('http://localhost:8080/api/v1/resource');
  }
```

---

## CSRF Background Info

Cross-Site Request Forgery is a different kind of attack, where the malicious actor relies on the fact that 
some website you are authenticated in, authenticates based on cookies. It also explores the loophole in CORS that
due to web compatibility reasons (post forms existed before CORS, and disallowing them would break too much of existing web), 
CORS doesn't block form submissions and only blocks "dynamic" requests (e.g. AJAX, fetch, etc).

Since cookies are included by the browser
on every request automatically, a website could include a html from like the following:

```html
<form id="bad-form"
  action="http://www.banking.com/account/update"
  method="post">
  <input type="hidden" name="email" value="bad_actor@example.com">
</form>

<script>
  document.getElementById("bad-form").submit()
</script>
```

This html would be invisible to you but will automatically send a POST request as soon as anyone navigates to it, 
and as a result load it in their browser, and the browser will naturally include all the cookies it has
for `http://www.banking.com`, resulting in the POST request taking place.

### Solution and Explanation

In order to mitigate this vulnerability, Spring Security by default enables CSRF, where every "not CSRF allowed"
http method (in Spring Security 6 it is any method except `GET`, `HEAD`, `TRACE`, `OPTIONS` <sup class="foot-note">1</sup>) 
has to include both
- `CSRF-TOKEN` cookie
- `X-CSRF-TOKEN` header

Both cookie value and header value has to match. It is because these both match, that the Spring Security knows
that the request was made on our website (and not some other malicious website's invisible html). The logic here is
that with the first allowed http method (e.g. `GET`), the Backend sets the `CSRF-TOKEN` cookie with the response.
Afterward it is expected that the JavaScript on **our** website, will grab the value of the cookie and include the
value with `X-CSRF-TOKEN` header. 

Since the `CSRF-TOKEN` cookie will be limited to our domain, we know that the other website won't be able to access it 
and therefore will NOT be able to include it as header (since it can't possibly know or guess the randomly generated CSRF token value).
Thus, backend knows it can trust it. If the values don't match OR `X-CSRF-TOKEN` is missing, Spring Security
will return `403`.

As opposed to CORS, this security mechanism is enforced by the Backend. Another important detail is that Spring Security
will trigger `SessionAuthenticationStrategy::onAuthentication` which will replace the CSRF Token and erase it from the
browser. This is an `OWASP` recommendation, to prevent session fixation attack, where an attacker 
- injects a CSRF token into victim's browser
- wait for the victim to login
- use another Form POST to get the victim to perform an action with still UNchanged CSRF token.
Because of this reason, CSRF token should always be changed on principal change.

### Spring Security Configuration

Our solution targets stateless applications (like the ones that use JWT for authentication).

1. First we define our own filter, that renders the CsrfToken to response:

```java
public class CsrfCookieFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
        // Render the token value to a cookie by causing the deferred token to be loaded
        csrfToken.getToken();
        filterChain.doFilter(request, response);
    }
}
```

2. Then we define our custom `CsrfTokenRequestAttributeHandler` implementation:

```java
public class SpaCsrfTokenRequestHandler extends CsrfTokenRequestAttributeHandler {
    private final CsrfTokenRequestHandler delegate = new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       Supplier<CsrfToken> csrfToken) {
        /*
         * Always use XorCsrfTokenRequestAttributeHandler to provide BREACH protection of
         * the CsrfToken when it is rendered in the response body.
         */
        this.delegate.handle(request, response, csrfToken);
    }

    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
        /*
         * If the request contains a request header, use CsrfTokenRequestAttributeHandler
         * to resolve the CsrfToken. This applies when a single-page application includes
         * the header value automatically, which was obtained via a cookie containing the
         * raw CsrfToken.
         */
        if (StringUtils.hasText(request.getHeader(csrfToken.getHeaderName()))) {
            return super.resolveCsrfTokenValue(request, csrfToken);
        }
        /*
         * In all other cases (e.g. if the request contains a request parameter), use
         * XorCsrfTokenRequestAttributeHandler to resolve the CsrfToken. This applies
         * when a server-side rendered form includes the _csrf request parameter as a
         * hidden input.
         */
        return this.delegate.resolveCsrfTokenValue(request, csrfToken);
    }
}
```

3. Now we can define our configuration:

```java
@Bean
public SecurityFilterChain apiFilterChain(HttpSecurity http,
                                          CookieCsrfTokenRepository cookieCsrfTokenRepository,
                                          CorsConfigurationSource corsConfigurationSource
) throws Exception {
     return http
       .cors(c -> c.configurationSource(corsConfigurationSource))
       .csrf(csrf -> csrf.csrfTokenRepository(cookieCsrfTokenRepository)
         .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
         .sessionAuthenticationStrategy(new NullAuthenticatedSessionStrategy())) // Setting no-op AuthenticatedSessionStrategy
       .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
       .addFilterAfter(new CsrfCookieFilter(), BasicAuthenticationFilter.class)
       .authorizeHttpRequests(
         customizer -> customizer
           .requestMatchers("/auth/**").permitAll()
           .anyRequest().authenticated()
       )
       .build();
}
```

The reason we are setting `NullAuthenticatedSessionStrategy` as a sessionAuthenticationStrategy, is because
the default `SessionAuthenticationStrategy` gets triggered on every authentication, which, in case of a session-less
application, happens every request. 

This would have worked just fine for an application WITH a session, but for our application, this results in CSRF token
getting lost on EVERY request, which is quite annoying for the client, if EVERY `POST` request has to be preceded by 
a `GET` request, to get a new token. It only makes sense to revoke the CSRF token on an actual login.

Therefore, we provide `NullAuthenticatedSessionStrategy` which does NOT do anything, and thus does NOT revoke tokens,
and we revoke the tokens manually in the controller method responsible for the initial login.

For that we define our own `CsrfAuthenticationStrategy`:

```java
@Bean
public CookieCsrfTokenRepository cookieCsrfTokenRepository() {
    CookieCsrfTokenRepository cookieCsrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
    cookieCsrfTokenRepository.setCookiePath("/");
    return cookieCsrfTokenRepository;
}
```

and then we autowire it in the service that conducts the initial authentication (login), and call it right after:
```java
public ResponseDto authenticate(AuthenticationRequestDto requestDto, HttpServletRequest request, HttpServletResponse response) {
  Authentication authentication = authenticationManager.authenticate(
    new UsernamePasswordAuthenticationToken(requestDto.username(), requestDto.password())
  );

  // we trigger onAuthentication() manually (and NOT in SessionManagementFilter), to revoke the previous CSRF on login
  csrfAuthenticationStrategy.onAuthentication(authentication, request, response);
  
  // rest of the method...
}
```

That is all there is to it, now when we make any allowed frontend call (e.g. `GET`), we will get the `CSRF-TOKEN`
cookie, and then it is the responsibility of our frontend to include a `X-CSRF-TOKEN` with every request. For that,
in Angular, it is easiest to implement an interceptor:

```typescript
@Injectable()
export class CsrfTokenInterceptor implements HttpInterceptor {
  /**
   * HTTP Methods allowed in Backend {@link CsrfFilter.DefaultRequiresCsrfMatcher#allowedMethods}
   */
  private readonly CSRF_ALLOWED_METHODS = ["GET", "HEAD", "TRACE", "OPTIONS"]

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const xsrfTokenFromCookie = this.getCookie('XSRF-TOKEN');
    // IF not a CSRF Allowed method (e.g. POST, PUT or DELETE), and XSRF-TOKEN is present
    if (!this.CSRF_ALLOWED_METHODS.includes(req.method) && xsrfTokenFromCookie) {
      // Clone the request and add X-XSRF-TOKEN header
      const modifiedReq = req.clone({
        headers: req.headers.set('X-XSRF-TOKEN', xsrfTokenFromCookie)
      });
      // Pass the modified request to the next handler
      return next.handle(modifiedReq);
    }
    // If it's a GET request, pass the original request
    return next.handle(req);
  }

  getCookie(name: string): string | undefined {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return undefined;
  }
}
```

and of course don't forget to add it to providers in your module:

```typescript
...
   providers: [
    {provide: HTTP_INTERCEPTORS, useClass: CsrfTokenInterceptor, multi:true}
   ],
...
```

---

<p id="foot-note-1"></p>

1. The allowed http methods are defined in a private inner class `CsrfFilter.DefaultRequiresCsrfMatcher`, 
attribute `allowedMethods`:
`private final HashSet<String> allowedMethods = new HashSet<>(Arrays.asList("GET", "HEAD", "TRACE", "OPTIONS"));`

