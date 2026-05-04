# Sales-Engineering / RFP-Response MCP

**Drop-in templates for security questionnaires (SOC2, ISO27001, HIPAA, GDPR, NIST CSF, PCI-DSS), RFP responses, and competitive battlecards. For AI sales agents and human sales engineers.**

Built from 10+ years of B2B enterprise sales experience.

> **Disclaimer.** Outputs are structured starting templates based on publicly-documented security frameworks. They are NOT (a) a substitute for the actual content of your security program, (b) legal advice, (c) a certified audit attestation, (d) a guarantee of compliance. Replace bracketed placeholders with your specific facts. Have qualified security and legal counsel review before submitting any actual RFP or questionnaire response.

---

## Why This Exists

Mid-market B2B SaaS sales engineering teams burn 100-300 hours per quarter answering the same security and RFP questions. Loopio and Responsive sell point solutions for this at $30-100K/year per company.

AI agents can do this work better — but they need a structured library of starting templates to draft from. This MCP provides that library.

**Use case:** an AI agent receives a 200-question security questionnaire. It calls this MCP for each question, gets a starting template, fills in customer-specific facts, and submits a draft for human review.

## 7 Tools

| Tool | What it returns |
|---|---|
| `get_security_attestation` | SOC2 / ISO27001 / HIPAA / GDPR / NIST CSF / PCI-DSS attestation templates with placeholders |
| `get_questionnaire_response` | 10 common security questionnaire questions with template responses (encryption, access control, vulnerability mgmt, IR, retention, sub-processors, residency, SLA, AI usage) |
| `get_rfp_response_template` | 7 common RFP sections (overview, architecture, integrations, pricing, SLA, competitive displacement, references) |
| `get_competitive_battlecard` | 3 competitive scenarios (vs legacy incumbent, vs modern competitor, vs DIY internal build) |
| `search_questionnaire` | Free-text search across all questionnaire topics |
| `list_all_topics` | Discovery — all available frameworks, topics, sections, scenarios |
| `get_full_pack` | Complete library for fine-tuning or full agent context |

## Sample Use

```typescript
// Customer questionnaire asks: "What encryption do you use for data at rest?"
mcp.call("get_questionnaire_response", { topic: "encryption_at_rest" });
// Returns starting template with placeholders for KMS provider, rotation cadence

// RFP needs a competitive section vs Salesforce
mcp.call("get_competitive_battlecard", { scenario: "vs_legacy_incumbent" });
// Returns differentiation pattern, common objections + responses, pricing play
```

## Pricing

- Apify Pay-Per-Event: **$0.05 per tool call**
- First 10 calls free per actor

## Coverage

### Security frameworks (6)
SOC 2 Type II · ISO/IEC 27001:2022 · HIPAA · GDPR · NIST CSF 2.0 · PCI DSS 4.0

### Questionnaire topics (10)
Encryption at rest · Encryption in transit · Access control / least privilege · Vulnerability management · Incident response · Data retention · Sub-processors · Data residency · Uptime SLA · AI data usage policy

### RFP sections (7)
Company overview · Technical architecture · Integrations · Pricing · SLA & support · Competitive displacement · References

### Battlecards (3)
vs Legacy Incumbent · vs Modern Competitor · vs DIY Internal Build

## Production Roadmap

- v1.1: Add SOC 1, FedRAMP, StateRAMP, IRAP (Australia), CSA STAR, BSI C5 (Germany)
- v1.2: Vertical-specific Q&A (FinTech: PCI deep-dive, Healthcare: HIPAA + HITRUST, EdTech: FERPA/COPPA)
- v1.3: Bring-your-own-evidence adapter — pull current attestations from Vanta/Drata via API
- v2.0: Smart RFP-response — given a full RFP doc, pre-draft the entire response

## Built By

[Elisabeth Hitz](https://www.linkedin.com/in/elisabethhitz) — 10+ years of B2B enterprise sales experience. Worked sales engineering and RFP responses across SaaS verticals.

License: MIT
