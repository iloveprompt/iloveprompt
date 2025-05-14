import React, { useState, useEffect } from 'react';
import TranslationInlineEdit from './TranslationInlineEdit';

interface WizardListCrudProps {
  listName: string;
  listLabel: string;
  initialData: any[];
}

const WizardListCrud: React.FC<WizardListCrudProps> = ({ listName, listLabel, initialData }) => {
  const [data, setData] = useState<any[]>(initialData || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newItem, setNewItem] = useState<any>({ id: '', label: '', description: '', category: '' });
  const [editItem, setEditItem] = useState<any>(null);
  const [translationEdit, setTranslationEdit] = useState<{ index: number, value: string } | null>(null);
  const [translations, setTranslations] = useState<{ [id: string]: string }>({});

  // Atualiza os dados se a tab mudar
  useEffect(() => {
    setData(initialData || []);
  }, [initialData]);

  // Buscar tradução (mock)
  const getTranslation = (id: string) => {
    if (translations[id]) return translations[id];
    return data.find(item => item.id === id)?.label || '';
  };

  // Adicionar novo item (mock, só atualiza estado local)
  const handleAdd = () => {
    if (!newItem.id || !newItem.label) return;
    setData([...data, newItem]);
    setNewItem({ id: '', label: '', description: '', category: '' });
  };

  // Editar item existente (mock)
  const handleEdit = (index: number) => {
    if (!editItem) return;
    const updated = [...data];
    updated[index] = editItem;
    setData(updated);
    setEditingIndex(null);
    setEditItem(null);
  };

  // Remover item (mock)
  const handleRemove = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  // Editar tradução (mock)
  const handleTranslationEdit = (index: number, value: string) => {
    const item = data[index];
    setTranslations(prev => ({ ...prev, [item.id]: value }));
    setTranslationEdit(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-4">
      <h3 className="text-xl font-semibold mb-4">{listLabel}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-bold">ID</th>
              <th className="px-4 py-2 text-left font-bold">Label</th>
              <th className="px-4 py-2 text-left font-bold">Descrição</th>
              <th className="px-4 py-2 text-left font-bold">Categoria</th>
              <th className="px-4 py-2 text-left font-bold">Tradução (pt)</th>
              <th className="px-4 py-2 text-left font-bold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">Nenhum item encontrado</td>
              </tr>
            )}
            {data.map((item, idx) => (
              <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2">{editingIndex === idx ? <input className="border rounded px-2 py-1" value={editItem.id} onChange={e => setEditItem({ ...editItem, id: e.target.value })} /> : item.id}</td>
                <td className="px-4 py-2">{editingIndex === idx ? <input className="border rounded px-2 py-1" value={editItem.label} onChange={e => setEditItem({ ...editItem, label: e.target.value })} /> : item.label}</td>
                <td className="px-4 py-2">{editingIndex === idx ? <input className="border rounded px-2 py-1" value={editItem.description} onChange={e => setEditItem({ ...editItem, description: e.target.value })} /> : item.description}</td>
                <td className="px-4 py-2">{editingIndex === idx ? <input className="border rounded px-2 py-1" value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value })} /> : item.category}</td>
                <td className="px-4 py-2">
                  {translationEdit && translationEdit.index === idx ? (
                    <TranslationInlineEdit
                      value={getTranslation(item.id)}
                      onSave={value => handleTranslationEdit(idx, value)}
                      onCancel={() => setTranslationEdit(null)}
                      inline
                    />
                  ) : (
                    <>
                      {getTranslation(item.id)}{' '}
                      <button className="ml-2 text-blue-600 hover:underline" onClick={() => setTranslationEdit({ index: idx, value: getTranslation(item.id) })}>Editar</button>
                    </>
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingIndex === idx ? (
                    <>
                      <button className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600" onClick={() => handleEdit(idx)}>Salvar</button>
                      <button className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400" onClick={() => { setEditingIndex(null); setEditItem(null); }}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600" onClick={() => { setEditingIndex(idx); setEditItem(item); }}>Editar</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleRemove(idx)}>Remover</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="px-4 py-2"><input className="border rounded px-2 py-1" value={newItem.id} onChange={e => setNewItem({ ...newItem, id: e.target.value })} /></td>
              <td className="px-4 py-2"><input className="border rounded px-2 py-1" value={newItem.label} onChange={e => setNewItem({ ...newItem, label: e.target.value })} /></td>
              <td className="px-4 py-2"><input className="border rounded px-2 py-1" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} /></td>
              <td className="px-4 py-2"><input className="border rounded px-2 py-1" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} /></td>
              <td className="px-4 py-2" colSpan={2}><button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" onClick={handleAdd}>Adicionar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WizardListCrud; 