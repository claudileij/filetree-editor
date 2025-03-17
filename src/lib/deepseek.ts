
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DeepSeekState {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const useDeepSeekStore = create<DeepSeekState>()(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
    }),
    {
      name: 'deepseek-storage',
    }
  )
);

export const generateResponse = async (messages: any[], apiKey: string) => {
  if (!apiKey) {
    return "Por favor, configure sua API key do DeepSeek primeiro.";
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente útil que responde em português do Brasil.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('DeepSeek API error:', data.error);
      return `Erro na API: ${data.error.message || 'Ocorreu um erro desconhecido.'}`;
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return "Erro ao conectar com a API do DeepSeek. Verifique sua conexão ou API key.";
  }
};
