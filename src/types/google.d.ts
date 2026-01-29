declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenClient {
        requestAccessToken(config?: { prompt?: string }): void;
      }

      interface TokenResponse {
        access_token: string;
        error?: string;
        error_description?: string;
      }

      interface ErrorResponse {
        type: string;
        message: string;
      }

      function initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
        error_callback?: (error: ErrorResponse) => void;
      }): TokenClient;
    }
  }
}
