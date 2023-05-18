# For Java developers who are learning Angular - some pitfalls

---

I learned Java very well, being a backender and learned (am still learning) Angular on the 
job few years later. As a result here are the few common pitfalls that made me turn on 
debugger :-)

## Referencing function by name in JS doesn't behave the same as method reference in Java

So we all know comfortable way of using method reference in Java instead of a lambda which is shorter and also prettier:

```java
  private final List<String> vowels = List.of("a", "e", "i", "o", "u");

	public void someMethod() {
		boolean result = Stream.of("a", "b")
				.anyMatch(this::containsVowels);
		System.out.println(result);
	}

	private boolean containsVowels(String s) {
		return Arrays.stream(s.split("")).anyMatch(this.vowels::contains);
	}
```

This pretty much works as expected. But you might be surprised to find out that the following will throw an exception in Angular on line 10:

```typescript
  readonly vowels = ["a", "e", "i", "o", "u"];

  someMethod(): void {
    const result = ["a", "b"]
      .filter(this.containsVowels);
    console.log(result);
  }

  containsVowels(s: string): boolean {
    return s.split("").some(vowel => this.vowels.includes(vowel));
  }
```

At the first glance it looks the same, but the problem is passing function by reference 
on line 5 `this.containsVowels`. While passing functions like that works just like method 
reference in Java in a sense that incoming parameters are passed to the called function, 
when function is called like that in JS it binds it own `this` losing the 
reference to the original `this` from outer scope. So that would work fine if the function 
`containsVowels` didn't reference anything from the surrounding object but because it does 
try to reference `this.vowels` it will fail with a message 
`ERROR TypeError: Cannot read properties of undefined (reading 'vowels')` because this 
becomes undefined when function is called only by name reference.

To make it work all you need is to use arrow function which has the advantage of not binding its own this but rather inheriting the one from outer scope:

```typescript
 readonly vowels = ["a", "e", "i", "o", "u"];

  someMethod(): void {
    const result = ["a", "b"]
      .filter(letter => this.containsVowels(letter));
    console.log(result);
  }

  containsVowels(s: string): boolean {
    return s.split("").some(vowel => this.vowels.includes(vowel));
  }
```

## Array methods in JS are NOT lazily evaluated

This tripped me more than once since it is so easy to forget that it is not Stream API 
even though method names are similar. The following in Java will execute only one 
validating function if the input were to "apple", which is very useful when you want 
to only run as many validations as needed:


```java
public void validateAll(String word) {
        String word = "apple";
		
		boolean result = List.of(
						(Predicate<String>) input -> input.length() != 5,
						input -> !input.equals("some word"),
						input -> {throw new RuntimeException("will never get here");}
				).stream()
				.map(predicate -> predicate.test(word))
				.findFirst()
				.orElse(false);
		System.out.println(result);
}
```

Whereas in JS (Angular) array method get executed on every single member of the array:

```typescript
  validateAll(word = "apple") {
    const result = [
      (input: string) => input.length != 5,
      (input: string) => input !== "some word",
      (input: string) => {throw new Error("will get thrown no matter which input!")}
    ]
      .map(validator => validator(word))
      .find(result => result) || false;
    console.log(result)
  }
```

To make this work in Angular you would need to evaluate only in find:

```typescript
  validateAll(word = "apple") {
    const result = [
      (input: string) => input.length != 5,
      (input: string) => input !== "some word",
      (input: string) => {throw new Error("will get thrown no matter which input!")}
    ]
      .find(validator => validator(word)) || false;
    console.log(result)
  }
```
