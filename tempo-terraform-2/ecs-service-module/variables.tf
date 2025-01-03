
variable "execution_role_arn" {
  description = "IAM Role ARN for ECS Execution"
}

variable "cluster_id" {
  description = "ECS Cluster ID"
}

variable "subnets" {
  description = "List of subnets for ECS Service"
}

variable "alb_sg_id" {
  description = "Security Group ID for ALB"
}

variable "target_group_arn" {
  description = "Target Group ARN for ALB"
}
