
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
        model: 'deepseek-coder',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente de programação que ajuda a escrever ou modificar código.
            
Quando o usuário pedir para criar ou modificar um arquivo:
1. Responda em português de forma concisa e amigável
2. Se o pedido envolver código, forneça uma explicação breve do que você vai fazer
3. Em seguida, forneça o código completo dentro de blocos de código com o formato:

\`\`\`filepath:caminho/do/arquivo.extensão
// Código completo aqui
\`\`\`

Apenas converse normalmente quando não for solicitado código específico.
Não mostre código a menos que seja explicitamente solicitado.
Seja sempre prestativo e forneça explicações claras e concisas.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000,
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

// Process code blocks from the response
export const processCodeBlocks = (content: string) => {
  const codeBlockRegex = /```filepath:(.*?)\n([\s\S]*?)```/g;
  let match;
  const files: { path: string, content: string }[] = [];

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const filePath = match[1].trim();
    const fileContent = match[2].trim();
    files.push({
      path: filePath,
      content: fileContent
    });
  }

  // Replace code blocks with a note
  const cleanedContent = content.replace(codeBlockRegex, '[Código gerado para $1]');
  
  return {
    message: cleanedContent,
    files: files
  };
};
