---
title: "Real-time Log Streamer"
subtitle: "High-throughput, low-latency log streaming over the network"
githubLink: "https://github.com/amitsuthar69/tailf-log-streamer"
liveLink: "#"
imgPreview: "logs.png"
techStack: ["Golang", "WebSockets"]
date: "2025-09-15"
---

A high-performance systems utility designed to provide `tail -f` functionality over a network efficiently.

Built for distributed systems and cloud environments, this tool enables real-time monitoring of log files across multiple remote clients simultaneously without the overhead of traditional polling. ([GitHub](https://github.com/amitsuthar69/tailf-log-streamer))

### Features:

- Achieves an average latency of 2ms (3.3ms p95), ensuring logs reach your terminal almost instantly.
- Optimized to handle up to 16K lines per second, making it suitable for high-traffic production environments.
- Designed with a fan-out broadcast pipeline and ring buffers to support 250+ concurrent clients with zero performance degradation.
- Features O(1) tail-read behavior, meaning performance remains constant regardless of how large the log file grows.
- Supports snapshot-on-connect, allowing new clients to immediately see recent log history upon joining.
