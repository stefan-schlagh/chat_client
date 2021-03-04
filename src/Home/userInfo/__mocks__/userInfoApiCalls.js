export const fetchUserInfo = jest.fn(() => ({
            username: "test123",
            blocked: false,
            userExists: true
        }))
    //success
    .mockImplementationOnce(() => ({
        username: "test123",
        blocked: false,
        userExists: true
    }))
    //error while fetching
    .mockImplementationOnce(() => {
        throw new Error('Error fetching userInfo');
    })
    //user does not exist
    .mockImplementationOnce(() => ({
        userExists: false
    }))
    //blocked by this user
    .mockImplementationOnce(() => ({
        username: "test321",
        blocked: true,
        userExists: true
    }));