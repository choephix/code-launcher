import portscanner from 'portscanner';
import http from 'http';

interface PortInfo {
  port: number;
  contentType: string;
  status: number;
  title: string | null;
}

export async function scanOpenPorts(startPort = 1, endPort = 65535): Promise<PortInfo[]> {
  const openPorts: PortInfo[] = [];

  for (let port = startPort; port <= endPort; port++) {
    const status = await portscanner.checkPortStatus(port, '127.0.0.1');
    if (status === 'open') {
      const httpInfo = await checkHttpContent(port);
      if (httpInfo) {
        openPorts.push(httpInfo);
      }
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

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('html') || contentType.includes('json')) {
          let title: string | null = null;
          if (contentType.includes('html')) {
            const titleMatch = data.match(/<title>(.*?)<\/title>/);
            if (titleMatch) {
              title = titleMatch[1];
            }
          }
          resolve({
            port: port,
            contentType: contentType,
            status: res.statusCode || 0,
            title: title,
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
