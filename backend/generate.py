
'''
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

import os # since the API_KEY is in the env
from dotenv import load_dotenv
import google.generativeai as genai
import json

# name of the model
MODEL = 'gemini-2.0-flash'
# load env now
load_dotenv()

# grab the api key from the env and load it into here
API_KEY = os.getenv('GEMINI_API_KEY')


# set up genai with the key
genai.configure(api_key = API_KEY)

# PRACTICE MAKING GEMINI CREATE QUIZZES, open('file_location', 'access mode')
with open('lecture_content/calculus.json', 'r') as f:
  data = json.load(f)

# create the prompt here instead of feedig direc;t
prompt = f"""
You are an educational quiz generator.
Generate practice quizzes in STRICT JSON format like this:

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
# practice with model to make sure it can generate omehtinf
my_model = genai.GenerativeModel(MODEL)

response = my_model.generate_content(prompt)
# function to strip extra fences

def stripText(s):
    s = s.strip()

    # chop opening fence
    if s.startswith("```"):
        first_newline = s.find("\n")
        if first_newline != -1:
            s = s[first_newline+1:].lstrip()
        else:
            s = ""

    # chop closing fence
    if s.endswith("```"):
        last_fence = s.rfind("```")
        s = s[:last_fence].rstrip()

    # print to terminal
    print("Cleaned JSON:\n", s)
    return s


clean = stripText(response.text)
quiz = json.loads(clean)

with open("q_a/calculus.json", "w", encoding="utf-8") as f:
    for line in clean.splitlines():
        f.write(line.rstrip() + "\n")

print("✅ Saved cleaned JSON text exactly as returned")

print("Model Output\n")
print(response.text)
print("Metadata\n") # don't worry about it i just want to see how gemini is tokenizing on sum nerd shi
print(response.usage_metadata)



