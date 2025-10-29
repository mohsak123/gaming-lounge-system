
import { useAppContext } from './useAppContext';
import { INITIAL_LABELS } from '../constants';

export const useTranslation = () => {
  const { labels } = useAppContext();

  const t = (key: keyof typeof INITIAL_LABELS, ...args: (string | number)[]) => {
    let translation = labels[key] || key;
    if (args.length > 0) {
      args.forEach((arg, index) => {
        translation = translation.replace(`{${index}}`, String(arg));
      });
    }
    return translation;
  };

  return { t };
};
