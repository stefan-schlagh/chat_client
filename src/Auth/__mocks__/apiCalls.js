/*
    mocks for authentication apiCalls
 */
export const requestPasswordResetLink = jest.fn()
    // success
    .mockImplementationOnce(async () => ({
        status: 200
    }))
    // user not existing
    .mockImplementationOnce(async () => ({
        status: 404
    }))
    // other error
    .mockImplementationOnce(async () => ({
        status: 400
    }));
export const isVerificationCodeValid = jest.fn()
    // code invalid
    .mockImplementationOnce(async () => ({
        status: 403
    }))
    .mockImplementation(async () => ({
        status: 200
    }));
export const setPassword = jest.fn()
    // invalid link
    .mockImplementationOnce(async () => ({
        status: 403
    }))
    // other error
    .mockImplementationOnce(async () => ({
        status: 400
    }))
    // success
    .mockImplementation(async () => ({
        status: 200
    }));