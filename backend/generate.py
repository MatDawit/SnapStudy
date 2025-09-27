
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
quiz = response.text

with open('q_a/calculus.json','w') as f:
  data = json.dump(quiz, f, indent=2)

print("Model Output\n")
print(response.text)
print("Metadata\n") # don't worry about it i just want to see how gemini is tokenizing on sum nerd shi
print(response.usage_metadata)
