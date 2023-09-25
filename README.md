# OpenWhisk-GUI

A web GUI for Apache OpenWhisk serverless platform.

https://openwhisk.apache.org/

https://github.com/apache/openwhisk

## Prerequisites

Before you begin, ensure you have met the following requirements:

- A running OpenWhisk with CouchDB
- Docker compose

## Instructions to setup and run OpenWhisk-GUI with Docker Compose

Note: may not work on certain versions of Docker Compose.
Tested and verified to work on v2.20.2.

1. Clone this repository:

   ```
   git clone https://github.com/nyctrn/openwhisk-gui.git
   ```

2. Navigate to the project directory:

   ```
   cd openwhisk-gui
   ```

3. Run docker compose which downloads and setups Keycloak and builds OpenWhisk GUI application image:
   ```
   docker compose -f docker-compose-with-gui.yml up
   ```
4. [Final steps](#final-steps)

## Instructions to setup and run OpenWhisk-GUI with Docker Compose ONLY for the Keycloak installation

### Additional prerequisites for this method

- Node.js
- yarn

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
   The application uses the default addresses, ports, usernames and passwords for OpenWhisk

5. Build Next.js application:

   ```
   yarn build
   ```

6. Run the application:

   ```
   yarn start
   ```

7. [Final steps](#final-steps)

## <a id="final-steps">Final steps</a>

- Open your browser to http://localhost:3000.
- You should see the Keycloak log in page. If you want to log in with admin rights use admin/admin, else you can use testUser/testUser or you can register a new user.
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

- Give it some time to start. After a while, CouchDB should be running in a container

  ```
  docker ps
  ```
