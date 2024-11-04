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

  const resolveFaviconUrl = (port: number, faviconPath: string) => {
    try {
      const baseUrl = getPortUrl(port);
      const fullUrl = new URL(faviconPath, baseUrl);
      console.log(`🖼️ Resolved favicon URL: ${fullUrl.href}`);
      return fullUrl.href;
    } catch (error) {
      console.error(`❌ Error resolving favicon URL for port ${port}:`, error);
      return faviconPath; // Fallback to the original path if resolution fails
    }
  };

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
                <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full transition-colors duration-500 group-hover:bg-gray-600 group-hover:duration-150">
                  {port.favicon ? (
                    <img
                      src={resolveFaviconUrl(port.port, port.favicon)}
                      alt={`Favicon for ${port.title || `port ${port.port}`}`}
                      className="w-6 h-6 object-contain"
                      onError={e => e.currentTarget.remove()}
                    />
                  ) : (
                    <EarthIcon className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <span className="text-xs mt-1 text-center line-clamp-2">{port.title || `Port ${port.port}`}</span>
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
