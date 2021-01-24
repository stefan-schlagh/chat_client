/*let called = 0;

export const fetchUserInfo = () => {

    called ++;

    switch (called){
        case 1:
            return {
                uidSelf: 2,
                username: "test123",
                blocked: false,
                userExists: true
            };
        case 2:
            throw new Error('Error fetching userInfo');
        case 3:
            return {
                uidSelf: 2,
                userExists: false
            }
        case 4:
            return {
                uidSelf: 2,
                username: "test321",
                blocked: true,
                userExists: true
            }
        default:
            return {}
    }
*/
export const fetchUserInfo = jest.fn(() => ({
            uidSelf: 2,
            username: "test123",
            blocked: false,
            userExists: true
        }))
    //success
    .mockImplementationOnce(() => ({
        uidSelf: 2,
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
        uidSelf: 2,
        userExists: false
    }))
    //blocked by this user
    .mockImplementationOnce(() => ({
        uidSelf: 2,
        username: "test321",
        blocked: true,
        userExists: true
    }));