// This function fetches real news from NewsAPI.org
const fetch = require('node-fetch');

exports.handler = async () => {
  // Read the secret API key from Netlify's environment variables
  const { NEWS_API_KEY } = process.env;
  if (!NEWS_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'News API key is not configured.' }) };
  }

  // We will fetch top headlines about technology from reputable sources
  const apiUrl = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=6`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-Api-Key': NEWS_API_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('NewsAPI Error:', errorData);
      return { statusCode: response.status, body: JSON.stringify({ error: 'Failed to get response from NewsAPI.' }) };
    }

    const data = await response.json();
    
    // Return the articles to our React app
    return {
      statusCode: 200,
      body: JSON.stringify(data.articles),
    };

  } catch (error) {
    console.error('Function Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error.' }) };
  }
};
