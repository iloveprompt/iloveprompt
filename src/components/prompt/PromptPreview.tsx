import { Tabs, Tab, Box, IconButton, Paper, Menu, MenuItem, Button } from '@mui/material';
import { ContentCopy, Visibility, Code, Description, Article, Assignment, MoreVert } from '@mui/icons-material';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PromptPreviewProps {
  previewContent: string;
  codeContent: string;
  markdownContent: string;
  generatedPromptContent?: string;
  documentationContent?: string;
}

// Componente para exibir o preview do prompt em abas
const PromptPreview: React.FC<PromptPreviewProps> = ({
  previewContent,
  codeContent,
  markdownContent,
  generatedPromptContent = '',
  documentationContent = ''
}) => {
  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState(0);
  const { toast } = useToast();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isDocMenuOpen = Boolean(anchorEl);

  // Função para mudar a aba ativa
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Função para copiar o conteúdo da aba
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: 'Conteúdo copiado',
      description: 'O conteúdo foi copiado para a área de transferência',
    });
  };

  const handleDocMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDocMenuClose = () => {
    setAnchorEl(null);
  };

  // Conteúdo de cada aba
  const tabContents = [
    previewContent,
    codeContent,
    markdownContent,
    generatedPromptContent,
    documentationContent
  ];

  // Nomes e ícones das abas
  const tabLabels = [
    { label: 'Preview', icon: <Visibility /> },
    { label: 'Código', icon: <Code /> },
    { label: 'Markdown', icon: <Description /> },
    { label: 'Prompt Gerado', icon: <Article /> },
    { label: 'Documentação', icon: <Assignment /> },
  ];

  return (
    <Paper elevation={2} sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', mb: 0 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', m: 0, p: 0 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="tabs preview prompt"
          variant="fullWidth"
          sx={{
            minHeight: 28,
            '& .MuiTab-root': {
              minHeight: 28,
              fontSize: 12,
              py: 0.2,
              px: 1.2,
              minWidth: 70,
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            },
            '& .MuiTabs-flexContainer': {
              gap: 0,
              justifyContent: 'space-between',
            },
          }}
        >
          {tabLabels.map((tab, idx) => (
            <Tab key={tab.label} icon={tab.icon} label={tab.label} sx={{ minHeight: 28, fontSize: 12, py: 0.2, px: 1.2, minWidth: 70, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5 }} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ p: 1.2, pt: 1, pb: 1 }}>
        <Box
          sx={{
            p: 1.2,
            bgcolor: 'background.default',
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: 13,
            whiteSpace: 'pre-wrap',
            minHeight: 80,
            backgroundColor: '#f6f8fa',
            color: '#222',
            border: '1px solid #e0e0e0',
            lineHeight: 1.5,
            position: 'relative',
          }}
        >
          {/* Botão de copiar para todas as abas, exceto Documentação */}
          {activeTab !== 4 && (
            <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
              <IconButton onClick={() => handleCopyContent(tabContents[activeTab] || '')} size="small">
                <ContentCopy fontSize="small" />
              </IconButton>
            </Box>
          )}
          {/* Botão de menu na aba Documentação */}
          {activeTab === 4 && (
            <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
              <IconButton onClick={handleDocMenuOpen} size="small">
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={isDocMenuOpen}
                onClose={handleDocMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleDocMenuClose}>PRD</MenuItem>
                <MenuItem onClick={handleDocMenuClose}>Readme</MenuItem>
                <MenuItem onClick={handleDocMenuClose}>Roadmap</MenuItem>
                <MenuItem onClick={handleDocMenuClose}>Passo a Passo</MenuItem>
              </Menu>
            </Box>
          )}
          {tabContents[activeTab] || <span style={{ color: '#888' }}>Sem conteúdo</span>}
        </Box>
      </Box>
    </Paper>
  );
};

export default PromptPreview; 