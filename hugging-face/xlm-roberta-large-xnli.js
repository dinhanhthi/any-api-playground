/**
 * How to use this script (from the root of the repository):
 * node -r dotenv/config hugging-face/xlm-roberta-large-xnli.js
 */

import fetch from "node-fetch";

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/joeddav/xlm-roberta-large-xnli",
    {
      headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

query({
  inputs:
    "Hi, I recently bought a device from your company but it is not working as advertised and I would like to get reimbursed!",
  parameters: { candidate_labels: ["refund", "legal", "faq"] },
}).then((response) => {
  console.log(JSON.stringify(response));
});
