import React, { Component } from 'react';
import UserInfo, {errorCode} from "../Home/userInfo/UserInfo";
import { shallow } from 'enzyme';

jest.mock('../Home/userInfo/userInfoApiCalls');

describe('UserInfo', () => {
    describe('componentDidMount', () => {
        it('success', async () => {
            const renderedComponent = await shallow(<UserInfo uid={1} />)
            await renderedComponent.update()
            expect(renderedComponent.state('error')).toEqual(errorCode.none)
            const userData = renderedComponent.state('userInfo');
            expect(userData.username).toEqual('test123');
            expect(userData.blockedBySelf).toEqual(false)
            expect(userData.blockedByOther).toEqual(false)
        })

        it('error', async () => {
            const renderedComponent = await shallow(<UserInfo uid={1} />)
            await renderedComponent.update()
            expect(renderedComponent.state('error')).toEqual(errorCode.defaultError)
        })

        it('user not existing', async () => {
            const renderedComponent = await shallow(<UserInfo uid={1} />)
            await renderedComponent.update()
            expect(renderedComponent.state('error')).toEqual(errorCode.notExisting)
        })

        it('blocked by other user', async () => {
            const renderedComponent = await shallow(<UserInfo uid={3} />)
            await renderedComponent.update()
            expect(renderedComponent.state('userInfo').blockedByOther).toEqual(true)
        })
        it('blocked by self', async () => {
            const renderedComponent = await shallow(<UserInfo uid={3} />)
            await renderedComponent.update()
            expect(renderedComponent.state('userInfo').blockedBySelf).toEqual(true)
        })
        it('uid toBe NaN', async () => {
            const renderedComponent = await shallow(<UserInfo uid={"NaN"} />)
            await renderedComponent.update()
            expect(renderedComponent.state('error')).toEqual(errorCode.nan)
        })
    })
});