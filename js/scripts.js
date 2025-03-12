// DOM要素の取得
const demoSearch = document.getElementById('demo-search');
const demoResults = document.getElementById('demo-results');
const waitlistForm = document.getElementById('waitlist-form');
const waitlistSuccess = document.getElementById('waitlist-success');

// デモ検索機能の実装
demoSearch.addEventListener('keyup', handleDemoSearch);

function handleDemoSearch(e) {
  if (e.key === 'Enter') {
    const query = e.target.value.trim();
    if (query) {
      displaySearchResults(query);
    }
  }
}

// サンプルクエリボタンの実装
document.addEventListener('DOMContentLoaded', () => {
  // サンプルクエリボタンのイベント設定
  document.querySelectorAll('.sample-query-btn').forEach(button => {
    button.addEventListener('click', () => {
      const query = button.getAttribute('data-query');
      
      // 検索フィールドに入力を設定
      demoSearch.value = query;
      
      // フォーカスをアニメーションで表示
      demoSearch.classList.add('highlight-input');
      setTimeout(() => {
        demoSearch.classList.remove('highlight-input');
      }, 800);
      
      // 検索結果を表示
      displaySearchResults(query);
      
      // 検索結果が見えるようにスクロール
      demoResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
  
  // LocalStorageのチェックと他の初期化処理
  if (localStorage.getItem('rustysearch_waitlist') === 'true') {
    waitlistForm.style.display = 'none';
    waitlistSuccess.style.display = 'block';
  }
  
  // スムーススクロールの実装
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
});

function displaySearchResults(query) {
  const resultsContainer = document.getElementById('demo-results');
  query = query.toLowerCase();
  
  // Clear previous results
  resultsContainer.innerHTML = '';
  
  // Mock search results based on context understanding rather than fuzzy matching
  let results = [];
  
  // Fuzzy matching helper function - helps with typos
  function fuzzyMatch(query, keywords) {
    for (const keyword of keywords) {
      // Exact match
      if (query.includes(keyword)) return true;
      
      // Simple typo tolerance (character missing or wrong)
      for (let i = 0; i < keyword.length; i++) {
        // Skip one character (simulate missing character)
        const skipChar = keyword.slice(0, i) + keyword.slice(i + 1);
        if (query.includes(skipChar)) return true;
        
        // One character typo (if keyword is long enough)
        if (keyword.length >= 4) {
          for (let j = 0; j < query.length - keyword.length + 2; j++) {
            // Allow one character to be different
            const beforeTypo = query.slice(j, j + i);
            const afterTypo = query.slice(j + i + 1, j + keyword.length + 1);
            if (beforeTypo === keyword.slice(0, i) && 
                afterTypo === keyword.slice(i + 1)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  
  // Generate relevant results based on the query content
  if (fuzzyMatch(query, ['user authentication', 'authentication flow', 'login flow', 'signin'])) {
    results = [
      {
        filePath: 'src/auth/service.go',
        lineNumber: 42,
        score: 0.94,
        lineText: 'func (s *AuthService) AuthenticateUser(ctx context.Context, credentials model.UserCredentials) (*model.AuthToken, error) {',
        context: 'Core authentication service that validates user credentials and returns auth tokens'
      },
      {
        filePath: 'src/auth/flow.tsx',
        lineNumber: 28,
        score: 0.89,
        lineText: 'export const AuthenticationFlow: React.FC<AuthFlowProps> = ({ redirectPath, onSuccess }) => {',
        context: 'React component implementing complete user authentication flow with redirect handling'
      },
      {
        filePath: 'src/middleware/auth.go',
        lineNumber: 15,
        score: 0.87,
        lineText: 'func UserAuthMiddleware() gin.HandlerFunc {',
        context: 'Middleware that extracts and validates JWT tokens for user requests'
      },
      {
        filePath: 'src/auth/flow_test.py',
        lineNumber: 57,
        score: 0.82,
        lineText: 'def test_user_authentication_flow_with_valid_credentials(client, mock_db):',
        context: 'Integration test for the complete user authentication flow with mocked database'
      }
    ];
  } else if (fuzzyMatch(query, ['password reset', 'reset password', 'forgot password'])) {
    results = [
      {
        filePath: 'src/auth/password_service.go',
        lineNumber: 89,
        score: 0.95,
        lineText: 'func (s *PasswordService) InitiateReset(email string) (*model.ResetToken, error) {',
        context: 'Generates secure token and sends password reset email to user'
      },
      {
        filePath: 'src/controllers/password_controller.js',
        lineNumber: 34,
        score: 0.91,
        lineText: 'async function handlePasswordReset(req, res) {',
        context: 'Express.js controller for handling password reset requests and token validation'
      },
      {
        filePath: 'src/templates/emails/password_reset.html',
        lineNumber: 12,
        score: 0.85,
        lineText: '<a href="{{resetUrl}}" class="reset-button">Reset Your Password</a>',
        context: 'HTML email template for password reset with secure token link'
      },
      {
        filePath: 'src/components/ResetPasswordForm.tsx',
        lineNumber: 28,
        score: 0.83,
        lineText: 'export const ResetPasswordForm: React.FC<ResetPasswordProps> = ({ token, onSuccess }) => {',
        context: 'Form component for entering new password after reset token validation'
      }
    ];
  } else if (fuzzyMatch(query, ['user repository', 'repository interface', 'user dao'])) {
    results = [
      {
        filePath: 'src/repositories/user_repository.go',
        lineNumber: 15,
        score: 0.96,
        lineText: 'type UserRepository interface {',
        context: 'Interface defining all user data operations with clean separation from business logic'
      },
      {
        filePath: 'src/repositories/impl/postgres_user_repository.go',
        lineNumber: 28,
        score: 0.92,
        lineText: 'type PostgresUserRepository struct {',
        context: 'PostgreSQL implementation of the user repository interface'
      },
      {
        filePath: 'src/repositories/mock/mock_user_repository.go',
        lineNumber: 42,
        score: 0.89,
        lineText: 'func (m *MockUserRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {',
        context: 'Test mock implementation of user repository interface for unit testing'
      },
      {
        filePath: 'src/services/user_service.go',
        lineNumber: 18,
        score: 0.85,
        lineText: 'type UserService struct {',
        context: 'Service layer that depends on the user repository interface for data access'
      }
    ];
  } else if (fuzzyMatch(query, ['database connection', 'connection pool', 'db pool'])) {
    results = [
      {
        filePath: 'src/infrastructure/database.go',
        lineNumber: 23,
        score: 0.94,
        lineText: 'func NewConnectionPool(config *DatabaseConfig) (*pgxpool.Pool, error) {',
        context: 'Creates and configures connection pool with proper sizing and timeouts'
      },
      {
        filePath: 'src/config/database_config.go',
        lineNumber: 12,
        score: 0.90,
        lineText: 'type DatabaseConfig struct {',
        context: 'Configuration structure with all connection pool parameters'
      },
      {
        filePath: 'src/infrastructure/db_metrics.go',
        lineNumber: 31,
        score: 0.87,
        lineText: 'func InstrumentConnectionPool(pool *pgxpool.Pool, metrics *Metrics) *pgxpool.Pool {',
        context: 'Adds metrics and monitoring to database connection pool'
      },
      {
        filePath: 'src/infrastructure/database_test.go',
        lineNumber: 48,
        score: 0.85,
        lineText: 'func TestConnectionPoolMaxConnections(t *testing.T) {',
        context: 'Tests connection pool behavior under maximum connection load'
      }
    ];
  } else if (fuzzyMatch(query, ['jwt token', 'token validation', 'jwt validation'])) {
    results = [
      {
        filePath: 'src/auth/jwt/validator.go',
        lineNumber: 45,
        score: 0.95,
        lineText: 'func (v *JWTValidator) ValidateToken(tokenString string) (*Claims, error) {',
        context: 'Validates JWT signature, expiration and claims with proper error handling'
      },
      {
        filePath: 'src/auth/middleware.go',
        lineNumber: 28,
        score: 0.93,
        lineText: 'func JWTAuthMiddleware(validator jwt.Validator) gin.HandlerFunc {',
        context: 'HTTP middleware that extracts and validates JWT tokens from Authorization header'
      },
      {
        filePath: 'src/auth/jwt/generator.go',
        lineNumber: 32,
        score: 0.89,
        lineText: 'func (g *JWTGenerator) GenerateToken(userID string, roles []string) (string, error) {',
        context: 'Generates signed JWT tokens with proper claims and expiration'
      },
      {
        filePath: 'src/auth/jwt/refresh.go',
        lineNumber: 65,
        score: 0.85,
        lineText: 'func (r *RefreshService) RotateToken(refreshToken string) (*TokenPair, error) {',
        context: 'Implements secure token refresh logic with proper validation'
      }
    ];
  } else if (fuzzyMatch(query, ['payment processing', 'payment middleware', 'payment module'])) {
    results = [
      {
        filePath: 'src/payments/middleware.go',
        lineNumber: 27,
        score: 0.93,
        lineText: 'func PaymentProcessingMiddleware(processor *PaymentProcessor) gin.HandlerFunc {',
        context: 'Middleware that handles payment processing with proper error handling and logging'
      },
      {
        filePath: 'src/payments/stripe_processor.go',
        lineNumber: 54,
        score: 0.91,
        lineText: 'func (p *StripeProcessor) ProcessPayment(ctx context.Context, input PaymentInput) (*PaymentResult, error) {',
        context: 'Stripe implementation of payment processor with complete workflow'
      },
      {
        filePath: 'src/payments/webhook_handler.go',
        lineNumber: 83,
        score: 0.88,
        lineText: 'func (h *WebhookHandler) HandleStripeEvent(body []byte, signature string) error {',
        context: 'Securely handles payment webhook callbacks with signature validation'
      },
      {
        filePath: 'src/payments/transaction_manager.go',
        lineNumber: 127,
        score: 0.85,
        lineText: 'func (tm *TransactionManager) CreateTransaction(ctx context.Context, paymentID string, amount int64) (*Transaction, error) {',
        context: 'Manages payment transactions with proper database records and status tracking'
      }
    ];
  } else if (fuzzyMatch(query, ['error handling', 'error utility', 'error wrapper'])) {
    results = [
      {
        filePath: 'src/utils/errors/errors.go',
        lineNumber: 25,
        score: 0.94,
        lineText: 'func Wrap(err error, message string) *AppError {',
        context: 'Error wrapping utility that preserves stack traces and error context'
      },
      {
        filePath: 'src/middleware/error_handler.go',
        lineNumber: 42,
        score: 0.92,
        lineText: 'func ErrorHandlerMiddleware() gin.HandlerFunc {',
        context: 'Global error handling middleware that converts errors to appropriate HTTP responses'
      },
      {
        filePath: 'src/utils/errors/types.go',
        lineNumber: 15,
        score: 0.89,
        lineText: 'type AppError struct {',
        context: 'Custom error type with code, message and stack trace for structured error handling'
      },
      {
        filePath: 'src/api/responses/error_response.go',
        lineNumber: 31,
        score: 0.86,
        lineText: 'func NewErrorResponse(err error) *ErrorResponse {',
        context: 'Converts internal errors to client-safe API error responses'
      }
    ];
  } else if (fuzzyMatch(query, ['file upload', 'upload component', 'file uploader'])) {
    results = [
      {
        filePath: 'src/components/FileUpload.tsx',
        lineNumber: 34,
        score: 0.95,
        lineText: 'export const FileUploadComponent: React.FC<FileUploadProps> = ({ onUploadComplete, maxSizeMB, allowedTypes }) => {',
        context: 'React component for file uploads with drag-and-drop, progress and validation'
      },
      {
        filePath: 'src/api/uploads/upload_handler.go',
        lineNumber: 57,
        score: 0.91,
        lineText: 'func (h *UploadHandler) HandleFileUpload(c *gin.Context) {',
        context: 'Server handler for secure file uploads with type and size validation'
      },
      {
        filePath: 'src/services/storage/s3_storage.go',
        lineNumber: 72,
        score: 0.87,
        lineText: 'func (s *S3Storage) StoreFile(ctx context.Context, file io.Reader, key string, contentType string) (string, error) {',
        context: 'S3 implementation of file storage with proper content type and metadata'
      },
      {
        filePath: 'src/utils/file/validator.go',
        lineNumber: 28,
        score: 0.84,
        lineText: 'func ValidateFileUpload(fileHeader *multipart.FileHeader, config UploadConfig) error {',
        context: 'Utility for validating file uploads including size, type and malware scanning'
      }
    ];
  } else if (fuzzyMatch(query, ['api rate limit', 'rate limiting', 'request throttling'])) {
    results = [
      {
        filePath: 'src/middleware/rate_limiter.go',
        lineNumber: 38,
        score: 0.95,
        lineText: 'func RateLimiterMiddleware(store RateLimitStore, config RateLimitConfig) gin.HandlerFunc {',
        context: 'Middleware implementing token bucket rate limiting algorithm with proper headers'
      },
      {
        filePath: 'src/infrastructure/redis_rate_limiter.go',
        lineNumber: 52,
        score: 0.92,
        lineText: 'func (r *RedisRateLimiter) Allow(key string, limit Rate) (bool, RateLimitInfo, error) {',
        context: 'Redis-backed distributed rate limiter implementation with sliding window'
      },
      {
        filePath: 'src/config/rate_limit_config.go',
        lineNumber: 15,
        score: 0.88,
        lineText: 'type RateLimitConfig struct {',
        context: 'Configuration structure for rate limits with different tiers and rate policies'
      },
      {
        filePath: 'src/api/middleware_chain.go',
        lineNumber: 78,
        score: 0.86,
        lineText: 'apiGroup.Use(middleware.RateLimiterMiddleware(redisStore, config.RateLimit.API))',
        context: 'API router setup applying rate limiting middleware to endpoints'
      }
    ];
  } else if (fuzzyMatch(query, ['cache invalidation', 'cache strategy', 'invalidation strategy'])) {
    results = [
      {
        filePath: 'src/cache/invalidation.go',
        lineNumber: 47,
        score: 0.96,
        lineText: 'func (s *CacheInvalidator) InvalidateByKey(ctx context.Context, key string) error {',
        context: 'Implements precise key-based cache invalidation with proper logging'
      },
      {
        filePath: 'src/cache/strategies/time_based.go',
        lineNumber: 29,
        score: 0.93,
        lineText: 'func NewTimeBasedInvalidationStrategy(ttl time.Duration) *TimeBasedStrategy {',
        context: 'Time-based cache invalidation strategy with configurable TTL'
      },
      {
        filePath: 'src/cache/strategies/tag_based.go',
        lineNumber: 64,
        score: 0.90,
        lineText: 'func (s *TagBasedStrategy) InvalidateByTags(ctx context.Context, tags []string) error {',
        context: 'Tag-based cache invalidation for efficiently handling related cached items'
      },
      {
        filePath: 'src/services/product/product_service.go',
        lineNumber: 112,
        score: 0.87,
        lineText: 'func (s *ProductService) UpdateProduct(ctx context.Context, product *model.Product) error {',
        context: 'Product service with cache invalidation on product updates'
      }
    ];
  } else {
    // Default results for any other query
    results = [
      {
        filePath: 'src/main.go',
        lineNumber: 28,
        score: 0.75,
        lineText: 'func main() {',
        context: 'Application entry point that initializes all components'
      },
      {
        filePath: 'src/utils/logger.go',
        lineNumber: 42,
        score: 0.65,
        lineText: 'func NewLogger(config *LogConfig) *Logger {',
        context: 'Configurable logging utility for application-wide use'
      },
      {
        filePath: 'src/models/user.go',
        lineNumber: 15,
        score: 0.60,
        lineText: 'type User struct {',
        context: 'Core user data model with all user properties'
      },
      {
        filePath: 'package.json',
        lineNumber: 5,
        score: 0.58,
        lineText: '"dependencies": {',
        context: 'Node.js package dependencies configuration'
      },
      {
        filePath: 'Dockerfile',
        lineNumber: 1,
        score: 0.55,
        lineText: 'FROM node:16-alpine as builder',
        context: 'Docker container configuration for application deployment'
      }
    ];
  }
  
  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);
  
  // Display results in a nice format
  if (results.length > 0) {
    const resultsList = document.createElement('ul');
    resultsList.className = 'search-result-list';
    
    results.forEach(result => {
      const li = document.createElement('li');
      li.className = 'search-result-item';
      
      // Calculate relevance percentage
      const relevancePercent = Math.round(result.score * 100);
      
      li.innerHTML = `
        <div class="result-header">
          <span class="result-file">${result.filePath}</span>
          <span class="result-line">Line ${result.lineNumber}</span>
          <span class="result-score">${relevancePercent}% match</span>
        </div>
        <div class="result-code">${result.lineText}</div>
        <div class="result-context">${result.context}</div>
      `;
      
      resultsList.appendChild(li);
    });
    
    resultsContainer.appendChild(resultsList);
  } else {
    resultsContainer.innerHTML = '<div class="placeholder-text">No results found</div>';
  }
}

// Mailchimpフォーム送信処理
waitlistForm.addEventListener('submit', handleWaitlistSubmit);

function handleWaitlistSubmit(e) {
  // フォームはMailchimpに直接送信されるため、preventDefault()は不要
  
  const submitButton = waitlistForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting...';
  submitButton.disabled = true;

  // Google Analyticsでのイベント記録
  if (typeof gtag !== 'undefined') {
    gtag('event', 'waitlist_signup', {
      'event_category': 'engagement',
      'event_label': document.getElementById('interest').value
    });
  }

  // LocalStorageに登録済みとして記録
  setTimeout(() => {
    localStorage.setItem('rustysearch_waitlist', 'true');
    
    // フォームを非表示にして成功メッセージを表示
    waitlistForm.style.display = 'none';
    waitlistSuccess.style.display = 'block';
    
    // ボタンを元に戻す
    submitButton.innerHTML = originalButtonText;
    submitButton.disabled = false;
  }, 1000);
} 
