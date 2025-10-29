
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { DeviceStatus, Page } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import LabelEditor from './LabelEditor';
import PasswordManager from './PasswordManager';

const AdminAuthModal: React.FC<{ onAuthAttempt: (password: string) => boolean, onCancel: () => void }> = ({ onAuthAttempt, onCancel }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const { t } = useTranslation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onAuthAttempt(password);
        if (!success) {
            setError(true);
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">{t('admin_panel')}</h2>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{t('enter_admin_password')}</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    className={`w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${error ? 'border-red-500' : ''}`}
                    autoFocus
                />
                {error && <p className="text-red-500 text-xs mt-1">كلمة المرور غير صحيحة.</p>}
                <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 font-semibold transition-colors">
                        {t('cancel')}
                    </button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">
                        {t('submit')}
                    </button>
                </div>
            </form>
        </div>
    );
};

const ConfirmDeleteModal: React.FC<{ onConfirmDelete: () => void, onCancel: () => void, adminPass: string }> = ({ onConfirmDelete, onCancel, adminPass }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState<'initial' | 'password'>('initial');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleInitialConfirm = () => {
        setStep('password');
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === adminPass) {
            onConfirmDelete();
        } else {
            setError(true);
        }
    };

    if (step === 'initial') {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400">{t('confirm_delete_all_reports')}</h3>
                    <p className="my-4">{t('confirm_delete_all_reports')}</p>
                    <div className="flex justify-end gap-4">
                        <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500">{t('cancel')}</button>
                        <button onClick={handleInitialConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">{t('confirm_delete')}</button>
                    </div>
                </div>
            </div>
        );
    }
    
    // step === 'password'
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
            <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold">{t('enter_admin_password')}</h3>
                <p className="my-2 text-sm text-gray-600 dark:text-gray-400">{t('confirm_delete_password_prompt')}</p>
                 <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    className={`w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 mt-4 ${error ? 'border-red-500' : ''}`}
                    autoFocus
                />
                {error && <p className="text-red-500 text-xs mt-1">كلمة المرور غير صحيحة.</p>}
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500">{t('cancel')}</button>
                    <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">{t('confirm_delete')}</button>
                </div>
            </form>
        </div>
    );
};


const AdminView: React.FC = () => {
    const { prices, updatePrices, devices, addDevice, deleteDevice, updateDeviceStatus, deleteReports, credentials, setPage } = useAppContext();
    const [isAuthed, setIsAuthed] = useState(false);
    const [authMode, setAuthMode] = useState<'full' | 'password_only'>('full');
    const [showLabelEditor, setShowLabelEditor] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [currentPrices, setCurrentPrices] = useState(prices);
    const { t } = useTranslation();

    useEffect(() => {
        setCurrentPrices(prices);
    }, [prices]);

    const handleAuthAttempt = (password: string): boolean => {
        if (password === credentials.adminPass) {
            setIsAuthed(true);
            setAuthMode('full');
            setShowLabelEditor(false);
            return true;
        } else if (password === 'names') {
            setIsAuthed(true);
            setAuthMode('full');
            setShowLabelEditor(true);
            return true;
        } else if (password === 'password') {
            setIsAuthed(true);
            setAuthMode('password_only');
            setShowLabelEditor(false);
            return true;
        }
        return false;
    };
    
    if (!isAuthed) {
        return <AdminAuthModal onAuthAttempt={handleAuthAttempt} onCancel={() => setPage(Page.DASHBOARD)} />;
    }

    if (authMode === 'password_only') {
        return (
            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <PasswordManager />
            </div>
        );
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPrices({ ...currentPrices, [e.target.name]: parseFloat(e.target.value) });
    };

    const handlePriceUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updatePrices(currentPrices);
        alert('تم تحديث الأسعار بنجاح!');
    };
    
    const handleConfirmDeleteReports = () => {
        deleteReports();
        setShowConfirmDelete(false);
        alert('تم حذف جميع التقارير.');
    };

    return (
        <div className="space-y-8">
             {showConfirmDelete && (
                <ConfirmDeleteModal 
                    onConfirmDelete={handleConfirmDeleteReports}
                    onCancel={() => setShowConfirmDelete(false)}
                    adminPass={credentials.adminPass}
                />
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">{t('price_management')}</h2>
                <form onSubmit={handlePriceUpdate} className="space-y-4">
                    <div>
                        <label className="block font-medium">{t('single_price_per_hour')}</label>
                        <input type="number" name="single" value={currentPrices.single} onChange={handlePriceChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block font-medium">{t('double_price_per_hour')}</label>
                        <input type="number" name="double" value={currentPrices.double} onChange={handlePriceChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    </div>
                    <div>
                        <label className="block font-medium">{t('quad_price_per_hour')}</label>
                        <input type="number" name="quad" value={currentPrices.quad} onChange={handlePriceChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    </div>
                    <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{t('update_prices')}</button>
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">{t('device_management')}</h2>
                <button onClick={addDevice} className="px-4 py-2 rounded bg-green-600 text-white mb-4">{t('add_new_device')}</button>
                <ul className="space-y-2">
                    {devices.map(d => (
                        <li key={d.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <span>{d.name}</span>
                            <div className="flex gap-2">
                                <select 
                                    value={d.status} 
                                    onChange={(e) => updateDeviceStatus(d.id, e.target.value as DeviceStatus)}
                                    className="p-1 border rounded bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-sm"
                                >
                                    <option value={DeviceStatus.Available}>{t('available')}</option>
                                    <option value={DeviceStatus.Busy}>{t('busy')}</option>
                                    <option value={DeviceStatus.Maintenance}>{t('maintenance')}</option>
                                </select>
                                <button
                                    onClick={() => deleteDevice(d.id)}
                                    disabled={d.status === DeviceStatus.Busy}
                                    className="px-2 py-1 text-sm rounded bg-red-600 text-white disabled:bg-gray-400"
                                >
                                    حذف
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">{t('reports_management')}</h2>
                <button onClick={() => setShowConfirmDelete(true)} className="px-4 py-2 rounded bg-red-600 text-white">{t('delete_all_reports')}</button>
            </div>
            
            {showLabelEditor && <LabelEditor />}

        </div>
    );
};

export default AdminView;