/**
 * Secure Telemetry WebSocket Hook.
 * Implements clean connection boundary scoping, dynamic listener assignment via refs,
 * and a memory-safe exponential backoff circuit breaker to prevent perimeter flooding.
 */
import { useEffect, useRef, useState } from 'react';

interface WebSocketOptions {
  onMessage?: (event: MessageEvent) => void;
}

export function useWebSocket(url: string, options?: WebSocketOptions) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Store the mutable options callback in a ref to avoid resetting the
  // underlying active connection loop when parent layouts trigger a re-render
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    let isMounted = true;
    let reconnectDelay = 1000; // Initialization interval boundary at 1 second

    const connect = () => {
      if (!url) return;

      try {
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
          if (isMounted) {
            setIsConnected(true);
            reconnectDelay = 1000; // Securely reset delay steps on authenticated link completion
          }
        };

        socket.onmessage = (event) => {
          if (isMounted && optionsRef.current?.onMessage) {
            optionsRef.current.onMessage(event);
          }
        };

        socket.onclose = () => {
          if (isMounted) {
            setIsConnected(false);

            // Enforce incremental geometric backoff caps to guard the perimeter gateway
            reconnectTimeoutRef.current = window.setTimeout(() => {
              reconnectDelay = Math.min(reconnectDelay * 2, 30000);
              connect();
            }, reconnectDelay);
          }
        };

        socket.onerror = () => {
          // Explicit closure ensures immediate failover without leaving standard socket loops hanging
          socket.close();
        };
      } catch (error) {
        console.error('Enclave telemetry network channel initialization failure:', error);
      }
    };

    connect();

    // Complete architectural tear-down loop to eliminate socket memory bleed states entirely
    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [url]);

  return { isConnected };
}