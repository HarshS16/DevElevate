// import { Link } from 'react-router-dom'
// import { Button } from '../components/ui/Button'
// import { useResumes } from '../hooks/useResumes'
// import { usePortfolios } from '../hooks/usePortfolios'

// export function Dashboard() {
//   const { resumes, loading: resumesLoading } = useResumes()
//   const { portfolios, loading: portfoliosLoading } = usePortfolios()

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold">Resumes</h2>
//             <Link to="/resumes">
//               <Button size="sm">Manage</Button>
//             </Link>
//           </div>
//           <div className="text-sm text-gray-600">
//             {resumesLoading ? 'Loading...' : `${resumes.length} resumes`}
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold">Portfolios</h2>
//             <Link to="/portfolios">
//               <Button size="sm">Manage</Button>
//             </Link>
//           </div>
//           <div className="text-sm text-gray-600">
//             {portfoliosLoading ? 'Loading...' : `${portfolios.length} portfolios`}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



import React, { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  FileText, Github, Plus, Settings, TrendingUp,
  Activity, Users, Star, ArrowRight, Sparkles,
  Eye, Download, Edit3, Calendar, BarChart3,
  Zap, Trophy, Target, Clock, Upload
} from 'lucide-react'
import { useResumes } from '../hooks/useResumes'
import { usePortfolios } from '../hooks/usePortfolios'

// Custom Button Component
const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105'
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    outline: 'border-2 border-white/20 hover:border-blue-500/50 text-gray-300 hover:text-blue-400 bg-white/5 hover:bg-white/10 backdrop-blur-sm',
    ghost: 'text-gray-400 hover:text-blue-400 hover:bg-white/10',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
  }
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Floating Three.js Background
const FloatingBackground = () => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create floating particles
    const geometries = [
      new THREE.SphereGeometry(0.1),
      new THREE.OctahedronGeometry(0.15),
      new THREE.TetrahedronGeometry(0.12)
    ]

    const materials = [
      new THREE.MeshPhongMaterial({ 
        color: 0x3b82f6, 
        transparent: true, 
        opacity: 0.6,
        shininess: 100 
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0x8b5cf6, 
        transparent: true, 
        opacity: 0.5,
        shininess: 100 
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0x06b6d4, 
        transparent: true, 
        opacity: 0.4,
        shininess: 100 
      })
    ]

    const particles = []
    for (let i = 0; i < 20; i++) {
      const geometry = geometries[i % geometries.length]
      const material = materials[i % materials.length]
      const particle = new THREE.Mesh(geometry, material)
      
      particle.position.x = (Math.random() - 0.5) * 30
      particle.position.y = (Math.random() - 0.5) * 30
      particle.position.z = (Math.random() - 0.5) * 30
      
      particle.userData = {
        originalX: particle.position.x,
        originalY: particle.position.y,
        speed: 0.2 + Math.random() * 0.3,
        rotationSpeed: 0.01 + Math.random() * 0.02
      }
      
      scene.add(particle)
      particles.push(particle)
    }

    // Ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x3b82f6, 0.8, 100)
    pointLight1.position.set(10, 10, 10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.6, 80)
    pointLight2.position.set(-10, -10, 10)
    scene.add(pointLight2)

    camera.position.z = 20

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      particles.forEach((particle) => {
        particle.rotation.x += particle.userData.rotationSpeed
        particle.rotation.y += particle.userData.rotationSpeed * 0.7
        particle.position.x = particle.userData.originalX + Math.sin(Date.now() * 0.0005 * particle.userData.speed) * 3
        particle.position.y = particle.userData.originalY + Math.cos(Date.now() * 0.0007 * particle.userData.speed) * 2
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

    sceneRef.current = { scene, camera, renderer, particles }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-30" />
}

// Animated Counter
const AnimatedCounter = ({ end, duration = 1500, suffix = '' }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return <span>{count}{suffix}</span>
}

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, subtitle, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    whileHover={{ 
      scale: 1.05, 
      rotateY: 5,
      transition: { duration: 0.2 }
    }}
    className="group relative overflow-hidden"
  >
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
    
    <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 group-hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-5 h-5 text-green-400 opacity-60" />
      </div>
      
      <div className="text-2xl font-bold text-white mb-1">
        <AnimatedCounter end={value} />
      </div>
      
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div className="text-xs text-blue-300">{subtitle}</div>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
        className={`h-1 bg-gradient-to-r ${color} rounded mt-4`}
      />
    </div>
  </motion.div>
)

