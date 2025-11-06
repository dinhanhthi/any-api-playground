# v1 format responses no stream

```python
from openai import OpenAI

endpoint = "https://bymycarai.openai.azure.com/openai/v1/responses?deployment=gpt-4.1"

client = OpenAI(
    api_key=azure_api_key,
    base_url="https://bymycarai.openai.azure.com/openai/v1" # a part of the endpoint
)

response = client.responses.create(    
  model="gpt-4.1", # deployment name, extracted from the endpoint
  input="This is a test."
)

print(f"response.output[0].content[0].text: {response.output[0].content[0].text}")
print(f"response.usage.input_tokens: {response.usage.input_tokens}")
print(f"response.usage.output_tokens: {response.usage.output_tokens}")
```

# v1 format responses with stream

```python
from openai import OpenAI

endpoint = "https://bymycarai.openai.azure.com/openai/v1/responses?deployment=gpt-4.1"

client = OpenAI(
    api_key=azure_api_key,
    base_url="https://bymycarai.openai.azure.com/openai/v1" # a part of the endpoint
)

response = client.responses.create(    
  model="gpt-4.1", # deployment name, extracted from the endpoint
  input="This is a test.", # or input=messages
  stream=True
)

for event in response:
    if event.type == 'response.output_text.delta':
        print(f"event.delta: {event.delta}")
    if event.type == 'response.completed':
        print(f"response.usage.input_tokens: {event.response.usage.input_tokens}")
        print(f"response.usage.output_tokens: {event.response.usage.output_tokens}")
```

# v1 format chat completion

```python
from openai import OpenAI

endpoint = "https://bymycarai.openai.azure.com/openai/v1/responses?deployment=gpt-4.1"

client = OpenAI(
    api_key=azure_api_key,
    base_url="https://bymycarai.openai.azure.com/openai/v1/" # a part of the endpoint
)

response = client.chat.completions.create(
    model="gpt-4o", # deployment name, extracted from the endpoint
    messages=[
        {"role": "system", "content": "Assistant is a large language model trained by OpenAI."},
        {"role": "user", "content": "Who were the founders of Microsoft?"}
    ]
)

print(f"text: {response.choices[0].message.content}")
print(f"prompt_tokens: {response.usage.prompt_tokens}")
print(f"completion_tokens: {response.usage.completion_tokens}")
```