output "resource_group_name" {
  description = "Resource Group name"
  value       = module.stack.resource_group_name
}

output "aca_environment_id" {
  description = "Container App Environment ID"
  value       = module.stack.aca_environment_id
}

output "aca_default_domain" {
  description = "Default domain of the Container App Environment"
  value       = module.stack.aca_default_domain
}

output "backend_api_url" {
  description = "Public URL of the Backend .NET API"
  value       = module.stack.backend_api_url
}

output "frontend_react_url" {
  description = "Public URL of the Frontend React application"
  value       = module.stack.frontend_react_url
}
