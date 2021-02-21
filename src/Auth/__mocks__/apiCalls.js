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