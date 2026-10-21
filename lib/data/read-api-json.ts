import { host } from "@/config";

export async function readApiJson<T>(fileName: string): Promise<T> {
  if (typeof window === "undefined") {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const filePath = path.join(process.cwd(), "public", "api", fileName);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content) as T;
    } catch {
      // Direct fs failed, fall back to fetch
    }
  }

  const isServer = typeof window === "undefined";
  const baseUrl = isServer ? host : "";
  const url = `${baseUrl}/api/${fileName}`;
  const revalidate = process.env.NODE_ENV === "development" ? 0 : 3600;
  const response = await fetch(url, { next: { revalidate } });
  if (!response.ok) {
    throw new Error(`Failed to fetch /api/${fileName}: ${response.statusText}`);
  }
  return (await response.json()) as T;
}
