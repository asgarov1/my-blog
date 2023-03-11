# Java 8 map methods compute and merge

---

Let's start with simpler ones, `computeifAbsent()` and `computeifPresent()`

### computeIfAbesent() & computeIfPresent()

`public V computeIfAbsent(K key, Function<? super K, ? extends V> mapping Function)`

In english, this function will compute for every key function that is absent, 
the function that you pass as a second parameter. The function takes a key as a 
parameter and maps it to whatever you define in your function. If the result is null 
or exception the Map won't record the value.

Lastly the result of the function is recorded and also returned to you.

So for example:

```
Map<Integer, Integer> numbers = Stream.of(1, 2, 3)
                .collect(Collectors.toMap(Function.identity(), Function.identity()));
System.out.println(numbers); //{1=1, 2=2, 3=3}
        
numbers.computeIfAbsent(2, k -> 10); //nothing happens
System.out.println(numbers); //{1=1, 2=2, 3=3}

numbers.computeIfAbsent(4, k -> 20);
System.out.println(numbers); //{1=1, 2=2, 3=3}
```

As you can see the function only executes when the key returns null. 
Same for computeIfPresent() with the only difference that it expects a BiFunction 
taking both key and value as parameters:

```
Map<Integer, Integer> numbers = Stream.of(1, 2, 3)
.collect(Collectors.toMap(Function.identity(), Function.identity()));
System.out.println(numbers); //{1=1, 2=2, 3=3}

numbers.computeIfPresent(4, (k,v) -> v*10); //nothing happens
System.out.println(numbers); //{1=1, 2=2, 3=3}

numbers.computeIfPresent(2, (k,v) -> v*10);
System.out.println(numbers); //{1=1, 2=20, 3=3}
```

### compute()

`V compute(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)`

Useful when you want to perform an operation on all values, like for example 
add to +1 to a specific value.

```
Map<Integer, Integer> numbers = Stream.of(1, 2, 3)
.collect(Collectors.toMap(Function.identity(), Function.identity()));
System.out.println(numbers); //{1=1, 2=2, 3=3}

numbers.compute(1, (k, v) -> v == null ? null : v+1);
System.out.println(numbers); //{1=2, 2=2, 3=3}
```

returning null leaves map unchanged so this function only updates 1 if 
such key is found. It would probably be easier to use `computeIfPresent()` 
in this case.

### merge()


merge expects three parameters:
1. key
2. value
3. BiFunction mapper

Imagine you have 2 maps and you want to merge one into another overwriting 
duplicates. As easy as calling one function:

```
Map<Integer, Integer> numbersOne = Stream.of(1, 2, 3)
                .collect(Collectors.toMap(Function.identity(), Function.identity()));
System.out.println(numbersOne); //{1=1, 2=2, 3=3}

Map<Integer, Integer> numbersTwo = Stream.of(3,4,5)
                .collect(Collectors.toMap(Function.identity(), Function.identity()));
System.out.println(numbersTwo); //{3=3, 4=4, 5=5}

numbersOne.forEach((k,v) -> numbersTwo.merge(k,v, (v1,v2) -> v2));
System.out.println(numbersTwo); //{1=1, 2=2, 3=3, 4=4, 5=5}
```

In this case merge overwrites the previous value with a previous one. 
You could however build some logic into a mapper, like for example choosing a 
longer string:

```
Map<Integer, String> map = Stream.of(
                Map.entry(1, "apple"),
                Map.entry(2, "orange"),
                Map.entry(3, "pear")
        ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

map.merge(2, "newOrange", (a, b) -> b.length() > a.length() ? b : a);
System.out.println(map);  // {1=apple, 2=newOrange, 3=pear}

```

If the map doesn't have any value (returns null) for the specified key, 
merge doesn't call the mapper but simply inserts the new value:

```
Map<Integer, String> map = Stream.of(
                Map.entry(1, "apple"),
                Map.entry(2, "orange"),
                Map.entry(3, "pear")
        ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

map.merge(4, "newOrange", (a, b) -> b.length() > a.length() ? b : a);
System.out.println(map);  // {1=apple, 2=orange, 3=pear, 4=newOrange}
```

if the mapping function were to call a null the key would be removed from the map:

```
Map<Integer, String> map = Stream.of(
                Map.entry(1, "apple"),
                Map.entry(2, "orange"),
                Map.entry(3, "pear")
        ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

map.merge(2, "newOrange", (a, b) -> null);
System.out.println(map);  // {1=apple, 3=pear}
```
