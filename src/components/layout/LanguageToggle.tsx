import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'icon';
}

export function LanguageToggle({ variant = 'ghost', size = 'sm' }: LanguageToggleProps) {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={toggleLanguage}
            className="gap-2"
            title={t('common.language')}
        >
            <Globe className="w-4 h-4" />
            <span className="font-medium">
                {language === 'en' ? 'عربي' : 'EN'}
            </span>
        </Button>
    );
}