// Main Dashboard Component
export function Dashboard() {
  const navigate = useNavigate()

  // Debug logging for dashboard
  console.log('Dashboard component mounted')

  useEffect(() => {
    console.log('Dashboard useEffect - component fully loaded')
  }, [])

  // Real hooks for data fetching
  const { resumes, loading: resumesLoading, error: resumesError, uploadResume, buildResume } = useResumes()
  const { portfolios, loading: portfoliosLoading, error: portfoliosError, generatePortfolio } = usePortfolios()

  // State for quick actions
  const [showQuickCreate, setShowQuickCreate] = useState(false)

  // Quick action handlers
  const handleQuickCreateResume = () => {
    navigate('/resumes/new')
  }

  const handleQuickCreatePortfolio = () => {
    navigate('/portfolios/new')
  }

  const handleUploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        await uploadResume(file)
        // Show success message or redirect
      } catch (error) {
        console.error('Failed to upload resume:', error)
        // Show error message
      }
    }
  }

  const handleSettings = () => {
    navigate('/profile')
  }

  const quickStats = [
    { icon: FileText, title: 'Total Resumes', value: resumes.length, subtitle: '+2 this month', color: 'from-blue-500 to-cyan-500', delay: 0.1 },
    { icon: Github, title: 'Portfolios', value: portfolios.length, subtitle: '+1 this week', color: 'from-purple-500 to-pink-500', delay: 0.2 },
    { icon: Eye, title: 'Profile Views', value: 147, subtitle: '+23% this month', color: 'from-green-500 to-teal-500', delay: 0.3 },
    { icon: Target, title: 'Applications', value: 28, subtitle: '12 pending', color: 'from-orange-500 to-red-500', delay: 0.4 }
  ]

  const recentActivity = [
    { action: 'Resume updated', target: 'Software Engineer Resume', time: '2 hours ago', icon: Edit3 },
    { action: 'Portfolio published', target: 'React Developer Portfolio', time: '1 day ago', icon: Github },
    { action: 'Profile viewed', target: '15 new views', time: '2 days ago', icon: Eye },
    { action: 'Application sent', target: 'Google Inc.', time: '3 days ago', icon: Target }
  ]

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <FloatingBackground />

      {/* Content with top padding for fixed navbar */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 pt-8 pb-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-black mb-2"
            >
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Welcome Back
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-gray-300 text-lg"
            >
              Ready to elevate your career today?
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <Button
              size="sm"
              onClick={handleSettings}
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <div className="relative">
              <Button
                size="sm"
                onClick={() => setShowQuickCreate(!showQuickCreate)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Quick Create
              </Button>

              {/* Quick Create Dropdown */}
              {showQuickCreate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50"
                >
                  <div className="p-2">
                    <button
                      onClick={handleQuickCreateResume}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      New Resume
                    </button>
                    <button
                      onClick={handleQuickCreatePortfolio}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      New Portfolio
                    </button>
                    <label className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload Resume
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleUploadResume}
                        className="hidden"
                      />
                    </label>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumes Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Resumes</h2>
                </div>
                <Link to="/resumes">
                  <Button size="sm" variant="ghost" className="group">
                    Manage
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="text-3xl font-black text-white">
                  {resumesLoading ? (
                    <div className="animate-pulse bg-white/10 h-8 w-16 rounded" />
                  ) : (
                    <AnimatedCounter end={resumes.length} />
                  )}
                </div>
                <div className="text-sm text-gray-400">Active resumes ready to use</div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400">All optimized for ATS</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="sm"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
                  onClick={handleQuickCreateResume}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Resume
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={() => navigate('/resumes')}
                  disabled={resumes.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Latest
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Portfolios Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Portfolios</h2>
                </div>
                <Link to="/portfolios">
                  <Button size="sm" variant="ghost" className="group">
                    Manage
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="text-3xl font-black text-white">
                  {portfoliosLoading ? (
                    <div className="animate-pulse bg-white/10 h-8 w-16 rounded" />
                  ) : (
                    <AnimatedCounter end={portfolios.length} />
                  )}
                </div>
                <div className="text-sm text-gray-400">Professional portfolios live</div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-blue-400">Auto-synced with GitHub</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  size="sm"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200"
                  onClick={handleQuickCreatePortfolio}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Portfolio
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={() => navigate('/portfolios')}
                  disabled={portfolios.length === 0}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Live Sites
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-200 border border-white/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">
                        {activity.action}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {activity.target}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button variant="ghost" size="sm" className="w-full mt-4">
                View All Activity
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Quick Actions
            </h3>
            <p className="text-gray-400">
              Fast-track your career with these popular actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button variant="success" size="lg" className="group">
              <Zap className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
              Optimize Resume
            </Button>
            
            <Button variant="primary" size="lg" className="group">
              <Sparkles className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Generate Cover Letter
            </Button>
            
            <Button size="lg" className="group bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-200">
              <BarChart3 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              View Analytics
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}