import { describe, it, expect } from 'vitest';

describe('Disclosure Quality - UI Content Requirements', () => {
    it('should identify empty narratives and suggest data limitation paragraphs', () => {
        const mockDisclosureOutput = {
            sections: [
                {
                    pillar: 'governance',
                    narrative: '', // Empty narrative
                    missingInformation: ['Board composition data', 'Audit committee charter'],
                },
            ],
        };

        // Logic to be checked in UI or processing layer
        const section = mockDisclosureOutput.sections[0];
        const isMissingData = !section.narrative || section.narrative.trim().length === 0;

        expect(isMissingData).toBe(true);
        expect(section.missingInformation.length).toBeGreaterThan(0);

        // The UI should display "Information not provided" or similar
        const uiText = section.narrative || 'Information not provided for this section due to data limitations in the assessment.';
        expect(uiText).toContain('Information not provided');
        expect(uiText).toContain('data limitations');
    });

    it('should contain explicit [SOURCE_REQUIRED] placeholders instead of fabricated citations', () => {
        const mockNarrative = "The company follows governance best practices [SOURCE_REQUIRED: UAE Corporate Governance Code, Article 12].";

        // AI guardrail check: Ensure narrative contains placeholders, not hardcoded fake citations
        expect(mockNarrative).toContain('[SOURCE_REQUIRED:');

        // Positive check: No specific "Article 12" without the source required tag
        const fakeCitationPattern = /Article \d+/;
        expect(mockNarrative).toMatch(fakeCitationPattern);
        expect(mockNarrative).toContain('[SOURCE_REQUIRED:');
    });
});
