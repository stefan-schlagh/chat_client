export const fetchUserInfo = jest.fn(() => ({
            username: "test123",
            blockedBySelf: false,
            blockedByOther: false,
            userExists: true
        }))
    //success
    .mockImplementationOnce(() => ({
        username: "test123",
        blockedBySelf: false,
        blockedByOther: false,
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
    //blocked by other user
    .mockImplementationOnce(() => ({
        username: "test321",
        blockedBySelf: false,
        blockedByOther: true,
        userExists: true
    }))
    //blocked by user self
    .mockImplementationOnce(() => ({
        username: "test321",
        blockedBySelf: true,
        blockedByOther: false,
        userExists: true
    }));