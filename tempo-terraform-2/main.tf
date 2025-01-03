# Provider Configuration
provider "aws" {
  region = "us-east-1" # Change to your preferred region
}

# VPC Module
module "vpc" {
  source  = "./vpc-module"
}

module "ecs_cluster" {
  source = "./ecs-cluster-module"
}

# ALB Module
module "alb" {
  source  = "./alb-module"
  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.public_subnets
  security_group_id = aws_security_group.alb.id
}
resource "aws_security_group" "alb" {
  name        = "alb-security-group"
  description = "Allow inbound traffic to ALB"
  vpc_id      = module.vpc.vpc_id
}

# IAM Role for ECS Instances
resource "aws_iam_role" "ecs_instance_role" {
  name = "ecsInstanceRole"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      }
    }
  ]
}
EOF
}

# Attach IAM Policy
resource "aws_iam_policy_attachment" "ecs_instance_policy" {
  name       = "ecsInstancePolicyAttachment"
  roles      = [aws_iam_role.ecs_instance_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

output "ecs_instance_role_arn" {
  value = aws_iam_role.ecs_instance_role.arn
}

# ECS Service Module
module "ecs_service" {
  source            = "./ecs-service-module"
  execution_role_arn = aws_iam_role.ecs_instance_role.arn
  cluster_id         = module.ecs_cluster.ecs_cluster_id
  subnets            = module.vpc.public_subnets
  alb_sg_id          = module.alb.security_group_id
  target_group_arn   = module.alb.target_group_arn
}
