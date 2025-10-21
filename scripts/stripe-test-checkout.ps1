# Simulate checkout.session.completed to edge function
param(
  [string]$Endpoint = "http://localhost:54321/functions/v1/stripe-sync",
  [string]$UserId = "00000000-0000-0000-0000-000000000001"
)

if (-not $env:STRIPE_WEBHOOK_SECRET) {
  Write-Host "Set STRIPE_WEBHOOK_SECRET to the secret from 'stripe listen' output." -ForegroundColor Yellow
}

# Build a minimal event payload
$evt = @{
  id = "evt_test_checkout";
  type = "checkout.session.completed";
  data = @{ object = @{ client_reference_id = $UserId } };
}

# Post unsigned event (the function will early-return if secrets missing)
Invoke-RestMethod -Method Post -Uri $Endpoint -Body ($evt | ConvertTo-Json -Depth 6) -ContentType 'application/json'
