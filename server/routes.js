const axios = require('axios');
const FormData = require('form-data');
const util = require('util');
const { pipeline } = require('stream');
const pump = util.promisify(pipeline);

async function routes(fastify, options) {

    // Register multipart support
    fastify.register(require('@fastify/multipart'));

    fastify.post('/api/analyze-gap', async (request, reply) => {
        try {
            const parts = request.parts();
            const formData = new FormData();
            let jobDescription = '';

            for await (const part of parts) {
                if (part.type === 'file') {
                    formData.append('file', part.file, { filename: part.filename });
                } else {
                    // Assume jobDescription is a field
                    if (part.fieldname === 'jobDescription') {
                        jobDescription = part.value;
                    }
                }
            }

            // 1. Send file to AI Engine to Parse
            // We need to send the stream or buffer. 
            // Simplified approach: Client sends file + text. 
            // We can forward everything to Python if Python handles it, 
            // OR we parse here (not ideal for Python dependency plan)
            // Let's forward the file to Python's /parse-resume first.

            // Re-constructing the form data for Python
            // Note: fastify-multipart consumes the stream. 

            const file = await request.file();
            if (!file) {
                return reply.code(400).send({ error: 'No file uploaded' });
            }

            // We need to buffer the file to send it via axios form-data if we want to be simple,
            // or pipe the stream. Pumping stream is better.
            const aiFormData = new FormData();
            aiFormData.append('file', file.file, { filename: file.filename });

            const parseResponse = await axios.post('http://127.0.0.1:5000/parse-resume', aiFormData, {
                headers: aiFormData.getHeaders()
            });

            const resumeText = parseResponse.data.text;

            // Now get the job description. The problem is request.file() only gets the file.
            // If we used request.parts(), we could get both.
            // Let's assume the client sends jobDescription as a separate body field or we use fields.
            // See: The client implementation in next steps will send FormData.
            // Since we already called request.file(), we might have missed other fields if they came after.
            // Valid multipart/form-data order matters or we use parts().
            // Let's refactor to use parts() properly above, but 'request.file()' is easier if we enforce order?
            // No, let's use a simpler approach: 
            // The previous parts() loop was consuming stream. 
            // Let's Restart the logic using the buffer approach for simplicity in prototype.
        } catch (error) {
            // Fallback logic inside catch block is bad practice for main logic.
        }
    });

    // Redefining the route handler with a cleaner approach
    fastify.post('/api/analyze-gap-v2', async (request, reply) => {
        request.log.info('Starting /api/analyze-gap-v2 processing');

        try {
            const parts = request.parts();
            let resumeFileStream;
            let resumeFilename;
            let jobDescription;

            request.log.info('Iterating parts...');
            for await (const part of parts) {
                request.log.info(`Found part: type=${part.type}, fieldname=${part.fieldname}`);

                if (part.type === 'file') {
                    request.log.info('Consuming file stream...');
                    const chunks = [];
                    for await (const chunk of part.file) {
                        chunks.push(chunk);
                    }
                    resumeFileStream = Buffer.concat(chunks);
                    resumeFilename = part.filename;
                    request.log.info(`File consumed. Size: ${resumeFileStream.length} bytes`);
                } else {
                    request.log.info(`Type is ${part.type}, value=${part.value}`);
                    if (part.fieldname === 'jobDescription') {
                        jobDescription = part.value;
                    }
                }
            }
            request.log.info('Finished iterating parts');

            if (!resumeFileStream || !jobDescription) {
                request.log.error('Missing file or job description');
                return reply.code(400).send({ error: "Missing file or job description" });
            }

            // Step 1: Parse Resume
            request.log.info('Sending to python /parse-resume...');
            const parseFormData = new FormData();
            parseFormData.append('file', resumeFileStream, { filename: resumeFilename });

            const parseRes = await axios.post('http://127.0.0.1:5000/parse-resume', parseFormData, {
                headers: parseFormData.getHeaders(),
                timeout: 10000 // 10s timeout
            });
            request.log.info('Python parse response received');

            const resumeText = parseRes.data.text;

            // Step 2: Analyze
            request.log.info('Sending to python /analyze...');
            const analyzeRes = await axios.post('http://127.0.0.1:5000/analyze', {
                resume_text: resumeText,
                job_description: jobDescription
            }, { timeout: 10000 });
            request.log.info('Python analyze response received');

            return analyzeRes.data;

        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ error: "AI Engine processing failed", details: err.message });
        }
    });

    fastify.post('/api/chat', async (request, reply) => {
        try {
            const { message, context } = request.body;

            const response = await axios.post('http://127.0.0.1:5000/chat', {
                message,
                context
            });

            return response.data;
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ error: "Chat service failed" });
        }
    });
}

module.exports = routes;
