output "vnet_id" {
  description = "The ID of the Virtual Network"
  value       = azurerm_virtual_network.main.id
}

output "subnet_id" {
  description = "The ID of the subnet for Container Apps Environment"
  value       = azurerm_subnet.container_apps.id
}
