# Plan

## Undertanding the project

- Need the api

## Make adjustments to run locally

- Api cors
- Build Frontend with REACT_APP_API_BASE_URL

### Build apps


```bash
# Build and run frontend

docker build \
  --build-arg REACT_APP_API_BASE_URL="http://localhost:5000" \
  -f Dockerfile.prod . \
  -t interview-react-app:nginx

docker run --name react-investor-prod -p 3080:80 interview-react-app:nginx
```

```bash
# Build and run api

docker build . -t interview-dotnet-api:latest

docker run --name api-investor \
  -p 5000:5000 \
  -e Cors__AllowedOrigins="http://localhost:3000,http://127.0.0.1:3000,http://localhost:3080" \
  interview-dotnet-api:latest
```

## Components

### Inventory

- Resource Group: `azurerm_resource_group`
- Container registry
  - Explicitly ommited from terraform
- Virtual Network: `azurerm_virtual_network`
- Subnet for container apps: `azurerm_subnet`
- Container App Env: `azurerm_container_app_environment`
- Frontend / ReactApp: `azurerm_container_app`
- Backend / Dotnet API and SQLite: `azurerm_container_app`
  - Storage account explicitly ommited

### Connections

```mermaid
architecture-beta
    group shared(cloud)[Shared Services]
    service acr(disk)[Container Registry] in shared

    group client_side(internet)[Client]
    service client(internet)[Client Browser] in client_side

    group rg(cloud)[Resource Group: rg-investorflow-dev]
    service law(disk)[Log Analytics Workspace] in rg
    service frontend(internet)[Frontend - React] in rg
    service backend(server)[Backend - .NET API] in rg

    %% Flows
    acr:R --> L:frontend
    acr:R --> L:backend
    client:B --> T:frontend
    client:B --> T:backend
    frontend:R -- L:law
    backend:R -- L:law
```

## Interview Comments

- The terraform folder does not have to live in this repo