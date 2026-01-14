# Changelog

All notable changes to SilentFail will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-01-13

### Added
- Initial release
- Monitor creation with customizable intervals and grace periods
- Smart grace period algorithm
- Heartbeat ping endpoints (GET/POST)
- Email alerts via Resend
- GitHub and Discord OAuth authentication
- Dashboard with real-time status
- Monitor detail pages with ping history
- API key management
- Docker support with built-in cron worker
- Private monitors with secret keys
- Downtime tracking and duration calculation

### Security
- CRON_SECRET protection for internal endpoints
- API key authentication for admin endpoints
- Private monitors with bearer token or query param auth
