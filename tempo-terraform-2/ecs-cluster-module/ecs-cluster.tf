# ECS Cluster
resource "aws_ecs_cluster" "cluster" {
  name = "tempo-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = "Development"
    Project     = "NodeJSApp"
  }
}