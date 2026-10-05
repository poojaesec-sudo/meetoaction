import os
import json
import httpx
from typing import Dict, Any, Optional
from .nlp_service import extract_entities_and_tasks_heuristic

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "demo")  # 'gemini', 'openai', or 'demo'

async def analyze_meeting_transcript(
    transcript: str,
    title: str = "",
    date: str = "",
    participants: str = ""
) -> Dict[str, Any]:
    """
    Analyzes meeting transcript using either LLM (if configured)
    or the built-in rule-based NLP extraction engine.
    """
    # Check if user explicitly wants LLM or if an API key is available
    if LLM_PROVIDER == "gemini" and GEMINI_API_KEY:
        try:
            return await _analyze_with_gemini(transcript, title, date, participants)
        except Exception as e:
            print(f"Gemini API error ({e}), falling back to NLP engine.")
    elif LLM_PROVIDER == "openai" and OPENAI_API_KEY:
        try:
            return await _analyze_with_openai(transcript, title, date, participants)
        except Exception as e:
            print(f"OpenAI API error ({e}), falling back to NLP engine.")

    # Default to fast, zero-dependency, robust heuristic extraction
    return extract_entities_and_tasks_heuristic(transcript, title, participants)


async def _analyze_with_gemini(transcript: str, title: str, date: str, participants: str) -> Dict[str, Any]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    prompt = f"""You are an expert AI meeting analyst for an executive accountability system.
Analyze the following meeting transcript and extract structured information.

Meeting Title: {title}
Date: {date}
Participants: {participants}

Transcript:
\"\"\"{transcript}\"\"\"

Return ONLY a valid JSON object with the following schema:
{{
  "summary": "Clear, concise 2-3 sentence summary of the meeting",
  "discussion_points": ["Key topic 1", "Key topic 2"],
  "decisions": ["Important decision 1", "Important decision 2"],
  "action_items": [
    {{
      "task": "Action item name",
      "description": "Context or explanation of the task",
      "assignee": "Full name or Unassigned if missing",
      "deadline": "Extracted date or Not specified if missing",
      "priority": "High, Medium, or Low",
      "status": "Pending",
      "source_context": "The sentence where this task was mentioned",
      "is_inferred_priority": true or false
    }}
  ],
  "topics": ["Key Theme 1", "Key Theme 2"]
}}

Rules:
- If no assignee is identified, set "assignee": "Unassigned"
- If no deadline is identified, set "deadline": "Not specified"
- If priority is not explicitly mentioned, infer it and set "is_inferred_priority": true
- Do not output markdown code blocks, just raw JSON.
"""

    async with httpx.AsyncClient(timeout=30.0) as client:
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.2
            }
        }
        res = await client.post(url, json=payload)
        res.raise_for_status()
        data = res.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
        return json.loads(raw_text)


async def _analyze_with_openai(transcript: str, title: str, date: str, participants: str) -> Dict[str, Any]:
    url = "https://api.openai.com/v1/chat/completions"
    prompt = f"""You are an executive meeting assistant.
Extract structured meeting intelligence from this transcript.
Title: {title}
Participants: {participants}

Transcript:
\"\"\"{transcript}\"\"\"

Respond ONLY with valid JSON:
{{
  "summary": "...",
  "discussion_points": ["..."],
  "decisions": ["..."],
  "action_items": [
    {{
      "task": "...",
      "description": "...",
      "assignee": "...",
      "deadline": "...",
      "priority": "High | Medium | Low",
      "status": "Pending",
      "source_context": "...",
      "is_inferred_priority": true
    }}
  ],
  "topics": ["..."]
}}
"""
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"},
        "temperature": 0.2
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(url, json=payload, headers=headers)
        res.raise_for_status()
        data = res.json()
        return json.loads(data["choices"][0]["message"]["content"])
