import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <Input type="email" id="email" name="email" placeholder="Email adresinizi girin" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Şifre
            </label>
            <Input type="password" id="password" name="password" placeholder="Şifrenizi girin" />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Giriş Yap
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/auth/signup" className="text-purple-600 hover:underline">
            Hesap oluştur
          </Link>
          <Link href="/auth/homepage" className="text-purple-600 hover:underline">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  )
}

