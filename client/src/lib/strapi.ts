import qs from 'qs';

/**
 * Get the Strapi URL
 * @param {string} path
 * @returns {string}
 */
export function getStrapiURL(path = '') {
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path
 * @param {Object} urlParamsObject
 * @param {Object} options
 * @returns {Promise<any>}
 */
export async function fetchAPI(
    path: string,
    urlParamsObject: any = {},
    options: any = {}
) {
    // Merge default and user options
    const mergedOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    };

    // Build request URL
    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ''}`)}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);

    // Handle response
    if (!response.ok) {
        console.error(response.statusText);
        throw new Error(`An error occurred please try again`);
    }
    const data = await response.json();
    return data;
}

export async function getBlogPosts() {
    const posts = await fetchAPI('/blog-posts', { populate: '*' });
    return posts.data;
}

export async function getInterviewQuestions() {
    const questions = await fetchAPI('/interview-questions', { populate: '*' });
    return questions.data;
}
