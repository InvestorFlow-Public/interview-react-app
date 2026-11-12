# Application Stack Module

resource "azurerm_resource_group" "main" {
  name     = "${var.resource_group_name}-${var.environment}"
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "investorflow"
    ManagedBy   = "terraform"
  }
}

module "networking" {
  source              = "../networking"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  vnet_name           = "vnet-investorflow-${var.environment}"
  subnet_name         = "snet-container-apps"
  tags                = azurerm_resource_group.main.tags
}

module "aca_env" {
  source              = "../container-app-environment"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  environment_name    = "cae-investorflow-${var.environment}"
  subnet_id           = module.networking.subnet_id
  tags                = azurerm_resource_group.main.tags
}

module "backend_api" {
  source                       = "../container-app"
  name                         = "backend-api-${var.environment}"
  resource_group_name          = azurerm_resource_group.main.name
  container_app_environment_id = module.aca_env.id
  image                        = "${var.acr_name}.azurecr.io/interview-dotnet-api:${var.image_tag}"
  target_port                  = 5000
  external_enabled             = true
  min_replicas                 = var.backend_min_replicas
  max_replicas                 = var.backend_max_replicas

  env_vars = {
    "ASPNETCORE_ENVIRONMENT" = "Development"
    "ASPNETCORE_HTTP_PORTS"  = "5000"
    "Cors__AllowedOrigins"   = "https://frontend-react-${var.environment}.${module.aca_env.default_domain},http://localhost:3000,http://localhost:3080"
  }

  tags = azurerm_resource_group.main.tags
}

module "frontend_react" {
  source                       = "../container-app"
  name                         = "frontend-react-${var.environment}"
  resource_group_name          = azurerm_resource_group.main.name
  container_app_environment_id = module.aca_env.id
  image                        = "${var.acr_name}.azurecr.io/interview-react-app:${var.image_tag}"
  target_port                  = 80
  external_enabled             = true
  min_replicas                 = var.frontend_min_replicas
  max_replicas                 = var.frontend_max_replicas

  tags = azurerm_resource_group.main.tags
}
