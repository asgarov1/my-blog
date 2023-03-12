# Commons Reasons for @Transactional not working

I have been helping a few people on stackoverflow with these issues and decided to write a post about 
the most common problems people are having.

## Possible Causes:

### 1. In Class Invocations

> In proxy mode (which is the default), only external method calls coming in through the proxy are intercepted.
> This means that self-invocation, in effect, a method within the target object calling another method of the
> target object, will not lead to an actual transaction at runtime even if the invoked method is marked with
> `@Transactional`. Also, the proxy must be fully initialized to provide the expected behaviour, so you should 
> not rely on this feature in your initialization code, i.e. @PostConstruct.

So essentially you should take care to call you transactional methods only from outside the class they are declared in.

There is however a hack around this, you can inject a bean side of itself and call a method from that injected bean. 
This will work:

```
@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserService userService;

    public UserService(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Transactional
    public void save(User user) {
        System.out.println("INSIDE METHOD: Transaction open: " + TransactionSynchronizationManager.isActualTransactionActive());
        userRepository.save(user);
        System.out.println("USER " + user.getName() + " is SAVED!");
    }
    
    public void someOtherMethod(User user) { 
      userService.save(user); // will still save inside of Transaction! 
    }
}
```

I wouldn't necessarily call this clear code though. better just to make call invocations from outside.

### 2. Using checked exceptions

`@Transactional` will only roll back unchecked exceptions by default like for example `NullPointerException`. 
If you want to throw checked exceptions you need specify them in rollback:

```
@Transactional(rollbackFor = Exception.class)
public void save(User user) throws Exception {
    System.out.println("INSIDE METHOD: Transaction open: " + TransactionSynchronizationManager.isActualTransactionActive());
    userRepository.save(user);
    interruptWithException();
}

public void interruptWithException() throws Exception {
    throw new Exception();
}
```

### 3. Forgetting to use @EnableTransactionManagement over your @Configuration class.
```
@SpringBootApplication  //includes @Configuration
@EnableTransactionManagement
public class TransactionDemoApplication {
    public static void main(String[] args) {
        var ctx = SpringApplication.run(TransactionDemoApplication.class, args);
        UserService userService = ctx.getBean(UserService.class);
        try {
            userService.save(new User("Sam", "sam@winchester.com"));
        } catch (Exception e) { // ... }
    }
}
```
or in xml:
```
<bean id="txManager" class="org.springframework.orm.jpa.JpaTransactionManager">
    <property name="entityManagerFactory" ref="myEmf" />
</bean>
<tx:annotation-driven transaction-manager="txManager" />
```

### 4. Instantiating beans directly
Kinda silly to even have to mention it but probably the most common issue with beginner Spring questions in SO.

Spring `@Transactional` works via Proxying. Proxying will only be done if you let Spring instantiate the beans. 
That means as soon as you instantiate classes with `@Transactional` yourself - in my example that would have been:
```
UserService userService = new UserService();
```

No Spring Managed Bean => No Proxying => No Transactions.

These few pitfalls are important to understand. I recommend checking my article on Transactions - 
<a href="?post=2020-07-11_spring_transactions_explained.md">there is also example with GitHub link</a>
