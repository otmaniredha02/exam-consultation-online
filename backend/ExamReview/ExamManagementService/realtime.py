"""
Minimal in-process pub/sub for Server-Sent Events (SSE).

LIMITATION: this event bus lives in Python process memory, so it only
works correctly with a single worker process (e.g. `manage.py runserver`,
or `gunicorn --workers 1`). If you deploy with multiple workers or
multiple machines, each process gets its own broadcaster and events
published on one won't reach clients connected to another.

To scale beyond a single process, swap this for Redis pub/sub
(redis-py's `.pubsub()`) or Django Channels with a Redis channel layer —
the publish()/subscribe() call sites in views.py wouldn't need to change,
just this file's internals.
"""
import json
import queue
import threading

CHANNEL_QUEUE_MAXSIZE = 100
HEARTBEAT_SECONDS = 15


class EventBroadcaster:
    def __init__(self):
        self._lock = threading.Lock()
        self._subscribers: dict[str, set] = {}

    def subscribe(self, channel: str) -> "queue.Queue":
        q = queue.Queue(maxsize=CHANNEL_QUEUE_MAXSIZE)
        with self._lock:
            self._subscribers.setdefault(channel, set()).add(q)
        return q

    def unsubscribe(self, channel: str, q: "queue.Queue"):
        with self._lock:
            subs = self._subscribers.get(channel)
            if subs and q in subs:
                subs.remove(q)
            if subs is not None and not subs:
                self._subscribers.pop(channel, None)

    def publish(self, channel: str, event: str, data: dict):
        payload = json.dumps(data)
        with self._lock:
            subs = list(self._subscribers.get(channel, ()))
        for q in subs:
            try:
                q.put_nowait((event, payload))
            except queue.Full:
                pass  # a slow/stalled client shouldn't block publishers


broadcaster = EventBroadcaster()


def sse_stream(channel: str):
    """Generator yielding SSE-formatted messages for `channel`."""
    q = broadcaster.subscribe(channel)
    try:
        yield "event: connected\ndata: {}\n\n"
        while True:
            try:
                event, data = q.get(timeout=HEARTBEAT_SECONDS)
                yield f"event: {event}\ndata: {data}\n\n"
            except queue.Empty:
                yield ": heartbeat\n\n"  # keeps proxies/browsers from closing idle connections
    finally:
        broadcaster.unsubscribe(channel, q)