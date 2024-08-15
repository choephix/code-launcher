const templates = [
  {
    name: 'Empty Project',
    icon: 'https://simpleicons.org/icons/git.svg',
    command:
      'mkdir -p ~/workspace/{folderName} && cd ~/workspace/{folderName} && git init && code .',
  },
  {
    name: 'Next.js App',
    icon: 'https://simpleicons.org/icons/nextdotjs.svg',
    command: 'npx create-next-app ~/workspace/{folderName} --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-pnpm && code ~/workspace/{folderName}',
  },
  {
    name: 'Vite React + TypeScript',
    icon: 'https://simpleicons.org/icons/react.svg',
    command:
      'npm create vite@latest ~/workspace/{folderName} -- --template react-ts && cd ~/workspace/{folderName} && npm install && code .',
  },
  {
    name: 'Vite Vanilla TypeScript',
    icon: 'https://simpleicons.org/icons/vite.svg',
    command:
      'npm create vite@latest ~/workspace/{folderName} -- --template vanilla-ts && cd ~/workspace/{folderName} && npm install && code .',
  },
  {
    name: 'Turbo Monorepo',
    icon: 'https://simpleicons.org/icons/turborepo.svg',
    command:
      'npx create-turbo@latest ~/workspace/{folderName} --use-npm --no-install && cd ~/workspace/{folderName} && npm install && code .',
  },
  {
    name: 'Pixi.js Project',
    icon: 'https://simpleicons.org/icons/piapro.svg',
    command:
      'mkdir -p ~/workspace/{folderName} && cd ~/workspace/{folderName} && npm init -y && npm install pixi.js && echo "import * as PIXI from \'pixi.js\';\n\nconst app = new PIXI.Application();\ndocument.body.appendChild(app.view);" > index.js && code .',
  },
  {
    name: 'Three.js Project',
    icon: 'https://simpleicons.org/icons/threedotjs.svg',
    command:
      'mkdir -p ~/workspace/{folderName} && cd ~/workspace/{folderName} && npm init -y && npm install three && echo "import * as THREE from \'three\';\n\nconst scene = new THREE.Scene();\nconst camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\nconst renderer = new THREE.WebGLRenderer();\nrenderer.setSize(window.innerWidth, window.innerHeight);\ndocument.body.appendChild(renderer.domElement);" > index.js && code .',
  },
  {
    name: 'Astro Project',
    icon: 'https://simpleicons.org/icons/astro.svg',
    command:
      'npm create astro@latest ~/workspace/{folderName} -- --template minimal --install --no-git --typescript strictest --skip-houston && cd ~/workspace/{folderName} && code .',
  },
];

export default templates;
