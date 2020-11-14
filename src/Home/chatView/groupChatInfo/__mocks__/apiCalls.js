export const addMembers = jest.fn()
    .mockImplementation((gcid,users) => ({

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
export const leaveChat = jest.fn()
    .mockImplementation(() => {
        console.log("leaveChat clicked")
        return {}
    })

export const removeSelfAdmin = jest.fn()
    .mockImplementation(() => {
        console.log("removeSelfAdmin clicked")
        return {}
    })