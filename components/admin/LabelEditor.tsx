
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { AppLabels } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { INITIAL_LABELS } from '../../constants';

const LabelEditor: React.FC = () => {
    const { labels, updateLabels } = useAppContext();
    const [editableLabels, setEditableLabels] = useState<AppLabels>(labels);
    const { t } = useTranslation();

    useEffect(() => {
        setEditableLabels(labels);
    }, [labels]);

    const handleLabelChange = (key: string, value: string) => {
        setEditableLabels(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        updateLabels(editableLabels);
        alert('تم حفظ التسميات بنجاح!');
    };
    
    const labelKeys = Object.keys(INITIAL_LABELS) as Array<keyof typeof INITIAL_LABELS>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">{t('label_management')}</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {labelKeys.map(key => (
                     <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <label className="font-medium text-gray-700 dark:text-gray-300 capitalize">{key.replace(/_/g, ' ')}</label>
                        <input
                            type="text"
                            value={editableLabels[key] || ''}
                            onChange={(e) => handleLabelChange(key, e.target.value)}
                            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                    </div>
                ))}
            </div>
             <button onClick={handleSave} className="mt-6 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                {t('save_labels')}
            </button>
        </div>
    );
};

export default LabelEditor;
