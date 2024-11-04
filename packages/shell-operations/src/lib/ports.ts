import portscanner from 'portscanner';
import http from 'http';
import { exec } from 'child_process';
import { platform } from 'os';

interface PortInfo {
  port: number;
  address: string;
  contentType: string;
  status: number;
  title: string | null;
  favicon: string | null;
  isLocalOnly: boolean;
}

async function getListeningAddresses(): Promise<Map<number, { address: string; isLocalOnly: boolean }>> {
  return new Promise(resolve => {
    const addresses = new Map<number, { address: string; isLocalOnly: boolean }>();

    const command = platform() === 'win32' ? 'netstat -an | findstr LISTENING' : 'netstat -tln';

    exec(command, (error, stdout) => {
      if (error) {
        console.error('🔴 Error getting listening addresses:', error);
        resolve(addresses);
        return;
      }

      stdout.split('\n').forEach(line => {
        const parts = line.trim().split(/\s+/);
        // Format differs between OS, but we're looking for the local address column
        const addressPart = platform() === 'win32' ? parts[1] : parts[3];

        if (addressPart) {
          const [addr, portStr] = addressPart.split(':');
          const port = parseInt(portStr);
          if (!isNaN(port)) {
            const isLocalOnly = addr === '127.0.0.1' || addr === 'localhost' || addr === '::1';
            addresses.set(port, {
              address: addr,
              isLocalOnly,
            });
          }
        }
      });

      console.log('🎧 Found listening addresses:', addresses.size);
      resolve(addresses);
    });
  });
}

export async function scanOpenPorts(startPort = 1, endPort = 65535): Promise<PortInfo[]> {
  const openPorts: PortInfo[] = [];
  const listeningAddresses = await getListeningAddresses();

  for (let port = startPort; port <= endPort; port++) {
    try {
      const status = await portscanner.checkPortStatus(port, '127.0.0.1');
      if (status === 'open') {
        const addressInfo = listeningAddresses.get(port) || {
          address: '127.0.0.1',
          isLocalOnly: true,
        };

        const httpInfo = await checkHttpContent(port);
        if (httpInfo) {
          openPorts.push({
            ...httpInfo,
            address: addressInfo.address,
            isLocalOnly: addressInfo.isLocalOnly,
          });
        }
      }
    } catch (error) {
      console.warn('⚠️ Error scanning port', port, error);
    }
  }

  return openPorts;
}

function checkHttpContent(port: number): Promise<PortInfo | null> {
  return new Promise(resolve => {
    const options: http.RequestOptions = {
      hostname: 'localhost',
      port: port,
      method: 'GET',
      timeout: 1000,
    };

    const faviconRegex = /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["'][^>]*>/i;
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('html') || contentType.includes('json')) {
          let title: string | null = null;
          let favicon: string | null = null;
          if (contentType.includes('html')) {
            const titleMatch = data.match(/<title>(.*?)<\/title>/);
            if (titleMatch) {
              title = titleMatch[1];
            }

            const faviconMatch = data.match(faviconRegex);
            if (faviconMatch) {
              favicon = faviconMatch[1];
            }
          }
          resolve({
            port: port,
            contentType: contentType,
            status: res.statusCode || 0,
            title: title,
            favicon: favicon,
            isLocalOnly: true,
            address: 'localhost',
          });
        } else {
          resolve(null);
        }
      });
    });

    req.on('error', () => {
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });

    req.end();
  });
}
