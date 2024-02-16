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


### 3. Domain layer
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

### 2. Util classes
Since we will be connecting to DB, it is a good idea to put all the DB relevant properties and such into a 
properties file. We create a `application.properties` file:

```
datasource.url=jdbc:postgresql://localhost:5432/daodb
datasource.username=admin
datasource.password=admin

server.port=8080
```

and then create an util class that will read from it:

```java
public class PropertiesReader {

    private static final String DEFAULT_PROPERTIES_FILE = "application.properties";

    /**
     * Method to read specified properties file
     *
     * @param fileName is the file that will be looked for
     * @return Properties
     */
    public static Properties getProperties(String fileName) {
        try (InputStream input = PropertiesReader.class.getClassLoader().getResourceAsStream(fileName)) {
            Properties properties = new Properties();
            properties.load(input);
            return properties;
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    /**
     * Convenience method to read default properties file if no other file name was specified
     *
     * @return Properties
     */
    public static Properties getProperties() {
        return getProperties(DEFAULT_PROPERTIES_FILE);
    }

    /**
     * Convenience method to read a property value by key
     * from the default properties file
     *
     * @return Properties
     */
    public static String getProperty(String propertyKey) {
        return getProperties().getProperty(propertyKey);
    }
}
```

This class by default reads properties from `application.properties`, and allows retrieving a single property by key.

Then we also create a DB Connection Util:

```java
public class ConnectionFactory {
    private static final String CONNECTION_URL = PropertiesReader.getProperty("datasource.url");
    private static final String USERNAME = PropertiesReader.getProperty("datasource.username");
    private static final String PASSWORD = PropertiesReader.getProperty("datasource.password");

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(CONNECTION_URL, USERNAME, PASSWORD);
    }
}
```

### 3. DAO layer
No we can get to the fun part, namely creating our own DAO Layer. We start by defining a GenericDao class.

