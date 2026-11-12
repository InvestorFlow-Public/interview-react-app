variable "resource_group_name" {
  description = "Resource Group name"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "vnet_name" {
  description = "Virtual Network name"
  type        = string
  default     = "investorflow-vnet"
}

variable "vnet_address_space" {
  description = "Address space for the VNet"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "subnet_name" {
  description = "Subnet name for Container Apps"
  type        = string
  default     = "snet-container-apps"
}

variable "subnet_address_prefix" {
  description = "Address prefix for Container Apps subnet (requires /23 minimum)"
  type        = list(string)
  default     = ["10.0.4.0/23"]
}

variable "tags" {
  description = "Tags to apply to networking resources"
  type        = map(string)
  default     = {}
}
