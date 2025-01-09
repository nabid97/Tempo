
variable "execution_role_arn" {
  description = "IAM Role ARN for ECS Execution"
}

variable "cluster_id" {
  description = "ECS Cluster ID"
}

variable "subnets" {
  description = "List of subnets for ECS Service"
}

variable "target_group_arn" {
  description = "Target Group ARN for ALB"
}

variable "security_groups" {
  description = "The list of security groups to assign to ECS tasks"
  type        = list(string)
}