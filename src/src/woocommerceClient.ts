import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js';

// Setup OAuth 1.0a signature generator required by WooCommerce HTTP
const oauth = new OAuth({
    consumer: {
        key: 'ck_89d2a37e86e45edb02f29dda9b2c4c3e0df4de8b', // Paste your real ck_ key here
        secret: 'cs_dded11839739a23ef4fd2dee0b4ea77c8bc2a5e6', // Paste your real cs_ key here
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
        return CryptoJS.HmacSHA256(base_string, key).toString(CryptoJS.enc.Base64);
    },
});

const BASE_URL = 'http://aurhouse-backend.local/wp-json/wc/v3';

export const woocommerce = {
    get: async (endpoint: string) => {
        const url = `${BASE_URL}/${endpoint}`;
        const requestData = { url, method: 'GET' };

        // Generate secure authorization headers
        const authAndParams = oauth.authorize(requestData);
        const urlParams = new URLSearchParams(authAndParams as any).toString();

        const separator = url.includes('?') ? '&' : '?';
        const response = await fetch(`${url}${separator}${urlParams}`);
        if (!response.ok) {
            throw new Error(`WooCommerce API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return { data }; // Wrapped in an object to keep your existing .then((res) => res.data) fully working!
    }
};