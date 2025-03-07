# Task Manager

A task management web application built with React, TypeScript, and Vite.

## Features

- Task creation, editing, and deletion
- User authentication with Google OAuth
- Notifications using Notistack
- Date selection with MUI Date Pickers

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [Git](https://git-scm.com/)

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/task-manager.git
cd task-manager
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure API Base URL (if running backend locally)

If you're running the backend locally, update the `API_BASE_URL` in: `src/config.ts`

``` export const API_BASE_URL = 'http://localhost:port_number'; ```

Replace `port_number` with the backend server's port number.

### 4. Start the Development Server

```sh
npm run dev
```

This will start the Vite development server. Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

### 5. Build for Production

```sh
npm run build
```

### 6. Preview the Production Build

```sh
npm run preview
```

## Linting

To check for linting issues, run:

```sh
npm run lint
```

## Contributing

If you want to contribute, fork the repository and submit a pull request.

## License

Copyright (c) 2025 [Deepraj Sarkar]
