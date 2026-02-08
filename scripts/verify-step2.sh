#!/bin/bash

# Step 2 Definition of Done Verification Script

echo "================================================================================"
echo "AFAQ Step 2: Questionnaire v1 - Definition of Done Verification"
echo "================================================================================"
echo ""

FAILED=0

# 1. Dashboard has entry to questionnaire
echo "✓ Checking: Dashboard has entry to questionnaire"
if grep -q "/compliance/questionnaire" src/pages/Dashboard.tsx && \
   grep -q "Compliance Check" src/pages/Dashboard.tsx; then
  echo "  ✅ Dashboard has Compliance Check card with navigation"
else
  echo "  ❌ Dashboard missing questionnaire entry"
  FAILED=1
fi
echo ""

# 2. Questionnaire page generates/loads correct template
echo "✓ Checking: Questionnaire page exists and uses template builder"
if [ -f "src/pages/Questionnaire.tsx" ] && \
   grep -q "buildQuestionnaireTemplate" src/pages/Questionnaire.tsx && \
   grep -q "useQuestionnaireTemplate" src/pages/Questionnaire.tsx; then
  echo "  ✅ Questionnaire page exists with template generation/loading"
else
  echo "  ❌ Questionnaire page missing or incomplete"
  FAILED=1
fi
echo ""

# 3. User can answer questions
echo "✓ Checking: Question components exist"
COMPONENTS_EXIST=true
for component in QuestionSection QuestionItem AnswerInput EvidenceField ProgressTracker QuestionnaireNav; do
  if [ ! -f "src/components/compliance/${component}.tsx" ]; then
    echo "  ❌ Missing component: ${component}.tsx"
    COMPONENTS_EXIST=false
    FAILED=1
  fi
done
if [ "$COMPONENTS_EXIST" = true ]; then
  echo "  ✅ All UI components exist"
fi
echo ""

# 4. Autosave implemented
echo "✓ Checking: Autosave functionality"
if grep -q "useUpdateResponse" src/pages/Questionnaire.tsx && \
   grep -q "useEffect" src/pages/Questionnaire.tsx && \
   grep -q "setTimeout" src/pages/Questionnaire.tsx; then
  echo "  ✅ Autosave with debounce implemented"
else
  echo "  ❌ Autosave not properly implemented"
  FAILED=1
fi
echo ""

# 5. Conditional logic prevents invalid questions
echo "✓ Checking: Conditional logic implementation"
if [ -f "src/lib/conditional-logic.ts" ] && \
   grep -q "shouldShowQuestion" src/components/compliance/QuestionItem.tsx; then
  echo "  ✅ Conditional logic evaluator exists and is used"
else
  echo "  ❌ Conditional logic not properly implemented"
  FAILED=1
fi
echo ""

# 6. TypeScript compilation
echo "✓ Checking: TypeScript compilation"
if npx tsc --noEmit > /dev/null 2>&1; then
  echo "  ✅ TypeScript compiles without errors"
else
  echo "  ❌ TypeScript compilation failed"
  FAILED=1
fi
echo ""

# 7. Build passes
echo "✓ Checking: Production build"
if npm run build > /dev/null 2>&1; then
  echo "  ✅ Production build passes"
else
  echo "  ❌ Production build failed"
  FAILED=1
fi
echo ""

# 8. Tests pass
echo "✓ Checking: Test suite"
if npm test -- --run > /dev/null 2>&1; then
  TEST_COUNT=$(npm test -- --run 2>&1 | grep -o '[0-9]* passed' | head -1 | grep -o '[0-9]*')
  echo "  ✅ All tests pass (${TEST_COUNT} tests)"
else
  echo "  ❌ Tests failed"
  FAILED=1
fi
echo ""

# Summary
echo "================================================================================"
if [ $FAILED -eq 0 ]; then
  echo "✅ ALL ACCEPTANCE CRITERIA MET - STEP 2 COMPLETE"
  echo "================================================================================"
  echo ""
  echo "Next steps:"
  echo "  1. Run 'npm run dev' to start the development server"
  echo "  2. Navigate to /compliance/questionnaire to test the UI"
  echo "  3. Optionally run 'npx tsx scripts/seed-questionnaire.ts' to populate test data"
  echo ""
  exit 0
else
  echo "❌ SOME ACCEPTANCE CRITERIA NOT MET - STEP 2 INCOMPLETE"
  echo "================================================================================"
  echo ""
  exit 1
fi
