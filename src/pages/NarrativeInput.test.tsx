import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import NarrativeInput from './NarrativeInput';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock the hooks
const mockNavigate = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ reportId: '123' }),
    };
});

vi.mock('@/hooks/use-report-narratives', () => ({
    useReportNarrative: vi.fn(),
    useUpdateReportNarrative: vi.fn(() => ({
        mutateAsync: mockMutateAsync,
        isPending: false,
    })),
}));

vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
        toast: vi.fn(),
    }),
}));

import { useReportNarrative } from '@/hooks/use-report-narratives';

describe('NarrativeInput', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('populates form with existing data', async () => {
        (useReportNarrative as Mock).mockReturnValue({
            data: {
                reportId: '123',
                governanceText: 'Existing Governance',
                esgText: 'Existing ESG',
                riskText: 'Existing Risk',
                transparencyText: 'Existing Transparency',
            },
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={['/compliance/narrative/123']}>
                <Routes>
                    <Route path="/compliance/narrative/:reportId" element={<NarrativeInput />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Governance Narrative/i)).toHaveValue('Existing Governance');
            expect(screen.getByLabelText(/ESG Narrative/i)).toHaveValue('Existing ESG');
        });
    });

    it('submits data correctly', async () => {
        (useReportNarrative as Mock).mockReturnValue({
            data: null, // No existing data
            isLoading: false,
        });

        render(
            <MemoryRouter initialEntries={['/compliance/narrative/123']}>
                <Routes>
                    <Route path="/compliance/narrative/:reportId" element={<NarrativeInput />} />
                </Routes>
            </MemoryRouter>
        );

        const governanceInput = screen.getByLabelText(/Governance Narrative/i);
        fireEvent.change(governanceInput, { target: { value: 'New Governance Text' } });

        const saveButton = screen.getByText(/Save & Continue/i);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                reportId: '123',
                governanceText: 'New Governance Text',
                esgText: '',
                riskText: '',
                transparencyText: '',
            });
            expect(mockNavigate).toHaveBeenCalledWith('/compliance/disclosure/123');
        });
    });

    it('shows loading state', () => {
        (useReportNarrative as Mock).mockReturnValue({
            data: null,
            isLoading: true,
        });

        render(
            <MemoryRouter initialEntries={['/compliance/narrative/123']}>
                <Routes>
                    <Route path="/compliance/narrative/:reportId" element={<NarrativeInput />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading narrative data/i)).toBeInTheDocument();
    });
});
