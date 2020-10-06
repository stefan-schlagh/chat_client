export const addMembers = jest.fn()
    .mockImplementation((gcid,users) => ({
        a:1
    }))

export const fetchUsersNotInGroup = jest.fn()
    .mockImplementation((gcid,body) => ([
        {
            uid: 10,
            username: 'aaa'
        },
        {
            uid: 11,
            username: 'bbb'
        },
        {
            uid: 12,
            username: 'ccc'
        },
        {
            uid: 13,
            username: 'ddd'
        }
    ]))