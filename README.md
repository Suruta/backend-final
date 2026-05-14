# TODO
I have `amount` column in order and payment.

Fix: users and admin's logic.
Need to add 10 entities to every table

## General commands
Project Initialization
```
npm init -y
npm install express
```
Prisma CLI (command line tool)
```
npm install prisma@6 --save-dev

```
Prisma Client (for your code to use)
```
npm install @prisma/client@6
```
Dotenv for environment variables
```
npm install dotenv
```
Initialize prisma
```
npx prisma init
```
Migration prisma
```
npx prisma migrate dev --name <give a name>
```

```
create database <database name>;
create user <username> with encrypted password '<your password>';
grant all privileges on database <db name> to <usr name>;
alter database <db name> owner to <username>;
```
Grant permission createdb(postgresql)
```
alter role <username> with createdb;
```
Grant permission schema public(postgresql)
```
grant all privileges on schema public to <username>
```
How to drop a user with full privileges
```
reassign owned by <target user> to <trusted user>
drop owned by <target user>
```
