# Microstream vs Spring Data Jpa

---

So [MicroStream](https://microstream.one/) is pretty interesting library which provides 
an alternative to traditional persistence by simply ignoring the ORM aspect of persistence 
and directly writing bytecode into database or file. The result is that it is much faster.

I created a simple [demo app](https://github.com/asgarov1/microstream-demo) to compare 
the execution times of the two with the same Postgres DB instance and results were as following:
- Microstream persists 1000 entities on average in around 251ms (can be repeated by running 
[MicroStreamWriterService](https://github.com/asgarov1/microstream-demo/blob/master/src/main/java/com/asgarov/microstream/MicroStreamWriterService.java) class)
- Spring Boot Data for the same 1000 entities takes about 4853ms on average 
(can be repeated by running [SpringBootApp](https://github.com/asgarov1/microstream-demo/blob/master/src/main/java/com/asgarov/JpaApp.java))

<img src="assets/images/microstream/microstream_1.png">

I ran the methods 13 times to get the average and eliminated the first 3 runs from results 
counting those as warmup. And of course these results will likely differ on your machine, 
but it already shows the dynamic. Microstream is about 20 times faster for this huge 
dataset of 1000 generated entities.

This of course comes at a price, following are the disadvantages:

- You can't visually inspect the data from database with MicroStream because it is this 
fast by persisting bytecode directly into DB so your table consists of just byte arrays:

  <img src="assets/images/microstream/microstream_2.png">
- And secondly you end up loading this whole data back into memory when starting 
the application. Of course, it is possible to configure microstream to [load parts of 
data lazily](https://foojay.io/today/microstream-part-3-storing-data/#:~:text=When%20you%20have%20a%20very,it%20afterward%20from%20the%20memory.) as needed but per default it loads everything.

With smaller dataset MicroStream starts to lose its advantage to Spring Data JPA.

### 500 entities
  <img src="assets/images/microstream/microstream_3.png">

### 100 entities
  <img src="assets/images/microstream/microstream_4.png">

### 10 entities
  <img src="assets/images/microstream/microstream_5.png">

### 1 entities
  <img src="assets/images/microstream/microstream_6.png">

So Microstream is fantastic for larger datasets and has no advantage for smaller ones, 
even taking longer when only 1 entity needs to be saved.

### Disk usage
Another interesting thing was which is more efficient with disk usage. For 1000 entities, 
MicroStream, marked with blue, created 2 tables (one for type definitions and another one 
for data byte arrays) that amounted to 1088 kB whereas JPA also created 2 Tables (one for 
each entity used) and used 1080 kB. So in end effect both have very similar disk usage.

  <img src="assets/images/microstream/microstream_7.png">

SQL used to find out disk usage per table is as follows ([original resource](https://wiki.postgresql.org/wiki/Disk_Usage))

```sql
WITH RECURSIVE pg_inherit(inhrelid, inhparent) AS
    (select inhrelid, inhparent
    FROM pg_inherits
    UNION
    SELECT child.inhrelid, parent.inhparent
    FROM pg_inherit child, pg_inherits parent
    WHERE child.inhparent = parent.inhrelid),
pg_inherit_short AS (SELECT * FROM pg_inherit WHERE inhparent NOT IN (SELECT inhrelid FROM pg_inherit))
SELECT table_schema
    , TABLE_NAME
    , row_estimate
    , pg_size_pretty(total_bytes) AS total
    , pg_size_pretty(index_bytes) AS INDEX
    , pg_size_pretty(toast_bytes) AS toast
    , pg_size_pretty(table_bytes) AS TABLE
    , total_bytes::float8 / sum(total_bytes) OVER () AS total_size_share
  FROM (
    SELECT *, total_bytes-index_bytes-COALESCE(toast_bytes,0) AS table_bytes
    FROM (
         SELECT c.oid
              , nspname AS table_schema
              , relname AS TABLE_NAME
              , SUM(c.reltuples) OVER (partition BY parent) AS row_estimate
              , SUM(pg_total_relation_size(c.oid)) OVER (partition BY parent) AS total_bytes
              , SUM(pg_indexes_size(c.oid)) OVER (partition BY parent) AS index_bytes
              , SUM(pg_total_relation_size(reltoastrelid)) OVER (partition BY parent) AS toast_bytes
              , parent
          FROM (
                SELECT pg_class.oid
                    , reltuples
                    , relname
                    , relnamespace
                    , pg_class.reltoastrelid
                    , COALESCE(inhparent, pg_class.oid) parent
                FROM pg_class
                    LEFT JOIN pg_inherit_short ON inhrelid = oid
                WHERE relkind IN ('r', 'p')
             ) c
             LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
  ) a
  WHERE oid = parent
) a
ORDER BY total_bytes DESC;
```
