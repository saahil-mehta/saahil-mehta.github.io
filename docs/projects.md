# Projects

## Production Systems & Infrastructure

<div class="publication-card">
    <div class="publication-image">
        <lottie-player
            class="lottie-fill"
            src="assets/system-regular-1-share-hover-pinch.json"
            background="transparent"
            speed="1"
            preserveAspectRatio="xMidYMid meet"
            loop
            autoplay>
        </lottie-player>
    </div>
    <div class="publication-content">
        <h3 class="publication-title">
            Orca
        </h3>
        <div class="publication-venue">South Pole · Production</div>
        <div class="publication-authors">Saahil Mehta</div>
        <div class="publication-year">2026 - Present</div>
        <div class="publication-tags">
            <span class="tag tag-safety">Enterprise AI</span>
            <span class="tag tag-safety">Deep Research</span>
            <span class="tag tag-safety">RAG</span>
            <span class="tag tag-safety">Cloud Run</span>
            <span class="tag tag-safety">IAM</span>
        </div>
        <p style="margin-top:0.5rem;font-size:0.9rem;line-height:1.5;">
            South Pole's enterprise AI assistant, open to all 501 employees. Deep research over the web and company data, South Pole-format documents, decks and sales proposals, scheduled runs, memory, and sharing with version history. Eight releases in four months. Within three weeks of 2.0, 131 employees were querying governed data through it; 560,000+ requests served at 99.99% success.
        </p>
        <details style="margin-top:0.75rem;">
            <summary style="font-size:0.9rem;font-weight:600;cursor:pointer;color:var(--color-accent);">How it's built ▸</summary>
            <div style="margin-top:0.5rem;font-size:0.9rem;line-height:1.6;padding-left:0.5rem;border-left:2px solid var(--color-accent);margin-left:0.25rem;">
                <p>Next.js on Cloud Run behind Identity-Aware Proxy, Cloud SQL for state. Every BigQuery query runs as the signed-in user, so IAM and policy-tag masking decide what each person sees; no shared service account touches data, and every job is labelled so audit can tell Orca traffic apart. Context comes from the semantic layer over MCP, so answers rest on definitions the business certified. Guardrails decline bulk extracts of whole tables and personal records; eval suites gate each release.</p>
            </div>
        </details>
    </div>
</div>

<div class="publication-card">
    <div class="publication-image">
        <lottie-player
            class="lottie-fill"
            src="assets/system-regular-14-article-hover-article.json"
            background="transparent"
            speed="1"
            preserveAspectRatio="xMidYMid meet"
            loop
            autoplay>
        </lottie-player>
    </div>
    <div class="publication-content">
        <h3 class="publication-title">
            Orca Semantics
        </h3>
        <div class="publication-venue">South Pole · In Build</div>
        <div class="publication-authors">Saahil Mehta</div>
        <div class="publication-year">2026 - Present</div>
        <div class="publication-tags">
            <span class="tag tag-safety">OpenMetadata</span>
            <span class="tag tag-safety">Semantic Layer</span>
            <span class="tag tag-safety">Governance</span>
            <span class="tag tag-safety">Terraform</span>
        </div>
        <p style="margin-top:0.5rem;font-size:0.9rem;line-height:1.5;">
            A governed semantic layer on self-hosted OpenMetadata: plain-English definitions, certified metric SQL, a glossary and named owners per domain, all version controlled. Orca reads it before answering, the visualisation layer builds on it, and access approvals and quality routing reuse the same ownership model.
        </p>
        <details style="margin-top:0.75rem;">
            <summary style="font-size:0.9rem;font-weight:600;cursor:pointer;color:var(--color-accent);">How it's built ▸</summary>
            <div style="margin-top:0.5rem;font-size:0.9rem;line-height:1.6;padding-left:0.5rem;border-left:2px solid var(--color-accent);margin-left:0.25rem;">
                <p>Chosen over Cube and the dbt Semantic Layer because it is metadata-only: it never proxies queries, so per-user identity, IAM and PII masking stay intact. One Terraform module deploys dev and prod, Google SSO at the door, read-only ingestion from dbt and BigQuery. AI-drafted definitions are seeded in bulk and certified by domain owners in a task queue; uncertified drafts are hints, never truth.</p>
            </div>
        </details>
    </div>
