### **Executive Summary: The "Umoja" Election Intelligence Platform**

The "Chagua" (Swahili for "Elect") platform is designed to be the definitive, non-partisan source of truth for the Kenyan presidential election. It will empower campaign teams, media, and observers with a transparent, resilient, and insightful view of the electoral process, from the polling station to the national tally. The architecture is built on principles of fault tolerance, data integrity, and accessibility, directly addressing Kenya's unique infrastructural and electoral challenges.

---

### **1. System Architecture**

The platform is designed as a distributed, microservices-based system to ensure scalability, resilience, and maintainability.

```mermaid
graph TD
    subgraph Data Sources
        A1[IEBC Public Portal API/JSON]
        A2[IEBC RSS Feeds]
        A3[Scraped IEBC Web Portal]
        A4[Partner Feeds: Media/NGOs]
        A5[Social Media APIs: Twitter, FB]
        A6[Historical Data: CSVs, Shapefiles]
    end

    subgraph Ingestion and ETL Pipeline (The "Taka" Pipeline)
        B1[Load Balancer] --> B2{Queueing System: Kafka/RabbitMQ}
        A1 --> B1
        A2 --> B1
        A3 --> B1
        A4 --> B1
        A5 --> B1
        A6 --> B3[Bulk Ingestion Service]

        B2 --> C1[Ingestion Workers]
        C1 --> C2[Validation & Deduplication]
        C2 --> C3[Conflict Resolution Logic]
        C3 --> C4[NLP Sentiment Processor]
    end

    subgraph Data and Analytics Core
        D1[PostgreSQL + PostGIS DB]
        D2[TimescaleDB for Time-Series]
        D3[Redis for Caching/Live Counters]
        D4[Analytics Engine: Python/PyMC/Pandas]
        
        B3 --> D1
        C2 --> D1
        C2 --> D2
        C4 --> D2
        D1 --> D4
        D2 --> D4
    end

    subgraph Backend API Layer
        E1[REST/GraphQL API - FastAPI/NestJS]
        E2[Websocket Server for Real-Time]
        
        D1 --> E1
        D2 --> E1
        D3 --> E1
        D4 --> E1
        E1 --> E2
    end

    subgraph Client Layer
        F1[Web Dashboard: React/Vue + Mapbox]
        F2[Mobile App / PWA]
        F3[Third-Party Consumers: Media APIs]
        F4[Alerting Service: SMS/Email/Push]

        E1 --> F1
        E1 --> F2
        E1 --> F3
        E2 --> F1
        E2 --> F2
        E1 --> F4
    end

    style A4 fill:#f9f,stroke:#333,stroke-width:2px
    style B2 fill:#bbf,stroke:#333,stroke-width:2px
    style D4 fill:#f80,stroke:#333,stroke-width:2px
```

### **2. Key Technical Specifications**

#### **Database Schema (PostgreSQL - Simplified)**

```sql
-- Core geographical and registration data
CREATE TABLE constituencies (
    constituency_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    county_id INT REFERENCES counties(county_id),
    registered_voters_2022 INT,
    geom GEOMETRY(MultiPolygon, 4326) -- Shapefile data
);

CREATE TABLE polling_stations (
    station_id SERIAL PRIMARY KEY,
    station_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255),
    constituency_id INT REFERENCES constituencies(constituency_id),
    ward_id INT REFERENCES wards(ward_id),
    registered_voters INT
);

-- Real-time and historical results data
CREATE TABLE results (
    result_id BIGSERIAL PRIMARY KEY,
    station_id INT REFERENCES polling_stations(station_id),
    candidate_id INT REFERENCES candidates(candidate_id),
    election_year INT NOT NULL,
    votes INT NOT NULL,
    source VARCHAR(50) NOT NULL, -- 'IEBC_API', 'IEBC_SCRAPED', 'MEDIA_PARTNER_A'
    is_validated BOOLEAN DEFAULT false,
    form_34a_url VARCHAR(512), -- Link to the scanned form image
    ingested_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turnout and validation data
CREATE TABLE turnout (
    turnout_id BIGSERIAL PRIMARY KEY,
    station_id INT REFERENCES polling_stations(station_id),
    votes_cast INT NOT NULL,
    rejected_votes INT,
    source VARCHAR(50) NOT NULL,
    ingested_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **API Contracts (OpenAPI 3.0 Snippet)**

```yaml
paths:
  /api/v1/results/live:
    get:
      summary: Get live results aggregated by geography.
      parameters:
        - name: level
          in: query
          schema: { type: string, enum: [national, county, constituency] }
          required: true
        - name: id
          in: query
          schema: { type: integer }
      responses:
        '200':
          description: Aggregated results with vote counts and percentages.
  /api/v1/projections/win-probability:
    get:
      summary: Get the latest Monte Carlo win probability forecast.
      responses:
        '200':
          description: Win probability, confidence intervals, and projected final tally.
  /api/v1/history/compare:
    get:
      summary: Compare results between two election years for a geography.
      parameters:
        - name: year1
          in: query
          schema: { type: integer, default: 2017 }
        - name: year2
          in: query
          schema: { type: integer, default: 2022 }
        - name: constituency_id
          in: query
          schema: { type: integer }
      responses:
        '200':
          description: Side-by-side comparison of vote share and swing.
