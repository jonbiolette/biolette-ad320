#!/bin/bash

source ./.env.sh

MY_IP="$(dig +short myip.opendns.com @resolver1.opendns.com)"
DATA="[{"

curl --user "$PUBLIC_KEY:$PRIVATE_KEY" --digest --include \
     --header "Accept: application/json" \
     --header "Content-Type: application/json" \
     --request POST "https://cloud.mongodb.com/api/atlas/v1.0/groups/$GROUP_ID/accessList?pretty=true" \
     --data '
      [
        {
          "ipAddress" : "'"$MY_IP"'",
          "comment" : "IP address for dev"
        }
      ]'