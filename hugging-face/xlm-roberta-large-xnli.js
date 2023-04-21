/**
 * How to use this script (from the root of the repository):
 * node -r dotenv/config hugging-face/xlm-roberta-large-xnli.js
 */

import fetch from "node-fetch";
import got from "got";

async function query(data) {

  // 👇 Use fetch
  // const response = await fetch(
  //   "https://api-inference.huggingface.co/models/joeddav/xlm-roberta-large-xnli",
  //   {
  //     headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` },
  //     method: "POST",
  //     body: JSON.stringify(data),
  //   }
  // );
  // const result = await response.json();
  // return result;

  // 👇 Use got
  const response = await got("https://api-inference.huggingface.co/models/joeddav/xlm-roberta-large-xnli", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` },
    json: data
  }).json()
  return response;
}

query({
  inputs:
    "I love you!",
  parameters: { candidate_labels: ["négatif", "positif", "neutre"] },
}).then((response) => {
  console.log(JSON.stringify(response));
});
