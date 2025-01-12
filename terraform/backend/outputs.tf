output "ecs_instance_role_arn" {
  value = aws_iam_role.ecs_instance_role.arn
}

output "load_balancer_dns_name" {
  description = "The DNS name of the ALB"
  value       = module.alb.lb_dns_name

}
