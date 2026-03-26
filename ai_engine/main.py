from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_parser import extract_text_from_pdf
from llm_service import analyze_resume_with_llm
import random
import uuid
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory session storage (for demo purposes)
sessions = {}

class InterviewSession:
    def __init__(self):
        self.state = "intro"  # intro, question_1, question_2, finished
        self.transcript = []
        self.current_question = ""
        
    def next_response(self, user_message):
        self.transcript.append({"role": "user", "content": user_message})
        
        response = ""
        
        if self.state == "intro":
            response = "Great to meet you! Let's dive in. Can you describe a challenging project you worked on recently?"
            self.state = "question_1"
            self.current_question = "Describe a challenging project."
            
        elif self.state == "question_1":
            # Simple follow-up logic
            if len(user_message.split()) < 10:
                response = "Could you elaborate a bit more on that? specifically your role in the team?"
            else:
                response = "That sounds impressive. How did you handle any conflicts or disagreements during that project?"
                self.state = "question_2"
                self.current_question = "Handling conflicts."
                
        elif self.state == "question_2":
            response = "Thanks for sharing that. I have a good sense of your behavioral skills now. Let's wrap up this section. Is there anything else you'd like to add?"
            self.state = "wrapping_up"
            
        elif self.state == "wrapping_up":
            response = "Excellent. I've gathered enough information to provide you with some feedback. Click 'End Interview' to see your results."
            self.state = "finished"
            
        else:
            response = "The interview is complete. Please check your feedback."

        self.transcript.append({"role": "ai", "content": response})
        return response

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

@app.route('/parse-resume', methods=['POST'])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        text = extract_text_from_pdf(file.read())
        if text:
            return jsonify({"text": text, "filename": file.filename})
        else:
            return jsonify({"error": "Could not extract text"}), 500

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    resume_text = data.get('resume_text')
    job_description = data.get('job_description')
    
    if not resume_text or not job_description:
        return jsonify({"error": "Missing resume text or job description"}), 400

    # Use LLM Service
    analysis_result = analyze_resume_with_llm(resume_text, job_description)
    
    return jsonify(analysis_result)
@app.route('/start-interview', methods=['POST'])
def start_interview():
    session_id = str(uuid.uuid4())
    sessions[session_id] = InterviewSession()
    return jsonify({
        "session_id": session_id,
        "message": "Hello! I'm your AI Interview Coach. Let's start with a simple question: Tell me about yourself."
    })

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    session_id = data.get('session_id')
    
    if not message:
        return jsonify({"error": "No message provided"}), 400

    # If no session ID provided, create a temporary one or handle as stateless (fallback)
    if not session_id or session_id not in sessions:
        # Fallback to simple stateless response if no session
        return jsonify({"response": "I didn't catch that context. Could you restart the interview?"})

    session = sessions[session_id]
    response_text = session.next_response(message)
        
    return jsonify({"response": response_text, "state": session.state})

@app.route('/feedback', methods=['POST'])
def get_feedback():
    data = request.json
    session_id = data.get('session_id')
    
    if not session_id or session_id not in sessions:
         return jsonify({"error": "Session not found"}), 404
         
    # Mock analysis of the transcript
    score = random.randint(75, 95)
    
    return jsonify({
        "score": score,
        "strengths": ["Clear communication", "STAR method usage", "Confidence"],
        "improvements": ["Could provide more metric-based results", "Speak slightly slower"],
        "summary": "You demonstrated strong problem-solving skills. Focus on quantifying your impact in future answers."
    })

@app.route('/execute-code', methods=['POST'])
def execute_code():
    data = request.json
    code = data.get('code')
    language = data.get('language', 'javascript')
    
    # Mock execution delay
    time.sleep(1)
    
    # Simple mock validation logic
    if "return" not in code:
         return jsonify({"output": "Error: Function must return a value.", "success": False})
         
    # Simulate success if code looks somewhat correct (has basic keywords)
    success = True
    output = "Test Case 1: [2, 7], Target 9 -> Passed\nTest Case 2: [3, 2, 4], Target 6 -> Passed \nTest Case 3: [3, 3], Target 6 -> Passed"
    
    if len(code) < 50: # Arbitrary check for "too simple" code
        success = False
        output = "Test Case 1: Failed (Expected [0,1], Got undefined)\nSyntax Error: Incomplete implementation."

    return jsonify({
        "output": output,
        "success": success
    })

@app.route('/evaluate-answer', methods=['POST'])
def evaluate_answer_route():
    try:
        data = request.json
        if not data:
             return jsonify({'error': 'No data provided'}), 400
        
        question = data.get('question')
        answer = data.get('answer')
        
        if not question or not answer:
             return jsonify({'error': 'Missing question or answer'}), 400
             
        from llm_service import evaluate_answer
        result = evaluate_answer(question, answer)
        return jsonify(result)
    except Exception as e:
        print(f"Error in evaluate answer: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
