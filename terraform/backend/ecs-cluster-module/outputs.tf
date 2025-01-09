# Output the ECS Cluster ID
output "ecs_cluster_id" {
  description = "The ID of the ECS Cluster"
  value       = aws_ecs_cluster.cluster.id
}

# Output the ECS Cluster ARN
output "ecs_cluster_arn" {
  description = "The ARN of the ECS Cluster"
  value       = aws_ecs_cluster.cluster.arn
}