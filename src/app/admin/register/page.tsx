"use client"
import { useRouter } from 'next/navigation';
import AdminRegisterForm from '../../../components/forms/AdminRegisterForm';

export default function RegisterPage() {
  const router = useRouter();

  const handleSuccess = () => {
    setTimeout(() => {
      router.push('/admin/login');
    }, 2000);
  };

  return (
    <div>
      <h1>Admin Registration</h1>
      <AdminRegisterForm onSuccess={handleSuccess} />
    </div>
  );
}
