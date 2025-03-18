
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

// Define the response format type
export interface DeepSeekFile {
  name: string;
  content: string;
}

export interface DeepSeekResponse {
  content: string;
  files?: DeepSeekFile[];
}

export const generateResponse = async (messages: any[], apiKey: string): Promise<string> => {
  if (!apiKey) {
    return JSON.stringify({
      content: "Por favor, configure sua API key do DeepSeek primeiro."
    });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v3/chat/completions', {
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
            content: 'Você é um assistente especializado em programação que responde em português do Brasil. Suas respostas devem sempre estar no formato JSON com a estrutura: {"content": "sua resposta aqui", "files": [{"name": "/caminho/para/arquivo.js", "content": "conteúdo do arquivo"}]}. O campo "files" é opcional e só deve ser incluído quando você estiver fornecendo arquivos de código. IMPORTANTE: Ao fornecer arquivos de código, certifique-se de incluir TODOS os arquivos necessários para que o projeto funcione corretamente, incluindo package.json, arquivos de configuração, e qualquer outro arquivo dependente. Os arquivos devem ser organizados em uma estrutura de diretórios apropriada com caminhos relativos corretos. Garanta que pacotes e dependências estejam corretamente definidos nos arquivos package.json quando necessário. Se o usuário solicitar um projeto completo, certifique-se de fornecer TODOS os arquivos necessários, incluindo configurações, componentes, estilos e qualquer outro recurso necessário. Abaixo do conteúdo da mensagem para o usuário, certifique-se de enviar o código de compilação ou inicialização do projeto.'
          },
          ...messages
        ],
        temperature: 0.3,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('DeepSeek API error:', data.error);
      return JSON.stringify({
        content: `Erro na API: ${data.error.message || 'Ocorreu um erro desconhecido.'}`
      });
    }

    // Return the raw content from DeepSeek
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    return JSON.stringify({
      content: "Erro ao conectar com a API do DeepSeek. Verifique sua conexão ou API key."
    });
  }
};
