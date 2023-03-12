# Path resolve vs Path relativize

---

In this little article we are going to go over through these 2 methods and analyze all the edge cases. 
Motivation behind this is that Oracle loves to ask this question in the exam so gotta make sure you have got 
this one down.

## Resolve
Basically resolve appends path parameter to the path object it was called on (joins them):

```
Path path1 = Paths.get("a");
Path path2 = Paths.get("b");

System.out.println("Path1 resolve path2: " + path1.resolve(path2));
System.out.println("Path2 resolve path1: " + path2.resolve(path1));
```

Produces output:
```
Path1 resolve path2: a\b
Path2 resolve path1: b\a
```

### Edge cases:
#### What happens if the parameter is an absolute path?
The return value is a parameter without any change:

```
Path path1 = Paths.get("a");
Path path2 = Paths.get("/b");

System.out.println("Path1 resolve path2: " + path1.resolve(path2));
System.out.println("Path2 resolve path1: " + path2.resolve(path1));
Path1 resolve path2: \b
Path2 resolve path1: \b\a
```

#### What if the parameter/original path is empty?
Basically you only get the nonempty part.
```
Path path1 = Paths.get("a");
Path path2 = Paths.get("");

System.out.println("Path1 resolve path2: " + path1.resolve(path2));
System.out.println("Path2 resolve path1: " + path2.resolve(path1));
Path1 resolve path2: a
Path2 resolve path1: a
```

#### Documentation
```
/**
 * Resolve the given path against this path.
 * If the other parameter is an absolute path then this method trivially returns other. 
 * If other is an empty path then this method trivially returns this path. Otherwise, this method considers 
 * this path to be a directory and resolves the given path against this path. In the simplest case, 
 * the given path does not have a root component, in which case this method joins the given path to this 
 * path and returns a resulting path that ends with the given path. Where the given path has a root component 
 * then resolution is highly implementation dependent and therefore unspecified.
 * 
 * Params:  other – the path to resolve against this path
 * Returns: the resulting path
 * 
 * Path resolve(@NotNull Path other);
 */
```

## Relativize
This method does exactly what is sounds like - creates a relative path between two Paths.

```
Path path1 = Paths.get("a/b");
Path path2 = Paths.get("a/b/c/d");

System.out.println("Path1 relativize path2: " + path1.relativize(path2));
System.out.println("Path2 relativize path1: " + path2.relativize(path1));
Path1 relativize path2: c\d
Path2 relativize path1: ..\..
```

### Empty Path
Method works expectedly when it gets one empty path, doing what it needs to relativize them:

```
Path path1 = Paths.get("a/b");
Path path2 = Paths.get("");

System.out.println("Path1 relativize path2: " + path1.relativize(path2));
System.out.println("Path2 relativize path1: " + path2.relativize(path1));
Path1 relativize path2: ..\..
Path2 relativize path1: a\b
```
However, you have to be careful as passing an empty parameter to an absolute path will cause exception 
explained later due to mismatch of Path types.

### Method expects to get two relative Paths.
It still works if both paths are absolute:
```
Path path1 = Paths.get("/a/b");
Path path2 = Paths.get("/a/b/c/d");

System.out.println("Path1 relativize path2: " + path1.relativize(path2));
System.out.println("Path2 relativize path1: " + path2.relativize(path1));
Path1 relativize path2: c\d
Path2 relativize path1: ..\..
```

Problems start when one Path is relative and another on absolute:

```
Path path1 = Paths.get("a/b");
Path path2 = Paths.get("/a/b/c/d");

System.out.println("Path1 relativize path2: " + path1.relativize(path2));
System.out.println("Path2 relativize path1: " + path2.relativize(path1));
```
<img src="assets/images/relativize_exception.png">

Same if the original path was absolute and the paraneter relative - as the error mmessage says "other" 's Path type must match.

### Javadoc:
```
/**
 * Constructs a relative path between this path and a given path.
 * Relativization is the inverse of resolution. This method attempts to construct a relative path that when resolved against this path, yields a path that locates the same file as the given path. For example, on UNIX, if this path is "/a/b" and the given path is "/a/b/c/d" then the resulting relative path would be "c/d". Where this path and the given path do not have a root component, then a relative path can be constructed. A relative path cannot be constructed if only one of the paths have a root component. Where both paths have a root component then it is implementation dependent if a relative path can be constructed. If this path and the given path are equal then an empty path is returned.
 * 
 * For any two normalized paths p and q, where q does not have a root component,
 * p.relativize(p .resolve(q)).equals(q)
 * 
 * When symbolic links are supported, then whether the resulting path, when resolved against this path, yields a path that can be used to locate the same file as other is implementation dependent. For example, if this path is "/a/b" and the given path is "/a/x" then the resulting relative path may be "../x". If "b" is a symbolic link then is implementation dependent if "a/b/../x" would locate the same file as "/a/x".
 * 
 * Params: other – the path to relativize against this path
 * Returns: the resulting relative path, or an empty path if both paths are equal
 * Throws: IllegalArgumentException – if other is not a Path that can be relativized against this path
 * 
 * Path relativize(Path other);
 */
```
Hope this was helpful :)
