/**
 * Utility functions for AI SDK
 */

import { jsonSchema, tool } from 'ai'

/**
 * Convert OpenAI format tools to AI SDK tools format
 *
 * @param extractFunctions - Array of functions in OpenAI format
 * @returns Object with tool definitions compatible with AI SDK
 */
export function convertToAISdkTools(extractFunctions: any[]): any {
  const tools: any = {}

  extractFunctions.forEach(func => {
    const functionDef = func.function

    // Use tool() helper with jsonSchema() for proper JSON Schema format
    // inputSchema expects a JSON Schema object that defines the tool's input structure
    tools[functionDef.name] = tool({
      description: functionDef.description || `Tool: ${functionDef.name}`,
      inputSchema: jsonSchema(functionDef.parameters),
    })
  })

  return tools
}

/**
 * Convert OpenAI format messages to AI SDK ModelMessage format
 *
 * OpenAI format examples:
 * - User: { role: 'user', content: 'text' }
 * - Assistant with tool_calls: { role: 'assistant', tool_calls: [...] }
 * - Tool result: { role: 'tool', tool_call_id: 'id', content: 'result' }
 *
 * AI SDK format examples:
 * - User: { role: 'user', content: 'text' }
 * - Assistant with tool calls: { role: 'assistant', content: [{ type: 'tool-call', toolCallId, toolName, input }] }
 * - Tool result: { role: 'tool', content: [{ type: 'tool-result', toolCallId, toolName, output: { type: 'text', value } }] }
 *
 * @param messages - Array of messages in OpenAI format
 * @returns Array of messages in AI SDK ModelMessage format
 */
export function convertOpenAIMessagesToModelMessages(messages: any[]): any[] {
  return messages.map(msg => {
    // User message - no conversion needed
    if (msg.role === 'user') {
      return msg
    }

    // Assistant message with tool_calls (OpenAI format)
    if (msg.role === 'assistant' && msg.tool_calls) {
      return {
        role: 'assistant',
        content: msg.tool_calls.map((toolCall: any) => ({
          type: 'tool-call',
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
          input: typeof toolCall.function.arguments === 'string'
            ? JSON.parse(toolCall.function.arguments)
            : toolCall.function.arguments,
        })),
      }
    }

    // Assistant message with text content
    if (msg.role === 'assistant') {
      return msg
    }

    // Tool result message (OpenAI format)
    if (msg.role === 'tool' && msg.tool_call_id) {
      // Extract tool name from the corresponding tool_call if available
      // For now, we'll need to pass it or infer it
      return {
        role: 'tool',
        content: [
          {
            type: 'tool-result',
            toolCallId: msg.tool_call_id,
            toolName: msg.name || 'unknown', // OpenAI includes 'name' field in tool messages
            output: {
              type: 'text',
              value: msg.content,
            },
          },
        ],
      }
    }

    // System message or other - no conversion needed
    return msg
  })
}

