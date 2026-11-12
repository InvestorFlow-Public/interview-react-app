output "resource_group_name" {
  description = "Resource Group name"
  value       = azurerm_resource_group.main.name
}

output "aca_environment_id" {
  description = "Container App Environment ID"
  value       = module.aca_env.id
}

output "aca_default_domain" {
  description = "Default domain of the Container App Environment"
  value       = module.aca_env.default_domain
}

output "backend_api_url" {
  description = "Public URL of the Backend .NET API"
  value       = "https://${module.backend_api.fqdn}"
}

output "frontend_react_url" {
  description = "Public URL of the Frontend React application"
  value       = "https://${module.frontend_react.fqdn}"
}
