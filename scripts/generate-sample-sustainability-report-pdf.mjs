import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const outPath = path.resolve('public/sample-sustainability-report-redacted.pdf');

const report = {
  title: 'Sustainability & ESG Report (Sample)',
  reportingYear: '2024',
  companyName: 'Company Name Redacted',
  jurisdiction: 'UAE (sample only)',
  preparedBy: 'AFAQ ESG Navigator (Sample)',
  disclaimer:
    'This document is a PUBLIC SAMPLE generated with fictional / illustrative information. It is provided for demonstration purposes only and does not constitute legal, regulatory, financial, or assurance advice.',
  note:
    'All names, locations, figures, and performance data are illustrative. Any resemblance to real entities is coincidental.',
};

function html() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${report.title}</title>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    :root {
      --ink: #0f172a;
      --muted: #475569;
      --line: #e2e8f0;
      --accent: #1d4ed8;
      --accent2: #0ea5e9;
      --bg: #f8fafc;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    }
    html, body { font-family: var(--sans); color: var(--ink); }
    body { margin: 0; }

    /* Layout */
    .page { position: relative; }
    .section { margin: 0 0 18px 0; }
    .card {
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 14px 16px;
      background: #fff;
      box-shadow: 0 1px 0 rgba(15, 23, 42, .03);
    }

    /* Typography */
    h1 { font-size: 28px; margin: 0 0 8px 0; letter-spacing: -0.02em; }
    h2 { font-size: 16px; margin: 18px 0 10px 0; }
    h3 { font-size: 13px; margin: 12px 0 8px 0; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
    p { font-size: 11px; line-height: 1.55; margin: 0 0 10px 0; color: var(--ink); }
    .muted { color: var(--muted); }
    .small { font-size: 10px; }

    /* Cover */
    .cover {
      border-radius: 16px;
      padding: 22px;
      background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 45%, #f8fafc 100%);
      border: 1px solid #dbeafe;
    }
    .cover .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
    .meta .kv { border: 1px solid #dbeafe; background: rgba(255,255,255,.7); border-radius: 12px; padding: 10px 12px; }
    .kv .k { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
    .kv .v { font-size: 11px; font-weight: 600; color: var(--ink); }

    /* Chips */
    .chip {
      display: inline-block;
      font-size: 9px;
      padding: 5px 9px;
      border-radius: 999px;
      border: 1px solid #bae6fd;
      background: #f0f9ff;
      color: #075985;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    /* Table */
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th, td { border-bottom: 1px solid var(--line); padding: 8px 6px; vertical-align: top; }
    th { text-align: left; color: var(--muted); font-weight: 700; font-size: 9px; text-transform: uppercase; letter-spacing: .06em; }
    td { color: var(--ink); }
    .num { text-align: right; font-variant-numeric: tabular-nums; }

    /* Callouts */
    .callout {
      border: 1px solid #c7d2fe;
      background: #eef2ff;
      border-radius: 12px;
      padding: 10px 12px;
    }

    /* Footer */
    .footer { margin-top: 18px; padding-top: 10px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; gap: 12px; }

    /* Watermark */
    .watermark {
      position: fixed;
      inset: 0;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.06;
      transform: rotate(-22deg);
      font-size: 56px;
      font-weight: 900;
      letter-spacing: 0.2em;
      color: #0f172a;
      user-select: none;
      z-index: 9999;
      white-space: nowrap;
    }

    /* Ensure print colors */
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

    /* Page breaks */
    .pagebreak { page-break-before: always; }
  </style>
</head>
<body>
  <div class="watermark">SAMPLE • REDACTED • SAMPLE • REDACTED • SAMPLE • REDACTED</div>

  <div class="page">
    <div class="section cover">
      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
        <div>
          <div class="chip">Public Sample</div>
          <h1 style="margin-top:10px;">${report.title}</h1>
          <p class="muted">Reporting year ${report.reportingYear} • ${report.companyName} • ${report.jurisdiction}</p>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px; color: var(--muted);">Prepared by</div>
          <div style="font-size:11px; font-weight:700;">${report.preparedBy}</div>
        </div>
      </div>

      <div class="meta">
        <div class="kv"><div class="k">Document status</div><div class="v">Sample / Illustrative</div></div>
        <div class="kv"><div class="k">Assurance</div><div class="v">Not assured</div></div>
        <div class="kv"><div class="k">Scope</div><div class="v">Example-only (selected KPIs)</div></div>
        <div class="kv"><div class="k">Confidentiality</div><div class="v">Public demo (redacted)</div></div>
      </div>

      <div class="callout" style="margin-top: 14px;">
        <p style="margin:0;"><strong>Disclaimer:</strong> ${report.disclaimer}</p>
        <p class="small muted" style="margin:6px 0 0 0;">${report.note}</p>
      </div>

      <div class="footer">
        <div class="small muted">AFAQ ESG Navigator</div>
        <div class="small muted">Generated on ${new Date().toISOString().slice(0, 10)}</div>
      </div>
    </div>

    <div class="section card">
      <h3>Table of contents</h3>
      <table>
        <tbody>
          <tr><td>1. Executive summary</td><td class="num">2</td></tr>
          <tr><td>2. Reporting boundary & methodology (sample)</td><td class="num">3</td></tr>
          <tr><td>3. Governance</td><td class="num">4</td></tr>
          <tr><td>4. Environmental performance (selected KPIs)</td><td class="num">5</td></tr>
          <tr><td>5. Social performance (selected KPIs)</td><td class="num">6</td></tr>
          <tr><td>6. Risk, controls & transparency</td><td class="num">7</td></tr>
          <tr><td>7. Appendix: definitions (sample)</td><td class="num">8</td></tr>
        </tbody>
      </table>
      <p class="small muted" style="margin-top:10px;">Page numbers are illustrative in this sample PDF.</p>
    </div>

    <div class="pagebreak"></div>

    <div class="section card">
      <h2>1. Executive summary</h2>
      <p>
        This sample sustainability report illustrates the structure and tone of an ESG disclosure output.
        It demonstrates governance statements, a small set of quantitative KPIs, and an example narrative describing
        risks, controls, and transparency practices.
      </p>
      <p>
        <strong>Key highlights (illustrative):</strong>
      </p>
      <ul style="margin:0; padding-left: 18px; font-size: 11px; line-height: 1.55;">
        <li>Governance: Board-level oversight of ESG and periodic management reporting.</li>
        <li>Environment: Establishment of a GHG inventory and baseline year, with reduction targets.</li>
        <li>Social: Health & safety management, training hours tracking, and employee engagement pulse checks.</li>
        <li>Transparency: Published policies, data quality controls, and internal review prior to release.</li>
      </ul>
    </div>

    <div class="section card">
      <h2>2. Reporting boundary & methodology (sample)</h2>
      <p>
        <strong>Boundary (illustrative):</strong> Consolidated operations within a fictional UAE-headquartered group.
        Data includes selected indicators from offices and one primary facility.
      </p>
      <p>
        <strong>Methodology (illustrative):</strong> Data is collected from internal systems and supplier invoices.
        Calculations follow common GHG Protocol conventions where applicable. This sample does not claim full
        compliance with any particular standard.
      </p>
      <p class="small muted">
        Note: In the real product, methodology details are tailored to the selected framework and jurisdiction.
      </p>
    </div>

    <div class="pagebreak"></div>

    <div class="section card">
      <h2>3. Governance</h2>
      <p>
        The organization maintains governance structures intended to support effective ESG management.
        In this sample, the Board (or equivalent governing body) receives periodic ESG updates, and executive
        management is accountable for implementation.
      </p>

      <table>
        <thead>
          <tr>
            <th>Governance element</th>
            <th>Description (sample)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Oversight</strong></td>
            <td>ESG topics are reviewed quarterly by a designated committee; material items are escalated to leadership.</td>
          </tr>
          <tr>
            <td><strong>Policies</strong></td>
            <td>Code of Conduct, Anti-bribery, Whistleblowing, Supplier standards (publicly available in real deployments).</td>
          </tr>
          <tr>
            <td><strong>Accountability</strong></td>
            <td>Named owners for data collection and control checks; documented sign-off process before publication.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagebreak"></div>

    <div class="section card">
      <h2>4. Environmental performance (selected KPIs)</h2>
      <p>
        The table below shows example environmental indicators. Values are fictional and provided only to illustrate the
        reporting format.
      </p>
      <table>
        <thead>
          <tr>
            <th>KPI</th>
            <th class="num">2023</th>
            <th class="num">2024</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Scope 1 GHG emissions (tCO₂e)</td>
            <td class="num">120</td>
            <td class="num">112</td>
            <td>Fuel combustion at primary facility (illustrative).</td>
          </tr>
          <tr>
            <td>Scope 2 GHG emissions (tCO₂e)</td>
            <td class="num">980</td>
            <td class="num">910</td>
            <td>Market-based; electricity consumption (illustrative).</td>
          </tr>
          <tr>
            <td>Energy consumption (MWh)</td>
            <td class="num">4,850</td>
            <td class="num">4,620</td>
            <td>Includes facility + offices (illustrative).</td>
          </tr>
          <tr>
            <td>Water withdrawn (m³)</td>
            <td class="num">18,400</td>
            <td class="num">17,950</td>
            <td>Municipal supply (illustrative).</td>
          </tr>
        </tbody>
      </table>
      <p class="small muted" style="margin-top:10px;">All figures are examples; do not use for benchmarking.</p>
    </div>

    <div class="pagebreak"></div>

    <div class="section card">
      <h2>5. Social performance (selected KPIs)</h2>
      <p>
        Social indicators are examples showing how organizations may summarize workforce and community metrics.
      </p>
      <table>
        <thead>
          <tr>
            <th>KPI</th>
            <th class="num">2023</th>
            <th class="num">2024</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total workforce (FTE)</td>
            <td class="num">215</td>
            <td class="num">240</td>
            <td>Includes full-time employees (illustrative).</td>
          </tr>
          <tr>
            <td>Training hours per employee</td>
            <td class="num">14.2</td>
            <td class="num">16.8</td>
            <td>Includes compliance and skills training (illustrative).</td>
          </tr>
          <tr>
            <td>Recordable incident rate (per 200k hours)</td>
            <td class="num">0.52</td>
            <td class="num">0.44</td>
            <td>Health & safety program (illustrative).</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagebreak"></div>

    <div class="section card">
      <h2>6. Risk, controls & transparency</h2>
      <p>
        The organization identifies ESG risks and implements controls to support accurate reporting.
        Example controls include: KPI definition catalog, collection workflows, automated validation checks,
        and management review prior to release.
      </p>
      <p>
        <strong>Sample transparency statement:</strong> The report is intended to be clear, decision-useful, and consistent.
        Material assumptions are documented, and changes to methodology are disclosed where relevant.
      </p>
      <div class="callout">
        <p style="margin:0;"><strong>Sample limitation:</strong> This PDF is not tied to a specific company assessment and is not a regulated filing.</p>
      </div>
    </div>

    <div class="pagebreak"></div>

    <div class="section card">
      <h2>7. Appendix: definitions (sample)</h2>
      <table>
        <thead>
          <tr>
            <th>Term</th>
            <th>Definition (sample)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>tCO₂e</td>
            <td>Metric tonnes of carbon dioxide equivalent.</td>
          </tr>
          <tr>
            <td>Scope 1</td>
            <td>Direct emissions from owned/controlled sources.</td>
          </tr>
          <tr>
            <td>Scope 2</td>
            <td>Indirect emissions from purchased electricity/energy.</td>
          </tr>
          <tr>
            <td>FTE</td>
            <td>Full-time equivalent employee count.</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <div class="small muted">© ${new Date().getFullYear()} AFAQ ESG Navigator • Sample document</div>
        <div class="small muted">sample-sustainability-report-redacted.pdf</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html(), { waitUntil: 'networkidle' });

const pdfBuffer = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { top: '18mm', right: '16mm', bottom: '18mm', left: '16mm' },
});

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, pdfBuffer);

await browser.close();

console.log(`Wrote ${outPath}`);
