import React, { useRef, useEffect, useState } from 'react'
import { SignIn, useAuth } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import {
  Sparkles, ArrowRight, User, ArrowLeft, CheckCircle
} from 'lucide-react'



// Custom Button Component
const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    outline: 'border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/10',
    social: 'bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40'
  }
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Three.js Scene Component
const ThreeScene = () => {
  const mountRef = useRef(null)
  const animationRef = useRef()

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    const geometries = [
      new THREE.OctahedronGeometry(0.8),
      new THREE.IcosahedronGeometry(0.6),
      new THREE.TetrahedronGeometry(0.7),
      new THREE.BoxGeometry(1, 1, 1)
    ]

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.4 }),
      new THREE.MeshPhongMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.3 }),
      new THREE.MeshPhongMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.3 }),
      new THREE.MeshPhongMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.4 })
    ]

    const meshes = []
    for (let i = 0; i < 6; i++) {
      const geometry = geometries[i % geometries.length]
      const material = materials[i % materials.length]
      const mesh = new THREE.Mesh(geometry, material)
      
      mesh.position.x = (Math.random() - 0.5) * 25
      mesh.position.y = (Math.random() - 0.5) * 20
      mesh.position.z = (Math.random() - 0.5) * 15
      
      mesh.userData = {
        originalY: mesh.position.y,
        originalX: mesh.position.x,
        speed: 0.3 + Math.random() * 0.3,
        rotationSpeed: 0.005 + Math.random() * 0.01
      }
      
      scene.add(mesh)
      meshes.push(mesh)
    }

    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight1 = new THREE.PointLight(0x3b82f6, 0.8, 40)
    pointLight1.position.set(8, 8, 8)
    scene.add(pointLight1)

    camera.position.z = 20

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      const time = Date.now() * 0.001

      meshes.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rotationSpeed
        mesh.rotation.y += mesh.userData.rotationSpeed * 0.7
        mesh.position.y = mesh.userData.originalY + Math.sin(time * mesh.userData.speed) * 1.5
        mesh.position.x = mesh.userData.originalX + Math.cos(time * mesh.userData.speed * 0.8) * 1
      })

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement)
        } catch (e) {
          // Handle case where element might already be removed
        }
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 -z-10" />
}

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  const [hasRedirected, setHasRedirected] = useState(false)

  // Debug logging for sign-in page
  console.log('SignInPage - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn, 'hasRedirected:', hasRedirected)

  useEffect(() => {
    console.log('SignInPage mounted - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn)

    // Only redirect if loaded, signed in, and haven't already redirected
    if (isLoaded && isSignedIn && !hasRedirected) {
      console.log('SignInPage - User is already signed in, redirecting to dashboard')
      setHasRedirected(true)

      // Add a small delay to prevent rapid redirects
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 100)
    }
  }, [isLoaded, isSignedIn, navigate, hasRedirected])

  // If user is already signed in, show loading while redirecting
  if (isLoaded && isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  // Show loading if Clerk is still loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden">
      <ThreeScene />
      
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              DevElevate
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20" />
        
        {/* Floating Elements */}
        <div className="absolute top-32 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-red-500/20 rounded-2xl animate-bounce" />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 w-full max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Secure Login</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Welcome
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Back
              </span>
            </h1>
            
            <p className="text-gray-300 text-lg">
              Sign in to continue building your career
            </p>
          </div>

          {/* Sign In Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-3xl blur opacity-50" />
            <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
              
              {/* Clerk SignIn Component with Custom Styling */}
              <div className="clerk-signin-wrapper">
                <SignIn
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: 'w-full',
                      card: 'bg-transparent shadow-none border-none p-0',
                      headerTitle: 'text-white text-xl font-semibold mb-4',
                      headerSubtitle: 'text-gray-300 text-sm mb-6',
                      socialButtonsBlockButton: 'bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40 rounded-xl py-3 px-4 transition-all duration-200',
                      socialButtonsBlockButtonText: 'text-white font-medium',
                      dividerLine: 'bg-white/20',
                      dividerText: 'text-gray-400 text-sm',
                      formFieldLabel: 'text-gray-300 text-sm font-medium mb-2',
                      formFieldInput: 'w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                      formButtonPrimary: 'w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl',
                      footerActionLink: 'text-blue-400 hover:text-blue-300 transition-colors',
                      identityPreviewText: 'text-gray-300',
                      formResendCodeLink: 'text-blue-400 hover:text-blue-300',
                      otpCodeFieldInput: 'bg-white/5 border-white/20 text-white',
                      formFieldSuccessText: 'text-green-400',
                      formFieldErrorText: 'text-red-400',
                      alertClerkError: 'text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3'
                    },
                    layout: {
                      socialButtonsPlacement: 'top'
                    }
                  }}
                />
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/sign-up" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors group">
                    Sign up
                    <ArrowRight className="inline w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Sparkles, label: 'AI-Powered' },
              { icon: CheckCircle, label: 'ATS-Ready' },
              { icon: ArrowRight, label: 'Fast Setup' }
            ].map((feature) => (
              <div 
                key={feature.label}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <feature.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <span className="text-xs text-gray-300 font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side Content (Hidden on Mobile) */}
        <div className="hidden lg:block absolute left-12 top-1/2 transform -translate-y-1/2 max-w-md">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white/90">
              Join 50,000+ developers
            </h2>
            <div className="space-y-4">
              {[
                'Build ATS-optimized resumes in minutes',
                'Generate portfolios from GitHub automatically',
                'Get hired 3x faster with AI assistance'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Testimonial (Hidden on Mobile) */}
        <div className="hidden lg:block absolute right-12 top-1/2 transform -translate-y-1/2 max-w-sm">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
              ))}
            </div>
            <blockquote className="text-gray-300 mb-4 italic">
              "DevElevate helped me land my dream job at a FAANG company. The AI resume optimization was incredible!"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Sarah Chen</div>
                <div className="text-sm text-gray-400">Software Engineer @ Meta</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-xl border-t border-white/10 py-4 z-40">
        <div className="max-w-4xl mx-auto px-6 flex justify-center items-center gap-8 text-sm">
          <div className="flex items-center gap-2 text-gray-300">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>50,000+ users</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span>94% success rate</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span>Trusted by developers</span>
          </div>
        </div>
      </div>
    </div>
  )
}