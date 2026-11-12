output "id" {
  description = "The ID of the Container App"
  value       = azurerm_container_app.app.id
}

output "name" {
  description = "The name of the Container App"
  value       = azurerm_container_app.app.name
}

output "fqdn" {
  description = "The FQDN of the Container App ingress"
  value       = azurerm_container_app.app.ingress[0].fqdn
}
