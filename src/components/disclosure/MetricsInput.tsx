import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { DisclosureMetrics, DataQuality } from '@/types/disclosure-data';
import { DATA_QUALITY_DESCRIPTIONS } from '@/types/disclosure-data';

interface MetricsInputProps {
  metrics: Partial<DisclosureMetrics>;
  onMetricsChange: (metrics: Partial<DisclosureMetrics>) => void;
}

export function MetricsInput({ metrics, onMetricsChange }: MetricsInputProps) {
  const handleChange = (field: keyof DisclosureMetrics, value: any) => {
    onMetricsChange({ ...metrics, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ESG Metrics & Data
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p>Enter quantitative ESG data. All fields are optional - only fill in what you have available. Even estimates are valuable.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Fill in available metrics - all fields optional
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Data Quality */}
        <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <Label htmlFor="data-quality">Data Quality Level</Label>
            <Badge variant="outline">{metrics.data_quality || 'estimated'}</Badge>
          </div>
          <Select
            value={metrics.data_quality || 'estimated'}
            onValueChange={(v) => handleChange('data_quality', v as DataQuality)}
          >
            <SelectTrigger id="data-quality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DATA_QUALITY_DESCRIPTIONS).map(([key, desc]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium capitalize">{key}</span>
                    <span className="text-xs text-muted-foreground">{desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Environmental Metrics */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm flex items-center gap-2">
            🌍 Environmental
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scope1" className="text-sm">Scope 1 Emissions (tonnes CO₂e)</Label>
              <Input
                id="scope1"
                type="number"
                step="0.01"
                value={metrics.scope1_tonnes_co2e || ''}
                onChange={(e) => handleChange('scope1_tonnes_co2e', parseFloat(e.target.value) || undefined)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scope2" className="text-sm">Scope 2 Emissions (tonnes CO₂e)</Label>
              <Input
                id="scope2"
                type="number"
                step="0.01"
                value={metrics.scope2_tonnes_co2e || ''}
                onChange={(e) => handleChange('scope2_tonnes_co2e', parseFloat(e.target.value) || undefined)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="scope3-calc"
              checked={metrics.scope3_calculated || false}
              onCheckedChange={(checked) => handleChange('scope3_calculated', checked)}
            />
            <Label htmlFor="scope3-calc" className="text-sm font-normal cursor-pointer">
              We've calculated Scope 3 emissions
            </Label>
          </div>

          {metrics.scope3_calculated && (
            <div className="space-y-2">
              <Label htmlFor="scope3" className="text-sm">Scope 3 Emissions (tonnes CO₂e)</Label>
              <Input
                id="scope3"
                type="number"
                step="0.01"
                value={metrics.scope3_tonnes_co2e || ''}
                onChange={(e) => handleChange('scope3_tonnes_co2e', parseFloat(e.target.value) || undefined)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="energy" className="text-sm">Total Energy (kWh)</Label>
              <Input
                id="energy"
                type="number"
                step="0.01"
                value={metrics.total_energy_kwh || ''}
                onChange={(e) => handleChange('total_energy_kwh', parseFloat(e.target.value) || undefined)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="renewable" className="text-sm">Renewable Energy (%)</Label>
              <Input
                id="renewable"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={metrics.renewable_energy_percent || ''}
                onChange={(e) => handleChange('renewable_energy_percent', parseFloat(e.target.value) || undefined)}
                placeholder="0-100"
              />
            </div>
          </div>
        </div>

        {/* Social Metrics */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-medium text-sm flex items-center gap-2">
            👥 Social
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employees" className="text-sm">Total Employees</Label>
              <Input
                id="employees"
                type="number"
                value={metrics.total_employees || ''}
                onChange={(e) => handleChange('total_employees', parseInt(e.target.value) || undefined)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="women" className="text-sm">Women (%)</Label>
              <Input
                id="women"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={metrics.percent_women || ''}
                onChange={(e) => handleChange('percent_women', parseFloat(e.target.value) || undefined)}
                placeholder="0-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="women-lead" className="text-sm">Women in Leadership (%)</Label>
              <Input
                id="women-lead"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={metrics.percent_women_leadership || ''}
                onChange={(e) => handleChange('percent_women_leadership', parseFloat(e.target.value) || undefined)}
                placeholder="0-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="turnover" className="text-sm">Employee Turnover (%)</Label>
              <Input
                id="turnover"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={metrics.employee_turnover_percent || ''}
                onChange={(e) => handleChange('employee_turnover_percent', parseFloat(e.target.value) || undefined)}
                placeholder="0-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lti" className="text-sm">Lost Time Injuries</Label>
            <Input
              id="lti"
              type="number"
              value={metrics.lost_time_injuries || ''}
              onChange={(e) => handleChange('lost_time_injuries', parseInt(e.target.value) || undefined)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2 border-t pt-4">
          <Label htmlFor="notes" className="text-sm">Notes / Context</Label>
          <Textarea
            id="notes"
            value={metrics.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Add any context about your data, methodology, or data gaps..."
            rows={3}
          />
        </div>

        {/* Helper */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="font-medium mb-1">💡 Don't have all the data?</p>
          <p>That's completely normal for SMEs. Enter what you have - even rough estimates are valuable. The AI will help present your data professionally and explain any gaps.</p>
        </div>
      </CardContent>
    </Card>
  );
}
