import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const outPath = path.resolve('public/afaq-full-esg-disclosure-report-2025.pdf');

// Comprehensive ESG Report Data
const report = {
  title: 'ESG Disclosure Report 2025',
  subtitle: 'Comprehensive Environmental, Social & Governance Assessment',
  reportingYear: '2025',
  companyName: 'Gulf Horizon Manufacturing LLC',
  jurisdiction: 'United Arab Emirates',
  preparedBy: 'AFAQ ESG Navigator',
  generatedDate: new Date().toISOString().split('T')[0],
  disclaimer: 'This document is a SAMPLE generated with fictional data for demonstration purposes only.',
};

// Executive Summary Content
const executiveSummary = {
  overallScore: 68,
  environmentalScore: 72,
  socialScore: 65,
  governanceScore: 67,
  keyStrengths: [
    'Basic environmental monitoring systems in place',
    'Defined ESG governance roles with executive sponsorship',
    'Health & safety procedures and incident tracking',
    'Employee handbook with social policies',
    'Commitment to sustainability roadmap'
  ],
  criticalGaps: [
    'Incomplete Scope 3 GHG emissions screening',
    'Limited supplier ESG due diligence',
    'Inconsistent data collection for training metrics',
    'No formal climate risk assessment',
    'Absence of third-party assurance'
  ]
};

// Governance Pillar Data
const governance = {
  score: 67,
  boardSize: 7,
  independentDirectors: 3,
  meetingsPerYear: 12,
  committees: ['Audit', 'Risk', 'ESG Oversight'],
  policies: ['Code of Conduct', 'Anti-Bribery', 'Whistleblower', 'Conflict of Interest'],
  gaps: ['No ESG metrics in executive compensation', 'Limited board ESG training', 'Supplier audit program incomplete'],
  recommendations: [
    'Establish formal ESG committee with quarterly reviews',
    'Integrate ESG KPIs into executive incentive structure',
    'Implement annual board ESG training program',
    'Develop supplier code of conduct with assessment protocol'
  ]
};

// Environmental Pillar Data
const environmental = {
  score: 72,
  ghgEmissions: {
    scope1: 1250,
    scope2: 3800,
    scope3: 'Not fully assessed',
    total: 5050,
    intensity: 2.8
  },
  energy: {
    total: 18500,
    renewable: 15,
    intensity: 102
  },
  water: {
    withdrawal: 45000,
    discharge: 38000,
    consumption: 7000
  },
  waste: {
    total: 450,
    recycled: 65,
    landfill: 35
  },
  gaps: ['Scope 3 emissions incomplete', 'No renewable energy targets', 'Limited water recycling', 'No biodiversity assessment'],
  recommendations: [
    'Complete Scope 3 emissions inventory (Categories 1-15)',
    'Set science-based emissions reduction targets',
    'Increase renewable energy to 30% by 2027',
    'Implement water recycling and efficiency measures',
    'Conduct biodiversity impact assessment'
  ]
};

// Social Pillar Data
const social = {
  score: 65,
  workforce: {
    total: 180,
    permanent: 165,
    contract: 15,
    turnover: 12.5
  },
  diversity: {
    womenEmployees: 28,
    womenManagement: 15,
    nationalEmployees: 42
  },
  healthSafety: {
    recordableIncidents: 3,
    lostTimeDays: 45,
    trainingHours: 2100
  },
  community: {
    investmentAED: 125000,
    volunteering: 450,
    localProcurement: 68
  },
  gaps: ['No diversity targets', 'Limited mental health support', 'Inconsistent training tracking', 'No human rights due diligence'],
  recommendations: [
    'Set measurable diversity and inclusion targets',
    'Implement mental health and wellbeing program',
    'Establish comprehensive training management system',
    'Conduct human rights risk assessment in supply chain',
    'Develop community investment strategy'
  ]
};

// Data Annex - Detailed Metrics
const dataAnnex = {
  environmental: [
    { metric: 'Total GHG Emissions (Scope 1+2)', value: '5,050 tCO2e', method: 'GHG Protocol', source: 'Energy bills, fuel records' },
    { metric: 'Energy Consumption', value: '18,500 MWh', method: 'Direct metering', source: 'Utility bills' },
    { metric: 'Renewable Energy %', value: '15%', method: 'Direct metering', source: 'Solar installation data' },
    { metric: 'Water Withdrawal', value: '45,000 m³', method: 'Metering', source: 'Municipal bills' },
    { metric: 'Waste Generated', value: '450 tonnes', method: 'Weighbridge records', source: 'Waste contractor reports' },
    { metric: 'Waste Recycled %', value: '65%', method: 'Contractor data', source: 'Recycling certificates' }
  ],
  social: [
    { metric: 'Total Workforce', value: '180 FTE', method: 'HR system', source: 'Payroll records' },
    { metric: 'Employee Turnover', value: '12.5%', method: 'HR calculation', source: 'Exit records' },
    { metric: 'Women in Workforce %', value: '28%', method: 'HR system', source: 'Employee database' },
    { metric: 'Training Hours per Employee', value: '11.7', method: 'LMS tracking', source: 'Training records (partial)' },
    { metric: 'Recordable Incidents', value: '3', method: 'OSHA standards', source: 'Incident database' },
    { metric: 'Lost Time Injury Rate', value: '1.67', method: 'Per 200k hours', source: 'Safety records' }
  ],
  governance: [
    { metric: 'Board Size', value: '7', method: 'Count', source: 'Corporate registry' },
    { metric: 'Independent Directors %', value: '43%', method: 'Definition per bylaws', source: 'Board records' },
    { metric: 'Board Meetings', value: '12', method: 'Count', source: 'Minutes' },
    { metric: 'Ethics Training Completion', value: '95%', method: 'LMS tracking', source: 'Training system' },
    { metric: 'Supplier Audits Conducted', value: '8', method: 'Count', source: 'Procurement records' },
    { metric: 'Data Breaches', value: '0', method: 'Count', source: 'IT security logs' }
  ]
};

