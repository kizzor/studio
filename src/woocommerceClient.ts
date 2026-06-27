const CONSUMER_KEY = 'ck_cc517a39cca39a046456dce78a9c222b679374bb';
const CONSUMER_SECRET = 'cs_c5d998c37fb8335687cc6e066c8a1a8ea61a80bd';
const BASE_URL = 'https://shop.turbolucent.xyz/wp-json/wc/v3';

export const woocommerce = {
    get: async (endpoint: string) => {
        // endpoint may already include query params (e.g. "products?per_page=100&_cb=...")
        // Build the final URL robustly to avoid malformed "??" in query strings.
        const [pathPart, queryPart = ''] = endpoint.split('?');

        const url = new URL(`${BASE_URL}/${pathPart}`);

        // keep original query params from endpoint
        if (queryPart) {
            const qs = new URLSearchParams(queryPart);
            for (const [k, v] of qs.entries()) url.searchParams.set(k, v);
        }

        // auth params
        url.searchParams.set('consumer_key', CONSUMER_KEY);
        url.searchParams.set('consumer_secret', CONSUMER_SECRET);

        const response = await fetch(url.toString(), {
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
