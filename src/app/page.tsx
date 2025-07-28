
'use server';

import { LoginForm } from '@/components/login-form';

export default async function LoginPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4 text-white">
           <LoginForm />
        </main>
    );
}
