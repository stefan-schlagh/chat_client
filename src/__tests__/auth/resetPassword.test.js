import React from 'react';
import { shallow } from 'enzyme';
import ResetPassword from "../../Auth/ResetPassword";

jest.mock("../../Auth/apiCalls")

describe('test resetPassword',() => {
    it('verificationCode not valid',async () => {
        const resetPassword = await shallow(<ResetPassword/>);
        expect(resetPassword.state('linkValid')).toEqual(false)
        resetPassword.unmount();
    });
    it('check title',async () => {
        const resetPassword = await shallow(<ResetPassword/>);
        expect(resetPassword.find("h1").text()).toEqual("neues Passwort eingeben")
        expect(resetPassword.state('linkValid')).toEqual(true)
        resetPassword.unmount();
    });
    it('password error - too short',async () => {
        const resetPassword = await shallow(<ResetPassword/>);
        resetPassword.setState({password: 'ab'});
        const form = resetPassword.find('form').first();
        form.simulate('submit',{preventDefault: () => {}});
        await resetPassword.update();
        // error message should be there
        expect(resetPassword.state('error')).toEqual(true);
        expect(resetPassword.state('errorMessage')).toEqual('Passwort muss mindestens 8 Zeichen lang sein')
        resetPassword.unmount();
    });
    it('password error - too long',async () => {
        const resetPassword = await shallow(<ResetPassword/>);
        resetPassword.setState({password: '012345678901234567890123456789012345678901234567890123456789'});
        const form = resetPassword.find('form').first();
        form.simulate('submit',{preventDefault: () => {}});
        await resetPassword.update();
        // error message should be there
        expect(resetPassword.state('error')).toEqual(true);
        expect(resetPassword.state('errorMessage')).toEqual('Passwort darf höchstens 50 Zeichen lang sein')
        resetPassword.unmount();
    });
    it('password error - not equal',async () => {
        const resetPassword = await shallow(<ResetPassword/>);
        resetPassword.setState({password: '0123456789',passwordRepeat: '9876543210'});
        const form = resetPassword.find('form').first();
        form.simulate('submit',{preventDefault: () => {}});
        await resetPassword.update();
        // error message should be there
        expect(resetPassword.state('error')).toEqual(true);
        expect(resetPassword.state('errorMessage')).toEqual('Passwörter stimmen nicht überein!')
        resetPassword.unmount();
    });
    it('link not valid',async () => {
        const resetPassword = await shallow(<ResetPassword/>);
        resetPassword.setState({password: '0123456789',passwordRepeat: '0123456789'});
        const form = resetPassword.find('form').first();
        form.simulate('submit',{preventDefault: () => {}});
        await resetPassword.update();
        // error message should be there
        expect(resetPassword.state('error')).toEqual(true);
        expect(resetPassword.state('errorMessage')).toEqual('Fehler: Dieser Link ist ungültig!')
        resetPassword.unmount();
    });
    it('other error',async () => {
        const resetPassword = await shallow(<ResetPassword/>);
        resetPassword.setState({password: '0123456789',passwordRepeat: '0123456789'});
        const form = resetPassword.find('form').first();
        form.simulate('submit',{preventDefault: () => {}});
        await resetPassword.update();
        // error message should be there
        expect(resetPassword.state('error')).toEqual(true);
        expect(resetPassword.state('errorMessage')).toEqual('ein Fehler ist aufgetreten')
        resetPassword.unmount();
    });
    it('success',async () => {
        const resetPassword = await shallow(<ResetPassword/>);
        resetPassword.setState({password: '0123456789',passwordRepeat: '0123456789'});
        const form = resetPassword.find('form').first();
        form.simulate('submit',{preventDefault: () => {}});
        await resetPassword.update();
        expect(resetPassword.state('error')).toEqual(false);
        expect(resetPassword.state('passwordResetSuccess')).toEqual(true)
        resetPassword.unmount();
    });
});