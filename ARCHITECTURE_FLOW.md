# Project Architecture: CrimePredictPro

This diagram illustrates the end-to-end data flow and architectural components of the CrimePredictPro analytics platform.

```mermaid
graph TD
    subgraph "Data Source Layer"
        DS1[Historical Crime CSV] --> UI_Upload
        DS2[Real-time API Feeds] -.-> DS_Integrator
    end

    subgraph "Frontend Layer (React + Tailwind)"
        UI_Upload[Data Upload Interface] --> LS_Storage[(Browser LocalStorage)]
        
        subgraph "Analytics Dashboard"
            LS_Storage --> DB_Engine[Filtering & Analytics Engine]
            DB_Engine --> DB_Stats[Metrics Cards]
            DB_Engine --> DB_Charts[Trend & Distribution Charts]
        end

        subgraph "Prediction Engine"
            LS_Storage --> Pred_Config[Model Configuration]
            Pred_Config --> Pred_LSTM[LSTM Simulation Engine]
            Pred_LSTM --> Pred_Viz[Predictions vs Actual Visualization]
        end

        subgraph "Map Analysis"
            LS_Storage --> Map_Engine[Geospatial Processor]
            Map_Engine --> Map_Leaflet[Interactive Leaflet Map]
        end
    end

    subgraph "MLOps & Management"
        ML_Flow[MLflow Integration] <--> Model_Registry[Model Registry]
        Model_Registry --> Deploy_Mon[Deployment Monitor]
    end

    %% Styling
    classDef primary fill:#1E40AF,stroke:#fff,stroke-width:2px,color:#fff;
    classDef secondary fill:#f9fafb,stroke:#d1d5db,stroke-width:1px;
    classDef storage fill:#f59e0b,stroke:#fff,stroke-width:2px,color:#fff;
    
    class UI_Upload,DB_Engine,Pred_LSTM,Map_Engine primary;
    class LS_Storage storage;
```

## Architectural Flow Summary

1.  **Ingestion**: Users upload historical crime datasets (CSV) which are parsed and persisted in **LocalStorage** for high-performance client-side access.
2.  **Processing**: A centralized **Analytics Engine** handles complex filtering (Date, Region, Crime Type) and calculates real-time metrics (Clearance Rates, Response Times).
3.  **Visualization**:
    *   **Dashboard**: Recharts-powered interactive trends and pie charts.
    *   **Geospatial**: Leaflet-powered heatmap and cluster analysis.
4.  **Prediction**: An **LSTM Simulation Engine** uses seeded random algorithms to project future crime trends based on selected historical windows and crime metrics.
5.  **MLOps**: The **Model Management** module integrates with simulated MLflow servers to track experiments, register production-ready models, and monitor deployments.
