import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const componentTypes = {
    INPUT: 'input',
    SELECT: 'select',
    TEXTAREA: 'textarea'
}

const CommonForm = ({ formControls, formData, setFormData, onSubmit, buttonText, isBtnDisabled }) => {

    // render form inputs according to provided component types
    const renderInputsByComponentType = (getControlItem) => {
        let element = null;
        const value = formData[getControlItem.name] || '';

        switch (getControlItem.componentType) {
            case componentTypes.INPUT:
                element = <Input
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    id={getControlItem.name}
                    type={getControlItem.type}
                    value={value}
                    onChange={(event) =>
                        setFormData({
                            ...formData,
                            [getControlItem.name]: event.target.value
                        })
                    }
                />
                break;

            case componentTypes.SELECT:
                element = (
                    <Select
                        value={value}
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                [getControlItem.name]: value
                            })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={getControlItem.label || getControlItem.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                getControlItem.options &&
                                    getControlItem.options.length > 0
                                    ? getControlItem.options.map(optionItem =>
                                        <SelectItem key={optionItem.id} value={optionItem.id}>
                                            {optionItem.label}
                                        </SelectItem>)
                                    : null
                            }
                        </SelectContent>
                    </Select>
                )
                break;

            case componentTypes.TEXTAREA:
                element = <Textarea
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    id={getControlItem.id}
                    value={value}
                    onChange={(event) =>
                        setFormData({
                            ...formData,
                            [getControlItem.name]: event.target.value
                        })
                    }
                />
                break;

            default:
                element = <Input
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    id={getControlItem.name}
                    type={getControlItem.type}
                    value={value}
                    onChange={(event) =>
                        setFormData({
                            ...formData,
                            [getControlItem.name]: event.target.value
                        })
                    }
                />
                break;
        }

        return element;
    }

    return (
        <form onSubmit={onSubmit}>
            <div className='flex flex-col gap-3'>
                {
                    formControls.map(controlItem =>
                        <div key={controlItem.name} className='grid w-full gap-1.5'>
                            <Label className="mb-1">{controlItem.label}</Label>
                            {
                                renderInputsByComponentType(controlItem)
                            }
                        </div>
                    )
                }
            </div>

            <Button disabled={isBtnDisabled} type="submit" className="mt-3 w-full">{buttonText || "Submit"}</Button>
        </form>
    )
}

export default CommonForm