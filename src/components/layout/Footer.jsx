const Footer = () => {
  return (
    <footer className="bg-dark-500 border-t border-primary-500/20 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Universidad Tecnológica de Nayarit
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer