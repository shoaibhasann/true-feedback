function SuccessResponse(message, data = null){
    return {
        success: true,
        message: message,
        data: data
    }
}

function ErrorResponse(message, error = null){
    return {
        success: false,
        message: message,
        error: error
    }
}

export { SuccessResponse, ErrorResponse }