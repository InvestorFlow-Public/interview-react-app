terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "sttfstateinvestorflow"
    container_name       = "tfstate"
    key                  = "stg.terraform.tfstate"
  }
}
