# Spring: Transactions explained

---

> Transaction is a logical, atomic unit of work that contains one or more SQL statements. Either all applied, or all rolled back. 
> Oracle Database Concepts

Transactions should follow ACID principles

## ACID
- Atomicity - all tasks are performed or none - there are not partial transactions. If a transaction is updating 100 rows and 
fails at row 20, all the changes are rolled back.
- Consistency - transaction takes database from one consistent state to another one. In a banking transaction, 
there should never be a situation where one account is debited but another one is not credited, because even if these 
operations were done separately atomically they are still inconsistent.
- Isolation - the effect of a transaction is not visible until the transaction is committed. One user applying changes to a 
database table won't see other changes applied until he commits his. Oracle protects rows from concurrent modification via 
Row Locks. More on isolation levels here.
- Durability - changes committed by transactions are permanent.

## Spring example

Let's get our feet wet with an example right away, we will create [a Spring Boot application](https://github.com/asgarov1/springBootTransactionsExample)
(<5 mins of coding || <2 mins of copy pasting)

Dependencies you need for the pom file:

```
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-devtools</artifactId>
	<scope>runtime</scope>
	<optional>true</optional>
</dependency>
<dependency>
	<groupId>com.h2database</groupId>
	<artifactId>h2</artifactId>
	<scope>runtime</scope>
</dependency>
<dependency>
	<groupId>org.projectlombok</groupId>
	<artifactId>lombok</artifactId>
	<optional>true</optional>
</dependency>
```

We will have only one domain class for this example:

```
@Entity              //used for Spring JPA
@AllArgsConstructor  //Lombok annotation, creates all args constructor
@NoArgsConstructor   //Lombok, create no args constructor
@Getter              //Lombok, creates getters
@Setter              //Lombok, creates setters
public class User extends AbstractPersistable<Long> {

//AbstractPersistable is a utility class from Spring JPA that defines
//id and overwrites hash and equals - useful when working with JPA

    @Column
    private String name;

    @Column
    private String email;
}
```

*As you can see I make heavy use of Lombok to save time, if IntelliJ gives you trouble because of Lombok, 
make sure you have Lombok plugin installed and Enable Annotation Processing in IntelliJ settings.*

Next we define Repository and Service classes:

```
@Repository
public interface UserRepository extends CrudRepository<User, Long> {}

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void save(User user) {
        System.out.println("INSIDE METHOD: Transaction open: " + TransactionSynchronizationManager.isActualTransactionActive());
        userRepository.save(user);
        System.out.println("USER " + user.getName() + " is SAVED!");
    }
}
```

Isn't Spring awesome? Few lines and we are done! All that is left is Runner class:

```
@SpringBootApplication
@EnableTransactionManagement
public class TransactionDemoApplication {
    public static void main(String[] args) {
        var ctx = SpringApplication.run(TransactionDemoApplication.class, args);
        UserService userService = ctx.getBean(UserService.class);

        System.out.println("BEFORE METHOD: Transaction open: " + TransactionSynchronizationManager.isActualTransactionActive());
        userService.save(new User("Sam", "sam@winchester.com"));
        System.out.println("AFTER METHOD: Transaction open: " + TransactionSynchronizationManager.isActualTransactionActive());
    }
}
```

Important bit here is @EnableTransactionManagement - that is what enables transaction. Spring Boot will automatically 
configure the in memory H2 database for us but to avoid having to look up the url in console output lets define it in 
application.properties:

`spring.datasource.url=jdbc:h2:mem:testdb`

Now all you gotta do is run the application, go to http://localhost:8080/h2-console, make sure you have the correct details like so:
<img src="assets/images/h2_console_login.png" />

*`sa` is the default login, and default password is blank in H2*

Now press connect and as you can see we indeed created our user in the database. But even more importantly, 
the persisting was done in a transaction thanks to `@Transaction` above the save method. 
And as you can see in the console output:

```
BEFORE METHOD: Transaction open: false
INSIDE METHOD: Transaction open: true
USER Sam is SAVED!
AFTER METHOD: Transaction open: false
```

