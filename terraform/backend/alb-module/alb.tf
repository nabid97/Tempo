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

resource "aws_lb_listener" "http" {
  load_balancer_arn = module.alb.lb_arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs.arn
  }

  depends_on = [aws_lb_target_group.ecs] # Ensures the target group is created first

  tags = {
    Name        = "alb-listener"
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}


resource "aws_lb_target_group" "ecs" {
  name        = "ecs-target-group"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip" 

  health_check {
    path                = "/health" # Update this to match a valid endpoint in your app
    port                = "traffic-port"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name        = "ecs-tg"
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}
