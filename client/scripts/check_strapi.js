
// Native fetch used in Node 18+

async function checkStrapi() {
    const url = 'http://localhost:1337/api/interview-questions?populate=*';
    console.log(`Checking ${url}...`);
    try {
        const response = await fetch(url);
        console.log(`Status: ${response.status}`);
        if (!response.ok) {
            console.error('Error fetching data');
            return;
        }
        const data = await response.json();
        console.log('Data found:', data.data.length);
        if (data.data.length > 0) {
            console.log('First Item Category:', data.data[0].attributes ? data.data[0].attributes.category : data.data[0].category);
            console.log('Full First Item:', JSON.stringify(data.data[0], null, 2));
        } else {
            console.log('No questions found. Check if content is Published and Permissions are public.');
        }
    } catch (e) {
        console.error('Failed to connect to Strapi. Is it running?', e.message);
    }
}

checkStrapi();
