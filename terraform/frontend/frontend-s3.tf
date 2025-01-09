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

# Upload `index.html` to the root
resource "aws_s3_object" "frontend_index" {
  bucket        = aws_s3_bucket.frontend.id
  key           = "index.html" # Place `index.html` at the root
  source        = "C:/Users/Nabid/Tempo-ECS/tempo-ui--template/build/index.html" # Absolute path to `index.html`
  content_type  = "text/html"
}

# Upload files from `static/js/`
resource "aws_s3_object" "frontend_js_files" {
  for_each = fileset("C:/Users/Nabid/Tempo-ECS/tempo-ui--template/build/static/js", "**") # Match all files in `static/js`
  bucket   = aws_s3_bucket.frontend.id
  key      = "static/js/${each.value}" # Preserve folder structure in S3
  source   = "C:/Users/Nabid/Tempo-ECS/tempo-ui--template/build/static/js/${each.value}" # Local file path
  content_type = lookup({
    "js" = "application/javascript" # Default MIME type for `.js` files
  }, each.value, "application/octet-stream")
}
