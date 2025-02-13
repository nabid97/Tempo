# 1. AWS Provider
provider "aws" {
  region = "us-east-1"  # Change to your preferred region
}


# 2. VPC Module
#############################
module "vpc" {
  source  = "./vpc-module"
}

#############################
# 3. ECS Cluster Module
#############################
module "ecs_cluster" {
  source = "./ecs-cluster-module"
}

#############################
# 4. Security Groups
#############################

# ALB Security Group
resource "aws_security_group" "alb" {
  name        = "alb-security-group"
  description = "Allow inbound traffic to ALB"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow HTTP traffic from anywhere
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow HTTPS traffic from anywhere
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # Allow all outbound traffic
  }

  tags = {
    Name        = "alb-sg"
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}

# ECS Task Security Group
resource "aws_security_group" "ecs_task" {
  name        = "ecs-task-security-group"
  description = "Allow traffic from ALB to ECS tasks"
  vpc_id      = module.vpc.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # Allow all outbound traffic
  }

  tags = {
    Name        = "ecs-task-sg"
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}

# Security Group Rule to Allow ALB -> ECS Task Traffic
resource "aws_security_group_rule" "ecs_task_ingress" {
  type                     = "ingress"
  from_port                = 3000
  to_port                  = 3000
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ecs_task.id
  source_security_group_id = aws_security_group.alb.id
}

#############################
# 5. ALB Module
#############################
module "alb" {
  source  = "./alb-module"

  vpc_id            = module.vpc.vpc_id
  subnets           = module.vpc.public_subnets
  security_group_id = aws_security_group.alb.id
}

#############################
# 6. ECS Service Module
#############################
module "ecs_service" {
  source             = "./ecs-service-module"
  execution_role_arn = aws_iam_role.ecs_instance_role.arn
  cluster_id         = module.ecs_cluster.ecs_cluster_id
  subnets            = module.vpc.public_subnets # Replace with private_subnets for security
  security_groups    = [aws_security_group.ecs_task.id]
  target_group_arn   = module.alb.target_group_arn
}

#############################
# 7. Outputs
#############################

