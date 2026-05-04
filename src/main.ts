/**
 * Sales-Engineering / RFP-Response MCP Server v1.0
 * By Elisabeth Hitz — built from 10+ years of B2B enterprise sales experience
 *
 * 7 tools for AI sales agents and sales engineers handling RFPs, security
 * questionnaires, technical attestations, and competitive battle cards.
 *
 * Target users: AI agents at AI SDR / sales platforms, sales-engineering teams
 * at mid-market B2B SaaS companies, anyone fielding security questionnaires.
 *
 * DISCLAIMER: Outputs are structured starting templates based on publicly-documented
 * security frameworks (SOC2, ISO27001, HIPAA, GDPR, NIST CSF). They are NOT a
 * substitute for: (a) the actual content of YOUR security program, (b) legal review,
 * (c) certified audit attestation. Use as drafting scaffolds; replace bracketed
 * placeholders with your specific facts; have your security/legal team review
 * before submitting any actual RFP or questionnaire response.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// =====================================================
// SERVER METADATA
// =====================================================
const MCP_META = {
  server: "sales-engineering-mcp",
  version: "1.0.0",
  last_verified: "2026-Q2",
  author: "Elisabeth Hitz",
  homepage: "https://elisabethhitz-mcp.netlify.app",
  github: "https://github.com/closermethod/sales-engineering-mcp",
  jurisdiction_caveat: "Outputs are structured starting templates based on publicly-documented security frameworks (SOC2, ISO 27001, HIPAA, GDPR, NIST CSF, PCI-DSS). They are NOT (a) a substitute for the actual content of your security program, (b) legal advice, (c) a certified audit attestation, (d) a guarantee of compliance. Replace bracketed placeholders with your specific facts. Have qualified security and legal counsel review before submitting any actual RFP or security questionnaire."
} as const;

// =====================================================
// SECURITY ATTESTATION TEMPLATES (per framework)
// =====================================================
const SECURITY_ATTESTATIONS: Record<string, any> = {
  soc2_type_2: {
    framework: "SOC 2 Type II",
    issuing_authority: "AICPA",
    typical_scope: "Trust Services Criteria: Security (mandatory) + optional Availability, Processing Integrity, Confidentiality, Privacy",
    audit_period: "Minimum 6 months continuous; annual recertification",
    attestation_template: "[Company Name] maintains a SOC 2 Type II report covering the Trust Services Criteria of Security[, Availability, Confidentiality]. Our most recent audit was conducted by [Auditor Firm] for the period [Start Date] to [End Date]. The full report is available under NDA on request via [Email or Vanta/Drata customer portal].",
    common_questionnaire_questions: [
      "Do you have a current SOC 2 Type II report?",
      "What was the audit period?",
      "Who is the auditor?",
      "Are there any qualified opinions or exceptions in the report?",
      "How frequently is the audit performed?"
    ],
    response_pattern: "Affirmative + provide auditor + period + offer NDA-gated access. Never share publicly without NDA.",
    typical_setup_time: "12-18 months from start to first Type II report",
    typical_cost_band: "$25K-$80K annual audit + $20K-$60K Vanta/Drata/Tugboat tooling",
    common_pitfalls: [
      "Sharing report without NDA — your auditor will ding you on the next audit",
      "Promising controls you don't have — Type II tests OPERATING effectiveness over the audit period",
      "Saying 'we're SOC 2' when you only have Type I (point in time) — buyers will ask"
    ]
  },
  iso_27001: {
    framework: "ISO/IEC 27001:2022",
    issuing_authority: "ISO + accredited certification body",
    typical_scope: "Information Security Management System (ISMS) covering 93 controls in Annex A",
    audit_period: "3-year certification cycle: initial audit, surveillance audit (yearly), recertification (year 3)",
    attestation_template: "[Company Name] is certified to ISO/IEC 27001:2022. Certificate number: [Cert No]. Issued by [Certification Body Name] on [Date]. Valid through [Expiry Date]. Scope of certification: [e.g., 'design, development, and operation of [Product Name] SaaS platform']. Certificate available on request.",
    common_questionnaire_questions: [
      "Are you ISO 27001 certified?",
      "Which version (2013 or 2022)?",
      "What is your scope of certification?",
      "Who is your certification body?",
      "When does it expire?"
    ],
    response_pattern: "Affirm with certificate number + scope + cert body + expiry. Always note 2022 (current) vs 2013 (legacy).",
    typical_setup_time: "9-15 months from gap analysis to certification",
    typical_cost_band: "$15K-$40K cert body + $30K-$80K consultant/internal lift",
    common_pitfalls: [
      "Stating 'ISO 27001 compliant' instead of 'certified' — these are different (compliance is self-declared, certification is third-party audited)",
      "Letting cert lapse without surveillance audits",
      "Scope-shrinking to pass audit then claiming full coverage in sales materials"
    ]
  },
  hipaa: {
    framework: "HIPAA / HITECH",
    issuing_authority: "U.S. HHS Office for Civil Rights (no formal certification body — self-attested with audit support)",
    typical_scope: "Privacy Rule + Security Rule + Breach Notification Rule for Protected Health Information (PHI)",
    audit_period: "Continuous; OCR audits may occur",
    attestation_template: "[Company Name] supports HIPAA-compliant operations as a Business Associate. We sign Business Associate Agreements (BAAs) with covered entities. Our Security Rule controls include: encryption at rest (AES-256) and in transit (TLS 1.2+), access controls per least privilege, audit logging, BCP/DR, employee training, incident response plan with breach notification within 60 days. Our HIPAA program is reviewed annually by [Auditor or 'internal compliance team']. Penetration testing performed [annually/quarterly] by [Pentest Firm].",
    common_questionnaire_questions: [
      "Will you sign a BAA?",
      "What encryption standards do you use for PHI?",
      "Do you have a designated HIPAA Privacy Officer?",
      "How are breaches notified and within what timeframe?",
      "What is your HIPAA training cadence?"
    ],
    response_pattern: "Affirm BAA willingness. Specify encryption + access controls + breach timeline. Note 'HIPAA-aligned' or 'HIPAA-supportive' rather than 'HIPAA-certified' (which doesn't exist).",
    typical_setup_time: "6-12 months from policy work to confident BA status",
    typical_cost_band: "$10K-$30K legal + $20K-$50K technical controls + ongoing",
    common_pitfalls: [
      "Saying 'HIPAA certified' — there is no such thing",
      "Refusing to sign BAA but processing PHI — this is the entire HIPAA violation",
      "Forgetting Breach Notification Rule timeline (60 days for affected individuals; immediate for media if 500+ in a state)"
    ]
  },
  gdpr: {
    framework: "EU General Data Protection Regulation (GDPR)",
    issuing_authority: "Lead Supervisory Authority per EU member state",
    typical_scope: "All personal data of EU/EEA data subjects",
    audit_period: "Continuous; supervisory authorities can audit at any time",
    attestation_template: "[Company Name] processes personal data in compliance with the EU General Data Protection Regulation (Regulation (EU) 2016/679). We sign Data Processing Agreements (DPAs) including Standard Contractual Clauses (SCCs 2021) for cross-border transfers. Our DPA template is available at [URL]. Lead supervisory authority: [Member State DPA, typically based on EU establishment]. DPO contact: [dpo@company.com]. Personal data breach notification: within 72 hours to supervisory authority and to data subjects without undue delay where required.",
    common_questionnaire_questions: [
      "Are you GDPR compliant?",
      "Do you have a Data Protection Officer (DPO)?",
      "What is your lead supervisory authority?",
      "Do you sign DPAs with SCCs?",
      "How do you handle Data Subject Access Requests (DSARs)?",
      "What sub-processors do you use?",
      "Where is data stored geographically?"
    ],
    response_pattern: "Affirm. Specify DPO/Privacy Officer. Provide SCC version (2021). List sub-processors. State data residency. DSAR turnaround 30 days standard.",
    typical_setup_time: "3-9 months from privacy program inception",
    typical_cost_band: "$15K-$50K legal/DPO retainer + ongoing tooling",
    common_pitfalls: [
      "Confusing GDPR with EU-US Data Privacy Framework (DPF) — they are layered, not equivalent",
      "Missing the 72-hour breach notification window",
      "Sub-processor list staleness — must be current and notified before changes",
      "Treating non-EU customers as EU-protected when they aren't (over-application)"
    ]
  },
  nist_csf: {
    framework: "NIST Cybersecurity Framework 2.0",
    issuing_authority: "NIST (voluntary framework — not certifiable)",
    typical_scope: "6 functions: Govern, Identify, Protect, Detect, Respond, Recover",
    audit_period: "Self-assessed; some governments mandate alignment",
    attestation_template: "[Company Name] aligns to the NIST Cybersecurity Framework 2.0. We have mapped our security controls to NIST CSF Functions: Govern, Identify, Protect, Detect, Respond, Recover. Our current maturity tier across functions: [Tier 1 Partial / Tier 2 Risk Informed / Tier 3 Repeatable / Tier 4 Adaptive]. Detailed mapping is available under NDA.",
    common_questionnaire_questions: [
      "Do you align to NIST CSF?",
      "What is your current maturity tier?",
      "Provide your CSF Profile mapping for the [Govern / Identify / Protect / Detect / Respond / Recover] functions"
    ],
    response_pattern: "Affirm alignment (NOT 'certified' — CSF is not certifiable). Specify maturity tier honestly. Offer NDA-gated profile mapping.",
    typical_setup_time: "3-6 months mapping + ongoing maturity work",
    typical_cost_band: "$0 (framework is free) + internal mapping effort",
    common_pitfalls: [
      "Saying 'NIST CSF certified' — there is no certification",
      "Claiming Tier 4 maturity without continuous improvement evidence",
      "Mapping controls without documenting the mapping"
    ]
  },
  pci_dss: {
    framework: "PCI DSS 4.0",
    issuing_authority: "PCI Security Standards Council (audited by QSA for Level 1)",
    typical_scope: "Payment card data (cardholder data + sensitive authentication data)",
    audit_period: "Annual ROC for Level 1 (>6M transactions); SAQ for lower levels",
    attestation_template: "[Company Name] is PCI DSS [Level 1 / Level 2 / Level 3 / Level 4] compliant under version 4.0. Our most recent [Report on Compliance / Self-Assessment Questionnaire ([SAQ A / SAQ A-EP / SAQ D-Merchant / SAQ D-Service Provider])] was completed on [Date] and is valid through [Date]. QSA: [QSA firm name, if applicable]. Our Attestation of Compliance (AoC) is available on request under NDA.",
    common_questionnaire_questions: [
      "Are you PCI DSS compliant?",
      "What level / SAQ type?",
      "Who is your QSA (if Level 1)?",
      "When does your AoC expire?",
      "Do you store, process, or transmit cardholder data?"
    ],
    response_pattern: "If you avoid touching card data via tokenization (e.g., Stripe Elements), say so explicitly — many companies don't need full PCI scope.",
    typical_setup_time: "6-18 months depending on level",
    typical_cost_band: "$30K-$200K+ for Level 1 RoC; $5K-$30K for SAQ-D",
    common_pitfalls: [
      "Claiming PCI compliance without specifying level — 'Level 1' vs 'SAQ A' are very different",
      "Forgetting to renew AoC annually",
      "Scope-creeping into PCI when you could tokenize and stay out"
    ]
  }
};

// =====================================================
// COMMON SECURITY QUESTIONNAIRE Q&A
// =====================================================
const QUESTIONNAIRE_QA: Record<string, any> = {
  "encryption_at_rest": {
    common_phrasing: ["What encryption standard do you use for data at rest?", "Is data encrypted at rest?", "Do you use strong encryption algorithms?"],
    template_response: "All customer data is encrypted at rest using AES-256-GCM. Encryption keys are managed via [AWS KMS / GCP KMS / HashiCorp Vault] with automatic key rotation every [90 / 365] days. Database-level encryption (e.g., RDS encryption) is also enabled as defense-in-depth.",
    placeholders_to_fill: ["KMS provider", "key rotation cadence"],
    common_followups: ["Who has access to encryption keys?", "How are keys rotated?", "Is there a key escrow?"]
  },
  "encryption_in_transit": {
    common_phrasing: ["What protocols do you use for data in transit?", "Is data encrypted in transit?", "What TLS version do you support?"],
    template_response: "All data in transit is encrypted using TLS 1.2 minimum (TLS 1.3 preferred). HSTS is enforced on all customer-facing endpoints. Internal service-to-service communication uses mTLS within our [VPC / service mesh].",
    placeholders_to_fill: ["service mesh name (Istio, Linkerd, etc.)"],
    common_followups: ["Do you support TLS 1.0/1.1?", "Are you using strong cipher suites?", "Who manages your certificates?"]
  },
  "access_control_least_privilege": {
    common_phrasing: ["How do you implement least privilege?", "What is your access management approach?", "Do you use role-based access control?"],
    template_response: "We follow least-privilege access using role-based access control (RBAC) with [identity provider — Okta / Microsoft Entra / Google Workspace]. All employee access is provisioned via IdP groups; access is reviewed quarterly per our access review SOP. Production access is restricted to a defined on-call rotation; just-in-time elevation is logged via [PAM solution / Teleport / etc.]. SSO + MFA are mandatory for all staff and SaaS tools.",
    placeholders_to_fill: ["IdP", "PAM solution"],
    common_followups: ["What's your access review cadence?", "Who has admin access?", "How do you offboard?"]
  },
  "vulnerability_management": {
    common_phrasing: ["How do you handle vulnerabilities?", "What is your patching cadence?", "Do you do penetration testing?"],
    template_response: "We use [Snyk / Dependabot / GitHub Advanced Security] for SCA, [Trivy / AWS Inspector] for container scanning, and [Burp / OWASP ZAP] in CI for DAST. Critical CVEs are patched within 7 days; High within 30 days; Medium within 60 days; Low at next sprint. Annual third-party penetration test conducted by [pentest firm]. Most recent penetration test: [date]. Findings remediation tracked to closure with re-test.",
    placeholders_to_fill: ["SCA tool", "pentest firm", "last pentest date"],
    common_followups: ["What CVEs are currently open?", "Can we see your latest pentest report?", "What is your bug bounty program?"]
  },
  "incident_response": {
    common_phrasing: ["What is your incident response process?", "How do you handle security incidents?", "Do you have a CSIRT?"],
    template_response: "We maintain a documented Incident Response Plan aligned to NIST 800-61. Roles: Incident Commander, Comms Lead, Technical Lead, Legal/Privacy Lead. Severity levels P0-P4 with defined response SLAs (P0 within 15 min). Customer notification within [4-24 hours] of confirmed incident affecting customer data. Annual tabletop exercises conducted; most recent: [date]. Post-incident reviews are documented and shared with affected customers.",
    placeholders_to_fill: ["customer notification window", "last tabletop date"],
    common_followups: ["What was your last incident?", "Who is the on-call?", "What is your forensics process?"]
  },
  "data_retention": {
    common_phrasing: ["How long do you retain customer data?", "What is your data retention policy?", "Can customers request deletion?"],
    template_response: "Customer-controlled data is retained while the contract is active. Upon termination, customer data is deleted within [30 / 60 / 90] days unless legal hold applies. Backups follow a [N]-day retention window then are purged. Customers can request earlier deletion via [support@company / DPO contact]; deletion is confirmed in writing within [30] days per GDPR Article 17 (Right to Erasure). Audit logs retained [12-24] months for compliance.",
    placeholders_to_fill: ["deletion window", "backup retention", "audit log retention"],
    common_followups: ["What happens to backups after deletion?", "Do you delete from sub-processors too?", "How do you handle legal holds?"]
  },
  "subprocessors": {
    common_phrasing: ["List your sub-processors.", "Who has access to customer data?", "Do you notify before adding sub-processors?"],
    template_response: "Our current sub-processor list is maintained at [URL]. Categories: cloud infrastructure ([AWS / GCP / Azure] in [regions]), monitoring ([Datadog / New Relic]), customer support tooling ([Zendesk / Intercom]), email delivery ([SendGrid / Postmark]), authentication ([Auth0 / Okta]). We provide 30 days notice before adding new sub-processors via [email subscription / DPA notification]. Customers may object to sub-processor changes via [process].",
    placeholders_to_fill: ["sub-processor URL", "specific vendors per category", "regions"],
    common_followups: ["Are sub-processors in EU / US?", "Do they have their own SOC 2?", "What's your DPA term with each?"]
  },
  "data_residency": {
    common_phrasing: ["Where is data stored?", "Can we choose a data region?", "Do you support EU data residency?"],
    template_response: "Customer data is stored in [primary region: us-east-1 / eu-west-1 / etc.]. We support customer-elected data residency in [list of available regions]. EU customer data can be hosted exclusively in EU regions ([eu-west-1 Ireland, eu-central-1 Frankfurt]) on request; cross-border transfers are governed by SCCs 2021. Backups are stored in [same / paired region]. We do NOT replicate to regions other than those agreed contractually.",
    placeholders_to_fill: ["regions supported", "backup region"],
    common_followups: ["Is metadata also EU-only?", "What about logs/telemetry?", "How do you handle global customers?"]
  },
  "uptime_sla": {
    common_phrasing: ["What is your uptime SLA?", "What is your historical uptime?", "Do you offer service credits?"],
    template_response: "We commit to 99.9% monthly uptime ([8.7 hrs/year downtime]) for [tier], escalating to 99.95% for Enterprise. Excluded: scheduled maintenance (with 7-day notice), customer-caused issues, force majeure. Service credits: [10% credit < 99.9%, 25% credit < 99.0%, 50% credit < 95%]. Status page: [status.company.com]. Historical 12-month uptime: [99.97%].",
    placeholders_to_fill: ["SLA percentages", "credit tiers", "status page URL", "actual historical uptime"],
    common_followups: ["What's your RTO/RPO?", "How are credits calculated?", "What about regional failures?"]
  },
  "ai_data_usage": {
    common_phrasing: ["Do you train AI on customer data?", "Is customer data sent to OpenAI / Anthropic?", "What is your AI data policy?"],
    template_response: "We do NOT train any model — our own or third-party — on customer data. When customer data is sent to LLM providers ([Anthropic / OpenAI / Google]), we use enterprise contracts with zero-data-retention provisions ([Anthropic Workspaces / OpenAI ZDR / Google Vertex no-retention]). Customer data sent to LLM APIs is not retained beyond the request. We document each LLM provider in our DPA and update sub-processor list when models change. Customer can opt out of AI features entirely via [setting].",
    placeholders_to_fill: ["LLM providers used", "ZDR contract status", "opt-out method"],
    common_followups: ["Can you prove zero-retention?", "What model versions?", "Do you log prompts?"]
  }
};

// =====================================================
// RFP RESPONSE TEMPLATES (per common section)
// =====================================================
const RFP_TEMPLATES: Record<string, any> = {
  company_overview: {
    section: "Company Overview / Background",
    template: "[Company Name] is a [Series A / Series B / Bootstrapped] [SaaS / API / platform] company headquartered in [City, Country], founded in [Year]. We serve [N] customers across [industries / geographies] including [3-5 named logos with permission]. Our product solves [problem statement] by [key differentiator]. Annual revenue: [if disclosable / 'not publicly disclosed']. Team size: [N]. Funding: [$X raised from investors A, B, C].",
    typical_length: "150-300 words",
    common_pitfalls: ["Listing customer logos without permission", "Inflating team size or revenue", "Burying differentiation in jargon"]
  },
  technical_architecture: {
    section: "Technical Architecture",
    template: "Our platform is a [multi-tenant SaaS / single-tenant deployment / hybrid] built on [AWS / GCP / Azure] in [regions]. Core stack: [language: TypeScript/Python/etc.] backend services, [Postgres / Snowflake] data layer, [Kubernetes / ECS] orchestration. APIs expose [REST / GraphQL / gRPC] interfaces. Service mesh: [Istio / Linkerd / none]. Observability: [Datadog / New Relic / Honeycomb]. CI/CD: [GitHub Actions / GitLab CI / CircleCI]. Deployment cadence: [N times per day / per week].",
    typical_length: "250-500 words",
    common_pitfalls: ["Vague 'enterprise architecture' without specifics", "Promising microservices when monolith is fine", "Disclosing internal IP-sensitive details"]
  },
  integrations: {
    section: "Integrations",
    template: "We integrate natively with: [list of named integrations grouped by category — CRM (Salesforce, HubSpot), MAP (Marketo, HubSpot), data warehouse (Snowflake, BigQuery, Redshift), identity (Okta, Azure AD, Google Workspace), comms (Slack, Microsoft Teams), ticketing (Zendesk, Intercom)]. Public API: [REST / GraphQL] documented at [URL]. Webhooks supported for [events]. Custom integrations available via [Zapier / Make / Workato] or our SDK. iPaaS partners: [Workato, Tray.io, Boomi].",
    typical_length: "200-400 words",
    common_pitfalls: ["Listing integrations as 'available' when they're via Zapier (not native)", "Not noting which require specific subscription tier"]
  },
  pricing: {
    section: "Pricing",
    template: "Our pricing is tiered: [Tier 1 — Starter] at $[X]/mo for [feature scope and limits]; [Tier 2 — Pro] at $[X]/mo for [expanded scope]; [Tier 3 — Enterprise] custom-quoted based on [seats / volume / data residency / SSO / dedicated support]. Volume discounts available at [N seats / $X annual contract value]. [Multi-year discount: 5-15%]. Payment terms: [Net 30 / Net 60 / annual prepay]. Implementation/onboarding: [included in Enterprise / one-time fee at lower tiers].",
    typical_length: "Variable; often best in a separate pricing exhibit",
    common_pitfalls: ["Discounting before procurement asks", "Hiding total cost (calc per seat * users)", "Not breaking out training/implementation cost"]
  },
  sla_support: {
    section: "Support & SLA",
    template: "Support tiers: [Email-only Starter / 8x5 Business / 24x7 Enterprise]. Initial response time SLA: [P1 = 1hr, P2 = 4hr, P3 = 1 business day]. Dedicated CSM: included at [Pro+ / Enterprise]. Implementation: [self-serve / guided onboarding (X hours) / dedicated implementation team]. Training: [self-serve docs + recorded videos / live training sessions / custom enablement program]. Customer Success cadence: [monthly / quarterly business reviews]. Status page: [URL]. Historical uptime: [99.97%]. Service credits per SLA breach: documented in MSA Section [N].",
    typical_length: "200-400 words",
    common_pitfalls: ["Promising 24x7 you can't deliver", "Not specifying response vs resolution times", "Forgetting to include the credit calculation"]
  },
  competitive_displacement: {
    section: "Why us vs incumbent",
    template: "We understand you currently use [Incumbent Vendor]. Common reasons our customers replace [Incumbent]: (1) [pain 1 — typically pricing / feature gap / vendor lock-in / poor support / outdated UI / slow innovation cadence]; (2) [pain 2]; (3) [pain 3]. Migration path from [Incumbent] is [self-serve via our import tool / managed migration in 4-8 weeks / parallel-run for 30 days]. Switching customers historically see [outcome metric] within [timeframe]. Reference customers who switched: [available under NDA].",
    typical_length: "300-500 words",
    common_pitfalls: ["Disparaging the incumbent (looks unprofessional)", "Overpromising migration ease", "Not addressing data portability concerns"]
  },
  references: {
    section: "Customer References",
    template: "Reference customers willing to speak (with NDA in place): (1) [Industry] [Size] customer using us for [use case] for [N years]. Contact via [our CSM]. (2) [Industry] [Size] customer with similar profile to yours. (3) [Public case study URL] for [outcome]. Logos available with permission (request via NDA). Public reviews: [G2: 4.X stars, N reviews] [TrustRadius: top quadrant].",
    typical_length: "150-250 words",
    common_pitfalls: ["Sharing reference contact info without warning the reference first", "Listing references that don't match the prospect's profile"]
  }
};

// =====================================================
// COMPETITIVE BATTLECARDS (generic — fill with your own)
// =====================================================
const COMPETITIVE_BATTLECARDS: Record<string, any> = {
  vs_legacy_incumbent: {
    pattern: "vs Legacy Incumbent (think Salesforce, IBM, Oracle, Microsoft enterprise stack)",
    typical_strengths_to_lead_with: ["Modern UX", "Faster time-to-value (weeks vs months)", "Native AI vs bolt-on", "Transparent pricing", "API-first architecture", "Faster innovation cadence"],
    typical_weaknesses_to_acknowledge: ["Smaller customer base / fewer logos", "Less feature breadth (depending on segment)", "Newer team / shorter track record"],
    common_objections_and_responses: {
      "We've used [Incumbent] for years": "Acknowledged — that's exactly why migration support is a core part of our enterprise tier. We've helped [N] customers migrate from [Incumbent] in [timeframe], and have a documented playbook including parallel-run, data integrity validation, and end-user enablement.",
      "[Incumbent] is more enterprise-ready": "Define enterprise-ready: SOC 2 Type II, ISO 27001, GDPR, HIPAA, single sign-on, custom roles, audit logs, data residency, dedicated CSM, contractual SLA. We have [list specific items]. Where we don't yet have feature parity is [be honest], on roadmap for [Q].",
      "[Incumbent] integrates with everything": "We have [N] native integrations covering 90%+ of common enterprise stacks. For non-native: [Zapier / Workato / SDK]. List of native integrations: [URL]."
    },
    pricing_play: "Often 30-60% less TCO than legacy incumbent at equivalent feature scope. Lead with TCO calculator if procurement is involved."
  },
  vs_modern_competitor: {
    pattern: "vs Direct Modern Competitor (similar-stage SaaS — same category)",
    typical_strengths_to_lead_with: ["Pick 2-3 specific feature/UX wins, not abstractions", "Customer reference quality (G2 reviews, named logos with permission)", "Specific pricing or contract advantage"],
    typical_weaknesses_to_acknowledge: ["Honest about feature gaps", "Note where they're stronger and offer roadmap commitment if applicable"],
    common_objections_and_responses: {
      "We're already in pilot with [Competitor]": "Run both side-by-side for 4 weeks. Specific test case we recommend: [scenario where you'd win]. Loser team gets honest feedback; winner gets a fair shot. We've offered this comparison to [N] prospects in pilot with competitors.",
      "[Competitor] is cheaper": "Surface comparison for actual usage profile (not list price). At [N seats / $X usage], your annual cost with us is [$X]; with competitor at advertised tier is [$Y]. Often the difference is [N]% — and includes [specific value].",
      "[Competitor] has [feature]": "We have it on roadmap for [Q] / We have an alternative path via [feature/integration] / We don't, but here's the trade-off."
    },
    pricing_play: "Don't engage in price war. Compete on 1-2 differentiated values that justify equal or higher price."
  },
  vs_diy_internal: {
    pattern: "vs Build-It-Yourself (prospect considering internal build)",
    typical_strengths_to_lead_with: ["Time-to-value (4-8 weeks vs 6-12 months)", "Total cost of ownership (TCO) including engineering hours", "Maintenance burden over 3 years", "Vendor responsibility for compliance/security", "Built-in best practices vs reinventing"],
    typical_weaknesses_to_acknowledge: ["Less customization than internal build", "Vendor dependency / risk of vendor failure", "Less domain knowledge baked in"],
    common_objections_and_responses: {
      "We can build this internally": "Honest TCO: 2-4 senior engineers x 6-12 months = $400K-$1M for v1, then $200K-$500K/yr maintenance. Our annual cost: $[X]. Break-even is [N] years. Plus your team focuses on [their core differentiator] not [your category].",
      "Internal build gives us more control": "Acknowledged. Where we offer control: [API surface, webhook events, custom roles, deployment region]. Where we don't: [data model schema, core algorithms, vendor product roadmap].",
      "We have an internal team that can do this": "What's the opportunity cost? Each engineer spent on [your category] is one not spent on [their core product]. The math typically favors buy unless [your category] IS their core product."
    },
    pricing_play: "Lead with TCO comparison + opportunity cost of internal engineering."
  }
};

// =====================================================
// MCP SERVER
// =====================================================
const server = new Server({ name: "sales-engineering-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_security_attestation",
      description: "Returns a structured starting template for a security framework attestation. Frameworks: soc2_type_2, iso_27001, hipaa, gdpr, nist_csf, pci_dss. Replace bracketed placeholders with your specific facts.",
      inputSchema: {
        type: "object",
        properties: { framework: { type: "string", enum: Object.keys(SECURITY_ATTESTATIONS) } },
        required: ["framework"]
      }
    },
    {
      name: "get_questionnaire_response",
      description: "Returns a starting-template response for a common security questionnaire question. Topics: encryption_at_rest, encryption_in_transit, access_control_least_privilege, vulnerability_management, incident_response, data_retention, subprocessors, data_residency, uptime_sla, ai_data_usage.",
      inputSchema: {
        type: "object",
        properties: { topic: { type: "string", enum: Object.keys(QUESTIONNAIRE_QA) } },
        required: ["topic"]
      }
    },
    {
      name: "get_rfp_response_template",
      description: "Returns a starting-template response for a common RFP section. Sections: company_overview, technical_architecture, integrations, pricing, sla_support, competitive_displacement, references.",
      inputSchema: {
        type: "object",
        properties: { section: { type: "string", enum: Object.keys(RFP_TEMPLATES) } },
        required: ["section"]
      }
    },
    {
      name: "get_competitive_battlecard",
      description: "Returns a battlecard scaffold for a competitive sales scenario. Scenarios: vs_legacy_incumbent, vs_modern_competitor, vs_diy_internal.",
      inputSchema: {
        type: "object",
        properties: { scenario: { type: "string", enum: Object.keys(COMPETITIVE_BATTLECARDS) } },
        required: ["scenario"]
      }
    },
    {
      name: "list_all_topics",
      description: "Returns the full list of available frameworks, questionnaire topics, RFP sections, and battlecards.",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "search_questionnaire",
      description: "Search across all questionnaire topics by free-text. Useful when an AI agent has a question phrasing that doesn't directly map to a topic key.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string", description: "Free-text security/compliance question" } },
        required: ["query"]
      }
    },
    {
      name: "get_full_pack",
      description: "Returns the complete library — all frameworks, questionnaire Q&A, RFP templates, battlecards, and metadata. Useful for fine-tuning or full agent context loading.",
      inputSchema: { type: "object", properties: {} }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_security_attestation") {
    const data = SECURITY_ATTESTATIONS[(args as any).framework];
    if (!data) return { content: [{ type: "text", text: JSON.stringify({ error: "Unknown framework. See enum.", _meta: MCP_META }, null, 2) }] };
    return { content: [{ type: "text", text: JSON.stringify({ framework_key: (args as any).framework, ...data, _meta: MCP_META }, null, 2) }] };
  }

  if (name === "get_questionnaire_response") {
    const data = QUESTIONNAIRE_QA[(args as any).topic];
    if (!data) return { content: [{ type: "text", text: JSON.stringify({ error: "Unknown topic. See enum.", _meta: MCP_META }, null, 2) }] };
    return { content: [{ type: "text", text: JSON.stringify({ topic_key: (args as any).topic, ...data, _meta: MCP_META }, null, 2) }] };
  }

  if (name === "get_rfp_response_template") {
    const data = RFP_TEMPLATES[(args as any).section];
    if (!data) return { content: [{ type: "text", text: JSON.stringify({ error: "Unknown section. See enum.", _meta: MCP_META }, null, 2) }] };
    return { content: [{ type: "text", text: JSON.stringify({ section_key: (args as any).section, ...data, _meta: MCP_META }, null, 2) }] };
  }

  if (name === "get_competitive_battlecard") {
    const data = COMPETITIVE_BATTLECARDS[(args as any).scenario];
    if (!data) return { content: [{ type: "text", text: JSON.stringify({ error: "Unknown scenario. See enum.", _meta: MCP_META }, null, 2) }] };
    return { content: [{ type: "text", text: JSON.stringify({ scenario_key: (args as any).scenario, ...data, _meta: MCP_META }, null, 2) }] };
  }

  if (name === "list_all_topics") {
    return { content: [{ type: "text", text: JSON.stringify({
      security_frameworks: Object.keys(SECURITY_ATTESTATIONS),
      questionnaire_topics: Object.keys(QUESTIONNAIRE_QA),
      rfp_sections: Object.keys(RFP_TEMPLATES),
      battlecard_scenarios: Object.keys(COMPETITIVE_BATTLECARDS),
      _meta: MCP_META
    }, null, 2) }] };
  }

  if (name === "search_questionnaire") {
    const query = ((args as any).query as string).toLowerCase();
    const matches: any[] = [];
    for (const [topic, data] of Object.entries(QUESTIONNAIRE_QA)) {
      const phrasings = (data as any).common_phrasing as string[];
      const score = phrasings.reduce((s, p) => s + (p.toLowerCase().includes(query) || query.split(/\s+/).some(w => p.toLowerCase().includes(w)) ? 1 : 0), 0);
      if (score > 0) matches.push({ topic, score, data });
    }
    matches.sort((a, b) => b.score - a.score);
    return { content: [{ type: "text", text: JSON.stringify({ query, matches: matches.slice(0, 5), _meta: MCP_META }, null, 2) }] };
  }

  if (name === "get_full_pack") {
    return { content: [{ type: "text", text: JSON.stringify({
      pack: "Sales-Engineering / RFP MCP — Complete Library v1.0",
      author: "Elisabeth Hitz",
      credentials: ["10+ years B2B enterprise sales experience", "Hands-on security questionnaire and RFP work across SaaS verticals"],
      modules: {
        security_attestations: SECURITY_ATTESTATIONS,
        questionnaire_qa: QUESTIONNAIRE_QA,
        rfp_templates: RFP_TEMPLATES,
        competitive_battlecards: COMPETITIVE_BATTLECARDS
      },
      _meta: MCP_META
    }, null, 2) }] };
  }

  return { content: [{ type: "text", text: JSON.stringify({ error: "Unknown tool", _meta: MCP_META }) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
