/**
 * Server API proxy for App02 Customer Service
 * Proxies SSE streaming chat requests to the App02 backend,
 * avoiding browser mixed-content (HTTPS→HTTP) restrictions.
 */
export default defineEventHandler(async (event) => {
    const APP02_URL = process.env.APP02_API_URL || "http://43.136.44.199:8089";

    const body = await readBody(event);

    // Forward the request to App02 backend
    const response = await fetch(`${APP02_URL}/api/v1/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw createError({
            statusCode: response.status,
            statusMessage: await response.text(),
        });
    }

    // Stream the SSE response back to the client
    setResponseHeaders(event, {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });

    const reader = response.body?.getReader();
    if (!reader) {
        throw createError({ statusCode: 502, statusMessage: "No response body from upstream" });
    }

    // Use sendStream to pipe the SSE data
    return new ReadableStream({
        async start(controller) {
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    controller.enqueue(value);
                }
                controller.close();
            } catch (e) {
                controller.error(e);
            }
        },
    });
});
