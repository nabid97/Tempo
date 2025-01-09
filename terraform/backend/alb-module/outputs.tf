output "load_balancer_arn" {
  description = "The ARN of the ALB"
  value       = module.alb.lb_arn
}

output "load_balancer_dns_name" {
  description = "The DNS name of the ALB"
  value       = module.alb.lb_dns_name
}


# output "security_group_id" {
#   description = "The security group ID of the ALB"
#   value       = aws_security_group.alb.id
# }


output "target_group_arn" {
  description = "The ARN of the target group"
  value       = aws_lb_target_group.ecs.arn
}
