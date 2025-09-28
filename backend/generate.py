import os # since the API_KEY is in the env
from dotenv import load_dotenv
import google.generativeai as genai
import json
import fitz # for pdf file extraction
from pdfminer.high_level import extract_text

# glabal variable for the pdf file
from pathlib import Path

# name of the model
MODEL = 'gemini-2.0-flash'
# load env now
load_dotenv()

# grab the api key from the env and load it into here
API_KEY = os.getenv('GEMINI_API_KEY')

# set up genai with the key
genai.configure(api_key = API_KEY)

# seed model
my_model = genai.GenerativeModel(MODEL)

pdf_path = "pdf_files/polymorphism.pdf"

# function to strip extra fences
def stripText(s):
  s = s.strip()

  # chop opening fence (``` or ```json)
  if s.startswith("```"):
    first_newline = s.find("\n")
    if first_newline != -1:
      s = s[first_newline+1:].lstrip()
    else:
      s = ""

  # chop closing fence ONLY if it's literally at the end
  if s.endswith("```"):
    last_fence = s.rfind("```")
    # ensure it's just the fence at the end (no JSON after it)
    if s[last_fence:].strip() == "```":
      s = s[:last_fence].rstrip()

  print("Cleaned JSON:\n", s)
  return s

'''
=============== PART A ================
EXTRACT data from txt and have gemini dump a json file in format 
{
  "deck_title": "Course · Topic",
  "topics": [
    {
      "summary_text": "≤ 800 chars, student-friendly explanation of the concept."
    }
  ]
}

'''

doc = fitz.open(pdf_path)
all_text = []

for page in doc:
    text = page.get_text("text")  
    all_text.append(text)

full_text = "\n".join(all_text)
prompt_a = f"""
You are an educational summarizer.
Read the lecture slides text below and produce a JSON file in this exact format:

{{
  "deck_title": "Course · Topic",
  "topics": [
    {{
      "summary_text": "≤ 800 chars, student-friendly explanation of the concept."
    }}
  ]
}}

Rules:
- Do not include markdown fences (```).
- Do not add commentary or explanation outside the JSON.
- "deck_title" should be the course name or main topic of the slides.
- Each "summary_text" should summarize one concept or slide, concise and clear.

Here is the lecture text:
{full_text}
"""

# upload file into genai an dhave genai generate responses based off file+prompt
response = my_model.generate_content(prompt_a)

clean_a = stripText(response.text)
# Decode escaped unicode into actual characters
decoded = clean_a.encode("utf-8").decode("unicode_escape")

with open("lecture_content/poly.json", "w", encoding="utf-8") as f:
    for line in decoded.splitlines():
        f.write(line.rstrip() + "\n")
        print(line)


'''
READ/ load() the json file created and use that to create practice quizzes
{
  "deck_title": "Course · Topic",
  "qa_pairs": [
    {
      "practice_question": "One clear question testing this topic.",
      "answer": "Correct answer, ≤ 2 sentences."
    }
  ]
}
'''



# PRACTICE MAKING GEMINI CREATE QUIZZES, open('file_location', 'access mode')
with open('lecture_content/poly.json', 'r') as f:
  data = json.load(f)

# create the prompt_b here instead of feedig direc;t
prompt_b = f"""
You are an educational quiz generator.
Generate practice quizzes in STRICT JSON format like this make them short questions lecuture style <= 8 words MCQ and FRQ:

{{
  "deck_title": "Course · Topic",
  "qa_pairs": [
    {{
      "practice_question": "One clear question testing this topic.",
      "answer": "Correct answer, ≤ 2 sentences."
    }}
  ]
}}

Here is the lecture JSON to base the quiz on:
{json.dumps(data, indent=2)}
"""

response = my_model.generate_content(prompt_b)

clean = stripText(response.text)
# Decode escaped unicode into actual characters
decoded = clean.encode("utf-8").decode("unicode_escape")

with open("q_a/202.json", "w", encoding="utf-8") as f:
    for line in decoded.splitlines():
        f.write(line.rstrip() + "\n")


print("✅ Saved cleaned JSON text exactly as returned")

print("Model Output\n")
print(response.text)
print("Metadata\n") # don't worry about it i just want to see how gemini is tokenizing on sum nerd shi
print(response.usage_metadata)
