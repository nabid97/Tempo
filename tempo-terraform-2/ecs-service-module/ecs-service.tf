# ECS Task Definition
resource "aws_ecs_task_definition" "nodejs" {
  family                   = "nodejs-app"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.execution_role_arn

  container_definitions = <<DEFINITION
[
  {
    "name": "backend",
    "image": "<your-backend-image>",
    "portMappings": [
      {
        "containerPort": 5000,
        "hostPort": 5000
      }
    ]
  },
  {
    "name": "frontend",
    "image": "<your-frontend-image>",
    "portMappings": [
      {
        "containerPort": 3000,
        "hostPort": 3000
      }
    ]
  }
]
DEFINITION

  tags = {
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}

# ECS Service
resource "aws_ecs_service" "nodejs" {
  name            = "nodejs-service"
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.nodejs.arn

  launch_type = "EC2"

  network_configuration {
    subnets         = var.subnets
    security_groups = [var.alb_sg_id]
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "backend"
    container_port   = 5000
  }

  tags = {
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}