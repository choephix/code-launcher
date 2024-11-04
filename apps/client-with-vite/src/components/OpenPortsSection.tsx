import { useEffect, useState } from 'react';
import { apiService } from '../lib/apiService';
import { EarthIcon } from 'lucide-react';

interface PortInfo {
  port: number;
  contentType: string;
  status: number;
  title: string | null;
  favicon: string | null;
}

const resolveFaviconUrl = (port: number) => {
  const { protocol, hostname, port: clientPort } = window.location;
  return `${protocol}//${hostname}:${clientPort}/api/proxy-favicon/${port}`;
};

const PortIcon = ({ port, title }: { port: number; title: string | null }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <EarthIcon className="w-6 h-6" />;
  }

  return (
    <img
      src={resolveFaviconUrl(port)}
      alt={`Favicon for ${title || `port ${port}`}`}
      className="
      w-6 h-6 object-contain filter transition-all duration-500
      group-hover:brightness-200 group-hover:saturate-200 group-hover:contrast-75"
      onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.warn('❌ Error loading favicon for port', port, event);
        setHasError(true);
      }}
    />
  );
};

function OpenPortsSection() {
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

  if (openPorts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2 justify-center">
        <div className="flex flex-wrap gap-0 justify-center">
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
                className="group flex flex-col items-center w-24 p-2 text-gray-300 rounded-lg transition-colors duration-500 cursor-pointer animate-fade-in no-underline"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'forwards',
                }}
                title={`${port.title} | ${port.contentType} (Status: ${port.status})`}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full transition-colors duration-500 group-hover:bg-gray-700 group-hover:duration-100 group-hover:text-gray-300 text-gray-600">
                  <PortIcon port={port.port} title={port.title} />
                </div>
                <span className="text-xs mt-1 text-center line-clamp-2">{port.title || <i>Untitled</i>}</span>
                <span className="text-xs text-gray-600 font-bold">{port.port}</span>
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

export default OpenPortsSection;
