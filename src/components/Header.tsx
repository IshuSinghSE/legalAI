import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'How It Works', value: 'how-it-works' },
    { label: 'Features', value: 'features' },
    { label: 'Pricing', value: 'pricing' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ];

  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => onPageChange('home')} className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="font-bold text-xl text-gray-900">LegalAI</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onPageChange(item.value)}
                className={`text-sm transition-colors hover:text-blue-600 ${
                  currentPage === item.value ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button  size="sm"
              className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push('/dashboard')}>
              Get Started
            </Button>
            {/* <Button
             
              onClick={() => onPageChange('document-upload')}
            >
              Get Started
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  );
}
