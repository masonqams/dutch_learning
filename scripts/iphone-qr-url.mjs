import { networkInterfaces } from "node:os";

const port = process.env.PORT ?? "3000";
const interfaces = networkInterfaces();
const addresses = Object.values(interfaces)
  .flat()
  .filter(Boolean)
  .filter((address) => address.family === "IPv4" && !address.internal)
  .map((address) => address.address);

if (!addresses.length) {
  console.log("No Wi-Fi/LAN IPv4 address was found.");
  console.log(
    "Start the app, then open http://YOUR_MACBOOK_IP:3000/iphone-install-qr.html",
  );
  process.exit(0);
}

for (const address of addresses) {
  const appUrl = `http://${address}:${port}/`;
  const qrPageUrl = `http://${address}:${port}/iphone-install-qr.html`;
  const qrImageUrl = `https://quickchart.io/qr?size=360&margin=2&text=${encodeURIComponent(appUrl)}`;
  console.log(`App URL: ${appUrl}`);
  console.log(`QR page: ${qrPageUrl}`);
  console.log(`QR image: ${qrImageUrl}`);
  console.log("");
}
