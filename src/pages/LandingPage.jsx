import { Link } from 'react-router-dom';
import { ShoppingCart, Calendar, Settings, ArrowRight, Smartphone, AlertTriangle, ShieldCheck, ClipboardList, Apple, Play, Facebook, Twitter, Instagram, Users, Mail, Phone, MapPin} from 'lucide-react';
import Button from '../components/Button';
import pawtnerLogo from '../assets/W.png';
import heroImage from '../assets/undraw_data_0ml2.svg';
import mobileAppImage from '../assets/undraw_mobile-application_uc2q.svg';

const LandingPage = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-white text-[#323f56]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center" 
            onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
          >
            <img src={pawtnerLogo} alt="Pawtner Logo" className="h-8 w-auto" />
            <span className="ml-3 text-xl font-bold">Pawtner</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="text-sm font-semibold text-gray-600 hover:text-sky-500 transition-colors">
                Features
              </a>
              <a href="#why-pawtner" onClick={(e) => { e.preventDefault(); scrollToSection('why-pawtner'); }} className="text-sm font-semibold text-gray-600 hover:text-sky-500 transition-colors">
                Why Pawtner
              </a>
              <a href="#app" onClick={(e) => { e.preventDefault(); scrollToSection('app'); }} className="text-sm font-semibold text-gray-600 hover:text-sky-500 transition-colors">
                App
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {/* <Link to="/signin" className="text-sm font-semibold hover:text-sky-500 transition-colors">
                Sign In
              </Link> */}
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id='hero' className="container mx-auto px-6 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* IMPROVEMENT: Clear, benefit-oriented headline */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Manage Your Pet Business, <br />Made Simple with <span className="text-sky-500">Pawtner</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              The essential platform to manage your products, services, and customer orders. Spend less time on admin, and more time with the pets you love.
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link to="/signup">
                <Button padding="py-3 px-6">
                  Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <img src={heroImage} alt="Business Management Illustration" className="w-full h-96" />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-gray-100 py-20 sm:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Everything You Need to Get Started</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Pawtner provides the core tools to bring your business's operations into the digital age.
          </p>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-sky-100 text-sky-600 rounded-full h-12 w-12 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Product & Service Catalog</h3>
              <p className="mt-2 text-gray-600">Easily upload your products and list your services (like grooming or boarding) to create your digital storefront.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-sky-100 text-sky-600 rounded-full h-12 w-12 flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Order & Booking Tracker</h3>
              <p className="mt-2 text-gray-600">Monitor all incoming product orders and service bookings in one place. Update their status to keep customers informed.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 transition-transform duration-300 hover:-translate-y-2">
              <div className="bg-sky-100 text-sky-600 rounded-full h-12 w-12 flex items-center justify-center">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Business Profile Setup</h3>
              <p className="mt-2 text-gray-600">Manage your shop's essential information, including its name, address, and opening hours, so customers can find you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why Pet Owners Will Choose You on Pawtner */}
      <section id='why-pawtner' className="bg-white py-20 sm:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Why Pet Owners Will Love Your Shop on Pawtner</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We're building a trusted ecosystem that solves real problems for pet owners, driving them directly to your digital doorstep.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
            {/* Card 1: Emergency Access */}
            <div className="p-8">
              <div className="bg-red-100 text-red-600 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-center">Be a Hero in an Emergency</h3>
              <p className="mt-2 text-gray-600 text-center">Our app helps users instantly find verified clinics with 24/7 emergency services, making you the first choice when it matters most.</p>
            </div>
            {/* Card 2: Secure Bookings */}
            <div className="p-8">
              <div className="bg-green-100 text-green-600 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-center">Fill Your Holiday Slots</h3>
              <p className="mt-2 text-gray-600 text-center">Secure upfront payments for holiday boarding and grooming prevent no-shows and guarantee your revenue, especially during peak seasons.</p>
            </div>
            {/* Card 3: Digital Prescriptions */}
            <div className="p-8">
              <div className="bg-blue-100 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-center">Build Long-Term Trust</h3>
              <p className="mt-2 text-gray-600 text-center">Offer digital prescriptions and medication reminders directly through the app, creating loyal customers who rely on your professional care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Promotion Section (For Pet Owners) */}
      <section id='app' className="bg-gray-100 py-20 sm:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img src={mobileAppImage} alt="Illustration of a person using a mobile app" className="w-full h-96 rounded-lg" />
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-3xl font-bold">The All-in-One App for Pet Owners</h2>
              <p className="mt-4 text-lg text-gray-600">
                We drive customers to you by providing them a powerful mobile app. From finding emergency care and booking secure appointments, to managing prescriptions and reading trusted reviews, Pawtner is the go-to app for every pet parent.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                By joining us, you're not just getting a dashboard—you're getting featured in a marketplace they already love and trust.
              </p>

              <div className="mt-8">
                <p className="font-semibold text-gray-700 mb-4">Get the Pawtner app for pet owners:</p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  {/* App Store Badge */}
                  <a 
                    href="https://apps.apple.com/" // <-- LINK APP STORE
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center space-x-3 w-48 justify-center transition-transform hover:scale-105"
                  >
                    <Apple size={24}/>
                    <div>
                      <p className="text-xs -mb-1">Download on the</p>
                      <p className="text-lg font-semibold">App Store</p>
                    </div>
                  </a>
                  {/* Google Play Badge */}
                  <a 
                    href="https://play.google.com/" // <-- LINK GOOGLE PLAY
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center space-x-3 w-48 justify-center transition-transform hover:scale-105"
                  >
                    <Play size={24}/>
                    <div>
                      <p className="text-xs -mb-1">GET IT ON</p>
                      <p className="text-lg font-semibold">Google Play</p>
                    </div>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-white py-20 sm:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Section Icon */}
            <div className="mx-auto bg-sky-100 text-sky-600 rounded-full h-16 w-16 flex items-center justify-center">
              <Users className="h-8 w-8" />
            </div>
            
            {/* Section Title */}
            <h2 className="mt-6 text-3xl font-bold">
              About Pawtner
            </h2>

            {/* Section Description */}
            <p className="mt-4 text-lg text-gray-600">
              Pawtner was founded with a simple mission: to empower pet business owners with the digital tools they need to succeed. We believe that by simplifying operations, we help you focus on what you love most—caring for pets.
            </p>

            {/* Key Points/Values */}
            <div className="mt-12 grid sm:grid-cols-2 gap-8 text-left">
              <div className="p-6">
                <h3 className="text-xl font-semibold">Our Mission</h3>
                <p className="mt-2 text-gray-600">
                  To provide an intuitive, all-in-one platform that bridges the gap between pet service providers and the pet owners who need them, fostering a community built on trust and excellent care.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">Our Vision</h3>
                <p className="mt-2 text-gray-600">
                  To become the most trusted digital partner for pet businesses everywhere, driving their growth and helping them thrive in an increasingly digital world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-gray-100 py-20 sm:py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Get In Touch</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Have a question, a suggestion, or need support? Our team is ready to help you.
          </p>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            
            {/* Contact Card: Email */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-4">
              <div className="bg-sky-100 text-sky-600 rounded-full h-12 w-12 flex-shrink-0 flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email Us</h3>
                <p className="mt-1 text-gray-600">For support or inquiries.</p>
                <a href="mailto:support@pawtner.com" className="text-sky-500 font-semibold hover:underline break-all">
                  support@pawtner.com
                </a>
              </div>
            </div>

            {/* Contact Card: Phone */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-4">
              <div className="bg-sky-100 text-sky-600 rounded-full h-12 w-12 flex-shrink-0 flex items-center justify-center">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Call Us</h3>
                <p className="mt-1 text-gray-600">Mon-Fri, 9am - 5pm.</p>
                <a href="tel:+1234567890" className="text-gray-800 font-semibold">
                  (0341) 12345678
                </a>
              </div>
            </div>

            {/* Contact Card: Address */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-4">
              <div className="bg-sky-100 text-sky-600 rounded-full h-12 w-12 flex-shrink-0 flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Our Office</h3>
                <p className="mt-1 text-gray-600">
                  Jl. Topaz Nomor. 7, RT 003/RW 008, Kel. Tlogomas, Kecamatan Lowokwaru, Kota Malang - Jawa Timur 65144
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer className="bg-[#323f56] text-white">
        <div className="container mx-auto px-6 py-16">
          {/* Bagian CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold">Ready to Bring Your Business Online?</h2>
            <p className="mt-4 max-w-xl mx-auto opacity-90">
              Join Pawtner today and experience the ease of managing your business in the digital world.
            </p>
            <div className="mt-8">
              <Link to="/signup">
                <a className="inline-block bg-transparent border-2 border-white text-white font-bold text-lg py-3 px-10 rounded-lg transition-all duration-300 ease-in-out hover:bg-white hover:text-[#323f56] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#323f56] active:scale-95">
                  Sign Up Now
                </a>
              </Link>
            </div>
          </div>

          {/* Garis Pemisah */}
          <div className="mt-16 pt-10 border-t border-gray-200/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Kolom Logo & Deskripsi */}
              <div className="col-span-1 md:col-span-2 mb-8 md:mb-0 space-y-4">
                <div className="flex items-center">
                  <div className='rounded-full bg-white p-1'>
                    <img src={pawtnerLogo} alt="Pawtner Logo" className="h-8 w-auto object-cover" />
                  </div>
                  <span className="ml-3 text-xl font-bold">Pawtner</span>
                </div>
                <p className="mt-4 text-gray-400 max-w-sm">
                  The all-in-one platform for pet businesses to thrive in the digital age.
                </p>
                <div className="flex space-x-4 mt-4 sm:mt-0">
                  <a href="#" className="text-gray-400 hover:text-white"><Facebook size={20} /></a>
                  <a href="#" className="text-gray-400 hover:text-white"><Twitter size={20} /></a>
                  <a href="#" className="text-gray-400 hover:text-white"><Instagram size={20} /></a>
                </div>
              </div>
              
              {/* Kolom Tautan Company */}
              <div>
                <h4 className="font-semibold text-white">Company</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link 
                      to="/#" 
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/" 
                      className="text-gray-400 hover:text-white"
                      onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Kolom Tautan Legal */}
              <div>
                <h4 className="font-semibold text-white">Legal</h4>
                <ul className="mt-4 space-y-2">
                  <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                  <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200/20 flex flex-col sm:flex-row justify-center items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Pawtner. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage