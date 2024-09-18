import { useEffect, useState } from 'react';
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
        setOpenPorts(ports);
        console.log(`✅ Found ${ports.length} open ports`);
      } catch (error) {
        console.error('❌ Error fetching open ports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenPorts();
  }, []);

  if (loading) {
    return <div>Loading open ports...</div>;
  }

  return (
    <div>
      <h2>Open Ports</h2>
      <ul>
        {openPorts.map(port => (
          <li key={port.port}>
            Port {port.port}: {port.contentType} (Status: {port.status}){port.title && <span> - {port.title}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OpenPorts;
