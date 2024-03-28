# Refresh Token Functionality with Angular Interceptor

---

## Background
<br/>
By now JWT `access` and `refresh` tokens are a standard feature in web application and therefore this 
has become a common problem that needs to be solved - but for certain use cases a simple solution is not enough, 
hence this blogpost

Let's start with simple use case and expand on it as we encounter our error. So a straightforward solution
would be to implement an interceptor to intercept `401` response, in which case we get a new `access` token
via the refresh call, and then retry the original call:

```typescript
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    public readonly TOKEN_API_URL = 'api/v1/token';

    constructor(private http: HttpClient) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({withCredentials: true});
        return next.handle(request).pipe(
            catchError(err => {
                if (err?.status === 401) {
                    return this.refreshToken(request, next);
                }
                return throwError(() => err);
            })
        );
    }

    private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('grant_type', 'refresh_token');
        return this.http.post<any>(this.TOKEN_API_URL, formData)
            .pipe(
                switchMap(() => next.handle(request))
            );
    }
}
```

And this solution will work quite good as long as you don't have too many request starting at the same time.

This solution, however, has a flaw. Let's imagine a scenario where after some time your `access` token expired.
That mean that the next call will trigger the refresh interceptor - BUT what if you trigger an action that creates
multiple calls in parallel? That will result in multiple refresh calls, all made with the same `refresh` token
sent at the same time to the Authorization Server. The only problem? Almost any authorization server invalidates 
`refresh` token after use, meaning that the first of the many parallel calls will succeed and the rest
will fail, and the application will crash:

<br/>
<img src="assets/images/parallel_token_requests.png" width="60%" />
<br/>
<br/>

As you can see sending multiple refresh requests simultaneously leads to unpredictable results,
 and is in general something we want to avoid. So a solution that you should already start thinking
in the direction of, is building some kind of queue, where only when there is no `refresh` call is
already in progress a first `refresh` call gets created and the rest of the parallel calls should
wait (subscribe) until the original refresh token is completed, and then continue with their original call.

This can be easily achieved with a `BehaviorSubject`:

```typescript
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  public readonly TOKEN_API_URL = 'api/v1/token';
  private readonly refreshInProgress$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({withCredentials: true});
    return next.handle(request).pipe(
      catchError(err => {
        if (err?.status === 401) {
          return this.refreshToken(request, next);
        }
        return throwError(() => err);
      })
    );
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (this.refreshInProgress$.getValue()) {
      return this.refreshInProgress$.pipe(
        filter(value => value === false), // wait until refresh is finished
        take(1),
        switchMap(() => next.handle(request))
      );
    }

    const formData: FormData = new FormData();
    formData.append('grant_type', 'refresh_token');
    return this.http.post<any>(this.TOKEN_API_URL, formData)
      .pipe(
        switchMap(() => next.handle(request)),
        finalize(() => this.refreshInProgress$.next(false))
      );
  }
}
```

now we check if there is a `refreshInProgress`, and if so, we wait for it to stop, before continuing with the original request

```typescript
filter(value => value === false)
```

Otherwise, if there is no `refresh` in progress we send the `refresh` request. Now everything works as expected:

<br/>
<img src="assets/images/parallel_token_requests_2.png" width="60%" />
<br/>
<br/>
