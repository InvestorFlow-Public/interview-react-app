# variables.tf - Variable definitions

variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["dev", "qa", "stg", "prd"], var.environment)
    error_message = "Must be dev, qa, stg, or prd"
  }
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "eastus2"
}

variable "sku_tier" {
  description = "Static Web App SKU"
  type        = string
  default     = "Free"
}