So you can see that transaction only activates inside the method, making sure that whatever complicated 
(or in this case rather simple) commands we have in that method - they will all be performed as one transaction.

[GitHub Link](https://github.com/asgarov1/springBootTransactionsExample)

You might be wondering why did we need `@Transactional` in the first place? Well suppose we have several queries to database in 
that one method. Then, in case one of them would throw an exception all the changes will be rolled back. So the method 
executes either as whole or not at all - very useful to preserve data consistency.

As you saw all we needed to make our methods run in a transaction was to annotate the classes/methods with the 
`@Transactional` annotation, add `@EnableTransactionManagement` to the configuration and et voilà. But it helps to understand 
how it works under the hood + additional capabilities.

### Under the hood of @Transactional.

As mentioned before if any (by default only Runtime) exception is thrown within a method marked with `@Transactional` 
then all changes will be rolled back.

> In its default configuration, the Spring Framework’s transaction infrastructure code only marks a transaction for rollback 
> in the case of runtime, unchecked exceptions; that is, when the thrown exception is an instance or subclass of RuntimeException. 
> (Errors will also - by default - result in a rollback). Checked exceptions that are thrown from a transactional method do not 
> result in rollback in the default configuration.
> 
> https://docs.spring.io/spring/docs/5.0.5.RELEASE/spring-framework-reference/data-access.html#transaction-declarative-rolling-back

You can configure exactly which Exception types mark a transaction for rollback, including checked exceptions, or on the 
contrary specify 'no rollback rules' where you specify for which exceptions (maybe all of them) you don't want rollbacks, 
for example:

```
@Transactional(rollbackFor = IOException.class, noRollbackFor = NullPointerException.class)
public void save(User user) {
   // ...
}
```

> When using proxies, you should apply the @Transactional annotation only to methods with public visibility. 
> If you do annotate protected, private or package-visible methods with the @Transactional annotation, no error is raised, 
> but the annotated method does not exhibit the configured transactional settings. Consider the use of AspectJ if you need 
> to annotate non-public methods.
>
> https://docs.spring.io/spring/docs/5.0.5.RELEASE/spring-framework-reference/data-access.html#transaction-declarative-annotations

Further words of caution:

> In proxy mode (which is the default), only external method calls coming in through the proxy are intercepted. 
> This means that self-invocation, in effect, a method within the target object calling another method of the 
> target object, will not lead to an actual transaction at runtime even if the invoked method is marked with 
> `@Transactional`. Also, the proxy must be fully initialized to provide the expected behaviour, so you should not rely on 
> this feature in your initialization code, i.e. @PostConstruct.

There is however a hack around this, you can inject a bean side of itself and call a method from that injected bean. This will work:

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

### PlatformTransactionManager

Key thing to understand is the notion of transaction strategy which is defined by the 
`org.springframework.transaction.PlatformTransactionManager` interface:

```
public interface PlatformTransactionManager {

    TransactionStatus getTransaction(TransactionDefinition definition) throws TransactionException;

    void commit(TransactionStatus status) throws TransactionException;

    void rollback(TransactionStatus status) throws TransactionException;
}
```

*PlatformTransactionManager was created by SpringBoot for us in our example because of @EnableTransactionManage annotation. 
As you can see first method throws a TransactionException - all exceptions are Runtime exceptions in spring transaction package.*

The `TransactionDefinition` interface specifies:

 - Propagation - Typically, all code executed within a transaction scope will run in that transaction. However, you have the 
option of specifying the behavior in the event that a transactional method is executed when a transaction context already exists.
 - Isolation: The degree to which this transaction is isolated from the work of other transactions. More about transaction 
isolation levels.
 - Timeout: How long this transaction runs before timing out and being rolled back automatically by the underlying transaction 
infrastructure.
 - Read-only status: A read-only transaction can be used when your code reads but does not modify data. Read-only transactions 
can be a useful optimization in some cases, such as when you are using Hibernate.

The `TransactionStatus` interface provides a simple way for transactional code to control transaction execution and query transaction status. 
The concepts should be familiar, as they are common to all transaction APIs:

```
public interface TransactionStatus extends SavepointManager {
    boolean isNewTransaction();
    boolean hasSavepoint();
    void setRollbackOnly();
    boolean isRollbackOnly();
    void flush();
    boolean isCompleted();
}
```

Regardless of whether you opt for declarative or programmatic transaction management in Spring, defining the correct 
`PlatformTransactionManager` implementation is absolutely essential. You typically define this implementation through 
dependency injection.

## 7 types of Propagation:
### 1. Propagation.REQUIRED (default)

```
@Transactional(propagation = Propagation.REQUIRED)
public void methodA(){
    // ...
}
```

 - If the @Transactional methodA is called directly it creates its own transaction.
 - If the @Transactional methodA is called from another method then:
   - if the calling method has a transaction then methodA makes use of the existing transaction
   - if the calling method does not have a transaction, methodA will create one. Either way methodA will run in a transaction.

### 2. Propagation.NESTED
```
@Transactional(propagation = Propagation.NESTED)
public void methodA(){
    // ...
}
```

 - If the @Transactional methodA is called directly it creates its own transaction.
 - If the @Transactional methodA is called from another method then:
   - if the calling method has a transaction then methodA creates a nested transaction inside existing one
   - if the calling method does not have a transaction, methodA will create one. Either way methodA will run in a transaction.


### 3. Propagation.SUPPORTS
```
@Transactional(propagation = Propagation.SUPPORTS)
public void methodA(){
    // ...
}
```

Basically methodA will never create its own transaction:

 - If the @Transactional methodA is called directly it does not create its own transaction.
 - If the @Transactional methodA is called from another method then:
   - if the calling method has a transaction then methodA makes use of the existing transaction (supports it)
   - if the calling method does not have a transaction, methodA will not create one.

### 4. Propagation.NOT_SUPPORTED

```
@Transactional(propagation = Propagation.NOT_SUPPORTED)
public void methodA(){
    // ...
}
```

To keep it short this propagation type will ensure that the annotated method will never run in a transaction, 
doesn't matter whether:

 - methodA was called directly
 - was called from another method within transaction - in this case the current transaction will be suspended, 
methodA will run without transaction, and after methodA is done transaction will be resumed.
 - was called from another method without transaction

In all the cases methodA doesn't support transaction and will run without one.

### 5. Propagation.REQUIRES_NEW

Method will always run in a new transaction:

```
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void methodA(){
    // ...
}
```

 - If the methodA is called directly it creates its own transaction.
 - If the methodA is called from another method then:
   - if the calling method has a transaction then methodA **won't use existing transaction but instead create a new one**
   - if the calling method does not have a transaction, methodA will create one.

### 6. Propagation.NEVER
```
@Transactional(propagation = Propagation.NEVER)
public void methodA(){
    // ...
}
```
MethodA will never create a transaction, and will throw an exception if called from a method within a transaction

 - If the methodA is called directly it does not create its own transaction.
 - If the methodA is called from another method then:
   - if the calling method has a transaction then methodA will throw an exception:
`IllegalTransactionStateException: Existing transaction found for transaction marked with propagation 'never'`
   - if the calling method does not have a transaction, methodA will not create one.

### 7. Propagation.MANDATORY
```
@Transactional(propagation = Propagation.MANDATORY)
public void methodA(){
    // ...
}
```

 - If the methodA is called directly it will throw an exception:
`IllegalTransactionStateException: No existing transaction found for transaction marked with propagation 'mandatory'`
 - If the methodA is called from another method then:
   - if the calling method has a transaction then methodA will make use of the existing transaction.
   - if the calling method does not have a transaction, methodA will throw the aforementioned 
`IllegalTransactionStateException` exception.

---

### Useful Links:
https://docs.spring.io/spring/docs/5.0.5.RELEASE/spring-framework-reference/data-access.html#transaction
