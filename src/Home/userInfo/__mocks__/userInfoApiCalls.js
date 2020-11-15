export const fetchUserInfo = jest.fn()
    //success
    .mockImplementationOnce(() => ({
        uidSelf: 2,
        username: "test123",
        blocked: false,
        userExists: true
    }))
    //error while fetching
    .mockImplementationOnce(() => {
        throw new Error('Error fetching userInfo')
    })
    //user does not exist
    .mockImplementationOnce(() => ({
        uidSelf: 2,
        userExists: false
    }))
    //blocked by this user
    .mockImplementationOnce(() => ({
        uidSelf: 2,
        username: "test321",
        blocked: true,
        userExists: true
    }))