# Project Workspace

This workspace contains two projects: a Fastify server and a Next.js application.

## Fastify Server

The Fastify server is located in the `with-fastify` directory. It serves static files, handles form submissions, and renders views using EJS templates.

### Getting Started

1. Navigate to the `with-fastify` directory:
    ```sh
    cd with-fastify
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the server:
    ```sh
    npm start
    ```

4. Open [http://localhost:1500](http://localhost:1500) in your browser to see the server running.

### Project Structure

- `server.js`: Main server file that sets up Fastify and its routes.
- `public/`: Directory for static files.
- `templates/`: Directory for EJS templates.

## Next.js Application

The Next.js application is located in the `with-nextjs` directory. It includes a development launcher component for running commands and creating project folders.

### Getting Started

1. Navigate to the `with-nextjs` directory:
    ```sh
    cd with-nextjs
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application running.

### Project Structure

- `app/`: Contains the main application files.
  - `page.tsx`: Main page component.
  - `layout.tsx`: Layout component.
  - `globals.css`: Global CSS file.
- `components/`: Contains reusable components.
  - `DevLaunch.tsx`: Component for running commands and creating project folders.
- `lib/`: Contains utility functions and libraries.
  - `templates.ts`: Template data for the `DevLaunch` component.
- `public/`: Directory for static files.
- `next.config.mjs`: Next.js configuration file.
- `tailwind.config.ts`: Tailwind CSS configuration file.
- `tsconfig.json`: TypeScript configuration file.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
