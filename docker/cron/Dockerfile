# Minimal Alpine image with curl for cron
FROM alpine:3.19

# Install curl and bash
RUN apk add --no-cache curl bash

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Run the cron loop
ENTRYPOINT ["/entrypoint.sh"]
