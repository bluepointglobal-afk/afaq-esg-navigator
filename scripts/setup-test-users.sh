#!/bin/bash
# Setup Test Users for AFAQ ESG Navigator
# This script guides you through creating test users with auth and company data

set -e

echo "🔧 AFAQ Test User Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    touch .env.local
fi

# Check if service key is set
if ! grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
    echo "⚠️  Supabase service role key not found in .env.local"
    echo ""
    echo "📋 To get your service role key:"
    echo "   1. Go to: https://supabase.com/dashboard/project/rifhkbigyyyijegkfpkv/settings/api"
    echo "   2. Copy the 'service_role' key (NOT the anon key)"
    echo "   3. Paste it below"
    echo ""
    read -p "Enter service role key: " SERVICE_KEY

    if [ -z "$SERVICE_KEY" ]; then
        echo "❌ No key provided. Exiting."
        exit 1
    fi

    echo "" >> .env.local
    echo "# Service role key for admin operations (keep secret!)" >> .env.local
    echo "SUPABASE_SERVICE_ROLE_KEY=\"$SERVICE_KEY\"" >> .env.local
    echo "✅ Service key saved to .env.local"
    echo ""
else
    echo "✅ Service role key found in .env.local"
    echo ""
fi

# Load environment variables
export $(grep -v '^#' .env.local | xargs)
export $(grep -v '^#' .env | xargs)

# Check if tsx is installed
if ! command -v npx tsx &> /dev/null; then
    echo "📦 Installing tsx..."
    npm install -D tsx
    echo ""
fi

# Run the test user creation script
echo "🚀 Creating test users..."
echo ""
npx tsx scripts/create-test-users.ts

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Read TEST_USERS.md for login credentials"
echo "   2. Test at: https://afaq-esg-navigator.vercel.app/auth"
echo "   3. Verify data isolation by logging in as different users"
echo ""
echo "⚠️  Security reminder:"
echo "   - .env.local contains sensitive keys - do NOT commit it!"
echo "   - Add .env.local to .gitignore"
echo "   - Delete test users before production launch"
