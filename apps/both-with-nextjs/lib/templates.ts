const templates = [
  {
    name: 'Empty Project',
    icon: 'https://simpleicons.org/icons/git.svg',
    command:
      'mkdir -p ~/workspace/{folderName} && cd ~/workspace/{folderName} && git init',
  },
  {
    name: 'Next.js App',
    icon: 'https://simpleicons.org/icons/nextdotjs.svg',
    command:
      'npx create-next-app ~/workspace/{folderName} --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-pnpm',
  },
  {
    name: 'Vite React + TypeScript',
    icon: 'https://simpleicons.org/icons/react.svg',
    command:
      'npm create vite@latest ~/workspace/{folderName} -- --template react-ts && cd ~/workspace/{folderName} && npm install',
  },
  {
    name: 'Vite Vanilla TypeScript',
    icon: 'https://simpleicons.org/icons/vite.svg',
    command:
      'npm create vite@latest ~/workspace/{folderName} -- --template vanilla-ts && cd ~/workspace/{folderName} && npm install',
  },
  {
    name: 'Turbo Monorepo',
    icon: 'https://simpleicons.org/icons/turborepo.svg',
    command:
      'npx create-turbo@latest ~/workspace/{folderName} --use-npm --no-install && cd ~/workspace/{folderName} && npm install',
  },
  {
    name: 'Pixi.js Project',
    icon: 'https://simpleicons.org/icons/piapro.svg',
    command:
      'mkdir -p ~/workspace/{folderName} && cd ~/workspace/{folderName} && npm init -y && npm install pixi.js && echo "import * as PIXI from \'pixi.js\';\n\nconst app = new PIXI.Application();\ndocument.body.appendChild(app.view);" > index.js',
  },
  {
    name: 'Three.js Project',
    icon: 'https://simpleicons.org/icons/threedotjs.svg',
    command:
      'mkdir -p ~/workspace/{folderName} && cd ~/workspace/{folderName} && npm init -y && npm install three && echo "import * as THREE from \'three\';\n\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer();\nrenderer.setSize(window.innerWidth, window.innerHeight);\ndocument.body.appendChild(renderer.domElement);" > index.js',
  },
  {
    name: 'Astro Project',
    icon: 'https://simpleicons.org/icons/astro.svg',
    command:
      'npm create astro@latest ~/workspace/{folderName} -- --template minimal --install --no-git --typescript strictest --skip-houston',
  },
  {
    name: 'Express + TypeScript',
    icon: 'https://simpleicons.org/icons/express.svg',
    command:
      "mkdir -p ~/workspace/{folderName} && cd ~/workspace/{folderName} && npm init -y && npm install express @types/express typescript ts-node @types/node && npx tsc --init && echo \"import express from 'express';\n\nconst app = express();\nconst port = 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(port, () => {\n  console.log(`Server running at http://localhost:${port}`);\n});\" > src/index.ts",
  },
  {
    name: 'Elysia App',
    icon: 'https://simpleicons.org/icons/bun.svg',
    command:
      "mkdir -p ~/workspace/{folderName} && cd ~/workspace/{folderName} && bun init -y && bun add elysia && echo \"import { Elysia } from 'elysia';\n\nconst app = new Elysia().get('/', () => 'Hello Elysia').listen(3000);\n\nconsole.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);\" > src/index.ts",
  },
  {
    name: 'v0 Powered App',
    icon: "data:image/svg+xml,%3Csvg fill='currentColor' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' class='size-10'%3E%3Cpath d='M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z'%3E%3C/path%3E%3Cpath d='M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z'%3E%3C/path%3E%3C/svg%3E",
    command:
      'pnpm create next-app@latest --typescript --tailwind --eslint --import-alias "@/*" --use-pnpm ~/workspace/{folderName} && pnpm dlx v0@latest init',
  },
  {
    name: 'Astro Blog',
    icon: 'https://simpleicons.org/icons/astro.svg',
    command:
      'npm create astro@latest ~/workspace/{folderName} -- --template blog --install --no-git --typescript strictest --skip-houston',
  },
];

export default templates;