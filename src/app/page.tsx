import { AuthenticationForm } from "../components/AuthenticationForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8">Airbnb Maintenance Management System</h1>
      <AuthenticationForm />
    </main>
  );
}
