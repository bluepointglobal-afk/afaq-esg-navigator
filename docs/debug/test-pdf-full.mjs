import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read sample report to extract sections
const sampleReportPath = path.join(__dirname, 'src/lib/sample/sample-report.ts');
const sampleReportContent = fs.readFileSync(sampleReportPath, 'utf8');

// Parse the sample report to get sections (simplified extraction)
// For now, we'll load the actual sections from the TypeScript file by parsing
// Let's just create a comprehensive test with multiple sections

const payload = {
  companyName: 'Gulf Horizon Manufacturing LLC (Fictional Example)',
  reportingYear: 2025,
  jurisdiction: 'UAE (illustrative)',
  sections: [
    {
      id: 'executive_summary',
      title: 'Executive Summary',
      content: `**Report Purpose & Scope**
This report presents the ESG compliance assessment and sustainability performance of Gulf Horizon Manufacturing LLC for the reporting period FY2025. The assessment covers environmental, social, and governance practices across our operational footprint, benchmarked against regional and international standards including IFRS S1/S2 concepts, TCFD recommendations, and UAE regulatory expectations.

**Company Profile (Fictional Example)**
┌─────────────────────────────────────────────────┐
│ Legal Entity:    Gulf Horizon Manufacturing LLC │
│ Sector:          Light Manufacturing (Packaging)│
│ Employee Count:  ~180 FTE                       │
│ Facilities:      1 production site (UAE)        │
│ Annual Revenue:  AED 85-95M (illustrative)      │
│ Reporting Year:  2025                           │
│ Boundary:        Operational control            │
└─────────────────────────────────────────────────┘

**Assessment Methodology**
Our comprehensive assessment methodology includes:
• Structured questionnaire covering 120+ ESG criteria
• Gap analysis against best practices and regulatory requirements
• Risk-based scoring across Environmental, Social, and Governance pillars
• Evidence-based verification of policies, procedures, and data systems
• Forward-looking action planning with prioritized recommendations

**Overall ESG Readiness Score: 68/100 (Developing → Improving)**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    PILLAR SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Environmental:        72/100  ████████████░░░░░
  Social:               65/100  ██████████░░░░░░░
  Governance:           67/100  ███████████░░░░░░
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Key Strengths Identified**
✓ Basic environmental monitoring systems in place (energy, water, waste)
✓ Defined ESG governance roles with executive sponsorship
✓ Initial health & safety procedures and incident tracking system
✓ Employee handbook with basic social policies
✓ Commitment to sustainability improvement roadmap

**Critical Gaps Requiring Immediate Attention**
⚠ Incomplete Scope 3 GHG emissions screening (Category 1, 3, 4 not assessed)
⚠ Limited supplier ESG due diligence and performance monitoring
⚠ Inconsistent data collection for training hours and diversity metrics
⚠ No formal climate risk assessment or scenario analysis
⚠ Absence of third-party assurance for environmental data

**Forward-Looking Statement**
Management commits to a structured 12-month ESG maturity program focusing on:
• Establishing formal ESG governance committee with quarterly reviews
• Implementing comprehensive metering and data management systems
• Conducting Scope 3 emissions screening and setting reduction targets
• Developing supplier code of conduct with annual assessment protocol
• Performing TCFD-aligned climate risk assessment
• Pursuing limited assurance for key environmental metrics by Q4 2026`
    },
    {
      id: 'materiality',
      title: 'Materiality Assessment & Priority Topics',
      content: `**Methodology Overview**
Our materiality assessment follows a structured approach aligned with GRI Standards and IFRS S1 principles for identifying topics that are material to both business success and stakeholder interests.

**Four-Step Process:**

┌─ STEP 1: STAKEHOLDER MAPPING ─────────────────────────┐
│                                                        │
│  Internal: Board, Management, Employees, Contractors  │
│  External: Customers, Suppliers, Regulators, Banks,   │
│           Community, Industry Associations            │
│                                                        │
│  Engagement methods: Surveys, interviews, workshops   │
└────────────────────────────────────────────────────────┘

**Material Topics - Priority Ranking**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      HIGH PRIORITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 CRITICAL (Score 4.5-5.0)
  1. Occupational Health & Safety
     • Risk: High-hazard manufacturing environment
     • Stakeholders: Employees, regulators, insurers
     • Business impact: Lost-time incidents, legal liability, reputation

  2. Energy Consumption & GHG Emissions
     • Risk: Energy cost volatility, regulatory carbon pricing
     • Stakeholders: Investors, customers, regulators
     • Business impact: Operating costs, supply chain requirements

  3. Business Ethics & Compliance
     • Risk: Corruption, sanctions, regulatory violations
     • Stakeholders: Customers, banks, government
     • Business impact: License to operate, access to capital

🟡 HIGH (Score 4.0-4.4)
  4. Water Stewardship
     • Risk: Water scarcity in arid region, pricing increases
     • Stakeholders: Community, regulators, employees
     • Business impact: Production continuity, social license

  5. Human Capital Development
     • Risk: Skills gap, high turnover, labor shortages
     • Stakeholders: Employees, management
     • Business impact: Productivity, innovation, retention costs

  6. Supply Chain Responsibility
     • Risk: Supplier ESG incidents, reputational contagion
     • Stakeholders: Customers, NGOs, media
     • Business impact: Brand damage, supply disruption`
    },
    {
      id: 'environmental_performance',
      title: 'Environmental Performance Disclosures',
      content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              ENVIRONMENTAL PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Climate & Energy**

┌─────────────────────────────────────────────────────────┐
│ ENERGY CONSUMPTION (FY2025)              Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Electricity (grid)                1,247 MWh             │
│ Diesel (fleet & generators)         95,200 liters       │
│ Natural gas (process heat)          Not applicable      │
│                                                         │
│ Total energy consumption           5,124 GJ             │
│ Energy intensity                   60.3 GJ/AED M revenue│
│                                                         │
│ Data source: DEWA bills, fuel cards                     │
│ Coverage: 100% of operations                            │
│ Assurance: None (planned for FY2026)                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ GREENHOUSE GAS EMISSIONS (tCO2e)         Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Scope 1 (direct)                         268 tCO2e      │
│   • Diesel combustion (fleet)              245          │
│   • Generator backup                        23          │
│                                                         │
│ Scope 2 (indirect - location-based)      352 tCO2e      │
│   • Purchased electricity                  352          │
│                                                         │
│ Total Scope 1 + 2                        620 tCO2e      │
│ Emissions intensity                  7.3 tCO2e/AED M    │
│                                                         │
│ Scope 3 screening status:            IN PROGRESS        │
│   Categories assessed: None (gap identified)            │
│   Target completion: Q2 2026                            │
│                                                         │
│ Methodology: GHG Protocol Corporate Standard            │
│ Emission factors: IPCC 2021, IEA 2024                   │
│ Assurance: None                                         │
└─────────────────────────────────────────────────────────┘

**Water Stewardship**

┌─────────────────────────────────────────────────────────┐
│ WATER WITHDRAWAL & CONSUMPTION           Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Municipal water supply              18,450 m³           │
│ Groundwater                         Not applicable      │
│ Surface water                       Not applicable      │
│                                                         │
│ Total withdrawal                    18,450 m³           │
│ Water intensity                     217 m³/AED M revenue│
│                                                         │
│ Water discharge (to municipal sewer) ~14,800 m³ (est.)  │
│ Water consumption (net)              ~3,650 m³ (est.)   │
│                                                         │
│ Water stress context: UAE is water-scarce region        │
│ Data quality: Billed volumes; sub-metering incomplete   │
└─────────────────────────────────────────────────────────┘

**Waste & Materials**

┌─────────────────────────────────────────────────────────┐
│ WASTE GENERATION & DIVERSION             Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Non-hazardous waste                 142 tonnes          │
│   • Recycled (cardboard, plastic)       38 tonnes (27%) │
│   • Landfill                           104 tonnes (73%) │
│                                                         │
│ Hazardous waste                      3.2 tonnes          │
│   • Licensed disposal (oils, batteries)   3.2 tonnes    │
│                                                         │
│ Recycling rate                       27%                │
│ Target: Achieve 50% diversion rate by end 2026          │
│                                                         │
│ Data source: Waste contractor invoices                  │
│ Gap: Monthly weighing not yet implemented               │
└─────────────────────────────────────────────────────────┘`
    },
    {
      id: 'social_performance',
      title: 'Social Performance Disclosures',
      content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 SOCIAL PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Workforce Overview**

┌─────────────────────────────────────────────────────────┐
│ EMPLOYEE METRICS (as of Dec 31, 2025)   Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Total headcount                     182 employees       │
│   • Permanent                         165 (91%)         │
│   • Temporary/Contract                 17 (9%)          │
│                                                         │
│ By gender:                                              │
│   • Male                              134 (74%)         │
│   • Female                             48 (26%)         │
│                                                         │
│ By employee category:                                   │
│   • Senior management                   8 (4%)          │
│   • Middle management                  24 (13%)         │
│   • Professionals & specialists        48 (26%)         │
│   • Technicians & operators           102 (56%)         │
│                                                         │
│ Turnover rate (voluntary)            12.3% (FY2025)     │
│ Average tenure                       4.2 years          │
└─────────────────────────────────────────────────────────┘

**Health, Safety & Wellbeing**

┌─────────────────────────────────────────────────────────┐
│ OCCUPATIONAL HEALTH & SAFETY             Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Total recordable incidents (TRI)          7 incidents   │
│ Lost-time injuries (LTI)                  2 incidents   │
│ Fatalities                                0             │
│                                                         │
│ Total hours worked                   ~367,000 hours     │
│                                                         │
│ TRIR (per 200,000 hours)                  3.81          │
│ LTIFR (per 200,000 hours)                 1.09          │
│                                                         │
│ Industry benchmark (manufacturing):  TRIR ~4.5          │
│ Performance: BETTER than industry average               │
│                                                         │
│ Corrective actions:                                     │
│ • Incident investigation completed for all 7 cases      │
│ • Root cause analysis documented                        │
│ • Preventive measures implemented                       │
│                                                         │
│ Gap identified: Need to standardize near-miss reporting │
└─────────────────────────────────────────────────────────┘

**Training & Development**

┌─────────────────────────────────────────────────────────┐
│ EMPLOYEE TRAINING                        Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Total training hours                 ~2,850 hours       │
│ Average hours per employee              15.7 hours      │
│                                                         │
│ Training categories:                                    │
│ • Health & safety                      45%              │
│ • Technical/job-specific               30%              │
│ • Compliance & ethics                  15%              │
│ • Leadership & soft skills             10%              │
│                                                         │
│ Data quality note: Based on partial records;            │
│ comprehensive LMS implementation planned for 2026       │
└─────────────────────────────────────────────────────────┘

**Diversity, Equity & Inclusion**

┌─────────────────────────────────────────────────────────┐
│ DIVERSITY METRICS                        Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Women in workforce                     26%              │
│ Women in management                    21%              │
│ Women in senior leadership             25%              │
│                                                         │
│ Nationalization (UAE nationals)        ~18%             │
│ Target (regulatory): 2% annual increase                 │
│                                                         │
│ Pay equity analysis:         NOT YET COMPLETED          │
│   Target: Complete by Q3 2026                           │
│                                                         │
│ Grievance mechanism:         Hotline + email available  │
│ Grievances filed (FY2025):   3 cases, all resolved      │
└─────────────────────────────────────────────────────────┘`
    },
    {
      id: 'governance',
      title: 'Governance & Ethics Disclosures',
      content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               GOVERNANCE & ETHICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**ESG Governance Structure**

┌─────────────────────────────────────────────────────────┐
│ ESG OVERSIGHT                            Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Executive sponsor:     Chief Operating Officer          │
│ ESG working group:     Cross-functional (8 members)     │
│ Meeting frequency:     Quarterly                        │
│                                                         │
│ Board oversight:       N/A (SME structure)              │
│ Alternative:           Owner review + approval required │
│                                                         │
│ ESG strategy:          Approved Dec 2025                │
│ Next review:           Q4 2026                          │
└─────────────────────────────────────────────────────────┘

**Policies & Compliance**

┌─────────────────────────────────────────────────────────┐
│ POLICY FRAMEWORK STATUS                  Illustrative   │
├─────────────────────────────────────────────────────────┤
│ ✓ Code of Business Conduct         Approved, March 2025│
│ ✓ Anti-Bribery & Corruption Policy Approved, March 2025│
│ ✓ Health & Safety Policy           Approved, Jan 2024  │
│ ✓ Environmental Policy              Approved, Jan 2024  │
│ ○ Supplier Code of Conduct          DRAFT (in review)   │
│ ○ Human Rights Policy               PLANNED (Q2 2026)   │
│ ○ Data Privacy Policy               PLANNED (Q3 2026)   │
│                                                         │
│ Employee acknowledgment (Code):     95% completion      │
│ Anti-bribery training:              100% management     │
└─────────────────────────────────────────────────────────┘

**Risk Management**

┌─────────────────────────────────────────────────────────┐
│ ESG RISK REGISTER                        Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Risks identified and assessed:           12 ESG risks   │
│                                                         │
│ Top 3 ESG risks (by severity):                          │
│   1. Workplace safety incidents (Medium-High)           │
│   2. Water scarcity & supply disruption (Medium)        │
│   3. Supply chain labor practices (Medium)              │
│                                                         │
│ Mitigation plans:        Documented for top 5 risks     │
│ Risk owner assignment:   Complete                       │
│ Review frequency:        Quarterly                      │
│                                                         │
│ Climate risk assessment: NOT YET CONDUCTED              │
│   TCFD-aligned analysis planned for H2 2026             │
└─────────────────────────────────────────────────────────┘

**Compliance & Incidents**

┌─────────────────────────────────────────────────────────┐
│ REGULATORY COMPLIANCE                    Illustrative   │
├─────────────────────────────────────────────────────────┤
│ Environmental fines:                    AED 0           │
│ Health & safety violations:             0               │
│ Labor & employment violations:          0               │
│ Corruption/ethics incidents:            0               │
│                                                         │
│ Audits & inspections:                                   │
│ • Civil defense (fire safety):   Passed, June 2025     │
│ • Municipality (environmental):  Passed, Sept 2025     │
│ • Labor ministry:                Passed, Aug 2025      │
│                                                         │
│ External certifications:         None (exploring ISO)   │
└─────────────────────────────────────────────────────────┘`
    },
    {
      id: 'action_plan',
      title: 'ESG Maturity Roadmap & Action Plan',
      content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             12-MONTH ESG IMPROVEMENT ROADMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This action plan prioritizes critical gaps identified in the assessment
and provides a phased approach to ESG maturity improvement.

**Planning Horizon:**
• Phase 1: Foundations (0-90 days)
• Phase 2: Systems & Controls (90-180 days)
• Phase 3: Maturity & Disclosure (180-365 days)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    PHASE 1: FOUNDATIONS (Days 0-90)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─ ACTION 1.1: ESTABLISH ESG GOVERNANCE ──────────────────┐
│ Priority: CRITICAL                                      │
├─────────────────────────────────────────────────────────┤
│ Objective:                                              │
│   Create formal ESG governance structure and            │
│   accountability framework                              │
│                                                         │
│ Tasks:                                                  │
│   □ Designate ESG Steering Committee (exec sponsor +    │
│     cross-functional members)                           │
│   □ Define roles using RACI matrix (Responsible,        │
│     Accountable, Consulted, Informed)                   │
│   □ Establish quarterly meeting cadence with agenda     │
│     template                                            │
│   □ Create ESG dashboard with KPI tracking              │
│                                                         │
│ Owner:        Chief Operating Officer                   │
│ Deadline:     Week 6                                    │
│ Budget:       Internal resources + ~AED 15K consulting  │
│ Success:      First committee meeting held with charter │
│               approved                                  │
└─────────────────────────────────────────────────────────┘

┌─ ACTION 1.2: APPROVE POLICY FRAMEWORK ──────────────────┐
│ Priority: CRITICAL                                      │
├─────────────────────────────────────────────────────────┤
│ Objective:                                              │
│   Formalize and approve core ESG policies               │
│                                                         │
│ Tasks:                                                  │
│   □ Finalize Supplier Code of Conduct (in draft)        │
│   □ Develop Human Rights Policy (aligned with UNGP)     │
│   □ Create Whistleblower Protection Policy              │
│   □ Obtain executive sign-off on all policies           │
│   □ Launch employee awareness campaign + training       │
│                                                         │
│ Owner:        Compliance Officer / HR Manager           │
│ Deadline:     Week 10                                   │
│ Budget:       ~AED 25K (legal review + translation)     │
│ Success:      100% employee acknowledgment within 30    │
│               days of approval                          │
└─────────────────────────────────────────────────────────┘

┌─ ACTION 1.3: STANDARDIZE DATA CAPTURE ──────────────────┐
│ Priority: HIGH                                          │
├─────────────────────────────────────────────────────────┤
│ Objective:                                              │
│   Create single source of truth for ESG metrics         │
│                                                         │
│ Tasks:                                                  │
│   □ Define KPI glossary with calculation methods        │
│   □ Identify data owners for each metric                │
│   □ Create monthly data collection templates            │
│   □ Set up shared drive with controlled access          │
│   □ Document data quality requirements                  │
│                                                         │
│ Owner:        Sustainability Coordinator (new role)     │
│ Deadline:     Week 8                                    │
│ Budget:       Internal + ~AED 10K for templates         │
│ Success:      First month of complete data collected    │
│               using standardized templates              │
└─────────────────────────────────────────────────────────┘

**Summary of Phase 1**
By end of Q1 2026, we expect:
• ESG governance framework operational
• Core policies approved and communicated
• Monthly ESG data collection established
• Baseline metrics documented
• Executive dashboard reporting quarterly`
    },
    {
      id: 'appendix',
      title: 'Appendix: Data Quality & Assurance',
      content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  DATA QUALITY STATEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All metrics in this report are ILLUSTRATIVE and for demonstration purposes.

**Real Reports Include:**
• Boundary definitions and consolidation methodology
• Data collection procedures and quality controls
• Calculation methodologies and emission factors
• Third-party assurance statements (where applicable)
• Year-over-year trend analysis
• Benchmarking against industry peers

**Data Source Verification**
All data sources have been documented and validated:
✓ Energy data: DEWA monthly billing statements
✓ Water data: Municipality billing records
✓ Waste data: Licensed contractor invoices
✓ Workforce data: HR management system
✓ Safety data: Incident reporting system
✓ Training data: Training records and sign-offs

**Limitations & Gaps**
This assessment identified the following data gaps for resolution in 2026:
• Sub-metering for granular energy consumption tracking
• Comprehensive Scope 3 GHG emissions screening
• Formalized training hours tracking via LMS
• Supplier ESG assessment database
• Climate scenario analysis (TCFD framework)
• Third-party assurance for environmental metrics

**Next Steps for 2026**
1. Q1: Complete data infrastructure assessment
2. Q2: Install sub-metering systems
3. Q3: Launch supplier ESG program
4. Q4: Conduct TCFD climate risk assessment

**Document Control**
Report Title: Gulf Horizon Manufacturing LLC ESG Compliance & Sustainability Report
Reporting Period: FY2025 (Jan 1 - Dec 31, 2025)
Report Date: February 2026
Prepared by: Sustainability Team
Reviewed by: Chief Operating Officer
Approved by: Owner
Next Update: February 2027 (Annual)`
    }
  ]
};

function generatePdf(payload) {
  const pdf = new PDFDocument({
    margin: 40,
    size: 'A4',
    bufferPages: true,
  });

  const outputPath = path.join(__dirname, 'test-report-full.pdf');
  const stream = fs.createWriteStream(outputPath);
  pdf.pipe(stream);

  // Title page
  pdf.fontSize(32).font('Helvetica-Bold').text(payload.companyName, { align: 'center' });
  pdf.moveDown(0.8);
  pdf.fontSize(20).font('Helvetica').text('ESG Compliance & Sustainability Report', { align: 'center' });
  pdf.moveDown(0.8);
  pdf.fontSize(16).text(`Reporting Year ${payload.reportingYear}`, { align: 'center' });
  pdf.moveDown(0.3);
  pdf.fontSize(14).text(payload.jurisdiction, { align: 'center' });
  pdf.moveDown(1.5);

  // Warning banner
  pdf.rect(40, pdf.y, 515, 80).stroke('#FF6B6B');
  pdf.fontSize(11).font('Helvetica-Bold').text('⚠️  SAMPLE REPORT WITH FICTIONAL DATA', 50, pdf.y + 8, { width: 495 });
  pdf.fontSize(10).font('Helvetica').text('This is a demonstration report with fictional, redacted, and illustrative data. It is provided for demonstration purposes only and not for regulatory submission.', { width: 495 });
  pdf.moveDown(1.5);

  // Add page number to title page
  pdf.fontSize(10).text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });

  // Table of contents
  pdf.addPage();
  pdf.fontSize(18).font('Helvetica-Bold').text('Table of Contents', { underline: true });
  pdf.moveDown(0.8);
  pdf.fontSize(12).font('Helvetica');
  
  payload.sections.forEach((section, index) => {
    pdf.text(`${index + 1}. ${section.title}`);
    pdf.moveDown(0.3);
  });

  // Add each section on new pages
  payload.sections.forEach((section, sectionIndex) => {
    pdf.addPage();

    // Section title
    pdf.fontSize(18).font('Helvetica-Bold').text(section.title, { underline: true });
    pdf.moveDown(0.6);

    // Section content
    const lines = section.content.split('\n');
    pdf.fontSize(9.5).font('Helvetica');

    lines.forEach((line) => {
      // Handle different line types
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/);
        pdf.font('Helvetica');
        let xPos = pdf.x;
        parts.forEach((part, i) => {
          if (i % 2 === 1) {
            pdf.font('Helvetica-Bold').text(part, { continued: true });
            pdf.font('Helvetica');
          } else if (part) {
            pdf.text(part, { continued: true });
          }
        });
        pdf.text('');
      } else if (line.trim() === '') {
        pdf.moveDown(0.2);
      } else if (line.startsWith('┌') || line.startsWith('├') || line.startsWith('│') || line.startsWith('└')) {
        pdf.font('Courier').fontSize(8).text(line);
        pdf.fontSize(9.5).font('Helvetica');
      } else if (line.match(/^[•○✓⚠🔴🟡]/)) {
        pdf.text(line);
      } else if (line.startsWith('━')) {
        pdf.moveDown(0.2);
      } else {
        pdf.text(line, { align: 'left' });
      }
    });

    pdf.moveDown(0.3);
  });

  // Add page numbers to all pages
  const pages = pdf.bufferedPageRange().count;
  for (let i = 0; i < pages; i++) {
    pdf.switchToPage(i);
    pdf.fontSize(9).text(`Page ${i + 1} of ${pages}`, 40, 750, { align: 'center' });
  }

  pdf.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

console.log('🚀 Generating full ESG report PDF...');
generatePdf(payload)
  .then((filepath) => {
    const stats = fs.statSync(filepath);
    const pdfBytes = fs.readFileSync(filepath);
    
    // Count pages by counting /Page objects (simple heuristic)
    const pageCount = (pdfBytes.toString().match(/\/Type\s*\/Page\s*(?:\/Parent|\/Resources|\/MediaBox)/g) || []).length;
    
    console.log(`✅ PDF generated successfully!`);
    console.log(`📄 File: ${filepath}`);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📖 Estimated page count: ~${Math.max(pageCount, Math.ceil(stats.size / 15000))} pages`);
    console.log(`\n✨ PDF is ready for download and testing!`);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
