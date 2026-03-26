# AI-Powered Interview Coach & Resume Optimizer

A personalized dashboard for resume analysis and interview preparation.

## Modules

- **Client**: Next.js frontend (`/client`)
- **Server**: Fastify backend (`/server`)
- **AI Engine**: Python service (`/ai_engine`) - *Requires Python 3*
- **CMS**: Strapi (`/cms`)

## Setup

1.  **Client**: `cd client && npm install && npm run dev`
2.  **Server**: `cd server && npm install && npm start`
3.  **AI Engine**: `cd ai_engine && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python main.py`
4.  **CMS**: `cd cms && npm install && npm run develop`

## Architecture

- **Frontend**: Next.js, TailwindCSS
- **Backend**: Fastify
- **AI**: PyPDF2, Spacy, BERT
- **Database**: Strapi (SQLite default)
