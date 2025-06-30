import { useState, useEffect } from "react"
import { getPatients, addPatient, updatePatient, deletePatient } from "../../services/storageService"
import {
	Search,
	Edit,
	Trash2,
	User,
	Phone,
	Calendar,
	FileText,
	X,
	Save,
	UserPlus,
	Filter,
	Download,
	Users,
} from "lucide-react"

const PatientManagement = () => {
	const [patientList, setPatientList] = useState([])
	const [shownPatients, setShownPatients] = useState([])
	const [showAddForm, setShowAddForm] = useState(false)
	const [currentEditPatient, setCurrentEditPatient] = useState(null)
	const [searchVal, setSearchVal] = useState("")
	const [formInfo, setFormInfo] = useState({
		name: "",
		dob: "",
		contact: "",
		healthinfo: "",
	})

	useEffect(() => {
		loadAllPatients()
	}, [])

	useEffect(() => {
		filterPatientsNow()
	}, [patientList, searchVal])

	function loadAllPatients() {
		const allPatients = getPatients()
		setPatientList(allPatients)
	}

	// filter patients based on search - using manual loop instead of .filter
	const filterPatientsNow = () => {
		if (!searchVal || searchVal.trim() === "") {
			setShownPatients(patientList)
		} else {
			const filteredList = [];
			const searchLower = searchVal.toLowerCase();
			for (let i = 0; i < patientList.length; i++) {
				const patient = patientList[i];
				const nameMatch = patient.name.toLowerCase().includes(searchLower);
				const contactMatch = patient.contact.toLowerCase().includes(searchLower);
				if (nameMatch || contactMatch) {
					filteredList.push(patient);
				}
			}
			setShownPatients(filteredList);
		}
	}

	function clearForm() {
		setFormInfo({
			name: "",
			dob: "",
			contact: "",
			healthinfo: "",
		})
		setCurrentEditPatient(null)
		setShowAddForm(false)
	}

	function handleFormSubmit(e) {
		e.preventDefault()
		if (currentEditPatient) {
			// editing existing patient
			updatePatient(currentEditPatient.id, formInfo)
		} else {
			// adding new patient
			addPatient(formInfo)
		}
		clearForm()
		loadAllPatients()
	}

	function startEdit(patient) {
		setCurrentEditPatient(patient)
		setFormInfo(patient)
		setShowAddForm(true)
	}

	function confirmDelete(patientId) {
		const confirmResult = window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")
		if (confirmResult) {
			deletePatient(patientId)
			loadAllPatients()
		}
	}

	// why: calculate age from birth date - could optimize this
	function getPatientAge(birthDate) {
		const now = new Date()
		const born = new Date(birthDate)
		let yearsDiff = now.getFullYear() - born.getFullYear()
		const monthDiff = now.getMonth() - born.getMonth()
		if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < born.getDate())) {
			yearsDiff--
		}
		return yearsDiff
	}

	return (
		<div className="figma-dashboard-grid">
			{/* Header section */}
			<div className="figma-card p-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="figma-icon-primary">
							<Users className="h-6 w-6" />
						</div>
						<div>
							<h1 className="figma-h1">Patient Management</h1>
							<p className="figma-body-large text-figma-secondary">Manage patient records and medical information</p>
						</div>
					</div>
					<button onClick={() => setShowAddForm(true)} className="figma-btn-primary">
						<UserPlus className="h-4 w-4 mr-2" />
						Add New Patient
					</button>
				</div>
			</div>

			{/* Search and filter section */}
			<div className="figma-card p-6">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1">
						<div className="figma-search">
							<Search className="search-icon h-5 w-5" />
							<input
								type="text"
								placeholder="Search patients by name or contact..."
								value={searchVal}
								onChange={(e) => setSearchVal(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex gap-3">
						<button className="figma-btn-secondary">
							<Filter className="h-4 w-4 mr-2" />
							Filter
						</button>
						<button className="figma-btn-secondary">
							<Download className="h-4 w-4 mr-2" />
							Export
						</button>
					</div>
				</div>
			</div>

			{/* Stats cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="figma-stats-card">
					<div className="flex items-start justify-between mb-6">
						<div className="figma-icon-primary">
							<Users className="h-6 w-6" />
						</div>
					</div>
					<div>
						<div className="figma-h1 mb-2">{patientList.length}</div>
						<div className="figma-body text-figma-secondary">Total Patients</div>
						<div className="figma-body-small text-figma-muted mt-1">Active in system</div>
					</div>
				</div>
				<div className="figma-stats-card">
					<div className="flex items-start justify-between mb-6">
						<div className="figma-icon-success">
							<UserPlus className="h-6 w-6" />
						</div>
					</div>
					<div>
						<div className="figma-h1 mb-2">12</div>
						<div className="figma-body text-figma-secondary">New This Month</div>
						<div className="figma-body-small text-figma-muted mt-1">Recently added</div>
					</div>
				</div>
				<div className="figma-stats-card">
					<div className="flex items-start justify-between mb-6">
						<div className="figma-icon-warning">
							<Calendar className="h-6 w-6" />
						</div>
					</div>
					<div>
						<div className="figma-h1 mb-2">8</div>
						<div className="figma-body text-figma-secondary">Appointments Today</div>
						<div className="figma-body-small text-figma-muted mt-1">Scheduled visits</div>
					</div>
				</div>
				<div className="figma-stats-card">
					<div className="flex items-start justify-between mb-6">
						<div className="figma-icon-primary">
							<FileText className="h-6 w-6" />
						</div>
					</div>
					<div>
						<div className="figma-h1 mb-2">{patientList.length}</div>
						<div className="figma-body text-figma-secondary">Active Records</div>
						<div className="figma-body-small text-figma-muted mt-1">Medical files</div>
					</div>
				</div>
			</div>

			{/* Add/Edit Patient Form Modal */}
			{showAddForm && (
				<div className="figma-modal-overlay">
					<div className="figma-modal">
						<div className="figma-modal-header">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<div className="figma-icon-primary">
										<User className="h-5 w-5" />
									</div>
									<h2 className="figma-h3">{currentEditPatient ? "Edit Patient Record" : "Add New Patient"}</h2>
								</div>
								<button
									onClick={clearForm}
									className="text-figma-muted hover:text-figma-secondary p-2 rounded-lg hover:bg-figma-primary"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
						</div>
						<form onSubmit={handleFormSubmit} className="figma-modal-body space-y-6">
							<div>
								<label className="block figma-body font-medium text-figma-primary mb-2">
									<User className="h-4 w-4 inline mr-2" />
									Full Name
								</label>
								<input
									type="text"
									required
									value={formInfo.name}
									onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })}
									className="figma-input"
									placeholder="Enter patient's full name"
								/>
							</div>
							<div>
								<label className="block figma-body font-medium text-figma-primary mb-2">
									<Calendar className="h-4 w-4 inline mr-2" />
									Date of Birth
								</label>
								<input
									type="date"
									required
									value={formInfo.dob}
									onChange={(e) => setFormInfo({ ...formInfo, dob: e.target.value })}
									className="figma-input"
								/>
							</div>
							<div>
								<label className="block figma-body font-medium text-figma-primary mb-2">
									<Phone className="h-4 w-4 inline mr-2" />
									Contact Information
								</label>
								<input
									type="tel"
									required
									value={formInfo.contact}
									onChange={(e) => setFormInfo({ ...formInfo, contact: e.target.value })}
									className="figma-input"
									placeholder="Phone number or email"
								/>
							</div>
							<div>
								<label className="block figma-body font-medium text-figma-primary mb-2">
									<FileText className="h-4 w-4 inline mr-2" />
									Medical History & Notes
								</label>
								<textarea
									value={formInfo.healthinfo}
									onChange={(e) => setFormInfo({ ...formInfo, healthinfo: e.target.value })}
									className="figma-input"
									rows="4"
									placeholder="Allergies, medical conditions, medications, etc."
								/>
							</div>
							<div className="flex justify-end space-x-3 pt-4 border-t border-figma-light">
								<button type="button" onClick={clearForm} className="figma-btn-secondary">
									<X className="h-4 w-4 mr-2" />
									Cancel
								</button>
								<button type="submit" className="figma-btn-primary">
									<Save className="h-4 w-4 mr-2" />
									{currentEditPatient ? "Update Patient" : "Add Patient"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Patients Table */}
			<div className="figma-card">
				<div className="p-6 border-b border-figma-light">
					<div className="flex items-center justify-between">
						<h2 className="figma-h3">Patient Records</h2>
						<div className="figma-body-small text-figma-muted">
							Showing {shownPatients.length} of {patientList.length} patients
						</div>
					</div>
				</div>
				<div className="figma-table">
					<table className="w-full">
						<thead>
							<tr>
								<th>Patient Information</th>
								<th>Age</th>
								<th>Contact</th>
								<th>Medical Notes</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{/* old way: shownPatients.map(...) */}
							{(() => {
								let res = [];
								for (let i = 0; i < shownPatients.length; i++) {
									const patient = shownPatients[i];
									res.push(
										<tr key={patient.id}>
											<td>
												<div className="flex items-center">
													<div className="figma-icon-secondary mr-3">
														<User className="h-4 w-4" />
													</div>
													<div>
														<div className="figma-body font-semibold text-figma-primary">{patient.name}</div>
														<div className="figma-body-small text-figma-muted">DOB: {patient.dob}</div>
													</div>
												</div>
											</td>
											<td>
												<span className="figma-body font-medium text-figma-primary">{getPatientAge(patient.dob)} years</span>
											</td>
											<td>
												<div className="figma-body text-figma-primary">{patient.contact}</div>
											</td>
											<td>
												<div className="figma-body text-figma-primary max-w-xs truncate">
													{patient.healthinfo || <span className="text-figma-muted italic">No medical notes</span>}
												</div>
											</td>
											<td>
												<div className="flex items-center space-x-2">
													<button
														onClick={() => startEdit(patient)}
														className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
														title="Edit Patient"
													>
														<Edit className="h-4 w-4" />
													</button>
													<button
														onClick={() => confirmDelete(patient.id)}
														className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
														title="Delete Patient"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												</div>
											</td>
										</tr>
									)
								}
								return res;
							})()}
						</tbody>
					</table>
					{shownPatients.length === 0 && (
						<div className="text-center py-12">
							<div className="figma-icon-secondary mx-auto mb-4">
								<Users className="h-8 w-8" />
							</div>
							<div className="figma-body-large text-figma-secondary">
								{searchVal ? "No patients found matching your search" : "No patients found"}
							</div>
							<div className="figma-body-small text-figma-muted mt-1">
								{searchVal ? "Try adjusting your search terms" : "Add your first patient to get started"}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default PatientManagement
