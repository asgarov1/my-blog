# DAO Layer with Vanilla Java (no frameworks)

## Background
In this tutorial we are going to create a DAO Layer with Vanilla Java (no Spring) and we will 
test our Application by implementing a Server with Sockets and test it all with Postman. [GitHub Link](https://github.com/asgarov1/vanillaJavaDaoLayerWithServer)

### Video Version:
<iframe width="1000" height="650" 
src="https://www.youtube.com/embed/y3_GgIy6O8g?si=FK2Jfu32_cow_nEH" 
title="YouTube video player" frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

<br>

### 1. Database setup
First of all we will create a `schema.sql` in our `src/main/resources` folder:

```sql
-- Order of table creation is important!
-- Referenced tables have to be created first

CREATE TABLE IF NOT EXISTS student_group(
                       group_id SERIAL PRIMARY KEY,
                       group_name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS student (
                          student_id SERIAL PRIMARY KEY,
                          group_id INT,
                          first_name VARCHAR(20) NOT NULL,
                          last_name VARCHAR(20) NOT NULL,
                          FOREIGN KEY (group_id) REFERENCES student_group (group_id)
);

CREATE TABLE IF NOT EXISTS course(
                        course_id SERIAL PRIMARY KEY,
                        course_name VARCHAR(30) NOT NULL,
                        course_description VARCHAR(200) NOT NULL
);

create table IF NOT EXISTS student_course
(
    student_course_id SERIAL PRIMARY KEY,
    student_id INT,
    course_id INT,
    CONSTRAINT FK_student FOREIGN KEY (student_id) REFERENCES student (student_id) ON DELETE CASCADE,
    CONSTRAINT FK_course FOREIGN KEY (course_id) REFERENCES course (course_id) ON DELETE CASCADE
);
```

Once we have that covered we create a `Dockerfile` in the root folder of our project:

```dockerfile
FROM postgres
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD admin
ENV POSTGRES_DB daodb

COPY src/main/resources/schema.sql /docker-entrypoint-initdb.d/
```
As you can see, in the Dockerfile we will be creating an image from `postgres` and 
we set username, password and db name using environment variables. Also the script
will copy our previously created `schema.sql` inside of container where it will get executed
automatically at database startup.

We then start our container with the following command:
`docker build -t dao-db . && docker run -d -p 5432:5432 dao-db`

After that we can connect to our database (for example with Intellij) and see that our
tables have been created.


### 2. Domain layer
Next we need to create the domain classes:

```java
public class Course {
  private Integer id;
  private String name;
  private String description;
  // getters and setters
}
```

```java
public class Student {
    private Integer studentId;
    private Integer groupId;
    private String firstName;
    private String lastName;
  // getters and setters
}
```
```java
public class StudentCourse {
  private Integer studentCourseId;
  private Integer studentId;
  private Integer courseId;
  // getters and setters
}
```
```java
public class StudentGroup {
  private Integer id;
  private String name;
  // getters and setters
}
```

### 3. DAO layer
No we can get to the fun part, namely creating our own DAO Layer. We start by defining a GenericDao class.

We will be using a template design pattern here, which saves us bunch of time,
