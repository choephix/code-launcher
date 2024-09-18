import React, { useEffect, useState } from 'react';
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
        console.log('🔍 Fetching open ports...');
        const ports = await apiService.findOpenPorts();
        const filteredPorts = ports.filter(port => port.status >= 200 && port.status < 300);
        setOpenPorts(filteredPorts);
        console.log(`✅ Found ${filteredPorts.length} open ports with 2xx status`);
      } catch (error) {
        console.error('❌ Error fetching open ports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenPorts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4 border-b border-gray-700">
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
        <span className="text-xs text-gray-400">Loading open ports...</span>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2 ml-2">
        <h2 className="text-sm text-gray-400">Open Ports</h2>
        <div className="flex flex-wrap gap-2">
          {openPorts.length > 0 ? (
            openPorts.map(port => (
              <span
                key={port.port}
                className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                title={`${port.contentType} (Status: ${port.status})`}
              >
                <span className="font-bold">{port.port}</span>
                {port.title && <span className="ml-1"> {port.title}</span>}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No open ports found</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default OpenPorts;
