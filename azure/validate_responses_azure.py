"""
Azure OpenAI validation for Responses API format (non-v1, with api-version)

How to run:
    python azure/validate_responses_azure.py

Environment variables needed:
    AZURE_API_KEY=your-api-key

Endpoint:
    https://micka-mkl7dkpl-swedencentral.cognitiveservices.azure.com/openai/responses?api-version=2025-04-01-preview
Deployment: hep-gpt-52

Note: This endpoint uses /openai/responses (without /v1).
    - AzureOpenAI client uses deployment-based URLs by default (/deployments/{model}/...)
      which doesn't match this endpoint format.
    - OpenAI client with base_url appends /responses to base_url,
      so we set base_url to the root /openai path and it builds the correct URL.
    - We pass api-version via default_query since this isn't a v1 endpoint.

Refs:
    - Azure OpenAI Responses API: https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/responses
"""

import os
import time
import json
from dotenv import load_dotenv
from openai import OpenAI, AzureOpenAI

load_dotenv(override=True)

api_key = os.getenv("AZURE_API_KEY", "")
full_endpoint = "https://micka-mkl7dkpl-swedencentral.cognitiveservices.azure.com/openai/responses?api-version=2025-04-01-preview"
deployment_name = "hep-gpt-52"

print("=== Azure OpenAI Responses API Validation (Python) ===\n")

if not api_key:
    print("❌ AZURE_API_KEY is not set")
    exit(1)

print(f"API Key: {api_key[:10]}...{api_key[-4:]}")
print(f"Full Endpoint: {full_endpoint}")
print(f"Deployment Name: {deployment_name}\n")

# The endpoint is: {base}/openai/responses?api-version=2025-04-01-preview
# OpenAI client calls: {base_url}/responses for responses.create()
# So base_url should be: https://micka-mkl7dkpl-swedencentral.cognitiveservices.azure.com/openai
base_url = "https://micka-mkl7dkpl-swedencentral.cognitiveservices.azure.com/openai"
api_version = "2025-04-01-preview"

print(f"Base URL: {base_url}")
print(f"API Version: {api_version}")

# Use OpenAI client (not AzureOpenAI) with custom base_url
# - base_url points to /openai
# - SDK appends /responses -> /openai/responses
# - default_query adds ?api-version=... to every request
# - default_headers adds api-key for Azure auth
client = OpenAI(
    api_key=api_key,
    base_url=base_url,
    default_query={"api-version": api_version},
    default_headers={"api-key": api_key},
)

print("\nTesting connection (no stream)...\n")

start_time = time.time()

try:
    response = client.responses.create(
        model=deployment_name,
        input=[
            {"role": "user", "content": "Hello, who are you?"}
        ],
    )

    duration = int((time.time() - start_time) * 1000)

    print(f"Response: {response.output[0].content[0].text}")
    print(f"Duration: {duration}ms")
    print(f"Input tokens: {response.usage.input_tokens}")
    print(f"Output tokens: {response.usage.output_tokens}")
    print(f"\n✅ Status: VALID")

    print("\n=== Summary ===")
    print(json.dumps({
        "service": "Azure OpenAI (Responses API)",
        "valid": True,
        "response": response.output[0].content[0].text,
        "duration": duration,
        "deployment": deployment_name,
        "apiVersion": api_version,
        "modelType": "responses",
    }, indent=2))

except Exception as e:
    print(f"\n❌ Status: INVALID")
    print(f"Error: {e}")
    exit(1)

# --- Streaming test ---
print("\n\n--- Streaming test ---\n")

start_time = time.time()

try:
    stream = client.responses.create(
        model=deployment_name,
        input=[
            {"role": "user", "content": "Hello, who are you?"}
        ],
        stream=True,
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            print(event.delta, end="")
        if event.type == "response.completed":
            duration = int((time.time() - start_time) * 1000)
            print(f"\n\nDuration: {duration}ms")
            print(f"Input tokens: {event.response.usage.input_tokens}")
            print(f"Output tokens: {event.response.usage.output_tokens}")
            print(f"\n✅ Streaming: VALID")

except Exception as e:
    print(f"\n❌ Streaming: INVALID")
    print(f"Error: {e}")
    exit(1)
