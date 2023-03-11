# Jackson BeanDeserializerModifier with existing JsonDeserializers

---

So I had a case where I wanted to add a general deserializer for Strings, but I couldn't use custom JsonDeserializer because 
I also needed reliable information about the field/class being deserialized and that is just not always available with 
JsonDeserializer due to it being recursive (most of the time it is there, but with an edge case of having empty json objects 
in the middle of json it starts giving wrong type information)

BeanDeserializerModifier to the rescue!

## The code

So first of all our class to deserialize into:

```
package com.asgarov.jacksondemo.domain;

import com.asgarov.jacksondemo.config.NameSerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Person {
    private int id;

    @JsonDeserialize(using = NameSerializer.class)
    private String name;

    private String email;
}
```

And following best practices, lets first define a test we want to fail:

```
package com.asgarov.jacksondemo.serializer;

import com.asgarov.jacksondemo.domain.Person;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class NameSerializerTest {
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void test() throws JsonProcessingException {
        Person person = objectMapper.readValue(
                "{\"id\":1,\"name\":\"Alfred\",\"email\":\"admin@admin<script></script>.com\"}",
                Person.class);
        assertEquals(1, person.getId());
        assertEquals("Mr/Mrs Alfred", person.getName());
        assertEquals("admin@admin.com", person.getEmail());
    }
}
```

So as you can see I want to get "Mr/Mrs " appended from one specific deserializer, and have another one taking care 
of cleaning out evil <script></script> tags found in our strings. Let's start with defining first deserializer.

```
package com.asgarov.jacksondemo.config;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

public class NameSerializer extends JsonDeserializer<Object> {
    @Override
    public Object deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {
        return "Mr/Mrs " + jsonParser.getValueAsString();
    }
}
```

So this one is very simple, and is used directly from the annotation. The main logic is in BeanDeserializerModifier:

```
package com.asgarov.jacksondemo.config;

import com.fasterxml.jackson.databind.BeanDescription;
import com.fasterxml.jackson.databind.DeserializationConfig;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.BeanDeserializerBuilder;
import com.fasterxml.jackson.databind.deser.BeanDeserializerModifier;
import com.fasterxml.jackson.databind.deser.SettableBeanProperty;

import java.util.Iterator;

public class MyBeanDeserializerModifier extends BeanDeserializerModifier {
    @Override
    public BeanDeserializerBuilder updateBuilder(DeserializationConfig config, BeanDescription beanDesc, BeanDeserializerBuilder builder) {
        for (Iterator<SettableBeanProperty> properties = builder.getProperties(); properties.hasNext(); ) {
            SettableBeanProperty property = properties.next();
            if (isStringAndNotExcluded(property, beanDesc)
                    && doesNotHaveExistingDeserializer(property)
            ) {
                property = property.withValueDeserializer(new AntisamyDeserializer());
                builder.addOrReplaceProperty(property, true);
            }
        }
        return builder;
    }

    private boolean doesNotHaveExistingDeserializer(SettableBeanProperty property) {
        return property.getAnnotation(JsonDeserialize.class) == null;
    }

    private boolean isStringAndNotExcluded(SettableBeanProperty property, BeanDescription beanDesc) {
        return property.getType().getRawClass().equals(String.class)
                && !beanDesc.getBeanClass().isAnnotationPresent(ExcludeAntisamy.class)
                && !property.getMember().hasAnnotation(ExcludeAntisamy.class);
    }
}
```

So we have quite a bit going on here, so allow me to explain - updateBuilder is the method that contains all the logic. 
If the conditions are met for the specific property we define the <script> tags cleaning deserializer in there. But since 
in accordance with [Jackson's design](https://github.com/FasterXML/jackson-databind/issues/3089), you can only use one 
deserializer for any given type, we must be careful that we don't override any predefined @JsonDeserialize deserializer logic - 
checked in `doesNotHaveExistingDeserializer` method.

I also check that it should only apply the custom logic for String types and only if they don't have `@ExcludeAntisamy` 
annotation at class or field level (in `isStringAndNotExcluded` method).

That is pretty much all there is to it, we just need to configure `ObjectMapper` bean:

```
package com.asgarov.jacksondemo.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SerializerConfig {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        SimpleModule module = new SimpleModule();
        module.setDeserializerModifier(new MyBeanDeserializerModifier());
        objectMapper.registerModule(module);
        return objectMapper;
    }
}
```

and here is the marker annotation code - pretty straightforward:
```
package com.asgarov.jacksondemo.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.FIELD})
public @interface ExcludeAntisamy {
}
```

Full code can be found [here](https://github.com/asgarov1/Jackson_BeanDeserializerModifier_Demo). Thanks for reading!
