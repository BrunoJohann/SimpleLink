import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirecionar para a página raiz internacionalizada (inglês como fallback)
  redirect('/en')
}
