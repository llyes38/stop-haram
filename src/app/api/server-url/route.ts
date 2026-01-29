import { NextResponse } from "next/server";
import os from "os";

/**
 * Retourne l'URL à ouvrir sur le téléphone (même WiFi) pour simplifier la manip.
 * Utilisé uniquement en dev / réseau local.
 */
export async function GET() {
  const port = process.env.PORT ?? 3000;
  let host = "localhost";
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const iface = interfaces[name];
      if (!iface) continue;
      for (const config of iface) {
        if (config.family === "IPv4" && !config.internal) {
          host = config.address;
          break;
        }
      }
      if (host !== "localhost") break;
    }
  } catch {
    /* ignore */
  }
  const urlForPhone = `http://${host}:${port}`;
  return NextResponse.json({ urlForPhone, host, port });
}
