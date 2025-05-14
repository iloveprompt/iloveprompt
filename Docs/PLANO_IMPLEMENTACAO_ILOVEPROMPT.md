# Plano de Implementação – App IlovePrompt

## 1. Geração de Documentação
- Implementar carregamento e edição de templates customizáveis (por admin e/ou usuário).
- Implementar persistência real dos documentos gerados no banco (tabela `generated_documents`).
- Salvar metadados do wizard junto ao documento.
- Na última tela do wizard, adicionar botão/item retrátil para gerar e visualizar cada tipo de documentação (PRD, Readme, Roadmap, Fases, Fluxo).
- Permitir salvar, baixar e compartilhar (WhatsApp) o documento.
- Exibir preview do documento gerado.
- Implementar geração de imagem do fluxo (renderizar sintaxe Mermaid ou usar API de imagem).

## 2. Melhorar Prompt com I.A
- Implementar chamadas reais para todos os provedores LLM suportados (OpenAI, Gemini, Groq, DeepSeek).
- Usar System Message global do admin.
- Adicionar botão/item retrátil na última tela do wizard para "Melhorar Prompt com I.A".
- Exibir resultado ao usuário.

## 3. Gestão de APIs de LLM (Usuário/Admin)
- Garantir que a lógica de múltiplas APIs, ativação, deleção e teste de conexão está completa.
- Tela de dashboard com cards para cada API cadastrada:
  - Editar, deletar, ativar/desativar, testar conexão.
  - Ícone de status (ativa/inativa, sucesso/falha no teste).
  - Permitir cadastro de múltiplas APIs, mas só uma ativa.
- Tela para admin cadastrar/editar System Message global.
- Tela para admin cadastrar APIs globais (se desejado).

## 4. Templates Customizáveis
- Permitir que admin/usuário edite e salve templates de documentação.
- Tela de edição de templates.

## 5. Compartilhamento
- Adicionar opção de compartilhar documento via WhatsApp (gerar link ou usar API do WhatsApp).

## 6. Metadados
- Garantir que todos os metadados do wizard sejam salvos junto ao documento.

## Roadmap Sugerido
1. Banco de Dados: Criar tabela `generated_documents` e, se necessário, tabela de templates customizáveis.
2. Serviços Backend: Finalizar integração real com provedores LLM. Implementar persistência de documentos e templates.
3. Frontend: Adicionar UI para geração, visualização, download e compartilhamento de documentação. Adicionar UI para cards de APIs, System Message e templates.
4. Testes e Validação: Testar fluxo completo de geração, melhoria de prompt, gestão de APIs e templates. 