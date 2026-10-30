const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function analyzeMessageApi({ message, language = 'en', source = 'web', metadata = {} }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
        source,
        metadata: {
          has_url: metadata.has_url || false,
          urls: metadata.urls || [],
          phone_numbers: metadata.phone_numbers || []
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok || !data) {
      const errorMsg = data?.message || data?.error || 'Analysis service temporarily unavailable. Please try again.';
      const status = response.status || 500;
      return {
        success: false,
        status,
        error: errorMsg
      };
    }

    return {
      success: true,
      data
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return {
        success: false,
        status: 408,
        error: 'Analysis request timed out. Please try again.'
      };
    }
    return {
      success: false,
      status: 0,
      error: 'Network connection failed. Unable to reach analysis engine.'
    };
  }
}
