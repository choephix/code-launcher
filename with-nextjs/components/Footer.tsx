'use client';

import { useStore } from '@/lib/store';
import { Github, Heart, Twitter, MessageCircle, Coffee, Star } from 'lucide-react';

export default function Footer() {
  const { stats } = useStore();

  return (
    <footer className='mt-8 mb-8 pt-4 border-t border-gray-700'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-wrap items-center justify-center text-xs text-gray-400'>
          <div className='flex items-center mr-4'>
            <div className='w-20 bg-gray-700 rounded-full h-2 mr-2'>
              <div
                className='bg-blue-500 h-2 rounded-full'
                style={{ width: `${stats.cpuUsage}%` }}
              ></div>
            </div>
            <span>CPU {~~stats.cpuUsage}%</span>
          </div>
          <div className='flex items-center'>
            <div className='w-20 bg-gray-700 rounded-full h-2 mr-2'>
              <div
                className='bg-green-500 h-2 rounded-full'
                style={{ width: `${stats.memUsage}%` }}
              ></div>
            </div>
            <span>MEM {~~stats.memUsage}%</span>
          </div>

          <span className='mx-2'>|</span>

          <span className='flex items-center'>
            Made with <Heart className='text-red-500 mx-1 w-4 h-4' /> by{' '}
            <a
              href='https://github.com/choephix'
              className='ml-1 hover:text-blue-400 transition-colors duration-300'
              target='_blank'
              rel='noopener noreferrer'
            >
              <b>choephix</b>
            </a>
            <span className='mx-2'>|</span>
            <a
              href='https://github.com/choephix/code-launcher/stargazers'
              className='flex items-center hover:text-blue-400 transition-colors duration-300'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Github className='mr-1 w-4 h-4' /> Star on GitHub
            </a>
          </span>

          {/* Additional options (uncomment or modify as needed) */}
          {/* <span className='mx-2'>|</span>
          <a href='https://twitter.com/yourusername' className='flex items-center hover:text-blue-400 transition-colors duration-300' target='_blank' rel='noopener noreferrer'>
            <Twitter className='mr-1 w-4 h-4' /> Twitter
          </a> */}
          {/* <span className='mx-2'>|</span>
          <a href='https://discord.gg/yourinvite' className='flex items-center hover:text-blue-400 transition-colors duration-300' target='_blank' rel='noopener noreferrer'>
            <MessageCircle className='mr-1 w-4 h-4' /> Discord
          </a> */}
          {/* <span className='mx-2'>|</span>
          <a href='https://www.buymeacoffee.com/yourusername' className='flex items-center hover:text-blue-400 transition-colors duration-300' target='_blank' rel='noopener noreferrer'>
            <Coffee className='mr-1 w-4 h-4' /> Buy me a coffee
          </a> */}
          {/* <span className='mx-2'>|</span>
          <a
            href='https://github.com/choephix/code-launcher/stargazers'
            className='flex items-center hover:text-blue-400 transition-colors duration-300'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Star className='mr-1 w-4 h-4' /> Star on GitHub
          </a> */}
          {/* <span className='mx-2'>|</span>
          <span>v1.0.0</span> */}
        </div>
      </div>
    </footer>
  );
}
