output "ecs_service_id" {
  description = "The ID of the ECS Service"
  value       = aws_ecs_service.nodejs.id
}

output "ecs_service_name" {
  description = "The name of the ECS Service"
  value       = aws_ecs_service.nodejs.name
}

output "ecs_task_definition" {
  description = "The ARN of the ECS task definition."
  value       = aws_ecs_task_definition.nodejs.arn
}