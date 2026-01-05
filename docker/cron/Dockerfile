# Minimal Alpine image with curl for cron
FROM alpine:3.19

# Install curl and bash
RUN apk add --no-cache curl bash

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
# Convert Windows line endings to Unix 
RUN sed -i 's/\r$//' /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN addgroup -S -g 1001 cronuser && \
    adduser -S -u 1001 -G cronuser cronuser

USER cronuser

# Run the cron loop
ENTRYPOINT ["/entrypoint.sh"]
