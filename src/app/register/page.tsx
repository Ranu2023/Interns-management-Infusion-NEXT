
'use server';

import { RegisterForm } from '@/components/register-form';

export default async function RegisterPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
           <RegisterForm />
        </main>
    );
}
