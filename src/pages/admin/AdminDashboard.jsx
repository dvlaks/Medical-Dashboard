import { useState, useEffect } from "react"
import { getPatients, getIncidents } from "../../services/storageService"
import { DollarSign, UserPlus, Calendar, TrendingUp, MoreHorizontal, ChevronRight, Edit, Trash2 } from "lucide-react"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    newPatients: 0,
    newAppointments: 0,
    earnings: 0,
    upcomingAppointments: [],
    patientData: [],
    patientVisitData: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const patients = getPatients()
      const incidents = getIncidents()

      // Calculate stats
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      const newPatients =
        patients.filter((patient) => {
          const patientDate = new Date(patient.createdAt || Date.now())
          return patientDate.getMonth() === currentMonth && patientDate.getFullYear() === currentYear
        }).length || 1925

      const newAppointments =
        incidents.filter((incident) => {
          const appointmentDate = new Date(incident.appointmentDate)
          return appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear
        }).length || 153

      const earnings =
        incidents.filter((i) => i.status === "Completed" && i.cost).reduce((sum, incident) => sum + incident.cost, 0) ||
        23425

      // Upcoming appointments
      const upcomingAppointments = incidents
        .filter((incident) => new Date(incident.appointmentDate) > new Date() && incident.status === "Scheduled")
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 3)

      // Default appointments if none exist
      if (upcomingAppointments.length === 0) {
        upcomingAppointments.push(
          {
            id: "demo-1",
            title: "Root Canal Treatment",
            appointmentDate: "2024-07-30T14:30:00",
            patientId: "demo-patient-1",
            doctorName: "Dr. Michael Chen",
          },
          {
            id: "demo-2",
            title: "Dental Cleaning & Checkup",
            appointmentDate: "2024-07-30T16:30:00",
            patientId: "demo-patient-2",
            doctorName: "Dr. Michael Chen",
          },
        )
      }

      // Patient data
      let patientData = patients.slice(0, 4).map((patient) => {
        const patientIncidents = incidents.filter((i) => i.patientId === patient.id)
        const latestIncident = patientIncidents.sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate),
        )[0]

        return {
          id: patient.id,
          name: patient.name,
          dateIn: latestIncident ? new Date(latestIncident.appointmentDate).toLocaleDateString() : "Dec 18, 2021",
          symptoms: latestIncident ? latestIncident.title : "General Checkup",
          status: latestIncident ? latestIncident.status : "Confirmed",
        }
      })

      // Default patient data if none exist
      if (patientData.length === 0) {
        patientData = [
          {
            id: "demo-1",
            name: "Jennifer Wilson",
            dateIn: "Dec 18, 2021",
            symptoms: "Tooth Pain & Sensitivity",
            status: "Confirmed",
          },
          {
            id: "demo-2",
            name: "Robert Martinez",
            dateIn: "Dec 18, 2021",
            symptoms: "Routine Cleaning",
            status: "Scheduled",
          },
          {
            id: "demo-3",
            name: "Lisa Anderson",
            dateIn: "Dec 18, 2021",
            symptoms: "Crown Replacement",
            status: "Confirmed",
          },
          {
            id: "demo-4",
            name: "David Thompson",
            dateIn: "Dec 18, 2021",
            symptoms: "Wisdom Tooth Extraction",
            status: "Cancelled",
          },
        ]
      }

      setStats({
        totalPatients: patients.length,
        newPatients,
        newAppointments,
        earnings,
        upcomingAppointments,
        patientData,
        patientVisitData: generateChartData(),
      })
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = () => {
    return [
      { month: "Jan", visits: 120 },
      { month: "Feb", visits: 180 },
      { month: "Mar", visits: 150 },
      { month: "Apr", visits: 200 },
      { month: "May", visits: 170 },
      { month: "Jun", visits: 220 },
      { month: "Jul", visits: 190 },
      { month: "Aug", visits: 250 },
      { month: "Sep", visits: 210 },
      { month: "Oct", visits: 280 },
      { month: "Nov", visits: 240 },
      { month: "Dec", visits: 200 },
    ]
  }

  const getPatientName = (patientId) => {
    const patients = getPatients()
    const patient = patients.find((p) => p.id === patientId)
    return patient ? patient.name : "Unknown Patient"
  }

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // SVG Chart Component
  const PatientVisitChart = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => d.visits))
    const minValue = Math.min(...data.map((d) => d.visits))
    const chartWidth = 700
    const chartHeight = 280
    const padding = { top: 20, right: 40, bottom: 60, left: 60 }

    const points = data
      .map((item, index) => {
        const x = padding.left + (index * (chartWidth - padding.left - padding.right)) / (data.length - 1)
        const y =
          chartHeight -
          padding.bottom -
          ((item.visits - minValue) / (maxValue - minValue)) * (chartHeight - padding.top - padding.bottom)
        return `${x},${y}`
      })
      .join(" ")

    // Create gradient area under the line
    const areaPoints = `${padding.left},${chartHeight - padding.bottom} ${points} ${
      padding.left + (chartWidth - padding.left - padding.right)
    },${chartHeight - padding.bottom}`

    return (
      <div className="chart-container">
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 50, 100, 150, 200, 250, 300].map((value) => {
            if (value > maxValue) return null
            const y =
              chartHeight -
              padding.bottom -
              ((value - minValue) / (maxValue - minValue)) * (chartHeight - padding.top - padding.bottom)
            return (
              <g key={value}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text x={padding.left - 15} y={y + 4} fontSize="12" fill="#94a3b8" textAnchor="end">
                  {value}
                </text>
              </g>
            )
          })}

          {/* Area under the line */}
          <polygon points={areaPoints} fill="url(#chartGradient)" />

          {/* Chart line */}
          <polyline
            points={points}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = padding.left + (index * (chartWidth - padding.left - padding.right)) / (data.length - 1)
            const y =
              chartHeight -
              padding.bottom -
              ((item.visits - minValue) / (maxValue - minValue)) * (chartHeight - padding.top - padding.bottom)
            return (
              <g key={index}>
                <circle cx={x} cy={y} r="6" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" />
                <circle cx={x} cy={y} r="3" fill="#3b82f6" />
              </g>
            )
          })}

          {/* X-axis labels */}
          {data.map((item, index) => {
            const x = padding.left + (index * (chartWidth - padding.left - padding.right)) / (data.length - 1)
            return (
              <text
                key={index}
                x={x}
                y={chartHeight - padding.bottom + 25}
                fontSize="13"
                fill="#64748b"
                textAnchor="middle"
                fontWeight="500"
              >
                {item.month}
              </text>
            )
          })}
        </svg>
      </div>
    )
  }

  // Donut Chart Component
  const PatientSatisfactionChart = () => {
    const data = [
      { label: "Excellent", value: 60, color: "#3b82f6" },
      { label: "Good", value: 25, color: "#f97316" },
      { label: "Fair", value: 15, color: "#22c55e" },
    ]

    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0

    const radius = 90
    const strokeWidth = 24
    const normalizedRadius = radius - strokeWidth * 2
    const circumference = normalizedRadius * 2 * Math.PI

    return (
      <div className="satisfaction-card">
        <div className="card-header" style={{ padding: "0 0 24px 0", margin: 0 }}>
          <h3 className="card-title">Patient Satisfaction</h3>
        </div>
        <div className="satisfaction-chart">
          <svg width="240" height="240">
            <g transform="translate(120, 120)">
              {/* Background circle */}
              <circle cx="0" cy="0" r={normalizedRadius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />

              {/* Data segments */}
              {data.map((item, index) => {
                const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`
                const strokeDashoffset = (-cumulativePercentage * circumference) / total
                cumulativePercentage += item.value

                return (
                  <circle
                    key={index}
                    cx="0"
                    cy="0"
                    r={normalizedRadius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90)"
                  />
                )
              })}

              {/* Center text */}
              <text
                x="0"
                y="-8"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="32"
                fontWeight="900"
                fill="#0f172a"
              >
                4,251
              </text>
              <text x="0" y="12" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#64748b">
                Total Reviews
              </text>
            </g>
          </svg>
        </div>
        <div className="satisfaction-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="text-red-600 text-sm">{error}</div>
          <button 
            onClick={() => loadDashboardData()} 
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
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon blue">
              <DollarSign className="h-7 w-7" />
            </div>
            <div className="stat-trend">
              <TrendingUp className="h-3 w-3" />
              <span>+12%</span>
            </div>
          </div>
          <div className="stat-value">${stats.earnings.toLocaleString()}</div>
          <div className="stat-label">Monthly Revenue</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon orange">
              <UserPlus className="h-7 w-7" />
            </div>
            <div className="stat-trend">
              <TrendingUp className="h-3 w-3" />
              <span>+18%</span>
            </div>
          </div>
          <div className="stat-value">{stats.newPatients.toLocaleString()}</div>
          <div className="stat-label">New Patients</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon green">
              <Calendar className="h-7 w-7" />
            </div>
            <div className="stat-trend">
              <TrendingUp className="h-3 w-3" />
              <span>+8%</span>
            </div>
          </div>
          <div className="stat-value">{stats.newAppointments}</div>
          <div className="stat-label">Appointments</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-grid">
        {/* Left Column */}
        <div>
          {/* Patient Visit Chart */}
          <div className="chart-card">
            <div className="card-header">
              <h3 className="card-title">Patient Visits Overview</h3>
              <div className="card-controls">
                <span className="card-subtitle">Sort by</span>
                <select className="card-select">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              </div>
            </div>
            <PatientVisitChart data={stats.patientVisitData} />
          </div>

          {/* Patient Data Table */}
          <div className="table-card">
            <div className="table-header">
              <h3 className="card-title">Recent Patients</h3>
              <button className="header-btn">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date In</th>
                  <th>Treatment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.patientData.map((patient) => (
                  <tr key={patient.id}>
                    <td className="font-semibold">{patient.name}</td>
                    <td className="text-gray-500">{patient.dateIn}</td>
                    <td className="text-gray-600">{patient.symptoms}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          patient.status === "Confirmed"
                            ? "status-confirmed"
                            : patient.status === "Scheduled"
                              ? "status-incoming"
                              : "status-cancelled"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="action-btn delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Doctor Profile */}
          <div className="doctor-card">
            <h3 className="doctor-name">Dr. Michael Chen, DDS</h3>
            <div className="doctor-stats">
              <div className="doctor-stat">
                <div className="doctor-stat-value">4,250</div>
                <div className="doctor-stat-label">Appointments</div>
              </div>
              <div className="doctor-stat">
                <div className="doctor-stat-value">3.2k</div>
                <div className="doctor-stat-label">Patients</div>
              </div>
              <div className="doctor-stat">
                <div className="doctor-stat-value">4.9</div>
                <div className="doctor-stat-label">Rating</div>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="appointments-card">
            <div className="appointments-header">
              <h3 className="card-title">Today's Schedule</h3>
              <button className="header-btn">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="appointments-date">
              <div className="appointments-date-text">July 30, 2024</div>
            </div>
            {stats.upcomingAppointments.map((appointment, index) => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-content">
                  <div className="appointment-time">
                    {formatTime(appointment.appointmentDate)} -{" "}
                    {formatTime(new Date(new Date(appointment.appointmentDate).getTime() + 60 * 60 * 1000))}
                  </div>
                  <div className="appointment-title">{appointment.title}</div>
                  <div className="appointment-doctor">
                    {appointment.doctorName || `Patient: ${getPatientName(appointment.patientId)}`}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 appointment-arrow" />
              </div>
            ))}
          </div>

          {/* Patient Satisfaction */}
          <PatientSatisfactionChart />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
