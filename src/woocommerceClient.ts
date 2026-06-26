const CONSUMER_KEY = 'ck_cc517a39cca39a046456dce78a9c222b679374bb';
const CONSUMER_SECRET = 'cs_c5d998c37fb8335687cc6e066c8a1a8ea61a80bd';
const BASE_URL = 'https://shop.turbolucent.xyz/wp-json/wc/v3';

export const woocommerce = {
    get: async (endpoint: string) => {
        const separator = endpoint.includes('?') ? '&' : '?';
        const url = `${BASE_URL}/${endpoint}${separator}consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`WooCommerce API Error: ${response.status} ${response.statusText} :: ${text}`);
        }

        const data = await response.json();
        return { data };
    }
};
