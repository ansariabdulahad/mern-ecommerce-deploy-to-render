import { filterOptions } from '@/config'
import React, { Fragment } from 'react'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'

const ProductFilter = ({ filters, handleFilter }) => {
    return (
        <div className='bg-background md:border-r rounded-lg shadow-sm'>
            <div className='p-4 border-b'>
                <h2 className='text-lg font-extrabold'>Filters</h2>
            </div>
            <div className='p-4 space-y-4'>
                {
                    Object.keys(filterOptions).map((keyItem, index) => (
                        <Fragment key={index}>
                            <div>
                                <h3 className='text-base font-bold'>{keyItem}</h3>
                                <div className='grid gap-2 mt-2'>
                                    {
                                        filterOptions[keyItem].map((option) => (
                                            <Label key={option.id}
                                                className='flex items-center gap-2 font-medium'
                                            >
                                                <Checkbox
                                                    onCheckedChange={() => handleFilter(keyItem, option.id)}
                                                    checked={
                                                        filters &&
                                                        Object.keys(filters).length > 0 &&
                                                        Array.isArray(filters[keyItem]) &&
                                                        filters[keyItem].indexOf(option.id) > -1
                                                    }
                                                />
                                                {option.label}
                                            </Label>
                                        ))
                                    }
                                </div>
                            </div>
                            <Separator />
                        </Fragment>
                    ))
                }
            </div>
        </div>
    )
}

export default ProductFilter