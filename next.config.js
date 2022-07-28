/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MORALIS_APP_ID: "LA2eBVTFrjgDWo5mSCGdvKkcjlgL4VoyyHqoe6dT",
    MORALIS_APP_URL: "https://juxypvpe5iky.usemoralis.com:2053/server",
    DEEWARR_ACCOUNT: "0x7a2B903BD643c2f36C740c054BD7344B45Ccf9A8",
    CONTRACT_ADDRESS: "0x4F7AdfCBf661a485816d8bca6b987478998F09eF",
    SOULBOUND_CONTRACT_ADDRESS: "0xBC9484A44aa3D4214B980E08EEc008144b6771dc",
  },
};

module.exports = nextConfig;
