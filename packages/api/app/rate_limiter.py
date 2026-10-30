import time
from collections import defaultdict
from typing import Dict, List

class SlidingWindowRateLimiter:
    def __init__(self, limit: int = 60, window_seconds: int = 60):
        self.limit = limit
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = defaultdict(list)

    def is_allowed(self, client_ip: str) -> bool:
        now = time.time()
        window_start = now - self.window_seconds

        # Clean timestamps older than the sliding window
        timestamps = self.requests[client_ip]
        self.requests[client_ip] = [ts for ts in timestamps if ts > window_start]

        if len(self.requests[client_ip]) >= self.limit:
            return False

        self.requests[client_ip].append(now)
        return True

    def reset(self):
        """Helper for test suites."""
        self.requests.clear()

limiter = SlidingWindowRateLimiter()