</div>

<div class="publication-card">
    <div class="publication-image">
        <lottie-player
            class="lottie-fill"
            src="assets/system-regular-22-build-hover-build.json"
            background="transparent"
            speed="1"
            preserveAspectRatio="xMidYMid meet"
            loop
            autoplay>
        </lottie-player>
    </div>
    <div class="publication-content">
        <h3 class="publication-title">
            Orca Core
        </h3>
        <div class="publication-venue">South Pole · Production</div>
        <div class="publication-authors">Saahil Mehta</div>
        <div class="publication-year">2026</div>
        <div class="publication-tags">
            <span class="tag tag-safety">Dagster</span>
            <span class="tag tag-safety">dbt</span>
            <span class="tag tag-safety">GKE</span>
            <span class="tag tag-safety">Cloud Build</span>
        </div>
        <p style="margin-top:0.5rem;font-size:0.9rem;line-height:1.5;">
            Orchestration for 1,800+ dbt models, migrated from dbt Cloud to self-hosted Dagster on GKE in three weeks. Shadow runs proved the output identical to production before cutover; deploys rebuild the image and roll out without a human step. Avoided a three-year renewal at ~27k EUR a year.
        </p>
        <details style="margin-top:0.75rem;">
            <summary style="font-size:0.9rem;font-weight:600;cursor:pointer;color:var(--color-accent);">How it's built ▸</summary>
            <div style="margin-top:0.5rem;font-size:0.9rem;line-height:1.6;padding-left:0.5rem;border-left:2px solid var(--color-accent);margin-left:0.25rem;">
                <p>Dagster mirrors each dbt Cloud job verbatim (selectors, threads, schedules), so any difference is the runner's fault. Evidence compares every relation between shadow and production. Cloud Build rebuilds the image on merge, changed models build on every marts merge, and alerting is episodic (state changes plus a daily summary) with data and infrastructure alerts split. The UI sits behind Identity-Aware Proxy.</p>
            </div>
        </details>
    </div>
</div>

<div class="publication-card">
    <div class="publication-image">
        <lottie-player
            class="lottie-fill"
            src="assets/system-regular-63-settings-cog-hover-cog-1.json"
            background="transparent"
            speed="1"
            preserveAspectRatio="xMidYMid meet"
            loop
            autoplay>
        </lottie-player>
    </div>
    <div class="publication-content">
        <h3 class="publication-title">
            Data Access Governance
        </h3>
        <div class="publication-venue">South Pole · Production</div>
        <div class="publication-authors">Saahil Mehta</div>
        <div class="publication-year">2026</div>
        <div class="publication-tags">
            <span class="tag tag-safety">IAM</span>
            <span class="tag tag-safety">Terraform</span>
            <span class="tag tag-safety">GitHub App</span>
            <span class="tag tag-safety">Governance</span>
        </div>
        <p style="margin-top:0.5rem;font-size:0.9rem;line-height:1.5;">
            Self-service data access. A request names the access group and the reason, mails the data owner, and opens a Terraform pull request that grants the group read access, through an org-owned GitHub App. A human still merges. Replaced hand-edited IAM at around ten changes a month and returned 40+ hours a month to the team.
        </p>
        <details style="margin-top:0.75rem;">
            <summary style="font-size:0.9rem;font-weight:600;cursor:pointer;color:var(--color-accent);">How it's built ▸</summary>
            <div style="margin-top:0.5rem;font-size:0.9rem;line-height:1.6;padding-left:0.5rem;border-left:2px solid var(--color-accent);margin-left:0.25rem;">
                <p>Access is granted to groups, never to people. The server re-resolves memberships, so a mail can only claim what the server established. Terraform preconditions fail the plan on an unknown dataset or an overlapping binding, so machine-written grants cannot silently revoke hand-written ones. My design, built by an engineer on my team.</p>
            </div>
        </details>
    </div>
</div>

