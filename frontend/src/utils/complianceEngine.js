/**
 * Compliance Transformation Engine
 * This script transforms granular mappings from the backend into the structured format 
 * required by ResultsPage and ReportPage.
 */

export const transformMappings = (mappings) => {
    let mappedDetails = [];
    let violations = 0;
    let complianceScore = 100;

    if (!mappings || !Array.isArray(mappings)) {
        return { score: 100, totalFindings: 0, violations: 0, details: [] };
    }

    mappings.forEach((m) => {
        // Assign risk based on section
        const isHighRisk = m.section.includes("8") || m.section.includes("9") || m.section.includes("10");
        const riskLevel = isHighRisk ? "High" : "Medium";

        // Professional Rationale Generation
        const mappingRationale = `This section was identified as the primary regulatory requirement because the technical finding directly involves components or processes referenced in ${m.title}. The mandate for ${m.section} governs the standards for such operations under the DPDP Act 2023.`;

        const technicalImpact = `The identified issue suggests a potential gap in implementing the statutory safeguards required by this section. Failure to address this may result in non-compliance with the legal framework regarding ${m.title.toLowerCase()}, specifically impacting data integrity and principal rights.`;

        mappedDetails.push({
            finding: m.finding,
            section: {
                number: `Section ${m.section}`,
                title: m.title,
                chapter: m.chapter
            },
            status: "Non-Compliant",
            risk: riskLevel,
            recommendation: `Implement controls to ensure compliance with ${m.title} as per ${m.section}.`,
            explanation: `This technical context directly relates to the requirements set forth in ${m.section} regarding ${m.title}.`,
            mapping_rationale: mappingRationale,
            technical_impact: technicalImpact,
            relevant_text: m.description
        });

        const deduction = riskLevel === "High" ? 12 : 6;
        complianceScore -= deduction;
        violations++;
    });

    return {
        score: Math.max(0, complianceScore),
        totalFindings: mappedDetails.length,
        violations: violations,
        details: mappedDetails,
    };
};
