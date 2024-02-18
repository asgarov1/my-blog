# Testing Spring Boot

---

With great power comes great responsibility and that would be testing. 
Luckily, Spring Boot offers some great tools for testing.

## @SpringBootTest

First and most obvious, this annotation above your test class will automatically 
look up in the directory structures looking for a class annotated with 
`@SpringBootApplication` or `@SpringBootConfiguration`. 
With the help of either of these classes it will automatically set up 
ApplicationContext (as long as no other `@Configuration` classes are specified 
in this Test class).

Also, a `PropertySourcesPlaceholderConfigurer` is automatically configured.

## @WebMvcTest

Awesome little annotation allowing to test your Controllers in web application.

`@WebMvcTest` autoconfigures the Spring MVC infrastructure and limits scanned 
beans to `@Controller`, `@ControllerAdvice`, `@JsonComponent`, `Converter`, 
`GenericConverter`, `Filter`, `HandlerInterceptor`, `WebMvcConfigurer`, and 
`HandlerMethodArgumentResolver`. 

Regular `@Component` beans are not scanned when using this annotation. 
If you have Spring Security on the classpath, `@WebMvcTest` will also scan 
`WebSecurityConfigurer` beans.

from Spring documentation
> `@WebMvcTest` also autoconfigures `MockMvc` allowing you to easily test requests. 
You could also achieve this in a non-@WebMvcTest (like for example `@SpringBootTest`) 
by annotating it with `@AutoConfigureMockMvc`.

Here is an example of MockMvc.

```java
@WebMvcTest(HomeController.class)
class HomeControllerTest {

    @Autowired
    private MockMvc mockMvc;

  	@Test
    @DisplayName("Index page works ok")
    public void test() throws Exception {
	  mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(view().name("index"))
             .andExpect(content().string(containsString("Homepage")));
    }
}
```

You can also easily pass parameters into MockMvc requests like so

```java
mockMvc.perform(post("/")                                             
.param("foo", "bar")
.flashAttr("example", new Example()));
```

`.param` in this case is what you expect with `@RequestParam` and 
`.flashAttr` is used to pass Objects into Model.

In case you want to pass object as JSON into a request you can do it like in the 
following example:

```java
@Test
@DisplayName("Posting the order works")
public void postingOrderWorks() throws Exception {
    OrderDTO orderDTO = OrderDTO.builder()
            .firstName("Tom")
            .lastName("Smith")
            .email("tom.smith@gmail.com").build();

    String json = new Gson().toJson(orderDTO);

    mockMvc.perform(post("/order")
           .contentType(MediaType.APPLICATION_JSON).content(json))
           .andExpect(status().isOk())
           .andExpect(content().string(containsString("Thank you, your order was placed successfully.")));
}
```

For this example you would need to add Gson to your dependencies. 
In Gradle: `compile 'com.google.code.gson:gson:2.8.6'`

Another great benefit that you get with `@WebMvcTest` that HtmlUnit Webclient bean or 
Selenium WebDriver bean are also autoconfigured if you have them in classpath.

### Example from Baeldung

```java
@WebMvcTest(HomeController.class)
class HomeControllerTest {

  @Autowired
  private WebApplicationContext wac;

  private WebClient webClient;

  @Before
  public void setup() {
    webClient = MockMvcWebClientBuilder.webAppContextSetup(wac).build();
  }
  
  @Test
  public void givenAMessage_whenSent_thenItShows() throws Exception {
      String text = "Hello world!";
      HtmlPage page;
  
        String url = "http://localhost/message/showForm";
        page = webClient.getPage(url);
  
        HtmlTextInput messageText = page.getHtmlElementById("message");
        messageText.setValueAttribute(text);
  
        HtmlForm form = page.getForms().get(0);
        HtmlSubmitInput submit = form.getOneHtmlElementByAttribute(
          "input", "type", "submit");
        HtmlPage newPage = submit.click();
  
        String receivedText = newPage.getHtmlElementById("received")
            .getTextContent();
  
        Assert.assertEquals(receivedText, text);     
  }
}
```

## @DataJpaTest
You can use the `@DataJpaTest` annotation to test JPA applications. 
By default, it scans for @Entity classes and configures Spring Data JPA repositories. 
If an embedded database is available on the classpath, it configures one as well. 
Regular `@Component` beans are not loaded into the ApplicationContext.

from Spring documentation:
```java
@DataJpaTest
class CatalogServiceImplTest {

    @Autowired
    CatalogRepository catalogRepository;

    @Test
    @DisplayName("findById() works as expected")
    void findByIdWorksOk() {
      Item croissant = Item.builder()
                        .title("Croissant")
                        .price(3.99)
                        .itemCode("xyz")
                        .build();

      catalogRepository.save(croissant);

      Optional<Item> foundProduct = catalogRepository
        .findById(croissant.getItemCode());
        
      assertTrue(foundProduct.isPresent());
      assertEquals(croissant, foundProduct.get());
    }
}
```
