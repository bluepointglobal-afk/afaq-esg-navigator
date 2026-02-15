import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    Table as TableIcon,
    FileJson,
    FileSpreadsheet,
    Download,
    ShieldCheck,
    Clock,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { DisclosureOutput } from '@/types/compliance';

export type ExportFormat = 'pdf' | 'html' | 'appendix' | 'json' | 'excel';

interface ExportPanelProps {
    disclosure: DisclosureOutput;
    isGenerating?: boolean;
    isPdfGenerating?: boolean;
    onDownload: (format: ExportFormat) => void;
}

export function ExportPanel({ disclosure, isGenerating, isPdfGenerating, onDownload }: ExportPanelProps) {
    const [activeFormat, setActiveFormat] = useState('narrative');

    const handleDownload = (format: ExportFormat) => {
        onDownload(format);
    };

    return (
        <Card className="overflow-hidden border-2 border-primary/10 shadow-lg bg-white/50 backdrop-blur-sm">
            <div className="bg-primary/5 p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">Export Package v1</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span>Generated: {new Date(disclosure.generatedAt).toLocaleString()}</span>
                            <Badge variant="outline" className="text-[10px] py-0 h-4 bg-white">v{disclosure.templateVersion || '1.0.0'}</Badge>
                        </div>
                    </div>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Framework Alignment</div>
                    <div className="flex gap-1 mt-1">
                        {disclosure.sections.map(s => (
                            <div key={s.id} className="w-2 h-2 rounded-full bg-green-500" title={s.title} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6">
                <Tabs defaultValue="narrative" onValueChange={setActiveFormat} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="narrative" className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="hidden sm:inline">Narrative Report</span>
                            <span className="sm:hidden">Report</span>
                        </TabsTrigger>
                        <TabsTrigger value="appendix" className="flex items-center gap-2">
                            <TableIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Evidence Appendix</span>
                            <span className="sm:hidden">Appendix</span>
                        </TabsTrigger>
                        <TabsTrigger value="json" className="flex items-center gap-2">
                            <FileJson className="w-4 h-4" />
                            <span className="hidden sm:inline">Disclosure Pack</span>
                            <span className="sm:hidden">JSON</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="narrative" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 italic text-sm text-slate-600 line-clamp-3">
                                    "{disclosure.sections[0]?.narrative?.substring(0, 300) || 'No preview available'}..."
                                </div>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ChevronRight className="w-3 h-3 text-primary" />
                                        Professional PDF format
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ChevronRight className="w-3 h-3 text-primary" />
                                        Auditor-friendly tone
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <ChevronRight className="w-3 h-3 text-primary" />
                                        Multilingual support
                                    </li>
                                </ul>
                            </div>
                            <div className="w-full md:w-64 flex flex-col justify-center gap-3">
                                <Button
                                    size="lg"
                                    className="w-full gap-2 shadow-md hover:shadow-lg transition-all"
                                    onClick={() => handleDownload('pdf')}
                                    disabled={isPdfGenerating}
                                >
                                    {isPdfGenerating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Generating PDF...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            Download PDF
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full gap-2"
                                    onClick={() => handleDownload('html')}
                                >
                                    <FileText className="w-3 h-3" />
                                    Download HTML
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="appendix" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Evidence Summary</span>
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{disclosure.sections.reduce((acc, s) => acc + (s.dataPoints?.length || 0), 0)} Data Points</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {disclosure.sections.slice(0, 3).map(s => (
                                            <div key={s.id} className="flex items-center justify-between text-xs">
                                                <span className="text-slate-600">{s.title}</span>
                                                <span className="text-slate-400 font-mono">{(s.dataPoints?.length || 0)} pts</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-64 flex flex-col justify-center gap-3">
                                <Button
                                    size="lg"
                                    className="w-full gap-2 shadow-md hover:shadow-lg transition-all"
                                    onClick={() => handleDownload('excel')}
                                >
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Download Excel
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full gap-2"
                                    onClick={() => handleDownload('appendix')}
                                >
                                    <TableIcon className="w-3 h-3" />
                                    Download HTML
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="json" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-slate-300 overflow-hidden border border-slate-800 shadow-inner">
                                    <pre className="opacity-70">
                                        {`{
  "reportId": "${disclosure.reportId}",
  "generated_at": "${disclosure.generatedAt}",
  "sections_count": ${disclosure.sections.length},
  "assessment_id": "${(disclosure.assessmentId || 'N/A').substring(0, 18)}...",
  "status": "Final",
  "hash": "sha256:7bc94...82e"
}`}
                                    </pre>
                                </div>
                            </div>
                            <div className="w-full md:w-64 flex flex-col justify-center">
                                <Button variant="secondary" size="lg" className="w-full gap-2 border shadow-sm" onClick={() => handleDownload('json')}>
                                    <Download className="w-4 h-4" />
                                    Download JSON
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground mt-3">Full disclosure_pack data</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                        ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">Verified by AFAQ Governance Engine</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                    FID: <span className="font-mono">{(disclosure.id || 'N/A').substring(0, 8)}</span>
                </div>
            </div>
        </Card>
    );
}