We will be using a [template design pattern](https://en.wikipedia.org/wiki/Template_method_pattern) here, 
which saves us bunch of time, by implementing all the logic in `AbstractDao` class, and only implementing the differing
(entity specific) parts in the child classes.

We first create an exception that we will be using:

```java
public class DaoException extends RuntimeException {
    public DaoException(String message, Throwable cause) {
        super(message, cause);
    }

    public DaoException(String message) {
        super(message);
    }
}
```

We then create a `GenericDao` interface:

```java
public interface GenericDao<T, K> {

    T create(T object) throws DaoException;

    T read(K id) throws DaoException;

    void update(T object) throws DaoException;

    void delete(K id) throws DaoException;

    void setId(T object, K id);
}
```

Following that we create the abstract class that implements it and contains all the boilerplate:

```java
public abstract class AbstractDao<T, K> implements GenericDao<T, K> {

    private static final int UPDATE_EXECUTED_SUCCESSFULLY = 1;
    public static final String COULD_NOT_FIND_AN_OBJECT_WITH_SUCH_ID = "Couldn't find an object with such ID!";

    // CRUD Queries
    protected abstract String getCreateQuery(T object);

    protected abstract String getSelectByIdQuery();

    protected abstract String getUpdateQuery();

    protected abstract String getDeleteQuery();


    /**
     * Setting id into a prepared statement
     */
    protected abstract void setIdIntoStatement(PreparedStatement preparedStatement, K id)
            throws DaoException;

    protected abstract void setObjectIntoStatement(PreparedStatement preparedStatement, T object)
            throws DaoException;

    protected abstract T readObject(ResultSet resultSet) throws DaoException;


    @Override
    public T create(T object) throws DaoException {
        String createQuery = getCreateQuery(object);
        try (Connection connection = ConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(createQuery, Statement.RETURN_GENERATED_KEYS)) {

            setObjectIntoStatement(statement, object);
            statement.executeUpdate();
            try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    setId(object, (K) generatedKeys.getObject(1));
                } else {
                    throw new SQLException("Problem with creating the object!");
                }
            }
            return object;
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    @Override
    public T read(K id) throws DaoException {
        String selectByIdQuery = getSelectByIdQuery();
        try (Connection connection = ConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(selectByIdQuery)) {

            setIdIntoStatement(statement, id);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                return readObject(resultSet);
            } else {
                throw new DaoException(COULD_NOT_FIND_AN_OBJECT_WITH_SUCH_ID);
            }
        } catch (SQLException e) {
            throw new DaoException(e.getMessage());
        }
    }

    @Override
    public void update(T object) throws DaoException {
        String updateQuery = getUpdateQuery();

        try (Connection connection = ConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(updateQuery)) {

            setObjectIntoStatement(statement, object);

            if (statement.executeUpdate() < UPDATE_EXECUTED_SUCCESSFULLY) {
                throw new DaoException("Problem with updating the object!");
            }
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    @Override
    public void delete(K id) throws DaoException {
        String deleteQuery = getDeleteQuery();

        try (Connection connection = ConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(deleteQuery)) {

            setIdIntoStatement(statement, id);
            if (statement.executeUpdate() < UPDATE_EXECUTED_SUCCESSFULLY) {
                throw new DaoException("Problem with deleting the object!");
            }

        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }
}
```

And after that we just need to create the Implementation classes:

#### CourseDao.java
```java
public class CourseDao extends AbstractDao<Course, Integer> {


    @Override
    protected String getCreateQuery(Course course) {
        return "INSERT INTO course (course_name, course_description) VALUES (?,?);";
    }

    @Override
    protected String getSelectByIdQuery() {
        return "SELECT * FROM course WHERE course_id = ?;";
    }

    @Override
    protected String getUpdateQuery() {
        return "UPDATE course SET course_name = ?, course_description = ? WHERE course_id = ?;";
    }

    @Override
    protected String getDeleteQuery() {
        return "DELETE FROM course WHERE course_id = ?;";
    }

    @Override
    protected void setIdIntoStatement(PreparedStatement statement, Integer id) throws DaoException {
        try {
            statement.setInt(1, id);
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    @Override
    protected void setObjectIntoStatement(PreparedStatement statement, Course course) throws DaoException {
        try {
            if (course.getId() != 0) {
                statement.setString(1, course.getName());
                statement.setString(2, course.getDescription());
                statement.setLong(3, course.getId());
            } else {
                statement.setString(1, course.getName());
                statement.setString(2, course.getDescription());
            }
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    @Override
    protected Course readObject(ResultSet resultSet) throws DaoException {
        Course course = new Course();
        try {
            course.setId(resultSet.getInt("course_id"));
            course.setName(resultSet.getString("course_name"));
            course.setDescription(resultSet.getString("course_description"));
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
        return course;
    }

    @Override
    public void setId(Course course, Integer id) {
        course.setId(id);
    }
}
```

#### StudentCourseDao.java
```java
public class StudentCourseDao  extends AbstractDao<StudentCourse, Integer> {

    @Override
    protected String getCreateQuery(StudentCourse course) {
        return "INSERT INTO student_course (student_id, course_id) VALUES (?,?);";
    }

    @Override
    protected String getSelectByIdQuery() {
        return "SELECT * FROM student_course WHERE student_course_id = ?;";
    }

    @Override
    protected String getUpdateQuery() {
        return "UPDATE student_course SET student_id = ?, course_id = ? WHERE student_course_id = ?;";
    }

    @Override
    protected String getDeleteQuery() {
        return "DELETE FROM student_course WHERE student_course_id = ?;";
    }

    @Override
    protected void setIdIntoStatement(PreparedStatement statement, Integer studentCourseId) throws DaoException {
        try {
            statement.setInt(1, studentCourseId);
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    @Override
    protected void setObjectIntoStatement(PreparedStatement statement, StudentCourse studentCourse) throws DaoException {
        try {
            if (studentCourse.getStudentCourseId() != 0) {
                // update use case
                statement.setInt(1, studentCourse.getStudentId());
                statement.setInt(2, studentCourse.getCourseId());
                statement.setInt(3, studentCourse.getStudentCourseId());
            } else {
                // create use case
                statement.setInt(1, studentCourse.getStudentId());
                statement.setInt(2, studentCourse.getCourseId());
            }
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    @Override
    protected StudentCourse readObject(ResultSet resultSet) throws DaoException {
        StudentCourse studentCourse = new StudentCourse();
        try {
            studentCourse.setStudentCourseId(resultSet.getInt("student_course_id"));
            studentCourse.setStudentId(resultSet.getInt("student_id"));
            studentCourse.setCourseId(resultSet.getInt("course_id"));
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
        return studentCourse;
    }

    @Override
    public void setId(StudentCourse object, Integer id) {
        object.setStudentCourseId(id);
    }

    public List<StudentCourse> findAllByStudentId(Integer studentId) throws DaoException {
        List<StudentCourse> studentCourses = new ArrayList<>();
        try (Connection connection = ConnectionFactory.getConnection();
             Statement statement = connection.createStatement()) {

            String query = "SELECT * FROM student_course WHERE student_id = " + studentId + ";";
            ResultSet resultSet = statement.executeQuery(query);

            while (resultSet.next()) {
                int course_id = resultSet.getInt("course_id");
                int studentCourseId = resultSet.getInt("student_course_id");
                studentCourses.add(new StudentCourse(studentCourseId, studentId, course_id));
            }
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
        return studentCourses;
    }
}
```

#### StudentDao.java
```java
public class StudentDao extends AbstractDao<Student, Integer> {

    @Override
    protected String getCreateQuery(Student student) {
        return "INSERT INTO student (group_id, first_name, last_name) VALUES (?,?,?);";
    }

    @Override
    protected String getUpdateQuery() {
        return "UPDATE student SET group_id = ?, first_name = ?, last_name = ? WHERE student_id = ?;";
    }

    @Override
    protected String getSelectByIdQuery() {
        return "SELECT * FROM student WHERE student_id = ?;";
    }

    @Override
    protected String getDeleteQuery() {
        return "DELETE FROM student WHERE student_id = ?";
    }

    @Override
    protected void setIdIntoStatement(PreparedStatement statement, Integer id) throws DaoException {
        try {
            statement.setInt(1, id);
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    @Override
    protected void setObjectIntoStatement(PreparedStatement statement, Student student) throws DaoException {
        try {
            if (student.getStudentId() != null) {
                // update statement
                statement.setObject(1, student.getGroupId());
                statement.setString(2, student.getFirstName());
                statement.setString(3, student.getLastName());
                statement.setInt(4, student.getStudentId());
            } else {
                // create statement (id will be generated in the database)
                statement.setObject(1, student.getGroupId());
                statement.setString(2, student.getFirstName());
                statement.setString(3, student.getLastName());
            }
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    @Override
    protected Student readObject(ResultSet resultSet) throws DaoException {
        Student student = new Student();
        try {
            student.setStudentId(resultSet.getInt("student_id"));
            student.setGroupId(resultSet.getInt("group_id"));
            student.setFirstName(resultSet.getString("first_name"));
            student.setLastName(resultSet.getString("last_name"));
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
        return student;
    }

    @Override
    public void setId(Student student, Integer id) {
        student.setStudentId(id);
    }
}
```

and last but not least:

#### StudentGroupDao.java
```java
public class StudentGroupDao extends AbstractDao<StudentGroup, Integer> {

    @Override
    protected String getCreateQuery(StudentGroup group) {
        return "INSERT INTO student_group (group_name) VALUES (?);";
    }

    @Override
    protected String getSelectByIdQuery() {
        return "SELECT * FROM student_group WHERE group_id = ?;";
    }

    @Override
    protected String getUpdateQuery() {
        return "UPDATE groups SET student_group = ? WHERE group_id = ?;";
    }

    @Override
    protected String getDeleteQuery() {
        return "DELETE FROM student_group WHERE group_id = ?";
    }

    @Override
    protected void setIdIntoStatement(PreparedStatement statement, Integer id) throws DaoException {
        try {
            statement.setInt(1, id);
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    @Override
    protected void setObjectIntoStatement(PreparedStatement statement, StudentGroup group) throws DaoException {
        try {
            if (group.getId() != 0) {
                statement.setString(1, group.getName());
                statement.setLong(2, group.getId());
            } else {
                statement.setString(1, group.getName());
            }
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
    }

    @Override
    protected StudentGroup readObject(ResultSet resultSet) throws DaoException {
        StudentGroup group = new StudentGroup();
        try {
            group.setId(resultSet.getInt("group_id"));
            group.setName(resultSet.getString("group_name"));
        } catch (SQLException e) {
            throw new DaoException(e.getMessage(), e);
        }
        return group;
    }

    @Override
    public void setId(StudentGroup object, Integer id) {
        object.setId(id);
    }
}
```

That is all we need for the DAO layer, in the project I also
implemented the server to be able to call the DAO layer via
http requests, so if you are interested check out the [GitHub Link](https://github.com/asgarov1/vanillaJavaDaoLayerWithServer)
or the [youtube video](https://www.youtube.com/watch?v=y3_GgIy6O8g)
