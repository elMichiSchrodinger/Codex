import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class OpenAIService {
  private static instance: OpenAIService;
  
  private constructor() {}
  
  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const systemPrompt = `You are an IT Service Management (ITSM) assistant. You help users with:
      - IT service requests and incidents
      - Service catalog information
      - SLA management questions
      - Asset management queries
      - Problem resolution guidance
      - Risk management advice
      - Audit and compliance questions
      - General IT best practices
      
      Provide helpful, professional responses focused on ITSM topics. Keep responses concise but informative.`;

      const openaiMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: openaiMessages,
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get response from AI assistant. Please check your API key and try again.');
    }
  }

  async generateIncidentSummary(incident: any): Promise<string> {
    try {
      const prompt = `Generate a brief summary and suggested next steps for this IT incident:
      
      Title: ${incident.title}
      Description: ${incident.description}
      Priority: ${incident.priority}
      Status: ${incident.status}
      
      Provide a professional summary and 2-3 actionable next steps.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.5,
      });

      return completion.choices[0]?.message?.content || 'Unable to generate summary.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate incident summary.');
    }
  }

  async suggestRiskMitigation(risk: any): Promise<string> {
    try {
      const prompt = `Suggest mitigation strategies for this IT risk:
      
      Risk: ${risk.description}
      Impact: ${risk.impact}
      Probability: ${risk.probability}
      Current Mitigation: ${risk.mitigation}
      
      Provide 3-4 specific, actionable mitigation strategies.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.6,
      });

      return completion.choices[0]?.message?.content || 'Unable to generate risk mitigation suggestions.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate risk mitigation suggestions.');
    }
  }
}

export const openaiService = OpenAIService.getInstance();