<div class="publication-card">
    <div class="publication-image">
        <lottie-player
            class="lottie-fill"
            src="assets/system-regular-consultation.json"
            background="transparent"
            speed="1"
            preserveAspectRatio="xMidYMid meet"
            loop
            autoplay>
        </lottie-player>
    </div>
    <div class="publication-content">
        <h3 class="publication-title">
            Cost Deep Dive
        </h3>
        <div class="publication-venue">South Pole · Production</div>
        <div class="publication-authors">Saahil Mehta</div>
        <div class="publication-year">2025 - Present</div>
        <div class="publication-tags">
            <span class="tag tag-safety">FinOps</span>
            <span class="tag tag-safety">BigQuery</span>
            <span class="tag tag-safety">Looker Studio</span>
            <span class="tag tag-safety">Anomaly Detection</span>
        </div>
        <p style="margin-top:0.5rem;font-size:0.9rem;line-height:1.5;">
            FinOps across 195 GCP projects and 60 services: spend by app, by service, by day, with P99 anomaly detection that emails me when an app breaks its own baseline. Caught a 6x BigQuery analysis spike in March 2026 and returned it to baseline; marts query spend fell 46% year on year.
        </p>
        <details style="margin-top:0.75rem;">
            <summary style="font-size:0.9rem;font-weight:600;cursor:pointer;color:var(--color-accent);">How it's built ▸</summary>
            <div style="margin-top:0.5rem;font-size:0.9rem;line-height:1.6;padding-left:0.5rem;border-left:2px solid var(--color-accent);margin-left:0.25rem;">
                <p>Built on the billing export in BigQuery with a view per app, a weekly BigQuery cost job on Orca Core, and a Looker Studio front end.</p>
            </div>
        </details>
    </div>
</div>

<div class="publication-card">
    <div class="publication-image">
        <lottie-player
            class="lottie-fill"
            src="assets/system-regular-63-settings-cog-hover-cog-1.json"
            background="transparent"
            speed="1"
            preserveAspectRatio="xMidYMid meet"
            loop
            autoplay>
        </lottie-player>
    </div>
    <div class="publication-content">
        <h3 class="publication-title">
            Enterprise Data Platform Migration
        </h3>
        <div class="publication-venue">South Pole · Production</div>
        <div class="publication-authors">Saahil Mehta</div>
        <div class="publication-year">2024</div>
        <div class="publication-tags">
            <span class="tag tag-safety">Terraform</span>
            <span class="tag tag-safety">GCP</span>
            <span class="tag tag-safety">Infrastructure-as-Code</span>
            <span class="tag tag-safety">CI/CD</span>
        </div>
        <p style="margin-top:0.5rem;font-size:0.9rem;line-height:1.5;">
            Migrated 18,000+ cloud resources from Pulumi to modular Terraform. Standardised IAM, networking, and policy-as-code so five business units now share one platform without stepping on each other. Adopted BI-as-code, DataOps, and FinOps practices alongside the migration, so the platform shipped governed, observable, and within budget from day one.
        </p>
    </div>
</div>

<div class="publication-card">
    <div class="publication-image">
        <lottie-player
            class="lottie-fill"
            src="assets/system-regular-1-share-hover-pinch.json"
            background="transparent"
            speed="1"
            preserveAspectRatio="xMidYMid meet"
            loop
            autoplay>
        </lottie-player>
    </div>
    <div class="publication-content">
        <h3 class="publication-title">
            <a href="https://knowsee.co.uk" target="_blank" class="publication-link">
                Knowsee
            </a>
        </h3>
        <div class="publication-venue">Private AI System for Teams · Personal Project · Paused</div>
        <div class="publication-authors">Saahil Mehta</div>
        <div class="publication-year">2024 - 2026</div>
        <div class="publication-tags">
            <span class="tag tag-safety">RAG</span>
            <span class="tag tag-safety">Agent Frameworks</span>
            <span class="tag tag-safety">Vector Stores</span>
            <span class="tag tag-safety">MCP</span>
            <a href="https://knowsee.co.uk" class="tag tag-arxiv">LIVE SITE</a>
        </div>
        <p style="margin-top:0.5rem;font-size:0.9rem;line-height:1.5;">
            A RAG-based AI platform that queries your data warehouse, ingests company knowledge (docs, screenshots, emails) with chunking and metadata that survives real-world inputs, and turns chat prompts into dashboards. SSO and RBAC out of the box; hallucination guardrails and sandboxed tools on by default; eval suites gate every release. Paused in 2026; the ideas went into Orca.
        </p>
    </div>
</div>

