# Extending JUni5 with custom annotations

---

I was excited to find out how easy it is to extend JUnit 5 with custom annotations, 
here is how.

I am going to utilize afterEachCallback since it fits for this purpose - some other callbacks 
that are available (in order of execution):

1. BeforeAllCallback
2. BeforeAll
3. BeforeEachCallback
4. BeforeEach
5. BeforeTestExecutionCallback
6. Test
7. AfterTestExecutionCallback
8. AfterEach
9. AfterEachCallback
10. AfterAll
11. AfterAllCallback

There is also [ExecutionCondition](https://junit.org/junit5/docs/5.0.3/api/org/junit/jupiter/api/extension/ExecutionCondition.html) 
available to evaluate whether test should run or not, [ParameterResolver](https://junit.org/junit5/docs/5.0.3/api/org/junit/jupiter/api/extension/ParameterResolver.html) 
to resolve parameters, [and others](https://junit.org/junit5/docs/5.0.3/api/org/junit/jupiter/api/extension/Extension.html).

```
public class EmailResultExtension implements AfterEachCallback {

    @Override
    public void afterEach(ExtensionContext extensionContext) throws Exception {
        boolean passed = extensionContext.getExecutionException().isEmpty();
        System.out.println("Test passed: " + passed);
        // email results
    }
}
```

I really liked the [declartive declation](https://junit.org/junit5/docs/current/user-guide/), 
that is possible with custom annotations

```
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@ExtendWith(EmailResultExtension.class)
public @interface EmailResult {
}
```

And just annotate your tests with your custom extension:

```
@EmailResult
@Test
public void test() {
    // some test
}
```

And it is that easy, custom EmailResultExtension logic will be automatically 
called after each annotated test
