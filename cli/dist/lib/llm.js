import Anthropic from '@anthropic-ai/sdk';
import { formatContextForPrompt } from "./context.js";
const SYSTEM_PROMPT = `You are a spec assistant for an AI-assisted software development workflow. You are given a spec template and a project context. Your job is to fill in the template completely, replacing every placeholder with specific, accurate content derived from the project context and the developer's stated intent.

Rules:
- Every placeholder must be filled — no [brackets] left
- All file names and paths must match the actual project
- Constraints section must reflect real project constraints
- Output only the filled spec — no preamble, no commentary`;
function buildUserMessage(template, context, intent) {
    const ctxStr = formatContextForPrompt(context);
    return `# Project context

${ctxStr}

# Spec template

${template}

# Developer's intent

${intent}

Fill the template above using the project context. Output the filled spec only.`;
}
export async function generateSpec(request, template, context, client) {
    return client.generate(SYSTEM_PROMPT, buildUserMessage(template, context, request.intent));
}
export function defaultAnthropicClient(model) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is not set. Add it to your shell or a .env file in the project root.');
    }
    const sdk = new Anthropic({ apiKey });
    return {
        async generate(system, user) {
            const res = await sdk.messages.create({
                model,
                max_tokens: 4096,
                system,
                messages: [{ role: 'user', content: user }],
            });
            const text = res.content
                .filter((b) => b.type === 'text')
                .map((b) => b.text)
                .join('\n');
            if (!text.trim())
                throw new Error('Anthropic returned no text content');
            return text;
        },
    };
}
//# sourceMappingURL=llm.js.map