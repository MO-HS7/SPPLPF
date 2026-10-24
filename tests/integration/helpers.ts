import net from 'node:net';

/**
 * Checks if a TCP port is reachable with a short timeout.
 * Used by integration test suites to cleanly skip when local datastore containers
 * are offline (e.g. after a machine restart before docker compose is launched).
 */
export async function isPortReachable(port: number, host = '127.0.0.1'): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host, timeout: 400 });
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}
