export const getUserSelf = jest.fn()
    .mockImplementationOnce(async () => {
        throw new Error('error fetching userInfo!')
    })
    .mockImplementationOnce(async () => ({
        uid: 3,
        username: "user123",
        email:"",
        emailVerified: true,
        accountCreationTime: "2020-04-07T16:44:19.000Z"
    }))
    .mockImplementation(async () => ({
        uid: 3,
        username: "user123",
        email:"user123@email.com",
        emailVerified: true,
        accountCreationTime: "2020-04-07T16:44:19.000Z"
    }));
export const setEmail = jest.fn()
    // error
    .mockImplementationOnce(async  () => {
        throw new Error('error setting email!')
    })
    // non 200 return
    .mockImplementationOnce(async  () => ({
        status: 400
    }))
    // email taken
    .mockImplementationOnce(async  () => ({
        status: 200,
        json: async () => ({
            emailTaken: true
        })
    }))
    // success
    .mockImplementationOnce(async  () => ({
        status: 200,
        json: async () => ({
            emailTaken: false
        })
    }));