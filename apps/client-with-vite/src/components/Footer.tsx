import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-8 mb-8 pt-4 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center text-xs text-gray-400">
          <span className="flex items-center">
            Made with <Heart className="text-red-500 mx-1 w-4 h-4" /> by{' '}
            <a
              href="https://github.com/choephix"
              className="ml-1 hover:text-blue-400 transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>choephix</b>
            </a>
            <span className="mx-2">|</span>
            <a
              href="https://github.com/choephix/code-launcher/stargazers"
              className="flex items-center hover:text-blue-400 transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-1 w-4 h-4" /> Star on GitHub
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
