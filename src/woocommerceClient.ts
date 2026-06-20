import OAuth from 'oauth-1.0a';
import CryptoJS from 'crypto-js';

// Setup OAuth 1.0a signature generator required by WooCommerce HTTP
const oauth = new OAuth({
    consumer: {
        key: 'ck_89d2a37e86e45edb02f29dda9b2c4c3e0df4de8b', // Paste your real ck_ key here
        secret: 'cs_dded11839739a23ef4fd2dee0b4ea77c8bc2a5e6', // Paste your real cs_ key here
    },
    // WooCommerce OAuth 1.0a is most commonly verified using HMAC-SHA1.
    // Using SHA256 here frequently causes signature mismatch (401/403).
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
    },
});

const BASE_URL = 'http://aurhouse-backend.local/wp-json/wc/v3';

export const woocommerce = {
    get: async (endpoint: string) => {
        const url = `${BASE_URL}/${endpoint}`;
        const requestData = { url, method: 'GET' };

        // WooCommerce expects OAuth parameters either as an Authorization header
        // or in a very specific format. Header-signing is the most compatible.
        const auth = oauth.authorize(requestData);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: oauth.toHeader(auth).Authorization,
            },
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText} :: ${text}`);
        }

        const data = await response.json();
        return { data }; // Wrapped in an object to keep your existing .then((res) => res.data) fully working!
    }
};