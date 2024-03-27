#!/usr/bin/env bash

set -eu

# # The CFN variables seem to include quotes when used in tests these quotes must
# # be removed before assigning these variable.
# remove_quotes () {
#   echo "$1" | tr -d '"'
# }

# # Github actions set to true for tests to run in headless mode
# export GITHUB_ACTIONS=true
# # shellcheck disable=SC2154
# export API_BASE_URL=$(remove_quotes "$CFN_BAVBackEndURL")
# export IPV_STUB_URL=$(remove_quotes $CFN_BAVIPVStubPrettyAPIURL)start
# export TEST_HARNESS_URL=$(remove_quotes $CFN_BAVTestHarnessURL)
# export SESSION_TABLE=$(remove_quotes $CFN_BAVBackendSessionTableName)

# declare error_code

# cd /app; yarn run test:e2e:cd
# error_code=$?

# cp -rf /app/test/reports $TEST_REPORT_ABSOLUTE_DIR

# sleep 2m

# apt-get install jq -y
# cd /app; npm run test:pii
# error_code=$?

# exit $error_code