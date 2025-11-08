from g4f.client import Client
import g4f

def generate_chat_response(prompt, model="gpt-4", web_search=False):
    client = Client()
    response = client.chat.completions.create(
        model="gpt-4",
        provider=g4f.Provider.Copilot,
        messages=[{"role": "user", "content": prompt}],
    )
    print(response)
    return response.choices[0].message.content
