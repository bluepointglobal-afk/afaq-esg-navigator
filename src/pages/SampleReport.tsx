import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SAMPLE_SUSTAINABILITY_REPORT } from '@/lib/sample/sample-report';
import { useLanguage } from '@/contexts/LanguageContext';

function Watermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        opacity: 0.06,
      }}
    >
      <div
        className="absolute -left-40 top-24 rotate-[-22deg] whitespace-nowrap text-6xl font-black tracking-widest text-slate-900"
      >
        SAMPLE • FICTIONAL DATA • SAMPLE • FICTIONAL DATA • SAMPLE • FICTIONAL DATA
      </div>
      <div
        className="absolute -left-40 top-96 rotate-[-22deg] whitespace-nowrap text-6xl font-black tracking-widest text-slate-900"
      >
        SAMPLE • FICTIONAL DATA • SAMPLE • FICTIONAL DATA • SAMPLE • FICTIONAL DATA
      </div>
    </div>
  );
}

export default function SampleReport() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const report = useMemo(() => SAMPLE_SUSTAINABILITY_REPORT, []);
  
  // Map section IDs to translated titles
  const getSectionTitle = (sectionId: string) => {
    const titleMap: Record<string, string> = {
      'executive_summary': t('sampleReport.executiveSummary'),
      'materiality': t('sampleReport.materiality'),
      'disclosures': t('sampleReport.disclosures'),
      'action_plan': t('sampleReport.actionPlan'),
      'evidence_register': t('sampleReport.evidenceRegister'),
    };
    return titleMap[sectionId] || sectionId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('sampleReport.backButton')}
              </Button>
              <Logo size="sm" />
            </div>
            <Badge variant="secondary">{t('sampleReport.publicSampleBadge')}</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Watermark />

            <Card className="p-6 md:p-8 mb-6 border-primary/20 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{t('sampleReport.pageTitle')}</h1>
                  <p className="text-muted-foreground mt-2">
                    {report.companyName} • Reporting Year {report.reportingYear} • {report.jurisdiction}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-medium">{t('sampleReport.exampleOnlyBadge')}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                <strong>{t('sampleReport.importantNote')}</strong> {report.note}
              </p>
            </Card>

            <div className="space-y-6">
              {report.sections.map((s) => (
                <Card key={s.id} className="p-6 md:p-8 relative">
                  <h2 className="text-xl font-semibold mb-4">{getSectionTitle(s.id)}</h2>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {s.content}
                    </pre>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 mt-6 bg-white border-dashed">
              <p className="text-sm text-muted-foreground">
                {t('sampleReport.ctaText')}
              </p>
              <div className="mt-4">
                <Button onClick={() => navigate('/auth')} variant="outline">
                  {t('sampleReport.signInButton')}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
