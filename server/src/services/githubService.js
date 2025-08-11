// const axios = require('axios');

// const GITHUB_API_BASE_URL = '[https://api.github.com](https://api.github.com)';

// // Exchanges GitHub code for an access token
// const getAccessToken = async (code, clientId, clientSecret) => {
//     try {
//         const response = await axios.post(
//             '[https://github.com/login/oauth/access_token](https://github.com/login/oauth/access_token)',
//             {
//                 client_id: clientId,
//                 client_secret: clientSecret,
//                 code: code,
//             },
//             {
//                 headers: {
//                     Accept: 'application/json',
//                 },
//             }
//         );
//         return response.data.access_token;
//     } catch (error) {
//         console.error('Error getting GitHub access token:', error.response ? error.response.data : error.message);
//         throw new Error('Failed to get GitHub access token.');
//     }
// };

// // Fetches user's public and private repositories
// const getUserRepos = async (accessToken) => {
//     try {
//         const response = await axios.get(`${GITHUB_API_BASE_URL}/user/repos`, {
//             headers: {
//                 Authorization: `token ${accessToken}`,
//             },
//             params: {
//                 type: 'owner', // Get repos owned by the user (public and private)
//                 per_page: 100 // Fetch more repos per page
//             }
//         });
//         return response.data.map(repo => ({
//             id: repo.id,
//             name: repo.name,
//             full_name: repo.full_name,
//             html_url: repo.html_url,
//             description: repo.description,
//             stargazers_count: repo.stargazers_count,
//             forks_count: repo.forks_count,
//             language: repo.language,
//             updated_at: repo.updated_at,
//             topics: repo.topics,
//             homepage: repo.homepage // Project live demo link
//         }));
//     } catch (error) {
//         console.error('Error fetching GitHub repos:', error.response ? error.response.data : error.message);
//         throw new Error('Failed to fetch GitHub repositories.');
//     }
// };

// // Fetches user's profile data
// const getUserProfile = async (accessToken) => {
//     try {
//         const response = await axios.get(`${GITHUB_API_BASE_URL}/user`, {
//             headers: {
//                 Authorization: `token ${accessToken}`,
//             },
//         });
//         return {
//             username: response.data.login,
//             name: response.data.name,
//             avatar_url: response.data.avatar_url,
//             html_url: response.data.html_url,
//             bio: response.data.bio,
//             public_repos: response.data.public_repos,
//             followers: response.data.followers,
//         };
//     } catch (error) {
//         console.error('Error fetching GitHub profile:', error.response ? error.response.data : error.message);
//         throw new Error('Failed to fetch GitHub profile.');
//     }
// };

// // NOTE: Getting detailed contributions (like commit counts) often requires
// // GitHub GraphQL API or specific libraries, which is more complex. For MVP,
// // we can stick to public repo stats or general profile info.
// // If you need contributions data beyond basic counts, look into GitHub GraphQL API.

// module.exports = {
//     getAccessToken,
//     getUserRepos,
//     getUserProfile,
// };

const axios = require('axios');

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/access_token';

const getAccessToken = async (code, clientId, clientSecret) => {
    try {
        const response = await axios.post(
            GITHUB_OAUTH_URL,
            {
                client_id: clientId,
                client_secret: clientSecret,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('[GitHub Error] getAccessToken:', error?.response?.data || error.message);
        throw new Error('Failed to get GitHub access token.');
    }
};

const getUserRepos = async (accessToken) => {
    try {
        const response = await axios.get(`${GITHUB_API_BASE_URL}/user/repos`, {
            headers: {
                Authorization: `token ${accessToken}`,
            },
            params: {
                type: 'owner',
                per_page: 100,
            },
        });

        return response.data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            html_url: repo.html_url,
            description: repo.description,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            language: repo.language,
            updated_at: repo.updated_at,
            topics: repo.topics,
            homepage: repo.homepage,
            visibility: repo.visibility,
            license: repo.license?.name,
            open_issues_count: repo.open_issues_count,
        }));
    } catch (error) {
        console.error('[GitHub Error] getUserRepos:', error?.response?.data || error.message);
        throw new Error('Failed to fetch GitHub repositories.');
    }
};

const getUserProfile = async (accessToken) => {
    try {
        const response = await axios.get(`${GITHUB_API_BASE_URL}/user`, {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        return {
            username: response.data.login,
            name: response.data.name,
            avatar_url: response.data.avatar_url,
            html_url: response.data.html_url,
            bio: response.data.bio,
            public_repos: response.data.public_repos,
            followers: response.data.followers,
        };
    } catch (error) {
        console.error('[GitHub Error] getUserProfile:', error?.response?.data || error.message);
        throw new Error('Failed to fetch GitHub profile.');
    }
};

module.exports = {
    getAccessToken,
    getUserRepos,
    getUserProfile,
};
