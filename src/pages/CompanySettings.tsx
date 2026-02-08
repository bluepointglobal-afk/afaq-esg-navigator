import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCompany, useUpdateCompany, CompanyData } from '@/hooks/use-company';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/layout/Logo';
import { ArrowLeft, Save, Building2, Globe } from 'lucide-react';
import { COUNTRIES, INDUSTRIES, STOCK_EXCHANGES } from '@/types';
import { useUserProfile } from '@/hooks/use-user-profile';
import { TierCard } from '@/components/tier/TierCard';

export default function CompanySettings() {
    const navigate = useNavigate();
    const { data: company, isLoading } = useCompany();
    const { data: userProfile } = useUserProfile();
    const updateCompanyMutation = useUpdateCompany();

    const { register, handleSubmit, reset, setValue, watch, formState: { isDirty } } = useForm<CompanyData>();

    useEffect(() => {
        if (company) {
            reset(company);
        }
    }, [company, reset]);

    const country = watch('country');
    const isListed = watch('isListed');

    const onSubmit = (data: CompanyData) => {
        if (company?.id) {
            updateCompanyMutation.mutate({ ...data, id: company.id });
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading settings...</div>;
    }

    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p>Company profile not found.</p>
                <Button onClick={() => navigate('/onboarding')}>Go to Onboarding</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                            <Logo size="sm" />
                        </div>
                        <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty || updateCompanyMutation.isPending}>
                            {updateCompanyMutation.isPending ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6">Company Settings</h1>

                <div className="grid gap-6">
                    {/* Subscription Card */}
                    {userProfile && <TierCard currentTier={userProfile.tier} />}

                    {/* Identity Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" /> Corporate Identity</CardTitle>
                            <CardDescription>Update your company's core information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Company Name (English)</Label>
                                    <Input id="name" {...register('name')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nameArabic">Company Name (Arabic)</Label>
                                    <Input id="nameArabic" {...register('nameArabic')} dir="rtl" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jurisdiction Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Jurisdiction & Frameworks</CardTitle>
                            <CardDescription>Changing these settings may alter your required compliance frameworks.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Country of Incorporation</Label>
                                    <Select
                                        value={country}
                                        onValueChange={(val) => setValue('country', val, { shouldDirty: true })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(COUNTRIES).map(([code, { name }]) => (
                                                <SelectItem key={code} value={code}>{name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Industry Sector</Label>
                                    <Select
                                        value={watch('industry')}
                                        onValueChange={(val) => setValue('industry', val, { shouldDirty: true })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INDUSTRIES.map((ind) => (
                                                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isListed"
                                    checked={isListed}
                                    onCheckedChange={(checked) => setValue('isListed', checked as boolean, { shouldDirty: true })}
                                />
                                <Label htmlFor="isListed">Publicly Listed Company</Label>
                            </div>

                            {isListed && country && STOCK_EXCHANGES[country] && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label>Stock Exchange</Label>
                                    <Select
                                        value={watch('stockExchange') || ''}
                                        onValueChange={(val) => setValue('stockExchange', val, { shouldDirty: true })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Exchange" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STOCK_EXCHANGES[country]?.map((ex) => (
                                                <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Financials Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Size & Revenue</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="employeeCount">Employees</Label>
                                    <Input id="employeeCount" type="number" {...register('employeeCount', { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="annualRevenue">Annual Revenue</Label>
                                    <Input id="annualRevenue" type="number" {...register('annualRevenue', { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="revenueCurrency">Currency</Label>
                                    <Input id="revenueCurrency" {...register('revenueCurrency')} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
