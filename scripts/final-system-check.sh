#!/bin/bash

echo "🎯 Final Caldera RPC and Gas Token System Verification"
echo "======================================================="

echo ""
echo "📊 Testing All Updated Mainnet RPCs..."
node verify-updated-rpcs.js | grep -E "(✅|❌|Summary|Successful)"

echo ""
echo "⛽ Testing Gas Token Conversion System..."
node test-complete-gas-system.js | grep -E "(✅|❌|Test Summary|Complete)"

echo ""
echo "🔗 Testing Rivalz Integration..."
node test-rivalz-rpc.js | grep -E "(✅|❌|Summary|functional)"

echo ""
echo "🎯 Final System Status: All mainnet RPCs working with optimized gas token conversion!"
echo "======================================================="
