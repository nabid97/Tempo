resource "aws_s3_bucket" "frontend" {
  bucket = "tempo-frontend-app-bucket-030125" # Replace with your unique bucket name

  tags = {
    Environment = "Production"
    Project     = "NodeJSApp"
  }
}

resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                 = aws_s3_bucket.frontend.id
  block_public_acls      = false
  ignore_public_acls     = false
  block_public_policy    = false
  restrict_public_buckets = false
}

resource "aws_s3_object" "frontend_index" {
  bucket        = aws_s3_bucket.frontend.id
  key           = "index.html"
  source        = "./dist/index.html"
  content_type  = "text/html"
}

resource "aws_s3_object" "frontend_js" {
  bucket       = aws_s3_bucket.frontend.id
  key          = "bundle.js"
  source       = "./dist/bundle.js"
  content_type = "application/javascript"
}
