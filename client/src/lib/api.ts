const API_BASE_URL = 'http://localhost:5000';

export const api = {
    analyzeGap: async (file: File, jobDescription: string) => {
        // 1. Upload and Parse Resume
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(`${API_BASE_URL}/parse-resume`, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to parse resume');
        }

        const uploadData = await uploadResponse.json();
        const resumeText = uploadData.text;

        if (!resumeText) {
            throw new Error('No text extracted from resume');
        }

        // 2. Analyze with extracted text
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to analyze gap');
        }

        return response.json();
    },

    startInterview: async () => {
        const response = await fetch(`${API_BASE_URL}/start-interview`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to start interview');
        return response.json();
    },

    chat: async (message: string, sessionId?: string) => {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, session_id: sessionId })
        });

        if (!response.ok) {
            throw new Error('Chat failed');
        }

        return response.json();
    },

    endInterview: async (sessionId: string) => {
        const response = await fetch(`${API_BASE_URL}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        });
        if (!response.ok) throw new Error('Failed to end interview');
        return response.json();
    },

    executeCode: async (code: string, language: string = 'javascript') => {
        const response = await fetch(`${API_BASE_URL}/execute-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language })
        });
        if (!response.ok) throw new Error('Failed to execute code');
        return response.json();
    },

    evaluateAnswer: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/evaluate-answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to evaluate answer');
        return response.json();
    }
};
