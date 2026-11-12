variable "name" {
  description = "Name of the Container App"
  type        = string
}

variable "resource_group_name" {
  description = "Azure Resource Group name"
  type        = string
}

variable "container_app_environment_id" {
  description = "ID of the Container App Environment"
  type        = string
}

variable "image" {
  description = "Container image URI"
  type        = string
}

variable "cpu" {
  description = "Allocated CPU cores"
  type        = number
  default     = 0.25
}

variable "memory" {
  description = "Allocated memory (e.g. 0.5Gi)"
  type        = string
  default     = "0.5Gi"
}

variable "target_port" {
  description = "Port exposed by the container"
  type        = number
  default     = 80
}

variable "external_enabled" {
  description = "Whether the ingress is externally accessible from internet"
  type        = bool
  default     = true
}

variable "min_replicas" {
  description = "Minimum number of replicas"
  type        = number
  default     = 1
}

variable "max_replicas" {
  description = "Maximum number of replicas"
  type        = number
  default     = 1
}

variable "concurrent_requests" {
  description = "Number of concurrent HTTP requests before scaling out a new replica"
  type        = number
  default     = 50
}

variable "env_vars" {
  description = "Environment variables for the container"
  type        = map(string)
  default     = {}
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
