import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const getBaseUrl = () => {
  if (ExecutionEnvironment.canUseDOM) {
    return '/api';
  }
  return process.env.BACKEND_URL || 'http://localhost:8000';
};

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any | null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(true); // Indicate success for retried requests
    }
  });
  failedQueue = [];
};

const apiClient = {
  request: async (method: string, path: string, data?: any) => {
    const url = `${getBaseUrl()}${path}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    let response = await fetch(url, options);

    if (response.status === 401 && !path.includes('/auth/refresh')) {
      // If 401 and not already a refresh request
      if (isRefreshing) {
        // If token is already refreshing, queue the failed request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient.request(method, path, data)); // Retry original request after refresh
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${getBaseUrl()}/auth/refresh`, { method: 'POST' });
        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh token');
        }
        // Assuming refresh returns new access token or just success
        // Process queued requests
        processQueue(null);
        // Retry original request
        response = await fetch(url, options); // Retry with new token
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        throw refreshError; // Propagate the refresh error
      } finally {
        isRefreshing = false;
      }
    }

    if (!response.ok) {
      // If it's still not ok after potential refresh or not a 401
      let errorData = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON
      }
      throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
    }

    try {
      return await response.json();
    } catch (error) {
      // Handle cases where the response body is empty or not JSON
      return null;
    }
  },

  get: async (path: string) => apiClient.request('GET', path),
  post: async (path: string, data?: any) => apiClient.request('POST', path, data),
};

export default apiClient;
