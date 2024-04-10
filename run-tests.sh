#!/usr/bin/env bash

set -eu

# The CFN variables seem to include quotes when used in tests these quotes must
# be removed before assigning these variable.
remove_quotes () {
  echo "$1" | tr -d '"'
}

# Github actions set to true for tests to run in headless mode
export GITHUB_ACTIONS=true
# shellcheck disable=SC2154
export IPR_CUSTOM_DOMAIN=$(remove_quotes "$CFN_IPRCustomDomain")

declare error_code

cd /app; npm run test:ipvr https://$IPR_CUSTOM_DOMAIN/resume
error_code=$?

exit $error_code