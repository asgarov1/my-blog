# Installing Oracle DB on your computer

---

There are 2 options:

- Using docker ( I will use Oracle Enterprise 12.2.0.1-slim)
- Installing it as a program (in this case I will use Oracle 21c Express)

## 1. Oracle with docker container

Create a Dockerfile with the following content:

```dockerfile
FROM store/oracle/database-enterprise:12.2.0.1-slim

ENV DB_SID=MYORACLE
ENV DB_PDB=MYPDB
ENV DB_MEMORY=1GB
ENV DB_PASSWD=password
```

*The file should be called Dockerfile and have no extension.*

Now just build the image from this Dockerfile and run it:

`docker build -t oracle-db . && docker run -d --name oracle-db -p 1521:1521 oracle-db`

## 2. Installing as a program

At the time of this writing you can download Oracle Database 21c Express Edition [here](https://www.oracle.com/database/technologies/xe-downloads.html). 
After that unpack it, go inside the folder and click setup.exe twice.

Once you have finished installation, open commandline, change into directory where you 
have installed the database\bin (`C:\app\USER_NAME\product\21c\dbhomeXE\bin`) and run 
following command:

`lsnrctl status`

This will present you an output, with an important line being here
<img src="assets/images/oracle/oracle_1.png">

This tells you the host (internal) ip address and port number that you will need to 
connect (more details [here](https://docs.oracle.com/en/database/oracle/oracle-database/21/xeinl/connecting-oracle-database-xeinl.html)).

Now open SQL Plus, and first connect as sysdba:
<img src="assets/images/oracle/oracle_2.png">

the select pluggable databases you have available, like so:
<img src="assets/images/oracle/oracle_3.png">

This tells you, you have XEPDB1 to connect to. Now you can use following command to 
actually connect to it:
<img src="assets/images/oracle/oracle_4.png">

Here sys is username, YOUR_PASSWORD should be replaced by the password you chose during 
installation, followed by @ip_address_of_host/database_name.

You can use similar information to connect from database management tool of your choice:
<img src="assets/images/oracle/oracle_5.png">

## Bonus: create and populate HR Schema

Download the code as zip from [here](https://github.com/oracle/db-sample-schemas#README.txt). 
You will only need the human_resources folder.

Move to the `<oracle_home>/dbhomeXE/demo/schema` and copy human_resources folder in there.

open `hr_mail.sql` in an editor and at the end of the file update the paths to the sqls as follows:

```sql
@?/demo/schema/human_resources/hr_cre.sql

-- 
-- populate tables
--

@?/demo/schema/human_resources/hr_popul.sql

--
-- create indexes
--

@?/demo/schema/human_resources/hr_idx.sql

--
-- create procedural objects
--

@?/demo/schema/human_resources/hr_code.sql

--
-- add comments to tables and columns
--

@?/demo/schema/human_resources/hr_comnt.sql

--
-- gather schema statistics
--

@?/demo/schema/human_resources/hr_analz.sql
```

open sql_plus, connect as sysdba, and run the following command:

```
@?/demo/schema/human_resources/hr_main.sql
```

You will be prompted to enter values for parameters:
<img src="assets/images/oracle/oracle_6.png">
<img src="assets/images/oracle/oracle_7.png">

That is it - your database is populated :) Now you can connect to it when starting SQL Plus directly:
<img src="assets/images/oracle/oracle_8.png">

`orclpdb1` is the name of my pluggable database that I created under `pbd$seed`. In your case, unless you also created one you are likely to still be using pbd$seed. You can list pluggable databases with the following command:
<img src="assets/images/oracle/oracle_9.png">

## Troubleshooting
### > ORA-12541: TNS:no listener

For whatever reason TNS Listener was not running after I restarted the computer. To fix that click Win + R, type services.msc and start OracleOracDB21Home1TNSListener.
<img src="assets/images/oracle/oracle_10.png">

### > ORA-01109: database not open
Sometimes you can't connect to the database because it is not open, and if you open SQL Plus and look for databases available you might find your pluggable database with status 'MOUNTED':
<img src="assets/images/oracle/oracle_11.png">

To fix that you just need to open it with the following command: 
`alter pluggable database all open;`
<img src="assets/images/oracle/oracle_12.png">

Once it changed its status to `READ WRITE` you are all good to go.

### > Automating the solution

Because you like me, might not like to do these troubleshooting steps every time you restart the computer here is a simple bat file fix.

First, create `open_dbs.sql` with the following SQL:
`alter pluggable database all open;`

then create a bat file with the following content:

```
::start the service
net start OracleOraDB21Home1TNSListener

::execute alter pluggable database command in the sql file and exit
exit | sqlplus -S sys/YOUR_PASSWORD as sysdba @C:\path\to\open_dbs.sql
```

That is all, just execute this bat whenever needed, u can also easily add a bat file 
to the windows startup task.

### > Make bat file auto-execute on startup

WIN + R and type shell:startup, paste your .bat file in that startup folder.

credits to [Milan M.](https://stackoverflow.com/questions/21218346/run-batch-file-on-start-up#:~:text=To%20run%20a%20batch%20file,drag%20shortcut%20to%20startup%20folder.&text=To%20start%20the%20batch%20file,also%20use%20a%20registry%20key.)

### > Increase UI Size
Oracle doesn't make it obvious but under Windows you need to navigate to your %AppData%/SQL Developer\system_something_\

Search for ide.properties in one of the subfolders (for me it was under o.sqldeveloper)

Open ide.properties and add `Ide.FontSize.en=15` to the bottom.
