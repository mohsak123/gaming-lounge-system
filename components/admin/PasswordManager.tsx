import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useTranslation } from '../../hooks/useTranslation';
import jsPDF from 'jspdf';

const PasswordManager: React.FC = () => {
    const { credentials, updateCredentials } = useAppContext();
    const { t } = useTranslation();
    const [newCreds, setNewCreds] = useState(credentials);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCreds({ ...newCreds, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateCredentials(newCreds);

        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Password Change Report', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleString('en-US')}`, 14, 35);
        
        doc.line(14, 40, 196, 40); // separator line

        doc.text(`New Login Username: ${newCreds.loginUser}`, 14, 50);
        doc.text(`New Login Password: ${newCreds.loginPass}`, 14, 60);
        doc.text(`New Admin Panel Password: ${newCreds.adminPass}`, 14, 70);
        
        doc.line(14, 80, 196, 80); // separator line
        
        doc.setFontSize(10);
        doc.setTextColor(255, 0, 0); // Red color for warning
        const warningText = 'IMPORTANT: Please store this information securely. It cannot be recovered.';
        doc.text(warningText, 105, 90, { align: 'center' });

        doc.save(`password-report-${new Date().toISOString().split('T')[0]}.pdf`);

        alert(t('passwords_updated_success'));
    };

    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-500 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-yellow-800 dark:text-yellow-300">{t('password_management')}</h2>
            <div className="space-y-4">
                <div>
                    <label className="block font-medium">{t('login_username')}</label>
                    <input type="text" name="loginUser" value={newCreds.loginUser} onChange={handleChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                </div>
                <div>
                    <label className="block font-medium">{t('login_password')}</label>
                    <input type="text" name="loginPass" value={newCreds.loginPass} onChange={handleChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                </div>
                 <div>
                    <label className="block font-medium">{t('admin_panel_password')}</label>
                    <input type="text" name="adminPass" value={newCreds.adminPass} onChange={handleChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                </div>
                <button onClick={handleSave} className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-white font-bold">
                    {t('save_and_export_pdf')}
                </button>
            </div>
        </div>
    );
};

export default PasswordManager;