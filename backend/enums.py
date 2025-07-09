from enum import Enum

class StatusError(str, Enum):
    NOT_FOUND_OR_UNCHANGED = "User not found or status unchanged"
    USER_NOT_FOUND = "User not found"

class AuthError(str, Enum):
    MISSING_SECRET_KEY = "SECRET_KEY environment variable is required"
    CREATE_TOKEN_FAILED = "Failed to create token"
    INVALID_COOKIE_STRUCTURE = "Invalid cookie structure"
    USER_NOT_FOUND = "User does not exist"
    FAILED_USER_CACHE = "Failed to access user cache"
    EXPIRED = "Token has expired"
    INVALID = "Invalid token"
    MISSING = "Invalid or missing token"
    INVALID_OR_EXPIRED_TOKEN = 'Invalid or expired token'