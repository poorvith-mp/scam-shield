export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Fetch asset from Cloudflare Workers static assets binding
    const response = await env.ASSETS.fetch(request);

    // Clone headers to inject cache-busting on HTML entry points
    const newHeaders = new Headers(response.headers);
    const contentType = newHeaders.get("content-type") || "";

    if (contentType.includes("text/html") || url.pathname === "/" || url.pathname === "/index.html") {
      newHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");
      newHeaders.set("Pragma", "no-cache");
      newHeaders.set("Expires", "0");
    } else {
      // Long-term immutable caching for hashed Vite asset bundles
      newHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
