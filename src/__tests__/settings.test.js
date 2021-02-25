import {shallow} from "enzyme";
import React from "react";
import Settings from "../Home/settings/Settings";

jest.mock("../Home/settings/apiCalls");

describe('test settings',() => {

    const email = "user123@email.com";
    const email2 = "user123@email2.com";

    test('get userInfo error',async () => {
        const settings = shallow(<Settings/>);
        expect(settings.state('error')).toEqual(false);
        await settings.update();
        expect(settings.state('error')).toEqual(true);
        const errorSpan = settings.find('span.error');
        expect(errorSpan.length).toEqual(1);
        expect(errorSpan.at(0).text()).toEqual("ein Fehler ist aufgetreten!")
    });
    test('get userInfo empty email',async () => {
        const settings = shallow(<Settings/>);
        expect(settings.state('error')).toEqual(false);
        await settings.update();
        expect(settings.state('error')).toEqual(false);
        const errorSpan = settings.find('span.error');
        expect(errorSpan.length).toEqual(0);
        expect(settings.state('loaded')).toEqual(true);
        const header = settings.find('h1');
        expect(header.length).toEqual(1);
        expect(header.at(0).text()).toEqual('Einstellungen');
        expect(settings.state('userDataSelf').email).toEqual('');
        const labelEdit = settings.find('EditableLabel').dive().find('.value-noEdit');
        expect(labelEdit.length).toEqual(1);
        expect(labelEdit.at(0).text().includes('Noch keine E-Mail Addresse!')).toEqual(true)
    });
    test('test loading...',async () => {
        const settings = shallow(<Settings/>);
        expect(settings.state('loaded')).toEqual(false);
        const loadingSpan = settings.find('span.loading');
        expect(loadingSpan.length).toEqual(1);
        expect(loadingSpan.at(0).text()).toEqual("laden...")
    });
    test('get userInfo success',async () => {
        const settings = shallow(<Settings/>);
        expect(settings.state('error')).toEqual(false);
        await settings.update();
        expect(settings.state('error')).toEqual(false);
        const errorSpan = settings.find('span.error');
        expect(errorSpan.length).toEqual(0);
        expect(settings.state('loaded')).toEqual(true);
        const header = settings.find('h1');
        expect(header.length).toEqual(1);
        expect(header.at(0).text()).toEqual('Einstellungen')
        expect(settings.state('userDataSelf').email).toEqual(email);
        const labelEdit = settings.find('EditableLabel').dive().find('.value-noEdit');
        expect(labelEdit.length).toEqual(1);
        expect(labelEdit.at(0).text().includes(email)).toEqual(true);
    });
    test('change email error',async () => {
        const settings = shallow(<Settings/>);
        await settings.update();
        const edit = settings.find('EditableLabel')
        expect(edit.length).toEqual(1);
        await edit.at(0).invoke('onChange')(email2);
        await settings.update();
        expect(settings.state('error')).toEqual(false);
        expect(settings.state('setEmailError')).toEqual(true);
        expect(settings.state('setEmailErrorMessage')).toEqual('Fehler beim Versenden der E-Mail!');
        expect(settings.state('emailChangeRequested')).toEqual(false);
    });
    test('change email - http 400',async () => {
        const settings = shallow(<Settings/>);
        await settings.update();
        const edit = settings.find('EditableLabel')
        expect(edit.length).toEqual(1);
        await edit.at(0).invoke('onChange')(email2);
        await settings.update();
        expect(settings.state('error')).toEqual(false);
        expect(settings.state('setEmailError')).toEqual(true);
        expect(settings.state('setEmailErrorMessage')).toEqual('Fehler beim Versenden der E-Mail!');
        expect(settings.state('emailChangeRequested')).toEqual(false);
    });
    test('change email - email taken',async () => {
        const settings = shallow(<Settings/>);
        await settings.update();
        const edit = settings.find('EditableLabel')
        expect(edit.length).toEqual(1);
        await edit.at(0).invoke('onChange')(email2);
        await settings.update();
        expect(settings.state('error')).toEqual(false);
        expect(settings.state('setEmailError')).toEqual(true);
        expect(settings.state('setEmailErrorMessage')).toEqual('E-Mail wird bereits verwendet!');
        expect(settings.state('emailChangeRequested')).toEqual(false);
    });
    test('change email - success',async () => {
        const settings = shallow(<Settings/>);
        await settings.update();
        const edit = settings.find('EditableLabel')
        expect(edit.length).toEqual(1);
        await edit.at(0).invoke('onChange')(email2);
        await settings.update();
        expect(settings.state('error')).toEqual(false);
        expect(settings.state('setEmailError')).toEqual(false);
        expect(settings.state('setEmailErrorMessage')).toEqual('');
        expect(settings.state('emailChangeRequested')).toEqual(true);
    });
});