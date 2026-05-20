import net from "net";

export default (forwarded?: string): string | null => {
  if (!forwarded) return null;

  const forwardedHeaders = Object.fromEntries(
    forwarded.split(";").map((s) => s.trim().split("="))
  );

  const clientIp = forwardedHeaders?.for?.toString().trim();

  if (clientIp && (net.isIPv4(clientIp) || net.isIPv6(clientIp))) {
    return clientIp;
  }

  return null;
};
