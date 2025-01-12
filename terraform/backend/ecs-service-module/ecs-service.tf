resource "aws_ecs_task_definition" "nodejs" {
  family                   = "nodejs-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"] # Updated to Fargate
  cpu                      = "256" # 0.25 vCPU
  memory                   = "512" # 512 MB
  execution_role_arn       = var.execution_role_arn

  container_definitions = <<DEFINITION
[
  {
    "name": "backend",
    "image": "495599735948.dkr.ecr.us-east-1.amazonaws.com/backend/tempo",
    "portMappings": [
      {
        "containerPort": 3000,
        "hostPort": 3000,
        "protocol": "tcp"
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
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = var.subnets
    assign_public_ip = true
    security_groups = var.security_groups
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "backend"
    container_port   = 3000
  }

  tags = {
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}



