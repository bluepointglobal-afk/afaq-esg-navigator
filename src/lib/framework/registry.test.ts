import { describe, it, expect } from 'vitest';
import { buildOutline } from './registry';

describe('Framework Registry - buildOutline', () => {
    it('should include global items for any jurisdiction', () => {
        const outline = buildOutline({
            jurisdiction: 'UAE',
            isListed: false,
            selectedFrameworks: ['IFRS_S1']
        });

        expect(outline.some(s => s.items.some(i => i.id === 'IFRS-S1-GOV-1'))).toBe(true);
    });

    it('should exclude listed-only items for non-listed companies', () => {
        const outline = buildOutline({
            jurisdiction: 'UAE',
            isListed: false,
            selectedFrameworks: ['LOCAL_UAE']
        });

        expect(outline.some(s => s.items.some(i => i.id === 'UAE-ADX-1'))).toBe(false);
    });

    it('should include listed-only items for listed companies', () => {
        const outline = buildOutline({
            jurisdiction: 'UAE',
            isListed: true,
            selectedFrameworks: ['LOCAL_UAE']
        });

        expect(outline.some(s => s.items.some(i => i.id === 'UAE-ADX-1'))).toBe(true);
    });

    it('should only include items from selected frameworks', () => {
        const outline = buildOutline({
            jurisdiction: 'KSA',
            isListed: false,
            selectedFrameworks: ['IFRS_S1'] // GRI and KSA not selected
        });

        expect(outline.some(s => s.topic === 'SOCIAL')).toBe(false);
    });
});
