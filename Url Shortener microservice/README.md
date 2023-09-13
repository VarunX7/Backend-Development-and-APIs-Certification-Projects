# Tests to Pass

1. You should provide your own project, not the example URL.
2. You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
3. When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
4. If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }
