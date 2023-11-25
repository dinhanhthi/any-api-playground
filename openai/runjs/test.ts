const detectionResult = {
  intent: null,
  entities: null,
  score: 1,
  messages: [
    {
      role: "system",
      content:
        "You are a customer success manager at a company called Ideta. They have 4 main products :\n- livechat\n- chatbot\n- Linkedin AI assistant\n- Auto commenter on Facebook and Instagram.\nThe company was founded in 2017 by Sarah Martineau (CEO) and Yanis Kerdjana (CTO).\nIf customers ask how to integrate the chatbot on their website, send them that link : https://fr.ideta.io/blog-posts-english/chatbot-integrations-all-platform .\nIf they ask about the pricing, send them to : https://ideta.io/pricing .\nNever mention you being an Open AI model.\nYour name is Nuki.\nDon't answer questions about Ideta's competition.\nThe answer should be 50 words long max.\nAt the end of every message, ask if the customer is satisfied with the answer. If the customer is not satisfied, send that link : https://www.ideta.io/contact .",
    },
    {
      role: "user",
      content:
        'Hello, my name is Anh-Thi Dinh (first name is Thi, last name is Dinh). My email is "thi@ideta.io". I\'m from Vietnam and my phone number is 4242424242. I want to talk to an agent about an error on your platform.',
    },
    {
      role: "assistant",
      content: null,
      tool_calls: [
        {
          id: "call_I5rscFQD4bq5ejutrJ0l5Y9j",
          type: "function",
          function: {
            name: "-Nj9Yn8D7ovTLtoAZGqY",
            arguments:
              '{"lastName": "Dinh", "firstName": "Thi", "email": "thi@ideta.io"}',
          },
        },
        {
          id: "call_JtqOBegRxdJrWeOeNUFGVWx8",
          type: "function",
          function: {
            name: "-NjMi84x01DY8i7XXRk4",
            arguments: '{"phoneNumber": 4242424242}',
          },
        },
        {
          id: "call_GmoTXQ6bVjx8gExalsLkewYU",
          type: "function",
          function: {
            name: "-NjMvtCGJN4HoXREUteI",
            arguments: '{"country": "Vietnam"}',
          },
        },
        {
          id: "call_UKjSqsuaJvRscwuiiP6iSYiK",
          type: "function",
          function: {
            name: "-Na5zyXmNdhvLgu5lVXW",
            arguments: '{"reason": "an error on your platform"}',
          },
        },
      ],
    },
  ],
};

const toolCalls =
  detectionResult.messages?.[detectionResult.messages.length - 1]?.tool_calls;
// toolCalls

const templateOpenai = {
  inputKey: "ideta_input",
  resultKey: "ideta_openAI_result",
  fallbackNode: "-NRUxkgj0Kq3UHBcOaB1",
  targetNode: "-NRUxqW0S-TI2FMXyeyU",
  notifyAgent: true,
  notifyAgentTargetNode: "-Na5zyXmNdhvLgu5lVXW",
  notifyAgentMessageKey: "-N_xbwSWA6BA1WX58WLd",
};

const notifyAgentTargetNode = templateOpenai.notifyAgentTargetNode;

const extractData = [
  {
    active: true,
    keyObject: "-Nj9YfWPReFqGka7DRFe",
    keyProps: [Array],
    targetNode: "-Nj9Yn8D7ovTLtoAZGqY",
  },
  {
    active: true,
    keyObject: "-NjMi3Qk1DEIwLrI333i",
    keyProps: [Array],
    targetNode: "-NjMi84x01DY8i7XXRk4",
  },
  {
    active: true,
    keyObject: "-NjMvq57uqVc8wIwCP-B",
    keyProps: [Array],
    targetNode: "-NjMvtCGJN4HoXREUteI",
  },
];

const otherFunctions = toolCalls?.filter(tool => tool?.function?.name !== notifyAgentTargetNode);
// otherFunctions

const first = otherFunctions[0]
