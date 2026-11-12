variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "eastus2"
}

variable "environment" {
  description = "Environment identifier (dev, qa, stg, prd)"
  type        = string
}

variable "acr_name" {
  description = "Name of the Azure Container Registry"
  type        = string
  default     = "investorflowacr"
}

variable "image_tag" {
  description = "Tag for container images"
  type        = string
  default     = "latest"
}

variable "backend_min_replicas" {
  description = "Minimum replicas for backend API"
  type        = number
  default     = 1
}

variable "backend_max_replicas" {
  description = "Maximum replicas for backend API"
  type        = number
  default     = 1
}

variable "frontend_min_replicas" {
  description = "Minimum replicas for frontend UI"
  type        = number
  default     = 1
}

variable "frontend_max_replicas" {
  description = "Maximum replicas for frontend UI"
  type        = number
  default     = 2
}
