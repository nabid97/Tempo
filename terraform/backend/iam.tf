#############################
# 6. IAM Role for ECS Instances
#############################
resource "aws_iam_role" "ecs_instance_role" {
  name = "ecsInstanceRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      }
    }
  ]
}
EOF
}


# Attach ECS role for EC2 container service
resource "aws_iam_policy_attachment" "ecs_task_execution_policy" {
  name       = "ecsTaskExecutionPolicyAttachment"
  roles      = [aws_iam_role.ecs_instance_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}


# Attach ECR read-only policy for pulling images
resource "aws_iam_policy_attachment" "ecs_execution_role_policy" {
  name       = "ecsExecutionRolePolicyAttachment"
  roles      = [aws_iam_role.ecs_instance_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}