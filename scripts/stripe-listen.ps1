param(
  [string]$ForwardTo = "http://localhost:54321/functions/v1/stripe-sync"
)

if (-not $env:STRIPE_CLI_API_KEY) {
  Write-Host "Please set STRIPE_CLI_API_KEY first." -ForegroundColor Yellow
}

stripe listen --forward-to $ForwardTo
