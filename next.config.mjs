/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'shareicon.net'
            }
        ]
    }
};

export default nextConfig;
