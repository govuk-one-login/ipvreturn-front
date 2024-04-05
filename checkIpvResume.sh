#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <IPR_URL>"
    exit 1
fi

IPR_URL="$1"

start_time=$(date +%s.%N)

response=$(curl -L -s -v "$IPR_URL" -o /dev/null 2>&1 | \
    tee >(grep -E "< HTTP/" | awk '{print $3}') \
         >(grep -i Location))

elapsed_time=$(echo "$(date +%s.%N) - $start_time" | bc)

error_occurred=0
status_503=0
domains=""

echo -e "\nHTTP Status Codes Received:"
status_codes=$(echo "$response" | grep -E "^[0-9]+")
echo "$status_codes"

# Check if any status code is 503
if echo "$status_codes" | grep -q "503"; then
  status_503=1
fi

echo -e "\nDomains from Location Headers:"
domains=$(echo "$response" | grep -i "Location" | awk -F'/' '{print $3}' | sort | uniq)
echo "$domains"
echo ""

# Check for error conditions
if [[ $status_503 -eq 1 ]] && [[ -z "$domains" ]]; then
  echo "Error: IPR might be down!!!"
  exit 1
elif [[ $error_occurred -eq 1 ]]; then
  echo "Error: An unspecified error occurred."
  exit 1
fi

echo "Request completed in $elapsed_time seconds."

# Check if elapsed time is more than 2.5 seconds
elapsed_check=$(echo "$elapsed_time > 2.5" | bc)
if [[ $elapsed_check -eq 1 ]]; then
  echo "Error: Request took longer than 2.5 seconds."
  exit 1
else
  echo "IPR all okay!"
fi

exit 0