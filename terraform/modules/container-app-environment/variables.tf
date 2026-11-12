variable "resource_group_name" {
  description = "Resource Group name"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "environment_name" {
  description = "Name for the Container App Environment"
  type        = string
  default     = "cae-investorflow"
}

variable "subnet_id" {
  description = "Infrastructure subnet ID for the Container App Environment"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
