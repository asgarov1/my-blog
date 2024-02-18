# Pivotal Spring 5 Exam - commonly asked questions/topics

---

**Disclaimer**: You won't pass without preparing well and reading/understanding a couple of books on Spring.

That being said, I have done many mock exams and also passed the real exam and questions on the following topics were always there:

## 1. Question on Bean Life-cycle
<img src="assets/images/bean_lifecycle.png">
Picture is from [Pro Spring 5: An In-Depth Guide to the Spring Framework and Its Tools](https://www.amazon.de/gp/product/1484228073/ref=as_li_tl?ie=UTF8&camp=1638&creative=6742&creativeASIN=1484228073&linkCode=as2&tag=asgarov1-21&linkId=deb69751f0bdfbc2479abcc5ee80d133)

Specifically there most likely will be question on the methods for bean creation/destruction life-cycle callback:

- `@PostConstruct` / `@PreDestroy` annotations can be used above any method
- `InitialisingBean` interface has method `afterPropertiesSet()`, `DisposableBean` interface has method `destroy()`
- with `@Bean(initMethod="..")` or `@Bean(destroyMethod="..")`

Spring 5 exam doesn't have XML based configuration, so I left it out.
Also, there is likely to be a couple of questions on `BeanPostProcessor` and `BeanFactoryPostProcessor`, 
their role and when they get called.

## 2. Question on transaction isolation levels

Pivotal likes this question a lot and never walks past without asking it. These make inherently sense, 
but for the sake of $250 paid for the exam learn them by heart.

- Read uncommitted
  - dirty read can occur: Yes
  - non-repeatable read can occur: Yes
  - phantom read can occur: Yes
- Read committed
  - dirty read can occur: No
  - non-repeatable read can occur: Yes
  - phantom read can occur: Yes
- Repeatable reads
  - dirty read can occur: No
  - non-repeatable read can occur: No
  - phantom read can occur: Yes
- Serializable
  - dirty read can occur: No
  - non-repeatable read can occur: No
  - phantom read can occur: No

## 3. What does the annotation @SpringBootApplication contain?
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {
    ...
}
```

Specifically pay attention to these three:

- `@SpringBootConfiguration` - alias for Configuration, allows defining `@Bean` in this class
- `@EnableAutoConfiguration` - enables the opinionated autoconfiguration of Spring Boot
- `@ComponentScan`

## 4. Scope
Here is what you need to know:

- Default scope: singleton
- You can change that with `@Scope("prototype")`
- Prototypes are by default lazy loaded, singletons are eager - can be changed with `@Lazy`
- If eager loaded bean is dependent on a lazy one, the lazy bean is going to be loaded eagerly as well
- The latest version of Spring framework defines 6 types of scopes:
(last 4 only available in web-aware application)
   - singleton
   - prototype
   - request
   - session
   - application
   - websocket

***S***ix ***P***riests ***R***equire ***S***even ***A***cres of ***W***hisky (doesn't make sense I know - 
helped to memorize these nonetheless)

## 5. AOP terminology
- **Joinpoint** - is a well-defined point during the execution of your application, in Spring AOP can only 
represent a method call. Basically it is a point in your code where you insert additional logic via AOP.
- **Advice** - actual code being inserted into the joinpoint.
- **Pointcut** - a predicate defining joinpoint(s) to define where exactly to execute the advice. Some advices 
should only be executed if certain combination of joinpoints match the criteria - hence the pointcut.
- **Aspect** - class that encapsulates advice and pointcut definitions.
- **Weaving** - process of inserting aspects into the application code at appropriate point (at build time 
or dynamically at run time).
- **Target** - target of the advice, also referred to as advised object.

more about AOP <a href="?post=2020-07-06_spring_aop_101.md">here</a>. 
Specifically you need to know the difference between **Advice**, **Joinpoint** and **Pointcut**, that default AOP 
implementation is through Interfaces but in case the bean doesn't implement any, CGLIB will be used for 
the sub-classing proxy. CGLIB is included in Spring Core jar.

Important to know that Proxy works through method overwriting and therefore won't work on final methods or classes. In between method calls inside of the target class won't be caught by AOP.

- Which type of Advices will execute if Exception is thrown? **@After, @Around, @Throws**
- Which type of advice allows to change the returned value? **@Around**
- Which types of advice allow to prevent the method from executing? **@Before, @Around**
    
You can add methods or fields to a proxied class - it is called **Introduction**

Spring AOP performs weaving at runtime.

## 6. Spring Boot
### Externalized Configuration

Short answer: Spring Boot lets you externalize your configuration so that you can work with the same 
application code in different environments. You can use properties files, YAML files, environment 
variables, and command-line arguments to externalize configuration.

[complete list here.](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config)

### Logging
Spring Boot uses Commons Logging for all internal logging.

## 7. Spring MVC
Which annotations can be applied to controller method parameters?
- `@RequestParam`
- `@RequestHeader`
- `@ModelAttribute`
- `@RequestBody`
- `@PathVariable`

Which annotations can be applied to controller method?
- `@ResponseBody`
- `@RequestMapping` and all of its specializations

Allowed return types for controller methods?
- `ModelAndView` (Class)
- `Model` (Interface)
- `Map`
- `String`
- `void`
- `View`
- `HttpEntity<?>` or `ResponseEntity<?>`
- `HttpHeaders`
- any Object with `@ResponseBody`

Among self-populated (automatic autowiring) method parameters for controller methods are:
- ServletRequest
- ServletResponse
- HttpSession
- HttpMethod
- Principal
- Locale
- ...[full list](https://docs.spring.io/spring/docs/5.0.5.RELEASE/spring-framework-reference/web.html#mvc-ann-arguments)

## 8. Spring Testing
Spring has mock objects on Environment, JNDI and Servlet API to assist in unit testing

`@ContextConfiguration` is commonly used in integration tests, class only annotation, here is an example:

```java
@ContextConfiguration(classes=TestConfig.class)
public class ExampleTestClass {
  // ...
}
```
more on Spring Boot testing [here](/?post=2020-07-28_testing_spring_boot.md).

## 9. Spring Security
There will definitely be a question on matching URLs and how more specific mvcMatchers have to be before 
less specific ones, otherwise both will get matched.

---

## Tips

This is by no means an exhaustive list, but I figured it pays off to have something like 9 questions 
(18%, passing score 76%) in your pocket. The rest you will have to make on your own - good luck :)

Pivotal has increased the amount of questions on Spring Boot (32% in total), and with 20% on Container 
you wouldn't be wrong to concentrate your effort on these 2 topics.

Also, funny thing I noticed: if some options speak favorably of Spring (something like Spring endorses 
best coding practices by promoting coding to interfaces) most likely that option is correct, similarly 
something like Spring doesn't allow for this kind of testing, doesn't have this feature is almost certainly 
wrong - so yeah, there is a bit of self advertisement you can rely on :)

---

**Recommended mock tests** - [itestjava.com](http://itestjava.com/), it is far from perfect, 
has outdated questions, but unfortunately I haven't found anything better for Spring 5 Exam.

Furthermore, there is [free app](https://play.google.com/store/apps/details?id=com.springqcm&hl=gsw) on 
Google Store with Spring 5 Practice Tests - worth checking it out.