```

#### **Analytics Model Framework: Monte Carlo Simulation**

1.  **Input Data**:
    *   Real-time results from reported polling stations.
    *   Historical results (2013, 2017) at polling station level.
    *   Demographic data (census, voter registration) linked to constituencies.
    *   Turnout data from reported stations.

2.  **Simulation Logic (for each of 50,000 runs)**:
    *   For each *unreported* polling station:
        *   **Baseline Turnout**: Project turnout based on the average turnout of already reported stations within the same ward, adjusted by its historical deviation from the ward average.
        *   **Baseline Vote Share**: Project vote share for each candidate based on a weighted average of:
            *   Performance in reported stations within the same constituency (high weight).
            *   The station's own historical performance in 2017/2022 (medium weight).
            *   Performance in demographically similar constituencies (low weight).
        *   **Introduce Stochasticity**: Add random noise to both turnout and vote share projections using a normal distribution centered around the baseline, with variance informed by historical volatility.
    *   **Aggregate**: Sum the actual results from reported stations and the simulated results from unreported stations to get a simulated national total for this run.

3.  **Output**:
    *   **Win Probability**: The percentage of the 50,000 simulations in which a candidate wins.
    *   **Confidence Intervals**: The 5th and 95th percentile of the projected final vote counts for each candidate, giving a plausible range.
    *   **Tipping Point Analysis**: Identify the constituencies whose remaining votes have the largest potential to swing the outcome.

#### **Critical UI Components (React/Vue)**

*   `<LiveMapContainer />`: Wrapper for Mapbox GL, handling data layers, popups, and zoom-based drill-downs.
*   `<ResultsTable />`: A virtualized, sortable, and filterable table for granular data.
*   `<ProjectionChart />`: Visualizes the Monte Carlo output (e.g., a histogram of final margin projections).
*   `<ScenarioSlider />`: An interactive component for the "what-if" analysis tool.
*   `<AlertManager />`: Handles UI notifications from the websocket server.

---

### **3. Kenya-Specific Solutions**

*   **IEBC Integration & Fallbacks:**
    1.  **Primary:** Poll official IEBC API endpoints every 15 seconds.
    2.  **Secondary (Fallback 1):** If the API fails or is unavailable, a dedicated Scrapy cluster will begin scraping the public results web portal, parsing HTML tables. This cluster will use rotating proxies to avoid being blocked.
    3.  **Tertiary (Fallback 2):** If the portal is down, ingest data from pre-vetted, trusted partners (e.g., ELOG, major media houses) via their APIs or structured data files (e.g., SFTP drops). **Crucially, data from these sources will be explicitly labeled as "Unverified by IEBC" on the UI.**
    4.  **Form 34A Verification:** The ingestion pipeline will extract the URL of the scanned Form 34A. A separate OCR (Optical Character Recognition) microservice can be triggered to read the text from the image as a final, programmatic verification step, flagging any discrepancies between the form image and the transmitted data.

*   **Low-Connectivity Handling (The "Taka" Pipeline):**
    *   **Queuing:** All incoming data, regardless of source, is pushed into a Kafka topic. This decouples ingestion from processing. If the database or processing workers are slow/overloaded, Kafka absorbs the spike, preventing data loss.
    *   **Timestamping:** Every data packet is timestamped at the source (if possible) and upon ingestion. This allows for correct sequencing even with satellite or mobile network delays.
    *   **Reconciliation Logic:** A worker process constantly reconciles data. If a result for polling station `X` arrives from `MEDIA_PARTNER_A` at 10:00 PM, and the official `IEBC_API` result for the same station arrives at 10:15 PM, the system will automatically prioritize the IEBC data but log the initial conflict for audit purposes.

*   **Optimized Mobile Delivery:**
    *   **Progressive Web App (PWA):** The platform will be a PWA, allowing users to "install" it to their home screen.
    *   **Service Workers:** Aggressive caching of static assets (app shell) and API data. The app will work offline, showing the last fetched data with a clear "Last updated: X minutes ago" banner.
    *   **'Lite Mode':** A user-toggleable mode that:
        *   Disables the interactive GIS map in favor of a simple results list.
        *   Replaces complex charts with static images or text summaries.
        *   Reduces the frequency of data refresh calls from every 30s to every 2 minutes.
        *   Uses WebP for images and heavily compresses data payloads.

---

### **4. Risk Mitigation**

| Risk | Mitigation Strategy |
| :--- | :--- |
| **Data Integrity & Conflict** | **Golden Record Principle:** IEBC data is the source of truth. All other data is secondary. A dedicated `conflict_resolution` service flags any discrepancies between sources for manual review. All data points are traceable to their source and timestamp. |
| **Scalability & Peak Load** | **Cloud-Native Architecture:** Use Kubernetes on AWS/GCP for auto-scaling. The ingestion pipeline (Kafka) and horizontally scalable API/worker nodes can handle massive traffic spikes on election night. Use a CDN (Cloudflare/CloudFront) to cache static assets and some API responses. |
| **Bias in Predictive Models** | **Transparency & Humility:** Clearly label all projections as "PROJECTIONS, NOT RESULTS". The UI will include a detailed "Methodology" section explaining the Monte Carlo model. Avoid using sentiment analysis as a direct input to the vote projection model; use it only as a contextual, separate insight ("Trending Topics"). |
| **Security** | **Defense in Depth:** Implement WAF (Web Application Firewall), DDoS protection (via CDN provider), regular security audits, environment variable secrets management (e.g., HashiCorp Vault), and role-based access control (RBAC) for platform administrators. |
| **Misinformation/Disinformation**| **Clarity and Context:** Every chart and number will have clear tooltips explaining what it represents and where the data comes from. Historical overlays will provide immediate context to prevent misinterpretation of raw numbers. Avoid sensationalist language in UI/alerts. |

---

### **5. Validation Plan**

The platform's accuracy will be validated in three phases:

1.  **Pre-Election (Dry Run):**
    *   Ingest the complete, official 2017 and 2022 election results.
    *   Run the entire platform against this historical data in a simulated "live" environment.
    *   Validate that the platform's final tally exactly matches the gazetted results at national, county, and constituency levels.
    *   Test the projection models by feeding them partial 2017/2022 data (e.g., 10% of stations reported) and measuring the accuracy of their final prediction against the known outcome.

2.  **During Election (Live Parallel Testing):**
    *   A dedicated "QA" team will manually sample 1% of incoming results.
    *   For each sampled result, they will manually open the linked Form 34A image on the IEBC portal and compare the votes with what our system has ingested.
    *   This provides a real-time audit and confidence score in the automated ingestion pipeline.

3.  **Post-Election (Final Reconciliation):**
    *   Once the IEBC declares and gazettes the final official results, we will perform a full reconciliation.
    *   We will generate a report detailing our platform's final numbers against the official ones, calculating the variance at every geographical level.
    *   The goal is a 0% variance for ingested results and a publicly reported accuracy metric for the final predictive models. This final report will be a testament to the platform's transparency and reliability.
