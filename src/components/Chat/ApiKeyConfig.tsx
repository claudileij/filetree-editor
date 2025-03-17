
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useDeepSeekStore } from '@/lib/deepseek';
import { useToast } from '../ui/use-toast';
import { Settings } from 'lucide-react';

export const ApiKeyConfig = () => {
  const { apiKey, setApiKey } = useDeepSeekStore();
  const [showConfig, setShowConfig] = useState(false);
  const [inputKey, setInputKey] = useState(apiKey);
  const { toast } = useToast();

  const handleSave = () => {
    setApiKey(inputKey);
    setShowConfig(false);
    toast({
      title: "API Key configurada",
      description: "Sua API key do DeepSeek foi salva com sucesso."
    });
  };

  return (
    <div className="p-2 border-t border-[#333]">
      {showConfig ? (
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-medium text-[#E2E8F0]">Configure sua API key do DeepSeek</h3>
          <Input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Cole sua API key aqui"
            className="bg-[#334155] border-[#475569] text-[#E2E8F0]"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              Salvar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowConfig(false)}
              className="border-[#475569] text-[#E2E8F0] hover:bg-[#334155]"
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfig(true)}
          className="w-full flex items-center gap-2 border-[#475569] text-[#E2E8F0] hover:bg-[#334155]"
        >
          <Settings className="h-4 w-4" />
          {apiKey ? "Mudar API key" : "Configurar API key do DeepSeek"}
        </Button>
      )}
    </div>
  );
};
