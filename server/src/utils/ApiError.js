

class ApiError extends Error {
    constructor(statusCode, messages="somthis went rownt..",error=[],data=null,stack="") {
        super(messages);
        this.statusCode = statusCode
        this.messages = messages
        this.error = error
        this.data = data
        this.stack = stack
        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            success: this.success,
            errors: this.errors,
            data: this.data,
            stack: this.stack,
        };
    }
}

export default ApiError