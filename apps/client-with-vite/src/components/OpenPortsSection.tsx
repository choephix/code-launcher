import React, { useEffect, useState } from 'react';
import { ExternalLinkIcon } from 'lucide-react';
import { apiService } from '../lib/apiService';

interface PortInfo {
  port: number;
  contentType: string;
  status: number;
  title: string | null;
}

function OpenPorts() {
  const [openPorts, setOpenPorts] = useState<PortInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpenPorts = async () => {
      try {
        console.log('🔍 Scanning ports...');
        const ports = await apiService.findOpenPorts();
        const filteredPorts = ports.filter(port => port.status >= 200 && port.status < 300);
        setOpenPorts(filteredPorts);
        console.log(`✅ Found ${filteredPorts.length} open ports with 2xx status`);
      } catch (error) {
        console.error('❌ Error scanning ports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenPorts();
  }, []);

  const getPortUrl = (port: number) => {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:${port}`;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <div className="flex items-center py-1 px-2">
              <span className="text-xs text-gray-600">Scanning open ports...</span>
            </div>
          ) : openPorts.length > 0 ? (
            openPorts.map((port, index) => (
              <a
                key={port.port}
                href={getPortUrl(port.port)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1 bg-gray-800 text-gray-300 rounded-full text-xs hover:bg-gray-700 transition-colors duration-200 cursor-pointer animate-pop-in opacity-0 no-underline"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'forwards',
                }}
                title={`${port.contentType} (Status: ${port.status})`}
              >
                {port.title && <span>{port.title}</span>}
                &nbsp;&nbsp;&nbsp;
                <span className="font-bold">{port.port}</span>
                <ExternalLinkIcon size={10} className="inline ml-2 mb-1" />
              </a>
            ))
          ) : (
            <span className="text-gray-500 text-xs py-1 px-2">No open ports found</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default OpenPorts;
