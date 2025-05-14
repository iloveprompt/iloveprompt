import React, { useState } from 'react';

interface TranslationInlineEditProps {
  value: string;
  onSave: (newValue: string) => void;
  onCancel: () => void;
  inline?: boolean;
}

const TranslationInlineEdit: React.FC<TranslationInlineEditProps> = ({ value, onSave, onCancel, inline = true }) => {
  const [editValue, setEditValue] = useState(value);

  if (inline) {
    return (
      <span>
        <input
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={() => onSave(editValue)}>Salvar</button>
        <button onClick={onCancel}>Cancelar</button>
      </span>
    );
  }

  // Modal (simples)
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 300 }}>
        <h4>Editar Tradução</h4>
        <input
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          style={{ width: '100%', marginBottom: 16 }}
        />
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => onSave(editValue)} style={{ marginRight: 8 }}>Salvar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default TranslationInlineEdit; 