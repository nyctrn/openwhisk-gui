# OpenWhisk-GUI

A web GUI for Apache OpenWhisk serverless platform.

https://openwhisk.apache.org/

https://github.com/apache/openwhisk

## Prerequisites

Before you begin, ensure you have met the following requirements:

- A running OpenWhisk with CouchDB
- Docker compose
- Node.js
- yarn

## Instructions to setup and run OpenWhisk-GUI

1. Clone this repository:

   ```
   git clone https://github.com/nyctrn/openwhisk-gui.git
   ```

2. Navigate to the project directory:

   ```
   cd openwhisk-gui
   ```

3. Run docker compose which downloads and setups Keycloak:
   ```
   docker compose up
   ```
4. Install application's dependencies with yarn:

   ```
   yarn
   ```

   Before the next step, update the env variables if needed.
   The application uses the default addresses, ports, usernames and password for OpenWhisk

5. Build Next.js application:

   ```
   yarn build
   ```

6. Run the application:
   ```
   yarn start
   ```

Then:

- Open your browser to http://localhost:3000 .
- You should see the Keycloak loging page. If you want to log in with admin rights use admin/admin, else you can use testUser/testUser or you can register a new user.
- You should have access to the application.

## OpenWhisk installation

If you need to run OpenWhisk in your machine:

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Docker
- NPM

1. Clone this repository:

   ```
   git clone https://github.com/apache/openwhisk.git
   ```

2. Navigate to the project directory:

   ```
   cd openwhisk
   ```

3. Start OpenWhisk:

   ```
   ./gradlew core:standalone:bootRun --args='--couchdb'
   ```

Give it some time to start. After a CouchDB should be running in a container

```
docker ps
```
