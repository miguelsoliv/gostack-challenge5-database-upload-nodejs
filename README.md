## [Banco de dados e upload de arquivos no Node.js](https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/desafio-database-upload)

### Cheatsheet

* Install dependencies: `yarn` | `npm i`
* Run your tests: `yarn test` | `npm test`
* Run development server: `yarn dev:server` | `npm run dev:server`
* Using TypeORM CLI with TypeScript: `yarn typeorm`

### Before testing

* Create `gostack_desafio06` and `gostack_desafio06_tests` databases

### Docker

* Check if your 5432 port is not currently being used:
```
Windows + R
resmon.exe
"Listening Ports"
```
* `docker run --name gostack_postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres` or `-p 5433:5432` if your port is not available
* List active containers: `docker ps`
* List all containers: `docker ps -a`
* Show logs from container: `docker logs container_id`
* Start container: `docker start container_id`
* Stop container: `docker stop container_id`

### DBeaver

* New connection -> PostgreSQL
* Connection settings:
1. Main:
```
Host: localhost or 192.168.99.100 if you're using Docker Toolbox
Port: 5432
Database: postgres
Username: postgres
Password: docker
```

2. PostgreSQL:
```
[x] Show all databases
```

### TypeORM

* Create migration: `yarn typeorm migration:create -n CreateMigrationName`
* Run migrations: `yarn typeorm migration:run`
* Undo last migration: `yarn typeorm migration:revert`
* List executed migrations: `yarn typeorm migration:show` (error will pop out if no migration has been executed)

### Remember

* To use decorators (like @Entity), go to `tsconfig.json`:
```
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
```

* Other settings:
1. `tsconfig.json`:
```
"strictPropertyInitialization": false,
```
2. `.eslintrc.json`:
```
"rules": {
  ...
  "class-methods-use-this": "off",
  "@typescript-eslint/camelcase": "off",
  ...
  "@typescript-eslint/no-unused-vars": ["error", {
    "argsIgnorePattern": "_"
  }],
```
