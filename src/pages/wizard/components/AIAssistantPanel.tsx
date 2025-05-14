
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface AIAssistantPanelProps {
  open: boolean;
  onClose: () => void;
  items: Array<{
    id: string;
    label: string;
    description: string;
    category?: string;
    value?: string;
  }>;
  title: string;
  prompt?: string;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ 
  open, 
  onClose, 
  items = [], 
  title,
  prompt
}) => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase()) || 
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } else {
      setSelectedItems(prev => [...prev, id]);
    }
  };

  const handleApply = () => {
    // In a real implementation, this would apply the selected items
    console.log("Applied items:", selectedItems);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-4 my-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        {prompt && (
          <div className="bg-muted/50 p-3 rounded-md text-sm mb-4">
            <Label className="font-medium mb-1 block">Prompt sugerido:</Label>
            <p className="text-muted-foreground">{prompt}</p>
          </div>
        )}
        
        <ScrollArea className="flex-1 pr-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredItems.map(item => (
              <Card 
                key={item.id}
                className={`cursor-pointer transition-all ${
                  selectedItems.includes(item.id) ? 'border-primary ring-1 ring-primary' : ''
                }`}
                onClick={() => handleToggleSelection(item.id)}
              >
                <CardContent className="p-3 relative">
                  {selectedItems.includes(item.id) && (
                    <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary" />
                  )}
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleApply}>
            Aplicar ({selectedItems.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistantPanel;
