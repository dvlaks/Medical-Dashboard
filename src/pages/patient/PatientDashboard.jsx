import { useState, useEffect } from "react"
import { getIncidents, getPatients } from "../../services/storageService"
import { useAuth } from "../../context/AuthContext"
import {
  User,
  Calendar,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  FileText,
  Download,
  Heart,
  Activity,
  Stethoscope,
  CalendarDays,
  Timer,
  CreditCard,
  TrendingUp,
} from "lucide-react"

const PatientDashboard = () => {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [patientInfo, setPatientInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPatientData()
  }, [user])

  const loadPatientData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user) return

      // Get patient info
      const patients = getPatients()
      const patient = patients.find((p) => p.id === user.patientId)
      setPatientInfo(patient)

      // Get patient's incidents
      const allIncidents = getIncidents()
      const patientIncidents = allIncidents.filter((incident) => incident.patientId === patient?.id)
      setIncidents(patientIncidents)
    } catch (err) {
      setError('Failed to load patient data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Scheduled":
        return "patient-status-badge patient-status-scheduled"
      case "Completed":
        return "patient-status-badge patient-status-completed"
      case "Cancelled":
        return "patient-status-badge patient-status-cancelled"
      case "In Progress":
        return "patient-status-badge patient-status-progress"
      default:
        return "patient-status-badge patient-status-progress"
    }
  }

  const upcomingIncidents = incidents.filter(
    (incident) => new Date(incident.appointmentDate) >= new Date() && incident.status === "Scheduled",
  )

  const pastIncidents = incidents.filter(
    (incident) => new Date(incident.appointmentDate) < new Date() || incident.status === "Completed",
  )

  const totalCost = incidents
    .filter((incident) => incident.status === "Completed" && incident.cost)
    .reduce((sum, incident) => sum + incident.cost, 0)

  const StatCard = ({ title, value, icon: Icon, iconBg, subtitle, trend }) => (
    <div className="stat-card">
      <div className="stat-header">
        <div className={`stat-icon ${iconBg}`}>
          <Icon className="h-7 w-7" />
        </div>
        {trend && (
          <div className="stat-trend">
            <TrendingUp className="h-3 w-3" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-600">Loading your dashboard...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="text-red-600 text-sm">{error}</div>
          <button 
            onClick={() => loadPatientData()} 
            className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-grid">
      <div className="hero-section">
        <div className="patient-welcome">
          <div className="patient-info">
            <div className="patient-avatar">
              <User className="h-8 w-8" />
            </div>
            <div className="patient-details">
              <h1>Welcome back, {user?.name || "Patient"}</h1>
              <p>ENTNT Dental Patient Portal</p>
            </div>
          </div>
          <div className="patient-status">
            <div className="status-dot"></div>
            <span className="text-sm font-medium text-green-700">Active Patient</span>
          </div>
        </div>
      </div>

      {/* Patient Information Card */}
      {patientInfo && (
        <div className="medical-info-card">
          <div className="medical-info-header">
            <div className="flex items-center gap-3">
              <div className="stat-icon blue">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="card-title">My Medical Information</h2>
            </div>
            <button className="header-btn">
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div className="medical-info-content">
            <div className="info-grid">
              <div className="info-field">
                <div className="info-label">
                  <User className="h-4 w-4" />
                  Full Name
                </div>
                <div className="info-value">{patientInfo.name}</div>
              </div>
              <div className="info-field">
                <div className="info-label">
                  <Phone className="h-4 w-4" />
                  Contact
                </div>
                <div className="info-value">{patientInfo.contact}</div>
              </div>
              <div className="info-field">
                <div className="info-label">
                  <Calendar className="h-4 w-4" />
                  Date of Birth
                </div>
                <div className="info-value">{patientInfo.dob}</div>
              </div>
              {patientInfo.healthinfo && (
                <div className="medical-notes">
                  <div className="info-label">
                    <Heart className="h-4 w-4" />
                    Medical History & Notes
                  </div>
                  <div className="info-value">{patientInfo.healthinfo}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingIncidents.length}
          icon={Timer}
          iconBg="orange"
          subtitle="Scheduled visits"
          trend="+12%"
        />
        <StatCard
          title="Total Appointments"
          value={incidents.length}
          icon={CalendarDays}
          iconBg="blue"
          subtitle="All time"
          trend="+8%"
        />
        <StatCard
          title="Completed Visits"
          value={pastIncidents.length}
          icon={CheckCircle}
          iconBg="green"
          subtitle="Treatment history"
          trend="+15%"
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalCost.toFixed(2)}`}
          icon={CreditCard}
          iconBg="blue"
          subtitle="Medical costs"
          trend="+5%"
        />
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Column */}
        <div>
          {/* Upcoming Appointments */}
          <div className="chart-card">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="stat-icon blue">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <h3 className="card-title">Upcoming Appointments</h3>
              </div>
            </div>
            <div style={{ padding: "0 32px 32px" }}>
              {upcomingIncidents.length > 0 ? (
                <div className="space-y-6">
                  {upcomingIncidents.map((incident) => (
                    <div key={incident.id} className="appointment-card">
                      <div className="appointment-header">
                        <div className="appointment-info">
                          <div className="appointment-icon">
                            <Stethoscope className="h-5 w-5" />
                          </div>
                          <div className="appointment-details">
                            <h4>{incident.title}</h4>
                            <p className="appointment-time">{formatDateTime(incident.appointmentDate)}</p>
                          </div>
                        </div>
                        <span className={getStatusBadge(incident.status)}>{incident.status}</span>
                      </div>
                      {incident.description && <p className="appointment-description">{incident.description}</p>}
                      <div className="appointment-meta">
                        {incident.comments && (
                          <div className="meta-item">
                            <div className="meta-label">Notes</div>
                            <div className="meta-value">{incident.comments}</div>
                          </div>
                        )}
                        {incident.cost && (
                          <div className="meta-item">
                            <div className="meta-label">Estimated Cost</div>
                            <div className="meta-value cost-value">${incident.cost}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Calendar className="h-8 w-8" />
                  </div>
                  <div className="empty-title">No upcoming appointments</div>
                  <div className="empty-subtitle">Contact ENTNT Dental to schedule your next visit</div>
                </div>
              )}
            </div>
          </div>

          {/* Medical History */}
          <div className="chart-card" style={{ marginTop: "36px" }}>
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="stat-icon green">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="card-title">Treatment History</h3>
              </div>
              <button className="header-btn">
                <Download className="h-5 w-5" />
              </button>
            </div>
            <div style={{ padding: "0 32px 32px" }}>
              {pastIncidents.length > 0 ? (
                <div className="space-y-6">
                  {pastIncidents.slice(0, 5).map((incident) => (
                    <div key={incident.id} className="appointment-card">
                      <div className="appointment-header">
                        <div className="appointment-info">
                          <div className="appointment-icon">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div className="appointment-details">
                            <h4>{incident.title}</h4>
                            <p className="appointment-time">{formatDateTime(incident.appointmentDate)}</p>
                          </div>
                        </div>
                        <span className={getStatusBadge(incident.status)}>{incident.status}</span>
                      </div>

                      {incident.description && <p className="appointment-description">{incident.description}</p>}

                      <div className="appointment-meta">
                        {incident.treatment && (
                          <div className="meta-item">
                            <div className="meta-label">Treatment</div>
                            <div className="meta-value">{incident.treatment}</div>
                          </div>
                        )}
                        {incident.cost && (
                          <div className="meta-item">
                            <div className="meta-label">Cost</div>
                            <div className="meta-value cost-value">${incident.cost}</div>
                          </div>
                        )}
                      </div>

                      {/* File Attachments */}
                      {incident.files && incident.files.length > 0 && (
                        <div className="file-attachments">
                          <div className="meta-label">Medical Records</div>
                          <div className="file-grid">
                            {incident.files.map((file, index) => (
                              <div key={index} className="file-item">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span>{file.name}</span>
                                {file.url && <Download className="h-3 w-3 file-download" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Next Appointment */}
                      {incident.nextDate && (
                        <div className="followup-notice">
                          <p>
                            <strong>Follow-up Scheduled:</strong> {formatDateTime(incident.nextDate)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Activity className="h-8 w-8" />
                  </div>
                  <div className="empty-title">No treatment history available</div>
                  <div className="empty-subtitle">Your dental care history will appear here</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Doctor Information */}
          <div className="doctor-card">
            <h3 className="doctor-name">Dr. Michael Chen, DDS</h3>
            <div className="doctor-stats">
              <div className="doctor-stat">
                <div className="doctor-stat-value">24/7</div>
                <div className="doctor-stat-label">Emergency Care</div>
              </div>
              <div className="doctor-stat">
                <div className="doctor-stat-value">15+</div>
                <div className="doctor-stat-label">Years Experience</div>
              </div>
              <div className="doctor-stat">
                <div className="doctor-stat-value">4.9</div>
                <div className="doctor-stat-label">Patient Rating</div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="contact-card" style={{ marginTop: "28px" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="stat-icon blue">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="card-title">Contact ENTNT Dental</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Need to schedule an appointment or have questions about your dental treatment? Dr. Michael Chen and the
              ENTNT Dental team are here to help.
            </p>
            <div className="contact-grid">
              <div className="contact-item">
                <div className="contact-icon">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="contact-details">
                  <p>Phone</p>
                  <p>(555) ENTNT-01</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="contact-details">
                  <p>Email</p>
                  <p>info@entntdental.com</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="contact-details">
                  <p>Hours</p>
                  <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
