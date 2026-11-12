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