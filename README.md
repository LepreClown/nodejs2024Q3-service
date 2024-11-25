# Home Library Service
A NestJS RESTful API service for managing a personal music library.

## Project Structure

The application is organized into the following main folders:

- **controllers/**: Defines HTTP request handlers and routing.
- **dto/**: Data Transfer Objects for request validation and data structure.
- **modules/**: NestJS module definitions and configurations.
- **services/**: Implements business logic and data handling.
- **types/**: TypeScript interfaces and types for structured data.

This modular structure helps maintain clean, organized, and scalable code.
## Downloading

```
git clone {repository URL}
```
## Change branch

```
git checkout develop-part-3
```

## Installing NPM modules

```
npm install
```
## Create .env variables with .env.example content

```
PORT=4000
```

## Running application

```
npm start
```

```
npm run test:auth
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
