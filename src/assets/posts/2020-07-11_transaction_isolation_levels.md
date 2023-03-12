# Transaction Isolation Levels

---

This article borrows heavily from [Oracle Database Concepts ](https://docs.oracle.com/cd/E11882_01/server.112/e40540.pdf)
because I find their explanation and examples great, feel free to use provided links to read from the original.
<img src="assets/images/isolation_levels/1.png">

Isolation Levels are there to prevent different levels of read phenomena. Let's take a look at these one by one:

## Read Phenomenas
### Dirty Read
A transaction reads data that has been written by another transaction that has not been committed yet.

> To illustrate the problem with dirty reads, suppose one transaction updates a column value without committing. 
> A second transaction reads the updated and dirty (uncommitted) value. The first session rolls back the 
> transaction so that the column has its old value, but the second transaction proceeds using the updated value, 
> corrupting the database. Dirty reads compromise data integrity, violate foreign keys, and ignore unique 
> constraints.
> 
> excerpt from Oracle Database Concepts

### Nonrepeatable read
A transaction rereads data it has previously read and finds that another committed transaction has modified or 
deleted the data. For example, a user queries a row and then later queries the same row, only to discover that 
the data has changed.

### Phantom reads
A transaction reruns a query returning a set of rows that satisfies a search
condition and finds that another committed transaction has inserted additional rows that satisfy the condition.

For example, a transaction queries the number of employees. Five minutes later it performs the same query, but 
now the number has increased by one because another user inserted a record for a new hire. More data satisfies 
the query criteria than before, but unlike in a fuzzy read the previously read data is unchanged.

## Isolation Levels
### Read committed
This is the default isolation level for Oracle and most other databases. Here every query executed by a transaction sees only data committed before the query—not the transaction—began. This level of isolation is appropriate for database environments in which few transactions are likely to conflict.

A query in a read committed transaction avoids reading data that commits while the query is in progress. For example, if a query is halfway through a scan of a million-row table, and if a different transaction commits an update to row 950,000, then the query does not see this change when it reads row 950,000. However, because the database does not prevent other transactions from modifying data read by a query, other transactions may change data between query executions. Thus, a transaction that runs the same query twice may experience fuzzy reads and phantoms.

This case scenario from Oracle Database Concepts book demonstrates Read committed well:
<img src="assets/images/isolation_levels/2.png">
<img src="assets/images/isolation_levels/3.png">

### Serializable Isolation Level
In the serialization isolation level, a transaction sees only changes committed at the time the transaction—not the query—began and changes made by the transaction itself. A serializable transaction operates in an environment that makes it appear as if no other users were modifying data in the database.

Serializable isolation is suitable for environments:

With large databases and short transactions that update only a few rows
Where the chance that two concurrent transactions will modify the same rows is relatively low
Where relatively long-running transactions are primarily read only
In serializable isolation, the read consistency normally obtained at the statement level extends to the entire transaction. Any row read by the transaction is assured to be the same when reread. Any query is guaranteed to return the same results for the duration of the transaction, so changes made by other transactions are not visible to the query regardless of how long it has been running. Serializable transactions do not experience
dirty reads, fuzzy reads, or phantom reads. Oracle Database permits a serializable transaction to modify a row only if changes to the row made by other transactions were already committed when the serializable transaction began. The database generates an error when a serializable transaction tries to update or delete data changed by a different transaction that committed after the serializable transaction began.
<img src="assets/images/isolation_levels/4.png">
<img src="assets/images/isolation_levels/5.png">
<img src="assets/images/isolation_levels/6.png">
