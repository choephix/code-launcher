export async function fetchFaviconFromPaths(port: number): Promise<Buffer | null> {
  const paths = ['/favicon.ico', '/favicon.png', '/favicon.jpg', '/favicon.svg'];
  for (const path of paths) {
    const url = `http://localhost:${port}${path}`;
    try {
      const response = await fetch(url);
      if (response.ok && response.headers.get('Content-Type')?.startsWith('image/')) {
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength > 0) {
          console.log('✅ Favicon found at', url, response.headers.get('Content-Type'));
          return Buffer.from(arrayBuffer);
        }
      }
    } catch (error) {
      // console.error(`❌ Error fetching favicon from path ${path}:`, error);
    }
  }
  return null;
}

export async function fetchFaviconFromHead(port: number): Promise<Buffer | null> {
  try {
    const response = await fetch(`http://localhost:${port}`);
    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }
    const text = await response.text();
    const match = text.match(/<link[^>]*rel=["']icon["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    if (match) {
      const faviconUrl = match[1];
      const faviconResponse = await fetch(faviconUrl.startsWith('http') ? faviconUrl : `http://localhost:${port}${faviconUrl}`);
      if (faviconResponse.ok && faviconResponse.headers.get('Content-Type')?.startsWith('image/')) {
        const arrayBuffer = await faviconResponse.arrayBuffer();
        if (arrayBuffer.byteLength > 0) {
          console.log('✅ Favicon found at', faviconUrl);
          return Buffer.from(arrayBuffer);
        }
      }
    }
  } catch (error) {
    // console.error(`❌ Error fetching favicon from head:`, error);
  }
  return null;
} 
