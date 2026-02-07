import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { object, string, type ObjectSchema } from 'yup';
import { useFormik } from 'formik';
import { useCustomEvents } from '@/services/formik/hooks';
import { updateCategory, useGetCategoryById } from '@/services/network/libs/categories';
import { useEffect } from 'react';

interface Props {
    isOpen: boolean;
    categoryId: number;
    setOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: () => void;
}

export interface EditCategoryFormValues {
    name?: string;
    description?: string
}

const EditCategoryModal = (props: Props) => {
    const { isOpen, refetch, setOpenEditModal, categoryId } = props;

    console.log('EditCategoryModal categoryId:', categoryId);

    const { data: categoryData, isLoading } = useGetCategoryById(categoryId, isOpen)

    console.log('EditCategoryModal categoryData:', categoryData);

    const initialValues: EditCategoryFormValues = {
        name: categoryData?.name ?? '',
        description: categoryData?.description ?? '',
    }

    const validationSchema: ObjectSchema<EditCategoryFormValues> = object().shape({
        name: string().optional(),
        description: string().optional()
    })

    const onSubmit = async (values: EditCategoryFormValues) => {
        console.log('Edit category values:', values);
        const response = await updateCategory(categoryId, values).catch((err) =>
            console.log('Create category error:', err),
        );

        if (response) {
            refetch();
            setOpenEditModal(false)
        }
    }


    useEffect(() => {
        if (categoryData) {
            formik.setValues({
                name: categoryData.name ?? '',
                description: categoryData.description ?? '',
            })
        }
    }, [categoryData])

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
    })

    const { onInputChange } = useCustomEvents<EditCategoryFormValues>(formik);

    return (
        <Dialog open={isOpen} onOpenChange={() => setOpenEditModal(false)}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Modify the details of your category
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit}>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='name'>Category Name</Label>
                            <Input id='name' name='name' placeholder='e.g., Electronics' onChange={onInputChange} value={formik.values.name} />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='description'>Category Description</Label>
                            <Input
                                id='description'
                                name='description'
                                onChange={onInputChange}
                                value={formik.values.description}
                                placeholder='e.g, Famous kitchen appliances...'
                            />
                        </div>
                    </div>

                    <DialogFooter className='mt-5'>
                        <Button variant='outline' onClick={() => setOpenEditModal(false)}>
                            Cancel
                        </Button>
                        <Button type='submit'>Edit Category</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditCategoryModal;
