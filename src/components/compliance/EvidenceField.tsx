import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface EvidenceFieldProps {
  evidenceUrls?: string[];
  notes?: string;
  onEvidenceChange: (urls: string[], notes: string) => void;
}

export function EvidenceField({ evidenceUrls = [], notes = '', onEvidenceChange }: EvidenceFieldProps) {
  const [urls, setUrls] = useState<string[]>(evidenceUrls.length > 0 ? evidenceUrls : ['']);
  const [localNotes, setLocalNotes] = useState(notes);

  const addUrl = () => {
    const newUrls = [...urls, ''];
    setUrls(newUrls);
  };

  const removeUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    onEvidenceChange(newUrls.filter(u => u.trim()), localNotes);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
    onEvidenceChange(newUrls.filter(u => u.trim()), localNotes);
  };

  const updateNotes = (value: string) => {
    setLocalNotes(value);
    onEvidenceChange(urls.filter(u => u.trim()), value);
  };

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
      <div>
        <Label className="text-sm text-muted-foreground">Evidence URLs (optional)</Label>
        <div className="space-y-2 mt-2">
          {urls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/document.pdf"
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                className="flex-1"
              />
              {urls.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUrl(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addUrl}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add URL
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-sm text-muted-foreground">Notes (optional)</Label>
        <Textarea
          placeholder="Additional context or explanation..."
          value={localNotes}
          onChange={(e) => updateNotes(e.target.value)}
          rows={2}
          className="mt-2"
        />
      </div>
    </div>
  );
}
