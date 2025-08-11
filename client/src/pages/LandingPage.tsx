// import { Link } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { Button } from '../components/ui/Button'
// import { Rocket, Wand2, FileText, Github, Bot, Gauge } from 'lucide-react'

// const fadeUp = {
//   hidden: { opacity: 0, y: 24 },
//   show: { opacity: 1, y: 0 },
// }

// export function LandingPage() {
//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navbar */}
//       <header id="top" className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
//         <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
//           <Link to="/" className="flex items-center gap-2">
//             <span className="text-2xl font-bold text-blue-700">DevElevate</span>
//           </Link>
//           <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
//             <a href="#features" className="text-gray-600 hover:text-blue-700">Features</a>
//             <a href="#services" className="text-gray-600 hover:text-blue-700">Services</a>
//             <a href="#contact" className="text-gray-600 hover:text-blue-700">Contact</a>
//           </nav>
//           <div className="flex items-center gap-3">
//             <Link to="/sign-in"><Button variant="outline">Sign in</Button></Link>
//             <Link to="/sign-up"><Button>Get started</Button></Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section id="features" className="relative overflow-hidden">
//         <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 via-white to-white" />
//         <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
//             <motion.div
//               initial="hidden"
//               whileInView="show"
//               viewport={{ once: true, amount: 0.3 }}
//               transition={{ duration: 0.6, ease: 'easeOut' }}
//               variants={fadeUp}
//               className="text-center md:text-left"
//             >
//               <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
//                 Elevate your career with <span className="text-primary-700">AI</span>
//               </h1>
//               <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
//                 Build ATS-friendly resumes, generate professional portfolios from your GitHub, and craft tailored cover letters — all in minutes.
//               </p>
//               <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
//                 <Link to="/sign-up"><Button size="lg">Start free</Button></Link>
//                 <a href="#services"><Button size="lg" variant="outline">See services</Button></a>
//               </div>
//               <div className="mt-8 flex items-center justify-center md:justify-start gap-6 text-sm text-gray-500">
//                 <div className="flex items-center gap-2"><Rocket className="h-4 w-4 text-blue-600" /> Fast</div>
//                 <div className="flex items-center gap-2"><Wand2 className="h-4 w-4 text-blue-600" /> AI‑powered</div>
//                 <div className="flex items-center gap-2"><Github className="h-4 w-4 text-blue-600" /> GitHub‑ready</div>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true, amount: 0.2 }}
//               transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
//               className="relative"
//             >
//               <div className="relative mx-auto max-w-lg">
//                 <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-blue-200/50 via-blue-100/30 to-transparent blur-2xl" />
//                 <div className="relative rounded-2xl border shadow-lg bg-white p-6">
//                   <div className="h-60 md:h-72 rounded-lg bg-gradient-to-br from-primary-600 to-blue-400 flex items-center justify-center">
//                     <span className="text-white/90 font-semibold text-xl">Live Preview</span>
//                   </div>
//                   <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-gray-600">
//                     <div className="rounded-md border p-2">Resume</div>
//                     <div className="rounded-md border p-2">Portfolio</div>
//                     <div className="rounded-md border p-2">Cover Letter</div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section id="services" className="mx-auto max-w-7xl px-4 py-20">
//         <motion.div
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ staggerChildren: 0.08 }}
//           className="text-center mb-12"
//         >
//           <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-gray-900">
//             Everything you need to stand out
//           </motion.h2>
//           <motion.p variants={fadeUp} className="mt-3 text-gray-600 max-w-2xl mx-auto">
//             Powerful tools for developers to showcase experience, projects, and skills.
//           </motion.p>
//         </motion.div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[
//             { icon: FileText, title: 'Resume Parsing', desc: 'Upload PDF/DOC to extract and structure your experience.', color: 'from-blue-500 to-blue-600' },
//             { icon: Wand2, title: 'AI Enhancements', desc: 'Refine summaries, bullet points, and keywords with AI.', color: 'from-sky-500 to-sky-600' },
//             { icon: Github, title: 'Portfolio from GitHub', desc: 'Turn repositories into a beautiful developer portfolio.', color: 'from-indigo-500 to-indigo-600' },
//             { icon: Bot, title: 'Cover Letters', desc: 'Generate tailored letters for each application.', color: 'from-blue-600 to-sky-600' },
//             { icon: Gauge, title: 'ATS Score', desc: 'Check how your resume matches job descriptions.', color: 'from-cyan-500 to-blue-600' },
//             { icon: Rocket, title: 'One‑click Publish', desc: 'Publish and share your portfolio instantly.', color: 'from-blue-700 to-indigo-700' },
//           ].map((s, i) => (
//             <motion.div
//               key={s.title}
//               initial="hidden"
//               whileInView="show"
//               viewport={{ once: true, amount: 0.2 }}
//               transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.05 }}
//               variants={fadeUp}
//               className="relative group"
//             >
//               <div className={`absolute -inset-0.5 bg-gradient-to-br ${s.color} rounded-2xl opacity-0 blur transition group-hover:opacity-30`} />
//               <div className="relative h-full rounded-2xl border bg-white p-6 shadow-sm">
//                 <div className="h-12 w-12 rounded-lg bg-blue-50 text-primary-700 flex items-center justify-center">
//                   <s.icon className="h-6 w-6" />
//                 </div>
//                 <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
//                 <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <div className="mt-14 text-center">
//           <Link to="/sign-up"><Button size="lg">Get started free</Button></Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer id="contact" className="border-t bg-white">
//         <div className="mx-auto max-w-7xl px-4 py-10">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div>
//               <div className="text-xl font-bold text-primary-700">DevElevate</div>
//               <p className="mt-3 text-sm text-gray-600">AI resume & portfolio builder for developers.</p>
//             </div>
//             <div>
//               <div className="font-semibold text-gray-900">Product</div>
//               <ul className="mt-3 space-y-2 text-sm text-gray-600">
//                 <li><a href="#features" className="hover:text-primary-700">Features</a></li>
//                 <li><a href="#services" className="hover:text-primary-700">Services</a></li>
//               </ul>
//             </div>
//             <div>
//               <div className="font-semibold text-gray-900">Account</div>
//               <ul className="mt-3 space-y-2 text-sm text-gray-600">
//                 <li><Link to="/sign-in" className="hover:text-primary-700">Sign in</Link></li>
//                 <li><Link to="/sign-up" className="hover:text-primary-700">Get started</Link></li>
//               </ul>
//             </div>
//           </div>
//           <div className="mt-8 border-t pt-6 text-sm text-gray-500 flex items-center justify-between">
//             <span>© {new Date().getFullYear()} DevElevate. All rights reserved.</span>
//             <a href="#top" className="hover:text-primary-700">Back to top ↑</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }


