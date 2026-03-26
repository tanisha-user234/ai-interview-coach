import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")

if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

def analyze_resume_with_llm(resume_text, job_description):
    """
    Analyzes the resume against the job description using Google Gemini.
    Returns a JSON object with score, matching_skills, missing_skills, and suggestions.
    """
    if not GENAI_API_KEY:
        # Fallback if no key is provided
        return {
            "score": 0,
            "strengths": ["API Key Missing"],
            "missingSkills": ["API Key Missing"],
            "suggestions": ["Please configure your GEMINI_API_KEY in the .env file."]
        }

    model = genai.GenerativeModel('gemini-flash-latest')

    prompt = f"""
    You are an expert AI Interview Coach and Resume Auditor.
    
    JOB DESCRIPTION:
    {job_description}
    
    RESUME TEXT:
    {resume_text}
    
    Analyze the resume against the job description. 
    Provide the output strictly in the following JSON format (no markdown, just raw JSON):
    {{
        "score": <integer_0_to_100>,
        "strengths": [<list_of_strings>],
        "missingSkills": [<list_of_strings>],
        "suggestions": [<list_of_strings_actionable_advice>]
    }}
    
    Be critical but constructive. Identify keywords from the JD that are missing in the resume.
    """

    try:
        response = model.generate_content(prompt)
        response_text = response.text
        
        # Clean up code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "").replace("```", "")
        
        return json.loads(response_text)
    except Exception as e:
        print(f"LLM Error: {e}")
        return {
            "score": 0,
            "strengths": [],
            "missingSkills": ["Error analyzing resume"],
            "suggestions": ["Please try again later or check your API key."]
        }


import time

def evaluate_answer(question, answer):
    """
    Evaluates an interview answer using Gemini.
    """
    start_time = time.time()
    try:
        if not GENAI_API_KEY:
             return {"error": "API key not configured", "score": 0, "feedback": "API Key Missing", "improvements": []}
             
        # Use the working model alias
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = f"""
        You are an expert technical interviewer. Evaluate the following answer to an interview question.
        
        Question: "{question}"
        Candidate Answer: "{answer}"
        
        Provide feedback in JSON format with the following structure:
        {{
            "score": <0-100>,
            "feedback": "<concise feedback on content and delivery>",
            "improvements": ["<bullet point 1>", "<bullet point 2>"]
        }}
        """
        
        print(f"Requesting Gemini... Question length: {len(question)}, Answer length: {len(answer)}")
        response = model.generate_content(prompt)
        print(f"Gemini response received in {time.time() - start_time:.2f}s")
        
        # Clean up code blocks if present
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"): # sometimes it's just ```
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text)
    except Exception as e:
        print(f"Error generating feedback: {e}")
        return {
            "score": 0,
            "feedback": "Failed to generate feedback due to an error.",
            "improvements": ["Try again later."]
        }

