# Angular Recipes

---

### Inject a value (similar to @Value from Spring)

```typescript
export const BACKEND_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => "http://localhost:8080"
})

@Injectable({
  providedIn: "root"
})
export class PonyService {
  constructor(@Inject(BACKEND_URL) private url: string) {
  }
}
```

### A complex directive that matches a div with class "loggable" and attribute "logText"but without attribute 'notLoggable="true"'

```typescript
@Directive({
  selector: "div.loggable[logText]:not([notLoggable=true])"
})
export class ComplexSelectorDirective {
  constructor() {
    console.log("Very complex directive")
  }
}
Will match first div but not the second one:

<!-- match -->
<div class="loggable" logText="text">Hello</div>

<!-- NO match -->
<div class="loggable" logText="text" notLoggable="true">Hello</div>
```

### Logging Directive

```typescript
import {Directive} from '@angular/core';

@Directive({
  selector: '[logText]',
  inputs: ['text: logText']
})
export class SimpleTextDirective {
  set text(value: string){
    console.log(value);
  }
}
Usage:

<h1 logText="This is a logger">Heading</h1>
```

---

## Testing

### Query component and then instantiate it

```typescript
const ponies = fixture.debugElement.queryAll(By.directive(PonyComponent));
expect(ponies.length).toBe(1);
// we can check if the pony is correctly initialized
const rainbowDash = ponies[0].componentInstance.pony;
expect(rainbowDash.name).toBe('Rainbow Dash');
```

### Overriding component's metadata

```typescript
describe('RaceComponent', () => {
  let fixture: ComponentFixture<RaceComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RaceComponent, PonyComponent]
    });
    TestBed.overrideComponent(RaceComponent, {
      set: {
        template: '<h2>{{ race.name }}</h2>'
      }
    });
    fixture = TestBed.createComponent(RaceComponent);
  });
  
  it('should have a name', () => {
    // given a component instance with a race input initialized
    const raceComponent = fixture.componentInstance;
    raceComponent.race = {name: 'London'};
    // when we trigger the change detection
    fixture.detectChanges();
    // then we should have a name
    const element = fixture.nativeElement;
    expect(element.querySelector('h2').textContent).toBe('London');
  });
});
```

### Testing Http Calls

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
describe('RaceService', () => {
  let raceService: RaceService;
  let http: HttpTestingController;
  
  beforeEach(() =>
  	TestBed.configureTestingModule({
  		imports: [HttpClientTestingModule]
  	})
  );
  
  beforeEach(() => {
  	raceService = TestBed.inject(RaceService);
  	http = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
  	http.verify();
  });
  
  it('should return an Observable of 2 races', () => {
  	// fake response
  	const hardcodedRaces = [{ name: 'London' }, { name: 'Lyon' }];
  	// call the service
  	let actualRaces: Array<RaceModel> = [];
  	raceService.list().subscribe(races => (actualRaces = races));
  	// check that the underlying HTTP request was correct
  
    http.expectOne('/api/races')
  	// return the fake response when we receive a request
  	.flush(hardcodedRaces);
  	// check that the returned array is deserialized as expected
  	expect(actualRaces.length).toBe(2);
  });
});
```

---

## Interceptors

### Intercept Request

```typescript
@Injectable()
export class GithubAPIInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // if it is a Github API request
  if (req.url.includes('api.github.com')) {
  // we need to add an OAUTH token as a header to access the Github API
  const clone = req.clone({ setHeaders: { Authorization: `token ${OAUTH_TOKEN}` }
});
  return next.handle(clone);
  }
  // if it's not a Github API request, we just hand it to the next handler
  return next.handle(req);
  }
}
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: GithubAPIInterceptor, multi: true }
]
```

### Intercept Response

```typescript
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private router: Router, private errorHandler: ErrorHandler) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return next.handle(req).pipe(
  // we catch the error
  catchError((errorResponse: HttpErrorResponse) => {
  // if the status is 401 Unauthorized
  if (errorResponse.status === HttpStatusCode.Unauthorized) {
  // we redirect to login
  this.router.navigateByUrl('/login');
  } else {
  // else we notify the user
  this.errorHandler.handle(errorResponse);
  }
  return throwError(() => errorResponse);
  })
  );
  }
}
```

### Use context in the interceptor
#### 1. Define Context Token
```typescript
export const SHOULD_NOT_HANDLE_ERROR = new HttpContextToken<boolean>(() => false);
```

#### 2. Send request with context
```typescript
const context = new HttpContext().set(SHOULD_NOT_HANDLE_ERROR, true);
return http.get(`${baseUrl}/api/users`, { context });
```
#### 3. Use in the interceptor
```typescript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // if there is a context specifically asking for not handling the error, we don't
handle it
  if (req.context.get(SHOULD_NOT_HANDLE_ERROR)) {
  return next.handle(req);
  }
  return next.handle(req).pipe(
  // we catch the error
  catchError((errorResponse: HttpErrorResponse) => {
  ...
```