import React, { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import {
  Rocket, Wand2, FileText, Github, Bot, Gauge,
  ArrowRight, Sparkles, Zap, Trophy, Users,
  Star, CheckCircle, Play, X
} from 'lucide-react'

// Custom Button Component
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    outline: 'border-2 border-gray-200 hover:border-blue-500 text-gray-700 hover:text-blue-600 bg-white hover:bg-blue-50',
    ghost: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
  }
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
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

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create floating geometric shapes
    const geometries = [
      new THREE.OctahedronGeometry(1),
      new THREE.IcosahedronGeometry(1),
      new THREE.TetrahedronGeometry(1),
      new THREE.BoxGeometry(1.5, 1.5, 1.5)
    ]

    const materials = [
      new THREE.MeshPhongMaterial({ 
        color: 0x3b82f6, 
        transparent: true, 
        opacity: 0.8,
        shininess: 100 
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0x8b5cf6, 
        transparent: true, 
        opacity: 0.7,
        shininess: 100 
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0x06b6d4, 
        transparent: true, 
        opacity: 0.6,
        shininess: 100 
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0xf59e0b, 
        transparent: true, 
        opacity: 0.8,
        shininess: 100 
      })
    ]

    const meshes = []
    for (let i = 0; i < 8; i++) {
      const geometry = geometries[i % geometries.length]
      const material = materials[i % materials.length]
      const mesh = new THREE.Mesh(geometry, material)
      
      mesh.position.x = (Math.random() - 0.5) * 20
      mesh.position.y = (Math.random() - 0.5) * 20
      mesh.position.z = (Math.random() - 0.5) * 20
      
      mesh.userData = {
        originalY: mesh.position.y,
        speed: 0.5 + Math.random() * 0.5,
        rotationSpeed: 0.01 + Math.random() * 0.02
      }
      
      scene.add(mesh)
      meshes.push(mesh)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight1 = new THREE.PointLight(0x3b82f6, 1, 50)
    pointLight1.position.set(10, 10, 10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1, 50)
    pointLight2.position.set(-10, -10, 10)
    scene.add(pointLight2)

    camera.position.z = 15

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      meshes.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rotationSpeed
        mesh.rotation.y += mesh.userData.rotationSpeed * 0.7
        mesh.position.y = mesh.userData.originalY + Math.sin(Date.now() * 0.001 * mesh.userData.speed) * 2
      })

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
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
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 -z-10" />
}

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!hasStarted) return
    
    let startTime = null
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration, hasStarted])

  // Trigger animation when component comes into view
  useEffect(() => {
    const timer = setTimeout(() => setHasStarted(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return <span>{count.toLocaleString()}</span>
}

export default function LandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-x-hidden">
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
          
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Services', 'Pricing', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <Link to="/sign-in">
              <Button variant="ghost" size="sm" className="text-white hover:text-blue-400 hover:bg-white/10">
                Sign in
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/20 to-black/40" />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">AI-Powered Career Tools</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black leading-tight">
              <span className="block bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                Elevate Your
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Developer Career
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Build ATS-optimized resumes, generate stunning portfolios from GitHub, 
              and craft perfect cover letters with cutting-edge AI technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/sign-up">
                <Button size="lg" className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg">
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setIsVideoOpen(true)}
                className="group border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Ready in minutes
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl opacity-20 animate-pulse" />
        <div className="absolute bottom-40 right-32 w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-30 animate-bounce" />
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-black/20 backdrop-blur-sm border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, label: 'Developers', value: 50000, suffix: '+' },
              { icon: FileText, label: 'Resumes Created', value: 125000, suffix: '+' },
              { icon: Trophy, label: 'Job Placements', value: 15000, suffix: '+' },
              { icon: Star, label: 'Success Rate', value: 94, suffix: '%' }
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-white mb-2">
                  <AnimatedCounter end={stat.value} />
                  {stat.suffix}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Supercharge Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Job Applications
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to land your dream developer job, powered by advanced AI and seamless automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: FileText, 
                title: 'Smart Resume Builder', 
                desc: 'Upload your existing resume and let AI optimize it for ATS systems and specific job requirements.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              { 
                icon: Github, 
                title: 'GitHub Portfolio Magic', 
                desc: 'Transform your repositories into a stunning, professional portfolio website in seconds.',
                gradient: 'from-purple-500 to-pink-500'
              },
              { 
                icon: Wand2, 
                title: 'AI Cover Letters', 
                desc: 'Generate personalized, compelling cover letters tailored to each job application.',
                gradient: 'from-green-500 to-teal-500'
              },
              { 
                icon: Gauge, 
                title: 'ATS Optimization', 
                desc: 'Real-time scoring and suggestions to ensure your resume passes automated screening.',
                gradient: 'from-orange-500 to-red-500'
              },
              { 
                icon: Bot, 
                title: 'Interview Prep', 
                desc: 'AI-powered mock interviews with real-time feedback and improvement suggestions.',
                gradient: 'from-indigo-500 to-blue-500'
              },
              { 
                icon: Rocket, 
                title: 'Career Analytics', 
                desc: 'Track application success rates and get insights to improve your job search strategy.',
                gradient: 'from-violet-500 to-purple-500'
              }
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group relative cursor-pointer"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-3xl blur`} />
                
                <div className="relative h-full bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 group-hover:bg-white/10 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {feature.desc}
                  </p>
                  
                  <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded mt-6 w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black mb-8">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Ready to Land Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dream Job?
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of developers who've accelerated their careers with DevElevate's AI-powered tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/sign-up">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-12 py-6 text-xl"
                >
                  Start Free Trial
                  <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>

              <a href="#cta">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-12 py-6 text-xl"
                >
                  View Pricing
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="relative bg-black/40 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  DevElevate
                </span>
              </div>
              
              <p className="text-gray-300 text-lg mb-8 max-w-md">
                The most advanced AI-powered platform for developers to build careers, 
                showcase skills, and land dream jobs.
              </p>
              
              <div className="flex gap-4">
                {['Github', 'Twitter', 'LinkedIn', 'Discord'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-gray-400 hover:text-blue-400 transition-colors">
                      {social[0]}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Product</h4>
              <ul className="space-y-4">
                {['Features', 'Pricing', 'Templates', 'API', 'Integrations'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                      <span>{item}</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4">
                {['About', 'Blog', 'Careers', 'Support', 'Privacy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                      <span>{item}</span>
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400">
              © 2025 DevElevate. All rights reserved. Built with ❤️ for developers.
            </div>
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 hover:scale-105"
            >
              <span>Back to top</span>
              <div className="animate-bounce">
                ↑
              </div>
            </button>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative bg-black rounded-2xl overflow-hidden max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 text-lg">Demo video would play here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}