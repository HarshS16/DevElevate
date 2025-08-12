import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useResumes } from '../../hooks/useResumes'
import { Button } from '../../components/ui/Button'
import { 
  ArrowLeft, Save, Eye, Sparkles, 
  User, Briefcase, GraduationCap, 
  Award, Plus, Trash2
} from 'lucide-react'

interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    year: string
  }>
  skills: string[]
}

export function ResumeBuilderPage() {
  const navigate = useNavigate()
  const { buildResume } = useResumes()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [{ title: '', company: '', duration: '', description: '' }],
    education: [{ degree: '', school: '', year: '' }],
    skills: ['']
  })

  const steps = [
    { title: 'Personal Info', icon: User },
    { title: 'Experience', icon: Briefcase },
    { title: 'Education', icon: GraduationCap },
    { title: 'Skills', icon: Award }
  ]

  const handleSave = async () => {
    try {
      setSaving(true)
      await buildResume(resumeData)
      navigate('/resumes')
    } catch (err: any) {
      alert(err.message || 'Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }))
  }

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '' }]
    }))
  }

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }))
  }

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            value={resumeData.personalInfo.name}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, name: e.target.value }
            }))}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, email: e.target.value }
            }))}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
          <input
            type="tel"
            value={resumeData.personalInfo.phone}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, phone: e.target.value }
            }))}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
          <input
            type="text"
            value={resumeData.personalInfo.location}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, location: e.target.value }
            }))}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="San Francisco, CA"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
        <textarea
          value={resumeData.personalInfo.summary}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, summary: e.target.value }
          }))}
          rows={4}
          className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief summary of your professional background and goals..."
        />
      </div>
    </div>
  )

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Work Experience</h3>
        <Button size="sm" onClick={addExperience} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>
      
      {resumeData.experience.map((exp, index) => (
        <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-white">Experience {index + 1}</h4>
            {resumeData.experience.length > 1 && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => removeExperience(index)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={exp.title}
              onChange={(e) => {
                const newExp = [...resumeData.experience]
                newExp[index].title = e.target.value
                setResumeData(prev => ({ ...prev, experience: newExp }))
              }}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Job Title"
            />
            <input
              type="text"
              value={exp.company}
              onChange={(e) => {
                const newExp = [...resumeData.experience]
                newExp[index].company = e.target.value
                setResumeData(prev => ({ ...prev, experience: newExp }))
              }}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company Name"
            />
          </div>
          
          <input
            type="text"
            value={exp.duration}
            onChange={(e) => {
              const newExp = [...resumeData.experience]
              newExp[index].duration = e.target.value
              setResumeData(prev => ({ ...prev, experience: newExp }))
            }}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Duration (e.g., Jan 2020 - Present)"
          />
          
          <textarea
            value={exp.description}
            onChange={(e) => {
              const newExp = [...resumeData.experience]
              newExp[index].description = e.target.value
              setResumeData(prev => ({ ...prev, experience: newExp }))
            }}
            rows={3}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your responsibilities and achievements..."
          />
        </div>
      ))}
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Education</h3>
        <Button size="sm" onClick={addEducation} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>
      
      {resumeData.education.map((edu, index) => (
        <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-white">Education {index + 1}</h4>
            {resumeData.education.length > 1 && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => removeEducation(index)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => {
                const newEdu = [...resumeData.education]
                newEdu[index].degree = e.target.value
                setResumeData(prev => ({ ...prev, education: newEdu }))
              }}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Degree"
            />
            <input
              type="text"
              value={edu.school}
              onChange={(e) => {
                const newEdu = [...resumeData.education]
                newEdu[index].school = e.target.value
                setResumeData(prev => ({ ...prev, education: newEdu }))
              }}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="School/University"
            />
            <input
              type="text"
              value={edu.year}
              onChange={(e) => {
                const newEdu = [...resumeData.education]
                newEdu[index].year = e.target.value
                setResumeData(prev => ({ ...prev, education: newEdu }))
              }}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Graduation Year"
            />
          </div>
        </div>
      ))}
    </div>
  )

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Skills</h3>
        <Button size="sm" onClick={addSkill} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumeData.skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => {
                const newSkills = [...resumeData.skills]
                newSkills[index] = e.target.value
                setResumeData(prev => ({ ...prev, skills: newSkills }))
              }}
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a skill"
            />
            {resumeData.skills.length > 1 && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => removeSkill(index)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo()
      case 1: return renderExperience()
      case 2: return renderEducation()
      case 3: return renderSkills()
      default: return renderPersonalInfo()
    }
  }

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/resumes">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Resume Builder
                </span>
              </h1>
              <p className="text-gray-300">Create your professional resume step by step</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              size="sm"
              loading={saving}
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Resume
            </Button>
          </div>
        </motion.div>

        {/* Step Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              
              return (
                <div key={index} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : isCompleted 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{step.title}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 bg-white/20 mx-2" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
        >
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Next
              </Button>
            ) : (
              <Button
                loading={saving}
                onClick={handleSave}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Resume
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