function generateHTML() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${report.title}</title>
  <style>
    @page { 
      size: A4; 
      margin: 20mm 18mm;
      @bottom-center {
        content: counter(page);
        font-size: 9px;
        color: #64748b;
      }
    }
    
    :root {
      --ink: #0f172a;
      --muted: #475569;
      --light: #94a3b8;
      --line: #e2e8f0;
      --accent: #0ea5e9;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --bg: #f8fafc;
      --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { font-family: var(--sans); color: var(--ink); margin: 0; padding: 0; }
    
    /* Typography */
    h1 { font-size: 32px; margin: 0 0 12px 0; letter-spacing: -0.02em; font-weight: 700; }
    h2 { font-size: 22px; margin: 30px 0 16px 0; font-weight: 700; border-bottom: 3px solid var(--accent); padding-bottom: 8px; }
    h3 { font-size: 16px; margin: 24px 0 12px 0; font-weight: 700; color: var(--accent); }
    h4 { font-size: 13px; margin: 18px 0 10px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
    p { font-size: 11px; line-height: 1.6; margin: 0 0 12px 0; }
    ul, ol { font-size: 11px; line-height: 1.6; margin: 0 0 12px 0; padding-left: 20px; }
    
    /* Layout */
    .page { position: relative; padding: 0 0 20px 0; }
    .section { margin: 0 0 24px 0; page-break-inside: avoid; }
    .pagebreak { page-break-before: always; }
    
    /* Cover Page */
    .cover {
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      color: white;
      padding: 40px 30px;
      border-radius: 16px;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .cover h1 { font-size: 36px; margin-bottom: 8px; }
    .cover .subtitle { font-size: 16px; opacity: 0.9; margin-bottom: 30px; }
    .cover-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .cover-item { background: rgba(255,255,255,0.15); padding: 14px; border-radius: 10px; backdrop-filter: blur(10px); }
    .cover-label { font-size: 10px; opacity: 0.8; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.08em; }
    .cover-value { font-size: 13px; font-weight: 700; }
    
    /* Cards */
    .card {
      background: white;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 16px 18px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
    }
    
    /* Score Cards */
    .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 20px 0; }
    .score-card {
      background: var(--bg);
      border: 2px solid var(--line);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    .score-card .label { font-size: 11px; color: var(--muted); margin-bottom: 8px; font-weight: 600; text-transform: uppercase; }
    .score-card .value { font-size: 36px; font-weight: 900; color: var(--accent); margin-bottom: 4px; }
    .score-card .bar { height: 8px; background: var(--line); border-radius: 4px; overflow: hidden; margin-top: 8px; }
    .score-card .bar-fill { height: 100%; background: var(--accent); }
    
    /* Tables */
    table { width: 100%; border-collapse: collapse; font-size: 10px; margin: 14px 0; }
    th { text-align: left; padding: 10px 8px; background: var(--bg); font-weight: 700; color: var(--muted); border-bottom: 2px solid var(--line); font-size: 9px; text-transform: uppercase; }
    td { padding: 10px 8px; border-bottom: 1px solid var(--line); vertical-align: top; }
    .num { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
    
    /* Lists */
    .check-list { list-style: none; padding: 0; }
    .check-list li { padding: 8px 0 8px 28px; position: relative; font-size: 11px; }
    .check-list li:before { content: "✓"; position: absolute; left: 0; color: var(--success); font-weight: 900; font-size: 14px; }
    .gap-list { list-style: none; padding: 0; }
    .gap-list li { padding: 8px 0 8px 28px; position: relative; font-size: 11px; }
    .gap-list li:before { content: "⚠"; position: absolute; left: 0; color: var(--warning); font-size: 14px; }
    
    /* Callouts */
    .callout {
      border-left: 4px solid var(--accent);
      background: #f0f9ff;
      padding: 14px 16px;
      margin: 14px 0;
      border-radius: 6px;
      font-size: 11px;
    }
    .callout strong { color: var(--accent); }
    
    .warning-box {
      border: 2px solid var(--warning);
      background: #fffbeb;
      padding: 14px 16px;
      margin: 14px 0;
      border-radius: 8px;
      font-size: 11px;
    }
    
    /* Badges */
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-info { background: #dbeafe; color: #1e40af; }
    
    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: var(--light);
    }
    
    /* Chart Bars */
    .metric-bar {
      height: 24px;
      background: var(--line);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      margin: 8px 0;
    }
    .metric-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent) 0%, var(--success) 100%);
      display: flex;
      align-items: center;
      padding: 0 12px;
      color: white;
      font-size: 10px;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- COVER PAGE -->
    <div class="section cover">
      <div>
        <div class="badge" style="background: white; color: var(--accent); margin-bottom: 16px;">DEMONSTRATION REPORT</div>
        <h1>${report.title}</h1>
        <div class="subtitle">${report.subtitle}</div>
      </div>
      
      <div class="cover-grid">
        <div class="cover-item">
          <div class="cover-label">Company Name</div>
          <div class="cover-value">${report.companyName}</div>
        </div>
        <div class="cover-item">
          <div class="cover-label">Reporting Year</div>
          <div class="cover-value">${report.reportingYear}</div>
        </div>
        <div class="cover-item">
          <div class="cover-label">Jurisdiction</div>
          <div class="cover-value">${report.jurisdiction}</div>
        </div>
        <div class="cover-item">
          <div class="cover-label">Generated</div>
          <div class="cover-value">${report.generatedDate}</div>
        </div>
      </div>
      
      <div style="margin-top: 30px;">
        <div style="font-size: 11px; opacity: 0.9;">Prepared by</div>
        <div style="font-size: 18px; font-weight: 700; margin-top: 4px;">${report.preparedBy}</div>
      </div>
    </div>
    
    <div class="warning-box" style="margin-top: 20px;">
      <strong>⚠️ DISCLAIMER:</strong> ${report.disclaimer} This report is NOT suitable for regulatory submission or external disclosure without proper verification and assurance.
    </div>
    
    <!-- TABLE OF CONTENTS -->
    <div class="pagebreak"></div>
    <div class="section card">
      <h2>Table of Contents</h2>
      <table>
        <tbody>
          <tr><td><strong>1. Executive Summary</strong></td><td class="num">3</td></tr>
          <tr><td><strong>2. Governance Pillar Assessment</strong></td><td class="num">8</td></tr>
          <tr><td><strong>3. Environmental Pillar Assessment</strong></td><td class="num">15</td></tr>
          <tr><td><strong>4. Social Pillar Assessment</strong></td><td class="num">25</td></tr>
          <tr><td><strong>5. Gap Analysis & Recommendations</strong></td><td class="num">35</td></tr>
          <tr><td><strong>6. Data Quality & Methodology</strong></td><td class="num">42</td></tr>
          <tr><td><strong>7. Annex: Detailed Metrics & Sources</strong></td><td class="num">48</td></tr>
          <tr><td><strong>8. Glossary & Definitions</strong></td><td class="num">55</td></tr>
        </tbody>
      </table>
    </div>
    
    <!-- EXECUTIVE SUMMARY -->
    <div class="pagebreak"></div>
    <div class="section">
      <h2>1. Executive Summary</h2>
      
      <div class="card">
        <h3>1.1 Overall Assessment Results</h3>
        <p>
          This comprehensive ESG disclosure report presents the sustainability performance and compliance readiness 
          of ${report.companyName} for the reporting period ${report.reportingYear}. The assessment methodology 
          combines quantitative performance data, policy documentation review, and gap analysis against leading 
          frameworks including GRI Standards, TCFD recommendations, and UAE regulatory expectations.
        </p>
        
        <div class="score-grid">
          <div class="score-card">
            <div class="label">Overall Score</div>
            <div class="value">${executiveSummary.overallScore}</div>
            <div class="badge badge-warning">Developing</div>
            <div class="bar">
              <div class="bar-fill" style="width: ${executiveSummary.overallScore}%"></div>
            </div>
          </div>
          <div class="score-card">
            <div class="label">Environmental</div>
            <div class="value">${executiveSummary.environmentalScore}</div>
            <div class="badge badge-warning">Improving</div>
            <div class="bar">
              <div class="bar-fill" style="width: ${executiveSummary.environmentalScore}%"></div>
            </div>
          </div>
          <div class="score-card">
            <div class="label">Social</div>
            <div class="value">${executiveSummary.socialScore}</div>
            <div class="badge badge-warning">Developing</div>
            <div class="bar">
              <div class="bar-fill" style="width: ${executiveSummary.socialScore}%"></div>
            </div>
          </div>
        </div>
        
        <div class="score-grid" style="grid-template-columns: 1fr;">
          <div class="score-card">
            <div class="label">Governance</div>
            <div class="value">${executiveSummary.governanceScore}</div>
            <div class="badge badge-warning">Developing</div>
            <div class="bar">
              <div class="bar-fill" style="width: ${executiveSummary.governanceScore}%"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h3>1.2 Key Strengths</h3>
        <ul class="check-list">
          ${executiveSummary.keyStrengths.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      
      <div class="card">
        <h3>1.3 Critical Gaps Requiring Immediate Attention</h3>
        <ul class="gap-list">
          ${executiveSummary.criticalGaps.map(g => `<li>${g}</li>`).join('')}
        </ul>
      </div>
      
      <div class="callout">
        <strong>Management Commitment:</strong> The organization commits to a structured 12-month ESG maturity 
        program focusing on establishing formal governance, implementing comprehensive data systems, conducting 
        Scope 3 emissions screening, developing supplier codes of conduct, and pursuing third-party assurance 
        for key metrics by Q4 2026.
      </div>
    </div>
    
    <!-- GOVERNANCE PILLAR -->
    <div class="pagebreak"></div>
    <div class="section">
      <h2>2. Governance Pillar Assessment</h2>
      
      <div class="card">
        <h3>2.1 Overall Governance Score: ${governance.score}/100</h3>
        <div class="metric-bar">
          <div class="metric-bar-fill" style="width: ${governance.score}%">${governance.score}%</div>
        </div>
        
        <p style="margin-top: 16px;">
          The governance assessment evaluates board structure, executive oversight, policy frameworks, 
          risk management systems, and transparency mechanisms. The organization demonstrates basic governance 
          structures with room for maturity in ESG integration and assurance.
        </p>
      </div>
      
      <div class="card">
        <h3>2.2 Board Structure & Oversight</h3>
        <table>
          <thead>
            <tr>
              <th>Governance Element</th>
              <th class="num">Current State</th>
              <th>Assessment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Board Size</td>
              <td class="num">${governance.boardSize} directors</td>
              <td><span class="badge badge-success">Appropriate</span></td>
            </tr>
            <tr>
              <td>Independent Directors</td>
              <td class="num">${governance.independentDirectors} (${Math.round(governance.independentDirectors/governance.boardSize*100)}%)</td>
              <td><span class="badge badge-warning">Needs Improvement</span></td>
            </tr>
            <tr>
              <td>Board Meetings (Annual)</td>
              <td class="num">${governance.meetingsPerYear}</td>
              <td><span class="badge badge-success">Good</span></td>
            </tr>
            <tr>
              <td>ESG Committee</td>
              <td class="num">Yes</td>
              <td><span class="badge badge-success">Established</span></td>
            </tr>
            <tr>
              <td>ESG Metrics in Compensation</td>
              <td class="num">No</td>
              <td><span class="badge badge-warning">Gap Identified</span></td>
            </tr>
          </tbody>
        </table>
        
        <h4 style="margin-top: 20px;">Board Committees</h4>
        <ul>
          ${governance.committees.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
      
      <div class="card">
        <h3>2.3 Policies & Frameworks</h3>
        <p>
          The organization maintains essential governance policies covering ethics, compliance, and risk management. 
          All policies are documented, approved by senior management, and communicated to relevant stakeholders.
        </p>
        
        <h4>Active Policies</h4>
        <ul class="check-list">
          ${governance.policies.map(p => `<li>${p}</li>`).join('')}
        </ul>
        
        <div class="callout">
          <strong>Policy Review Cycle:</strong> All governance policies are reviewed annually and updated as needed 
          to reflect regulatory changes, best practices, and stakeholder feedback.
        </div>
      </div>
      
      <div class="card">
        <h3>2.4 Risk Management</h3>
        <p>
          The organization has established a formal Enterprise Risk Management (ERM) framework with quarterly 
          risk register reviews. ESG risks are integrated into the broader risk management process, with 
          designated owners and mitigation plans for identified material risks.
        </p>
        
        <table>
          <thead>
            <tr>
              <th>Risk Category</th>
              <th>Risk Level</th>
              <th>Mitigation Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Climate-related Physical Risks</td>
              <td><span class="badge badge-warning">Medium</span></td>
              <td>Assessment planned Q2 2026</td>
            </tr>
            <tr>
              <td>Regulatory Compliance</td>
              <td><span class="badge badge-warning">Medium</span></td>
              <td>Active monitoring, quarterly reviews</td>
            </tr>
            <tr>
              <td>Supply Chain Disruption</td>
              <td><span class="badge badge-warning">Medium</span></td>
              <td>Supplier diversification ongoing</td>
            </tr>
            <tr>
              <td>Data Security & Privacy</td>
              <td><span class="badge badge-success">Low</span></td>
              <td>Controls in place, annual audit</td>
            </tr>
            <tr>
              <td>Reputational Risk (ESG)</td>
              <td><span class="badge badge-warning">Medium</span></td>
              <td>Stakeholder engagement program</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="card">
        <h3>2.5 Governance Gaps & Recommendations</h3>
        
        <h4>Identified Gaps</h4>
        <ul class="gap-list">
          ${governance.gaps.map(g => `<li>${g}</li>`).join('')}
        </ul>
        
        <h4>Priority Recommendations (0-12 months)</h4>
        <ol>
          ${governance.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ol>
      </div>
    </div>
    
    <!-- ENVIRONMENTAL PILLAR -->
    <div class="pagebreak"></div>
    <div class="section">
      <h2>3. Environmental Pillar Assessment</h2>
      
      <div class="card">
        <h3>3.1 Overall Environmental Score: ${environmental.score}/100</h3>
        <div class="metric-bar">
          <div class="metric-bar-fill" style="width: ${environmental.score}%">${environmental.score}%</div>
        </div>
        
        <p style="margin-top: 16px;">
          The environmental assessment evaluates climate change impacts, resource efficiency, emissions management, 
          and environmental compliance. The organization has established baseline monitoring systems with 
          opportunities for improvement in Scope 3 accounting and target-setting.
        </p>
      </div>
      
      <div class="card">
        <h3>3.2 Climate Change & GHG Emissions</h3>
        
        <h4>Greenhouse Gas Emissions Inventory (tCO₂e)</h4>
        <table>
          <thead>
            <tr>
              <th>Scope</th>
              <th>Description</th>
              <th class="num">${report.reportingYear}</th>
              <th>Data Quality</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Scope 1</strong></td>
              <td>Direct emissions from owned sources (fuel combustion, process emissions)</td>
              <td class="num">${environmental.ghgEmissions.scope1.toLocaleString()}</td>
              <td><span class="badge badge-success">Measured</span></td>
            </tr>
            <tr>
              <td><strong>Scope 2</strong></td>
              <td>Indirect emissions from purchased electricity (market-based)</td>
              <td class="num">${environmental.ghgEmissions.scope2.toLocaleString()}</td>
              <td><span class="badge badge-success">Measured</span></td>
            </tr>
            <tr>
              <td><strong>Scope 3</strong></td>
              <td>Value chain emissions (15 categories per GHG Protocol)</td>
              <td class="num">Not assessed</td>
              <td><span class="badge badge-warning">Incomplete</span></td>
            </tr>
            <tr style="border-top: 2px solid var(--ink);">
              <td colspan="2"><strong>Total (Scope 1+2)</strong></td>
              <td class="num"><strong>${environmental.ghgEmissions.total.toLocaleString()}</strong></td>
              <td><span class="badge badge-info">Baseline Year</span></td>
            </tr>
          </tbody>
        </table>
        
        <h4 style="margin-top: 20px;">Emissions Intensity</h4>
        <p>
          <strong>Intensity Ratio:</strong> ${environmental.ghgEmissions.intensity} tCO₂e per AED million revenue<br>
          <strong>Baseline Year:</strong> ${report.reportingYear} (first comprehensive inventory)
        </p>
        
        <div class="callout">
          <strong>Scope 3 Screening Required:</strong> To meet international disclosure standards (IFRS S2, 
          SEC proposed rules), the organization should conduct a Scope 3 screening assessment across all 
          15 GHG Protocol categories and prioritize measurement of material categories.
        </div>
      </div>
      
      <div class="card">
        <h3>3.3 Energy Management</h3>
        
        <table>
          <thead>
            <tr>
              <th>Energy Metric</th>
              <th class="num">${report.reportingYear}</th>
              <th>Target</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Energy Consumption (MWh)</td>
              <td class="num">${environmental.energy.total.toLocaleString()}</td>
              <td>Reduce 10% by 2027</td>
              <td><span class="badge badge-info">Baseline</span></td>
            </tr>
            <tr>
              <td>Renewable Energy (%)</td>
              <td class="num">${environmental.energy.renewable}%</td>
              <td>30% by 2027</td>
              <td><span class="badge badge-warning">Behind Target</span></td>
            </tr>
            <tr>
              <td>Energy Intensity (kWh/unit)</td>
              <td class="num">${environmental.energy.intensity}</td>
              <td>Reduce 15% by 2028</td>
              <td><span class="badge badge-info">Baseline</span></td>
            </tr>
          </tbody>
        </table>
        
        <h4 style="margin-top: 20px;">Energy Sources Breakdown</h4>
        <ul>
          <li><strong>Grid Electricity:</strong> 85% (15,725 MWh) - DEWA supply</li>
          <li><strong>Solar PV (on-site):</strong> 15% (2,775 MWh) - 2.5 MW installation</li>
          <li><strong>Natural Gas:</strong> <5% - Backup generators</li>
        </ul>
        
        <p>
          <strong>Metering Coverage:</strong> 100% of electricity consumption metered through utility bills 
          and solar inverter data. Sub-metering installed for major equipment (>50 kW).
        </p>
      </div>
      
      <div class="card">
        <h3>3.4 Water Management</h3>
        
        <table>
          <thead>
            <tr>
              <th>Water Metric</th>
              <th class="num">${report.reportingYear} (m³)</th>
              <th>Intensity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Water Withdrawal</td>
              <td class="num">${environmental.water.withdrawal.toLocaleString()}</td>
              <td class="num">250 m³/AED million revenue</td>
            </tr>
            <tr>
              <td>Water Discharge</td>
              <td class="num">${environmental.water.discharge.toLocaleString()}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Water Consumption</td>
              <td class="num">${environmental.water.consumption.toLocaleString()}</td>
              <td class="num">39 m³/AED million revenue</td>
            </tr>
          </tbody>
        </table>
        
        <h4 style="margin-top: 20px;">Water Sources & Stress Assessment</h4>
        <ul>
          <li><strong>Municipal Supply:</strong> 100% (DEWA - medium water stress area per WRI Aqueduct)</li>
          <li><strong>Groundwater:</strong> 0%</li>
          <li><strong>Recycled/Reused:</strong> 0% (opportunity for improvement)</li>
        </ul>
        
        <div class="callout">
          <strong>Water Stress Context:</strong> The facility operates in a medium-high water stress region 
          (UAE). Water efficiency measures and recycling systems should be prioritized to reduce freshwater 
          dependence and improve resilience.
        </div>
      </div>
      
      <div class="card">
        <h3>3.5 Waste Management</h3>
        
        <table>
          <thead>
            <tr>
              <th>Waste Category</th>
              <th class="num">Amount (tonnes)</th>
              <th class="num">% of Total</th>
              <th>Disposal Method</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Recyclable Materials (paper, cardboard, plastic)</td>
              <td class="num">180</td>
              <td class="num">40%</td>
              <td>Recycling contractor</td>
            </tr>
            <tr>
              <td>Metals & Scrap</td>
              <td class="num">113</td>
              <td class="num">25%</td>
              <td>Recycling contractor</td>
            </tr>
            <tr>
              <td>General Non-Hazardous Waste</td>
              <td class="num">135</td>
              <td class="num">30%</td>
              <td>Landfill</td>
            </tr>
            <tr>
              <td>Hazardous Waste (oils, chemicals)</td>
              <td class="num">22</td>
              <td class="num">5%</td>
              <td>Licensed disposal facility</td>
            </tr>
            <tr style="border-top: 2px solid var(--ink);">
              <td><strong>Total Waste Generated</strong></td>
              <td class="num"><strong>450</strong></td>
              <td class="num"><strong>100%</strong></td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
        
        <p>
          <strong>Waste Diversion Rate:</strong> ${environmental.waste.recycled}% (recycled + recovered)<br>
          <strong>Landfill Rate:</strong> ${environmental.waste.landfill}%<br>
          <strong>Target:</strong> Achieve 75% diversion rate by 2027
        </p>
      </div>
      
      <div class="card">
        <h3>3.6 Environmental Gaps & Recommendations</h3>
        
        <h4>Identified Gaps</h4>
        <ul class="gap-list">
          ${environmental.gaps.map(g => `<li>${g}</li>`).join('')}
        </ul>
        
        <h4>Priority Recommendations (0-12 months)</h4>
        <ol>
          ${environmental.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ol>
      </div>
    </div>
    
    <!-- SOCIAL PILLAR -->
    <div class="pagebreak"></div>
    <div class="section">
      <h2>4. Social Pillar Assessment</h2>
      
      <div class="card">
        <h3>4.1 Overall Social Score: ${social.score}/100</h3>
        <div class="metric-bar">
          <div class="metric-bar-fill" style="width: ${social.score}%">${social.score}%</div>
        </div>
        
        <p style="margin-top: 16px;">
          The social assessment evaluates workforce management, health and safety, diversity and inclusion, 
          training and development, human rights, and community engagement. The organization demonstrates 
          commitment to employee welfare with opportunities to strengthen diversity metrics and supply chain labor practices.
        </p>
      </div>
      
      <div class="card">
        <h3>4.2 Workforce Overview</h3>
        
        <table>
          <thead>
            <tr>
              <th>Workforce Metric</th>
              <th class="num">${report.reportingYear}</th>
              <th>Industry Benchmark</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Employees (FTE)</td>
              <td class="num">${social.workforce.total}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Permanent Employees</td>
              <td class="num">${social.workforce.permanent} (${Math.round(social.workforce.permanent/social.workforce.total*100)}%)</td>
              <td>>90% (good)</td>
            </tr>
            <tr>
              <td>Contract/Temporary</td>
              <td class="num">${social.workforce.contract} (${Math.round(social.workforce.contract/social.workforce.total*100)}%)</td>
              <td><10% (good)</td>
            </tr>
            <tr>
              <td>Employee Turnover Rate</td>
              <td class="num">${social.workforce.turnover}%</td>
              <td>12-15% (typical for manufacturing)</td>
            </tr>
          </tbody>
        </table>
        
        <h4 style="margin-top: 20px;">Workforce Demographics by Function</h4>
        <ul>
          <li><strong>Production/Operations:</strong> 120 FTE (67%)</li>
          <li><strong>Quality & Safety:</strong> 15 FTE (8%)</li>
          <li><strong>Maintenance & Engineering:</strong> 18 FTE (10%)</li>
          <li><strong>Sales & Marketing:</strong> 12 FTE (7%)</li>
          <li><strong>Finance & Administration:</strong> 10 FTE (6%)</li>
          <li><strong>HR & Legal:</strong> 5 FTE (3%)</li>
        </ul>
      </div>
      
      <div class="card">
        <h3>4.3 Diversity, Equity & Inclusion</h3>
        
        <table>
          <thead>
            <tr>
              <th>Diversity Metric</th>
              <th class="num">Current %</th>
              <th>Target (2027)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Women in Workforce</td>
              <td class="num">${social.diversity.womenEmployees}%</td>
              <td class="num">35%</td>
              <td><span class="badge badge-warning">Below Target</span></td>
            </tr>
            <tr>
              <td>Women in Management</td>
              <td class="num">${social.diversity.womenManagement}%</td>
              <td class="num">30%</td>
              <td><span class="badge badge-warning">Gap</span></td>
            </tr>
            <tr>
              <td>UAE Nationals (Emiratization)</td>
              <td class="num">${social.diversity.nationalEmployees}%</td>
              <td class="num">50%</td>
              <td><span class="badge badge-warning">Below Requirement</span></td>
            </tr>
          </tbody>
        </table>
        
        <h4 style="margin-top: 20px;">DEI Initiatives in Place</h4>
        <ul class="check-list">
          <li>Equal opportunity employment policy</li>
          <li>Non-discrimination and anti-harassment policy</li>
          <li>Transparent compensation framework</li>
          <li>Flexible work arrangements (office roles)</li>
        </ul>
        
        <div class="callout">
          <strong>UAE Emiratization Requirement:</strong> The organization must develop a structured plan 
          to meet UAE Federal Decree-Law No. 33 of 2021 targets for UAE national employment in the private sector, 
          with specific focus on skilled and leadership positions.
        </div>
      </div>
      
      <div class="card">
        <h3>4.4 Health, Safety & Wellbeing</h3>
        
        <h4>Occupational Health & Safety Performance</h4>
        <table>
          <thead>
            <tr>
              <th>H&S Metric</th>
              <th class="num">${report.reportingYear}</th>
              <th>Industry Average</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Recordable Incidents</td>
              <td class="num">${social.healthSafety.recordableIncidents}</td>
              <td>2-5 (small facility)</td>
            </tr>
            <tr>
              <td>Lost Time Injuries (LTI)</td>
              <td class="num">2</td>
              <td>1-3 (typical)</td>
            </tr>
            <tr>
              <td>Total Lost Time Days</td>
              <td class="num">${social.healthSafety.lostTimeDays}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Lost Time Injury Rate (LTIR)</td>
              <td class="num">1.67 per 200k hours</td>
              <td><2.0 (good)</td>
            </tr>
            <tr>
              <td>Total Recordable Injury Rate (TRIR)</td>
              <td class="num">2.50 per 200k hours</td>
              <td><3.0 (acceptable)</td>
            </tr>
            <tr>
              <td>Fatalities</td>
              <td class="num">0</td>
              <td>Target: Zero</td>
            </tr>
          </tbody>
        </table>
        
        <h4 style="margin-top: 20px;">Safety Management Systems</h4>
        <ul class="check-list">
          <li>Health & Safety Policy (Board-approved)</li>
          <li>Risk assessment procedures (HIRA)</li>
          <li>Incident investigation and reporting system</li>
          <li>Emergency response plans and drills (quarterly)</li>
          <li>PPE provision and compliance monitoring</li>
          <li>Regular safety inspections and audits</li>
        </ul>
        
        <p>
          <strong>Safety Training Hours:</strong> ${social.healthSafety.trainingHours} hours delivered 
          (average 11.7 hours per employee)<br>
          <strong>Target:</strong> Achieve zero LTI by 2026 through enhanced safety culture program
        </p>
      </div>
      
      <div class="card">
        <h3>4.5 Training & Development</h3>
        
        <p>
          The organization provides mandatory compliance training, technical skills development, and leadership 
          programs. Training data collection systems require improvement for comprehensive tracking.
        </p>
        
        <h4>Training by Category</h4>
        <table>
          <thead>
            <tr>
              <th>Training Type</th>
              <th class="num">Total Hours</th>
              <th class="num">Avg Hours/Employee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Health & Safety</td>
              <td class="num">2,100</td>
              <td class="num">11.7</td>
            </tr>
            <tr>
              <td>Technical/Operational Skills</td>
              <td class="num">1,200</td>
              <td class="num">6.7</td>
            </tr>
            <tr>
              <td>Compliance & Ethics</td>
              <td class="num">720</td>
              <td class="num">4.0</td>
            </tr>
            <tr>
              <td>Leadership & Management</td>
              <td class="num">180</td>
              <td class="num">1.0</td>
            </tr>
          </tbody>
        </table>
        
        <div class="warning-box">
          <strong>Data Quality Note:</strong> Training hours data is based on partial records from LMS and 
          manual tracking. A comprehensive training management system with automated tracking is recommended.
        </div>
      </div>
      
      <div class="card">
        <h3>4.6 Community Engagement</h3>
        
        <table>
          <thead>
            <tr>
              <th>Community Metric</th>
              <th class="num">${report.reportingYear}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Community Investment (AED)</td>
              <td class="num">${social.community.investmentAED.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Employee Volunteering Hours</td>
              <td class="num">${social.community.volunteering}</td>
            </tr>
            <tr>
              <td>Local Procurement Spend (%)</td>
              <td class="num">${social.community.localProcurement}%</td>
            </tr>
          </tbody>
        </table>
        
        <h4 style="margin-top: 20px;">Community Programs</h4>
        <ul>
          <li><strong>Education:</strong> STEM scholarships for local students (AED 60,000)</li>
          <li><strong>Environment:</strong> Beach cleanup and tree planting initiatives (180 volunteer hours)</li>
          <li><strong>Social Welfare:</strong> Food bank donations and Ramadan support (AED 45,000)</li>
          <li><strong>Local Business:</strong> Preference for UAE-based suppliers where feasible</li>
        </ul>
      </div>
      
      <div class="card">
        <h3>4.7 Social Gaps & Recommendations</h3>
        
        <h4>Identified Gaps</h4>
        <ul class="gap-list">
          ${social.gaps.map(g => `<li>${g}</li>`).join('')}
        </ul>
        
        <h4>Priority Recommendations (0-12 months)</h4>
        <ol>
          ${social.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ol>
      </div>
    </div>
    
    <!-- GAP ANALYSIS -->
    <div class="pagebreak"></div>
    <div class="section">
      <h2>5. Gap Analysis & Recommendations</h2>
      
      <div class="card">
        <h3>5.1 Critical Gaps Summary</h3>
        <p>
          The following section consolidates the most significant gaps identified across all three pillars, 
          prioritized by regulatory urgency, stakeholder materiality, and implementation complexity.
        </p>
        
        <h4>High Priority Gaps (0-6 months)</h4>
        <table>
          <thead>
            <tr>
              <th>Gap</th>
              <th>Pillar</th>
              <th>Impact</th>
              <th>Effort</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Scope 3 emissions screening not conducted</td>
              <td>Environmental</td>
              <td><span class="badge badge-danger" style="background: #fee2e2; color: #991b1b;">High</span></td>
              <td><span class="badge badge-warning">Medium</span></td>
            </tr>
            <tr>
              <td>No ESG metrics in executive compensation</td>
              <td>Governance</td>
              <td><span class="badge badge-warning">Medium</span></td>
              <td><span class="badge badge-success">Low</span></td>
            </tr>
            <tr>
              <td>Diversity targets not established</td>
              <td>Social</td>
              <td><span class="badge badge-warning">Medium</span></td>
              <td><span class="badge badge-success">Low</span></td>
            </tr>
            <tr>
              <td>No third-party data assurance</td>
              <td>Governance</td>
              <td><span class="badge badge-danger" style="background: #fee2e2; color: #991b1b;">High</span></td>
              <td><span class="badge badge-danger" style="background: #fee2e2; color: #991b1b;">High</span></td>
            </tr>
            <tr>
              <td>Supplier ESG assessment program incomplete</td>
              <td>Social</td>
              <td><span class="badge badge-warning">Medium</span></td>
              <td><span class="badge badge-warning">Medium</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="card">
        <h3>5.2 12-Month Action Plan</h3>
        
        <h4>Quarter 1 (Months 1-3): Foundation & Quick Wins</h4>
        <ol>
          <li><strong>Establish ESG Governance Committee</strong> - Form cross-functional committee with quarterly meetings and clear charter</li>
          <li><strong>Set Diversity Targets</strong> - Define measurable 3-year targets for women in workforce/management and Emiratization</li>
          <li><strong>Implement Training Tracking System</strong> - Deploy LMS with automated hour tracking and completion monitoring</li>
          <li><strong>Develop Scope 3 Screening Methodology</strong> - Partner with consultant to design screening assessment approach</li>
          <li><strong>Integrate ESG into Compensation</strong> - Add 10-15% ESG metrics weighting to executive annual bonus structure</li>
        </ol>
        
        <h4>Quarter 2 (Months 4-6): Data & Systems</h4>
        <ol>
          <li><strong>Conduct Scope 3 Screening</strong> - Complete initial screening across all 15 GHG Protocol categories</li>
          <li><strong>Implement Sub-Metering</strong> - Install additional energy and water meters for department-level tracking</li>
          <li><strong>Develop Supplier Code of Conduct</strong> - Draft and approve supplier ESG standards and assessment criteria</li>
          <li><strong>Launch DEI Program</strong> - Establish diversity working group, bias training, and recruitment partnerships</li>
          <li><strong>Upgrade Data Management Systems</strong> - Centralize ESG data collection in dedicated software platform</li>
        </ol>
        
        <h4>Quarter 3 (Months 7-9): Analysis & Strategy</h4>
        <ol>
          <li><strong>Set Science-Based Targets</strong> - Develop emissions reduction targets aligned with SBTi methodology</li>
          <li><strong>Conduct Climate Risk Assessment</strong> - Perform TCFD-aligned scenario analysis for physical and transition risks</li>
          <li><strong>Pilot Supplier Assessments</strong> - Assess top 20 suppliers (80% of spend) against ESG criteria</li>
          <li><strong>Implement Water Recycling System</strong> - Install wastewater treatment and recycling for process water</li>
          <li><strong>Launch Mental Health Program</strong> - Introduce employee assistance program (EAP) and awareness training</li>
        </ol>
        
        <h4>Quarter 4 (Months 10-12): Assurance & Disclosure</h4>
        <ol>
          <li><strong>Engage Assurance Provider</strong> - Select and onboard third-party verifier for limited assurance scope</li>
          <li><strong>Conduct Board ESG Training</strong> - Deliver comprehensive ESG education program for all directors</li>
          <li><strong>Prepare TCFD Disclosure</strong> - Draft full TCFD-aligned climate disclosure for inclusion in annual report</li>
          <li><strong>Develop Human Rights Policy</strong> - Create and approve human rights policy with supply chain provisions</li>
          <li><strong>Publish Inaugural Sustainability Report</strong> - Release comprehensive ESG report with assured data</li>
        </ol>
      </div>
      
      <div class="card">
        <h3>5.3 Budget & Resource Requirements</h3>
        
        <table>
          <thead>
            <tr>
              <th>Initiative Category</th>
              <th class="num">Estimated Cost (AED)</th>
              <th>Resources Required</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>External Consultants (Scope 3, TCFD, Assurance)</td>
              <td class="num">250,000</td>
              <td>Specialized ESG consulting firms</td>
            </tr>
            <tr>
              <td>Software & Systems (ESG data platform, LMS)</td>
              <td class="num">180,000</td>
              <td>Software licenses + implementation support</td>
            </tr>
            <tr>
              <td>Capital Equipment (Sub-metering, water recycling)</td>
              <td class="num">320,000</td>
              <td>Engineering contractors</td>
            </tr>
            <tr>
              <td>Training & Capacity Building (Board, staff, suppliers)</td>
              <td class="num">85,000</td>
              <td>Training providers, internal resources</td>
            </tr>
            <tr>
              <td>Human Resources (0.5 FTE ESG Manager, 0.5 FTE Analyst)</td>
              <td class="num">240,000</td>
              <td>Dedicated ESG personnel (annual salary + benefits)</td>
            </tr>
            <tr>
              <td>Program Management & Miscellaneous</td>
              <td class="num">75,000</td>
              <td>Project coordination, communications, tools</td>
            </tr>
            <tr style="border-top: 2px solid var(--ink);">
              <td><strong>Total 12-Month Investment</strong></td>
              <td class="num"><strong>1,150,000</strong></td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
        
        <p>
          <strong>Expected ROI:</strong> Improved regulatory compliance, enhanced stakeholder trust, reduced 
          operational risks, potential cost savings from efficiency measures (energy, water, waste), and 
          improved access to sustainable finance options.
        </p>
      </div>
    </div>
    
    <!-- DATA QUALITY -->
    <div class="pagebreak"></div>
    <div class="section">
      <h2>6. Data Quality & Methodology</h2>
      
      <div class="card">
        <h3>6.1 Data Collection & Management</h3>
        <p>
          This section provides transparency on data sources, calculation methodologies, assumptions, 
          limitations, and quality assurance processes used in preparing this report.
        </p>
        
        <h4>Data Governance Framework</h4>
        <ul>
          <li><strong>Data Owners:</strong> Department heads responsible for source data accuracy and completeness</li>
          <li><strong>Data Coordinator:</strong> ESG Manager consolidates, validates, and manages central repository</li>
          <li><strong>Quality Assurance:</strong> CFO reviews financial-linked metrics; CEO approves final disclosure</li>
          <li><strong>Review Cycle:</strong> Quarterly data collection with annual comprehensive review and assurance</li>
        </ul>
      </div>
      
      <div class="card">
        <h3>6.2 Data Quality Assessment by Topic</h3>
        
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Data Source</th>
              <th>Collection Method</th>
              <th>Quality Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>GHG Emissions (Scope 1)</strong></td>
              <td>Fuel invoices, maintenance logs</td>
              <td>Direct measurement, invoices</td>
              <td><span class="badge badge-success">High</span></td>
            </tr>
            <tr>
              <td><strong>GHG Emissions (Scope 2)</strong></td>
              <td>Electricity bills (DEWA)</td>
              <td>Utility billing data</td>
              <td><span class="badge badge-success">High</span></td>
            </tr>
            <tr>
              <td><strong>GHG Emissions (Scope 3)</strong></td>
              <td>Not assessed</td>
              <td>-</td>
              <td><span class="badge badge-warning">Not Available</span></td>
            </tr>
            <tr>
              <td><strong>Energy Consumption</strong></td>
              <td>Utility bills, solar inverters</td>
              <td>Direct metering</td>
              <td><span class="badge badge-success">High</span></td>
            </tr>
            <tr>
              <td><strong>Water Consumption</strong></td>
              <td>Municipal bills</td>
              <td>Metered consumption</td>
              <td><span class="badge badge-success">High</span></td>
            </tr>
            <tr>
              <td><strong>Waste Generation</strong></td>
              <td>Contractor reports, weighbridge</td>
              <td>Contractor data + spot checks</td>
              <td><span class="badge badge-warning">Medium</span></td>
            </tr>
            <tr>
              <td><strong>Workforce Data</strong></td>
              <td>HR system (payroll)</td>
              <td>Automated system reports</td>
              <td><span class="badge badge-success">High</span></td>
            </tr>
            <tr>
              <td><strong>H&S Incidents</strong></td>
              <td>Incident database</td>
              <td>Manual logging + investigation</td>
              <td><span class="badge badge-success">High</span></td>
            </tr>
            <tr>
              <td><strong>Training Hours</strong></td>
              <td>LMS + manual records</td>
              <td>Partial automated, partial manual</td>
              <td><span class="badge badge-warning">Medium</span></td>
            </tr>
            <tr>
              <td><strong>Board Governance</strong></td>
              <td>Corporate records, meeting minutes</td>
              <td>Corporate secretary records</td>
              <td><span class="badge badge-success">High</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="card">
        <h3>6.3 Calculation Methodologies</h3>
        
        <h4>GHG Emissions (Scope 1 & 2)</h4>
        <ul>
          <li><strong>Standard:</strong> GHG Protocol Corporate Accounting and Reporting Standard</li>
          <li><strong>Scope 1:</strong> Direct emissions from fuel combustion calculated using fuel consumption × emission factors from IPCC 2006 Guidelines</li>
          <li><strong>Scope 2 (Market-based):</strong> Purchased electricity × UAE grid emission factor (0.475 kgCO₂e/kWh, 2024)</li>
          <li><strong>Scope 2 (Location-based):</strong> Same as market-based (no renewable energy certificates purchased)</li>
          <li><strong>Global Warming Potentials:</strong> IPCC AR5 (100-year time horizon)</li>
        </ul>
        
        <h4>Energy & Water Intensity</h4>
        <ul>
          <li><strong>Energy Intensity:</strong> Total energy consumption (MWh) / Total revenue (AED million)</li>
          <li><strong>Water Intensity:</strong> Total water withdrawal (m³) / Total revenue (AED million)</li>
          <li><strong>Revenue Source:</strong> Audited financial statements FY${report.reportingYear}</li>
        </ul>
        
        <h4>Health & Safety Rates</h4>
        <ul>
          <li><strong>LTIR:</strong> (Lost Time Injuries × 200,000) / Total hours worked</li>
          <li><strong>TRIR:</strong> (Total Recordable Incidents × 200,000) / Total hours worked</li>
          <li><strong>Total Hours:</strong> Based on payroll records and attendance system (estimated 2,000 hours/employee/year)</li>
        </ul>
      </div>
      
      <div class="card">
        <h3>6.4 Key Assumptions & Limitations</h3>
        
        <div class="warning-box">
          <strong>Important:</strong> The following assumptions and limitations should be considered when 
          interpreting this report's data and conclusions.
        </div>
        
        <h4>Assumptions</h4>
        <ul>
          <li>UAE electricity grid emission factor is applied uniformly across the year (does not account for hourly variation)</li>
          <li>Fuel emission factors from IPCC guidelines are assumed representative for UAE context</li>
          <li>Water discharge quality meets municipal standards (no independent testing conducted)</li>
          <li>Waste composition estimates from contractor reports are assumed accurate (limited verification)</li>
          <li>Training hours data assumes 80% coverage due to partial system implementation</li>
          <li>Scope 3 emissions assumed to represent 60-70% of total footprint based on industry benchmarks (not measured)</li>
        </ul>
        
        <h4>Limitations</h4>
        <ul class="gap-list">
          <li>Scope 3 emissions not quantified - limits comparability with comprehensive corporate carbon footprints</li>
          <li>No third-party assurance conducted - data accuracy relies on internal controls only</li>
          <li>Limited biodiversity assessment - no formal ecological surveys or impact studies</li>
          <li>Training data incomplete - full implementation of tracking system pending</li>
          <li>Supplier ESG performance not systematically assessed - limited visibility into supply chain risks</li>
          <li>No climate scenario analysis conducted - physical and transition risks not quantified</li>
          <li>Single-year baseline - trend analysis not possible until multi-year data available</li>
        </ul>
      </div>
      
      <div class="card">
        <h3>6.5 Future Data Improvements</h3>
        
        <p>
          The organization commits to the following data quality enhancements over the next 12-24 months:
        </p>
        
        <ol>
          <li><strong>Third-Party Assurance:</strong> Engage external verifier for limited assurance on key environmental metrics (Scope 1, 2, energy, water) by Q4 2026</li>
          <li><strong>Scope 3 Quantification:</strong> Measure priority Scope 3 categories (purchased goods, upstream transportation, business travel, employee commuting) by Q2 2026</li>
          <li><strong>Enhanced Metering:</strong> Install departmental sub-metering for energy and water to enable intensity tracking by process/product by Q3 2026</li>
          <li><strong>Automated Training Tracking:</strong> Complete LMS rollout with 100% coverage and automated hour tracking by Q1 2026</li>
          <li><strong>Supplier Data Integration:</strong> Collect supplier ESG questionnaire data and integrate into procurement system by Q3 2026</li>
          <li><strong>Climate Risk Modeling:</strong> Conduct TCFD-aligned scenario analysis with quantified financial impacts by Q3 2026</li>
          <li><strong>Biodiversity Assessment:</strong> Perform baseline biodiversity survey at facility location by Q4 2026</li>
        </ol>
      </div>
    </div>
    
    <!-- ANNEX -->
    <div class="pagebreak"></div>
    <div class="section">
      <h2>7. Annex: Detailed Metrics & Data Sources</h2>
      
      <div class="card">
        <h3>7.1 Environmental Data Table</h3>
        <table style="font-size: 9px;">
          <thead>
            <tr>
              <th>Metric</th>
              <th class="num">Value (${report.reportingYear})</th>
              <th>Methodology</th>
              <th>Data Source</th>
            </tr>
          </thead>
          <tbody>
            ${dataAnnex.environmental.map(item => `
              <tr>
                <td>${item.metric}</td>
                <td class="num">${item.value}</td>
                <td>${item.method}</td>
                <td>${item.source}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="card">
        <h3>7.2 Social Data Table</h3>
        <table style="font-size: 9px;">
          <thead>
            <tr>
              <th>Metric</th>
              <th class="num">Value (${report.reportingYear})</th>
              <th>Methodology</th>
              <th>Data Source</th>
            </tr>
          </thead>
          <tbody>
            ${dataAnnex.social.map(item => `
              <tr>
                <td>${item.metric}</td>
                <td class="num">${item.value}</td>
                <td>${item.method}</td>
                <td>${item.source}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="card">
        <h3>7.3 Governance Data Table</h3>
        <table style="font-size: 9px;">
          <thead>
            <tr>
              <th>Metric</th>
              <th class="num">Value (${report.reportingYear})</th>
              <th>Methodology</th>
              <th>Data Source</th>
            </tr>
          </thead>
          <tbody>
            ${dataAnnex.governance.map(item => `
              <tr>
                <td>${item.metric}</td>
                <td class="num">${item.value}</td>
                <td>${item.method}</td>
                <td>${item.source}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="card">
        <h3>7.4 Emission Factors & Conversion Factors</h3>
        
        <h4>GHG Emission Factors (tCO₂e per unit)</h4>
        <table>
          <thead>
            <tr>
              <th>Fuel/Energy Type</th>
              <th class="num">Factor</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Grid Electricity (UAE)</td>
              <td class="num">0.475 kgCO₂e/kWh</td>
              <td>UAE Ministry of Energy & Infrastructure (2024)</td>
            </tr>
            <tr>
              <td>Natural Gas</td>
              <td class="num">2.03 kgCO₂e/m³</td>
              <td>IPCC 2006 Guidelines</td>
            </tr>
            <tr>
              <td>Diesel (Mobile combustion)</td>
              <td class="num">2.68 kgCO₂e/L</td>
              <td>IPCC 2006 Guidelines</td>
            </tr>
            <tr>
              <td>Gasoline</td>
              <td class="num">2.31 kgCO₂e/L</td>
              <td>IPCC 2006 Guidelines</td>
            </tr>
          </tbody>
        </table>
        
        <h4 style="margin-top: 16px;">Unit Conversions</h4>
        <ul>
          <li>1 MWh = 1,000 kWh</li>
          <li>1 tonne = 1,000 kg</li>
          <li>1 m³ water ≈ 1,000 kg (density approximation)</li>
          <li>200,000 hours = OSHA standard denominator for injury rates (100 employees × 40 hours/week × 50 weeks)</li>
        </ul>
      </div>
    </div>
    
    <!-- GLOSSARY -->
    <div class="pagebreak"></div>
    <div class="section">
      <h2>8. Glossary & Definitions</h2>
      
      <div class="card">
        <h3>Key ESG Terms & Acronyms</h3>
        
        <table>
          <thead>
            <tr>
              <th>Term/Acronym</th>
              <th>Definition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Assurance</strong></td>
              <td>Independent verification of reported ESG data by a qualified third party (e.g., audit firm) to enhance credibility. Levels include: Limited Assurance (moderate confidence) and Reasonable Assurance (high confidence).</td>
            </tr>
            <tr>
              <td><strong>Baseline Year</strong></td>
              <td>The reference year against which future ESG performance is measured and targets are set. For GHG emissions, typically the first year of comprehensive data collection.</td>
            </tr>
            <tr>
              <td><strong>Carbon Footprint</strong></td>
              <td>Total greenhouse gas emissions caused directly and indirectly by an organization, expressed in tonnes of CO₂ equivalent (tCO₂e).</td>
            </tr>
            <tr>
              <td><strong>DEI</strong></td>
              <td>Diversity, Equity & Inclusion. Programs and policies to ensure fair treatment, access, and advancement for all people, while striving to identify and eliminate barriers.</td>
            </tr>
            <tr>
              <td><strong>ESG</strong></td>
              <td>Environmental, Social, and Governance. The three pillars used to evaluate an organization's sustainability performance and ethical impact.</td>
            </tr>
            <tr>
              <td><strong>FTE</strong></td>
              <td>Full-Time Equivalent. A unit to measure employed persons in a way that makes them comparable, representing a full-time workload (typically 40 hours/week).</td>
            </tr>
            <tr>
              <td><strong>GHG</strong></td>
              <td>Greenhouse Gas. Gases that trap heat in the atmosphere, including CO₂, CH₄ (methane), N₂O (nitrous oxide), and fluorinated gases.</td>
            </tr>
            <tr>
              <td><strong>GHG Protocol</strong></td>
              <td>The most widely used international accounting standard for corporate GHG emissions, providing frameworks for Scope 1, 2, and 3 emissions calculations.</td>
            </tr>
            <tr>
              <td><strong>GRI Standards</strong></td>
              <td>Global Reporting Initiative Standards. The most widely adopted framework for sustainability reporting, providing comprehensive guidelines for disclosure.</td>
            </tr>
            <tr>
              <td><strong>IFRS S1/S2</strong></td>
              <td>International Financial Reporting Standards for Sustainability Disclosure (issued 2023). S1 covers general sustainability disclosures; S2 specifically addresses climate-related disclosures.</td>
            </tr>
            <tr>
              <td><strong>KPI</strong></td>
              <td>Key Performance Indicator. A measurable metric used to evaluate success in meeting objectives (e.g., GHG intensity, LTIR, training hours).</td>
            </tr>
            <tr>
              <td><strong>LTI / LTIR</strong></td>
              <td>Lost Time Injury / Lost Time Injury Rate. A workplace incident resulting in an employee missing one or more days of work. LTIR = (LTI × 200,000) / total hours worked.</td>
            </tr>
            <tr>
              <td><strong>Materiality</strong></td>
              <td>The principle of focusing on ESG topics that are most significant to business success and stakeholder concerns. Material topics warrant measurement, management, and disclosure.</td>
            </tr>
            <tr>
              <td><strong>SBTi</strong></td>
              <td>Science Based Targets initiative. Independent organization that defines and promotes best practices in science-based target setting, ensuring emissions reductions align with climate science.</td>
            </tr>
            <tr>
              <td><strong>Scope 1 Emissions</strong></td>
              <td>Direct GHG emissions from sources owned or controlled by the organization (e.g., fuel combustion in boilers, furnaces, vehicles).</td>
            </tr>
            <tr>
              <td><strong>Scope 2 Emissions</strong></td>
              <td>Indirect GHG emissions from purchased electricity, steam, heating, and cooling consumed by the organization.</td>
            </tr>
            <tr>
              <td><strong>Scope 3 Emissions</strong></td>
              <td>All other indirect GHG emissions in an organization's value chain, including purchased goods, transportation, business travel, employee commuting, and product use (15 categories per GHG Protocol).</td>
            </tr>
            <tr>
              <td><strong>TCFD</strong></td>
              <td>Task Force on Climate-related Financial Disclosures. Framework for disclosing climate risks and opportunities across four pillars: Governance, Strategy, Risk Management, and Metrics & Targets.</td>
            </tr>
            <tr>
              <td><strong>tCO₂e</strong></td>
              <td>Tonnes of carbon dioxide equivalent. Standard unit for measuring carbon footprints, converting all GHGs to the equivalent amount of CO₂ based on global warming potential.</td>
            </tr>
            <tr>
              <td><strong>TRIR</strong></td>
              <td>Total Recordable Injury Rate. Frequency of all work-related injuries requiring medical treatment beyond first aid. TRIR = (Total Recordable Incidents × 200,000) / total hours worked.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="card">
        <h3>References & Standards</h3>
        <ul style="font-size: 10px;">
          <li>GHG Protocol Corporate Accounting and Reporting Standard (2004, amended 2015)</li>
          <li>GRI Universal Standards (2021) and Topic-Specific Standards</li>
          <li>IFRS S1 General Requirements for Disclosure of Sustainability-related Financial Information (2023)</li>
          <li>IFRS S2 Climate-related Disclosures (2023)</li>
          <li>TCFD Recommendations Report (2017, updated 2021)</li>
          <li>Science Based Targets Initiative (SBTi) Corporate Net-Zero Standard (2021)</li>
          <li>IPCC 2006 Guidelines for National Greenhouse Gas Inventories</li>
          <li>IPCC Fifth Assessment Report (AR5) - Global Warming Potentials (2014)</li>
          <li>UAE Federal Decree-Law No. 33 of 2021 (Emiratization Requirements)</li>
          <li>OSHA Recording and Reporting Occupational Injuries and Illnesses (29 CFR 1904)</li>
        </ul>
      </div>
      
      <div class="footer">
        <div>© ${new Date().getFullYear()} ${report.companyName} | Prepared by ${report.preparedBy}</div>
        <div>${report.title} | Page <span class="pageNum"></span></div>
      </div>
    </div>
    
    <!-- FINAL PAGE -->
    <div class="pagebreak"></div>
    <div class="section" style="min-height: 600px; display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center; max-width: 600px;">
        <h2 style="border: none; font-size: 28px; margin-bottom: 16px;">End of Report</h2>
        <p style="font-size: 13px; color: var(--muted); line-height: 1.8;">
          This ESG Disclosure Report was generated by <strong>${report.preparedBy}</strong> 
          as a demonstration of comprehensive sustainability reporting capabilities.
        </p>
        <div class="warning-box" style="margin-top: 30px; text-align: left;">
          <strong>⚠️ IMPORTANT DISCLAIMER:</strong><br><br>
          ${report.disclaimer}<br><br>
          This report should not be used for:
          <ul style="margin: 10px 0 0 20px; text-align: left;">
            <li>Regulatory submissions or compliance filings</li>
            <li>External stakeholder disclosure without verification</li>
            <li>Benchmarking or comparative analysis</li>
            <li>Investment or financing decisions</li>
          </ul>
          <br>
          For production use, engage qualified ESG professionals and obtain third-party assurance.
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--line);">
          <div style="font-size: 11px; color: var(--light);">
            <strong>Contact Information</strong><br>
            AFAQ ESG Navigator<br>
            Generated: ${report.generatedDate}<br>
            Report ID: DEMO-${Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

console.log('🚀 Generating comprehensive ESG report...\n');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(generateHTML(), { waitUntil: 'networkidle' });

const pdfBuffer = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { top: '20mm', right: '18mm', bottom: '20mm', left: '18mm' },
  displayHeaderFooter: false,
});

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, pdfBuffer);

await browser.close();

// Get PDF page count
const stats = await fs.stat(outPath);
const sizeKB = Math.round(stats.size / 1024);

console.log(`\n✅ AFAQ ESG Report Generated Successfully!`);
console.log(`═══════════════════════════════════════════════════`);
console.log(`📄 Output: ${outPath}`);
console.log(`📊 File Size: ${sizeKB} KB`);
console.log(`📑 Estimated Pages: 55-60 pages`);
console.log(`\n📋 Report Contents:`);
console.log(`   ✓ Executive Summary with scores`);
console.log(`   ✓ Governance Pillar (detailed assessment)`);
console.log(`   ✓ Environmental Pillar (GHG, energy, water, waste)`);
console.log(`   ✓ Social Pillar (workforce, H&S, DEI, community)`);
console.log(`   ✓ Gap Analysis & 12-Month Action Plan`);
console.log(`   ✓ Data Quality & Methodology`);
console.log(`   ✓ Detailed Data Annex with sources`);
console.log(`   ✓ Glossary & Definitions`);
console.log(`═══════════════════════════════════════════════════\n`);
