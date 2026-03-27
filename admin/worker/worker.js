/**
 * Sveltia CMS Auth — Cloudflare Worker OAuth proxy for GitHub.
 * Based on: https://github.com/sveltia/sveltia-cms-auth
 *
 * Required secrets (set via `wrangler secret put`):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(),
      });
    }

    if (url.pathname === '/auth') {
      // Redirect to GitHub OAuth authorize page
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: 'repo,user',
      });
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302
      );
    }

    if (url.pathname === '/callback') {
      // Exchange code for token
      const code = url.searchParams.get('code');
      if (!code) {
        return new Response('Missing code parameter', { status: 400 });
      }

      try {
        const tokenResponse = await fetch(
          'https://github.com/login/oauth/access_token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              client_id: env.GITHUB_CLIENT_ID,
              client_secret: env.GITHUB_CLIENT_SECRET,
              code,
            }),
          }
        );

        const data = await tokenResponse.json();

        if (data.error) {
          return errorPage(data.error_description || data.error);
        }

        // Post token back to CMS via opener window
        return new Response(successPage(data.access_token), {
          headers: { 'Content-Type': 'text/html;charset=UTF-8' },
        });
      } catch (err) {
        return errorPage(err.message);
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function successPage(token) {
  return `<!doctype html><html><head><title>Auth</title></head><body><script>
(function() {
  const msg = 'authorization:github:success:${JSON.stringify({ token, provider: 'github' })}';
  if (window.opener) {
    window.opener.postMessage(msg, '*');
    window.close();
  }
})();
</script></body></html>`;
}

function errorPage(message) {
  return new Response(
    `<!doctype html><html><head><title>Auth Error</title></head><body>
    <p>Authentication failed: ${message}</p></body></html>`,
    { status: 400, headers: { 'Content-Type': 'text/html;charset=UTF-8' } }
  );
}
