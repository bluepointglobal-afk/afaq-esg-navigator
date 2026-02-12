import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, CheckCircle2, Clock, Shield, Download, Trash2 } from "lucide-react";
import { useState } from "react";

interface Evidence {
  id: string;
  questionId: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileType: 'pdf' | 'image' | 'excel' | 'document';
  fileSize?: number;
  verificationStatus: 'preliminary' | 'verified' | 'audited';
  tags: string[];
  createdAt: string;
}

// Mock data for demonstration
const MOCK_EVIDENCE: Evidence[] = [
  {
    id: '1',
    questionId: 'gov-board-oversight',
    title: 'Board Resolution ESG Committee',
    description: 'Board minutes approving ESG committee formation',
    fileUrl: '/evidence/board-resolution.pdf',
    fileType: 'pdf',
    fileSize: 245000,
    verificationStatus: 'verified',
    tags: ['governance', 'policy'],
    createdAt: '2026-01-15T10:30:00Z'
  },
  {
    id: '2',
    questionId: 'env-ghg-emissions',
    title: 'GHG Emissions Verification Report',
    description: 'Third-party verification of Scope 1, 2 emissions',
    fileUrl: '/evidence/ghg-verification.pdf',
    fileType: 'pdf',
    fileSize: 1200000,
    verificationStatus: 'audited',
    tags: ['environmental', 'certificate', 'calculation'],
    createdAt: '2026-01-20T14:15:00Z'
  },
  {
    id: '3',
    questionId: 'social-diversity',
    title: 'Workforce Diversity Report 2024',
    description: 'HR records showing gender distribution by department',
    fileUrl: '/evidence/diversity-report.xlsx',
    fileType: 'excel',
    fileSize: 89000,
    verificationStatus: 'preliminary',
    tags: ['social', 'report'],
    createdAt: '2026-02-01T09:45:00Z'
  }
];

const VERIFICATION_STATUS = {
  preliminary: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Preliminary' },
  verified: { icon: CheckCircle2, color: 'bg-green-100 text-green-800 border-green-300', label: 'Verified' },
  audited: { icon: Shield, color: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Audited' },
};

const FILE_TYPE_ICONS = {
  pdf: '📄',
  image: '🖼️',
  excel: '📊',
  document: '📝',
};

function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface EvidenceRegisterProps {
  reportId?: string;
  mode?: 'full' | 'summary';
}

export function EvidenceRegister({ reportId, mode = 'full' }: EvidenceRegisterProps) {
  const [evidence] = useState<Evidence[]>(MOCK_EVIDENCE);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // TODO: Implement file upload
    setTimeout(() => setIsUploading(false), 1000);
  };

  if (mode === 'summary') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Evidence Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {evidence.slice(0, 3).map((item) => {
              const StatusIcon = VERIFICATION_STATUS[item.verificationStatus].icon;
              return (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <span>{FILE_TYPE_ICONS[item.fileType]}</span>
                  <span className="flex-1 truncate">{item.title}</span>
                  <StatusIcon className="w-3 h-3 text-muted-foreground" />
                </div>
              );
            })}
          </div>
          {evidence.length > 3 && (
            <p className="text-xs text-muted-foreground mt-2">
              +{evidence.length - 3} more documents
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Evidence Register & Audit Trail
            </CardTitle>
            <CardDescription>
              Supporting documents for your ESG disclosure. All uploads are tracked for audit compliance.
            </CardDescription>
          </div>
          <Button onClick={handleUpload} disabled={isUploading} size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload Evidence
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Evidence list */}
        <div className="space-y-3">
          {evidence.map((item) => {
            const StatusIcon = VERIFICATION_STATUS[item.verificationStatus].icon;
            const statusConfig = VERIFICATION_STATUS[item.verificationStatus];

            return (
              <div
                key={item.id}
                className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl">{FILE_TYPE_ICONS[item.fileType]}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatFileSize(item.fileSize)}</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusConfig.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upload placeholder */}
        {evidence.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-semibold mb-2">No Evidence Uploaded Yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Upload supporting documents to strengthen your disclosure
            </p>
            <Button onClick={handleUpload} disabled={isUploading}>
              Upload First Document
            </Button>
          </div>
        )}

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="font-semibold text-blue-900 mb-1">Audit Trail Active</p>
          <p className="text-blue-700 text-xs">
            All uploads, modifications, and deletions are logged with timestamps and user information for audit compliance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
