module "stack" {
  source = "../../modules/app-stack"

  resource_group_name = var.resource_group_name
  location            = var.location
  environment         = var.environment
  acr_name            = var.acr_name
  image_tag           = var.image_tag
  backend_min_replicas = var.backend_min_replicas
  backend_max_replicas = var.backend_max_replicas
  frontend_min_replicas = var.frontend_min_replicas
  frontend_max_replicas = var.frontend_max_replicas
}