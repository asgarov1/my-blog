# Setting Spring Properties in Runtime

---

Let say we have some kind of property that we want to supply in runtime for whatever reason. For example in our application.yml we have: defined:

```
custom:
name: ${customUsername}
```
With this configuration being the only one supplied, if this value (`${custom.name}`) is being 
referenced from any Bean, Spring will look for some PropertySource that contains username and 
failing to find one will throw:

```
Caused by: java.lang.IllegalArgumentException: Could not resolve placeholder 'customUsername' in value "${customUsername}"
// stacktrace ...
```

To solve these we have 2 options.

## Option 1: Register Custom EnvironmentPostProcessor

you can implement your own PropertySource, e.g.

```
public class CustomPropertySource extends PropertySource<String> {
    public CustomPropertySource(String name) {
        super(name); //name of the PropertySource, doesn't matter in our implementation
    }

    @Override
    public Object getProperty(String name) {
        if (name.equals("customUsername")) {
            return "MY CUSTOM RUNTIME VALUE";
        }
        return null;
    }
}
```

and then add it to the environment in EnvironmentPostProcessor:

```
public class EnvironmentConfig implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment,
                                       SpringApplication application) {
        environment.getPropertySources()
                .addFirst(new CustomPropertySource("customPropertySource"));
    }
}
```

the last step is that you have to register the EnvironmentPostProcess, by creating 
`spring.factories` file under path of `src/main/resources/META-INF/spring.factories` 
and inside of it just add following line:

`org.springframework.boot.env.EnvironmentPostProcessor=package.to.environment.config.EnvironmentConfig`

## Option 2: Register Custom EnvironmentPostProcessor

A class that is responsible for resolving these placeholders is a BeanPostProcessor called 
`PropertySourcesPlaceholderConfigurer` (see [here](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/support/PropertySourcesPlaceholderConfigurer.html)).

So we could override it and provide our custom `PropertySource` that would resolve the property like so:

```
@Component
public class CustomConfigurer extends PropertySourcesPlaceholderConfigurer {

    @Override
    protected void processProperties(ConfigurableListableBeanFactory beanFactoryToProcess, ConfigurablePropertyResolver propertyResolver) throws BeansException {
        ((ConfigurableEnvironment) beanFactoryToProcess.getBean("environment"))
                .getPropertySources()
                .addFirst(new CustomPropertySource("customPropertySource"));
        super.processProperties(beanFactoryToProcess, propertyResolver);
    }
}
```
