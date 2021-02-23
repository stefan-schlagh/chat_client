import EditableLabel from "../../util/EditableLabel";
import {shallow} from "enzyme";
import React from "react";

describe('editableLabel',() => {
    it('isEditing to be true',async () => {
        const editableLabel = await shallow(
            <EditableLabel
                value={"edit"}
                onChange={() => {}}
            />);
        expect(editableLabel.state('isEditing')).toEqual(false);
        const edit = editableLabel.find('.edit-start');
        expect(edit.length).toEqual(1);
        edit.at(0).simulate('click');
        await editableLabel.update();
        expect(editableLabel.state('isEditing')).toEqual(true);
    });
    it('isEditing to be true - doubleClick',async () => {
        const editableLabel = await shallow(
            <EditableLabel
                value={"edit"}
                onChange={() => {}}
            />);
        expect(editableLabel.state('isEditing')).toEqual(false);
        const valueSpan = editableLabel.find('.value-noEdit');
        expect(valueSpan.length).toEqual(1);
        valueSpan.at(0).simulate('doubleClick');
        await editableLabel.update();
        expect(editableLabel.state('isEditing')).toEqual(true);
    });
    it('submit edit',async () => {
        let changed = false;
        let vChanged = '';
        const editableLabel = await shallow(
            <EditableLabel
                value={"edit"}
                onChange={(value) => {
                    changed = true;
                    vChanged = value;
                }}
            />);
        const edit = editableLabel.find('.edit-start');
        edit.at(0).simulate('click');
        editableLabel.setState({value: 'edit2'})
        await editableLabel.update();
        expect(editableLabel.state('value')).toEqual('edit2');
        const submitEdit = editableLabel.find('.edit-submit');
        expect(submitEdit.length).toEqual(1);
        submitEdit.at(0).simulate('click',{preventDefault: () => {}});
        expect(changed).toEqual(true);
        expect(vChanged).toEqual('edit2');
    });
    it('submit edit - no change',async () => {
        let changed = false;
        const editableLabel = await shallow(
            <EditableLabel
                value={"edit"}
                onChange={(value) => {
                    changed = true;
                }}
            />);
        const edit = editableLabel.find('.edit-start');
        edit.at(0).simulate('click');
        editableLabel.setState({value: 'edit'})
        await editableLabel.update();
        expect(editableLabel.state('value')).toEqual('edit');
        const submitEdit = editableLabel.find('.edit-submit');
        expect(submitEdit.length).toEqual(1);
        submitEdit.at(0).simulate('click',{preventDefault: () => {}});
        expect(changed).toEqual(false);
    });
    it('submit edit - cancel',async () => {
        let changed = false;
        const editableLabel = await shallow(
            <EditableLabel
                value={"edit"}
                onChange={(value) => {
                    changed = true;
                }}
            />);
        const edit = editableLabel.find('.edit-start');
        edit.at(0).simulate('click');
        editableLabel.setState({value: 'edit2'})
        await editableLabel.update();
        expect(editableLabel.state('value')).toEqual('edit2');
        const submitCancel = editableLabel.find('.edit-cancel');
        expect(submitCancel.length).toEqual(1);
        submitCancel.at(0).simulate('click',{preventDefault: () => {}});
        expect(changed).toEqual(false);
    });
});