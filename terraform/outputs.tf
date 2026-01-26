# outputs.tf - Output values

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "static_web_app_url" {
  value = azurerm_static_web_app.main.default_host_name
}

output "static_web_app_token" {
  value     = azurerm_static_web_app.main.api_key
  sensitive = true
}

output "app_insights_key" {
  value     = azurerm_application_insights.main.instrumentation_key
  sensitive = true
}
