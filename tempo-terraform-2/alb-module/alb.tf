module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "8.2.0" # Latest version

  name               = "ecs-load-balancer"
  load_balancer_type = "application"
  vpc_id             = var.vpc_id # Pass VPC ID as a variable
  subnets            = var.subnets # Pass public subnets as a variable

  security_groups = [var.security_group_id] # Pass the security group ID as a variable

  enable_deletion_protection = false # Disable deletion protection for simplicity

  tags = {
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}

resource "aws_security_group" "alb" {
  name        = "alb-security-group"
  description = "Allow inbound traffic to ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "alb-sg"
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}

resource "aws_lb_target_group" "ecs" {
  name        = "ecs-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  tags = {
    Name        = "ecs-tg"
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}

