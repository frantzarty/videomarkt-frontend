// File: RegisterForm.tsx
import React, { useState } from 'react';
import { Modal, TextInput, PasswordInput, Checkbox, Button } from '@mantine/core';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: boolean;
}

const SignUp = () => {
    const [opened, setOpened] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
    const password = watch('password');

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.post('/api/register', data);
            console.log('Registration Successful', response.data);
            setOpened(false);
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Button className="bg-blue-500" onClick={() => setOpened(true)}>
                Open Registration Form
            </Button>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Authentication"
                centered
                overlayBlur={3}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex space-x-2">
                        <TextInput
                            label="First Name"
                            placeholder="Your first name"
                            required
                            className="w-1/2"
                            {...register('firstName', { required: 'First name is required' })}
                            error={errors.firstName?.message}
                        />
                        <TextInput
                            label="Last Name"
                            placeholder="Your last name"
                            required
                            className="w-1/2"
                            {...register('lastName', { required: 'Last name is required' })}
                            error={errors.lastName?.message}
                        />
                    </div>

                    <TextInput
                        label="Email"
                        placeholder="Your email"
                        type="email"
                        required
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Invalid email format',
                            },
                        })}
                        error={errors.email?.message}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Password"
                        required
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                        error={errors.password?.message}
                    />

                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm password"
                        required
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (value) => value === password || 'Passwords do not match',
                        })}
                        error={errors.confirmPassword?.message}
                    />

                    <Checkbox
                        label="I agree to sell my soul and privacy to this corporation"
                        required
                        {...register('terms', { required: 'You must agree to the terms' })}
                        error={errors.terms && 'You must agree to the terms'}
                    />

                    <Button type="submit" className="bg-blue-500 w-full">
                        Register
                    </Button>
                </form>
            </Modal>
        </div>
    );
};

export default SignUp;



