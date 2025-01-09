module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.17.0" # Latest version

  # Basic VPC Configuration
  cidr               = var.vpc_cidr
  azs                = var.availability_zones
  public_subnets     = var.public_subnets

  # NAT Gateway Configuration (Disable for simplicity)
  enable_nat_gateway = false

  # DNS Settings
  enable_dns_support   = true
  enable_dns_hostnames = true

  # Tags (Including Name)
  tags = {
    Name        = "tempo-vpc"
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}
