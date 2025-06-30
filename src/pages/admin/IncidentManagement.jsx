import React, { useState, useEffect } from 'react';
import { getIncidents, addIncident, updateIncident, deleteIncident, getPatients } from '../../services/storageService';
import FileUpload from '../../components/FileUpload';

const IncidentManagement = () => {
	const [incidentsList, setIncidentsList] = useState([]);
	const [allPatients, setAllPatients] = useState([]);
	const [displayForm, setDisplayForm] = useState(false);
	const [currentIncidentEdit, setCurrentIncidentEdit] = useState(null);
	const [inputData, setInputData] = useState({
		patientId: '',
		title: '',
		description: '',
		comments: '',
		appointmentDate: '',
		cost: '',
		treatment: '',
		status: 'Scheduled',
		nextDate: '',
		files: []
	});

	useEffect(() => {
		getIncidentsData();
		getPatientsData();
	}, []);

	const getIncidentsData = () => {
		const data = getIncidents();
		setIncidentsList(data);
	};

	const getPatientsData = () => {
		const patientData = getPatients();
		setAllPatients(patientData);
	};

	const submitForm = (e) => {
		e.preventDefault();
		
		const dataToSubmit = {
			...inputData,
			cost: inputData.cost ? parseFloat(inputData.cost) : null,
			nextDate: inputData.nextDate || null
		};

		if (currentIncidentEdit) {
			// update existing incident
			updateIncident(currentIncidentEdit.id, dataToSubmit);
		} else {
			// create new incident
			addIncident(dataToSubmit);
		}
		
		clearTheForm();
		getIncidentsData();
	};

	const startEditingIncident = (incident) => {
		setCurrentIncidentEdit(incident);
		
		// Format the date time inputs
		let aptDate = incident.appointmentDate;
		if (aptDate.includes('T')) {
			aptDate = aptDate.split('T')[0] + 'T' + aptDate.split('T')[1].slice(0, 5);
		}
		
		let nextApptDate = '';
		if (incident.nextDate) {
			nextApptDate = incident.nextDate;
			if (nextApptDate.includes('T')) {
				nextApptDate = nextApptDate.split('T')[0] + 'T' + nextApptDate.split('T')[1].slice(0, 5);
			}
		}

		setInputData({
			...incident,
			appointmentDate: aptDate,
			nextDate: nextApptDate,
			cost: incident.cost || ''
		});
		setDisplayForm(true);
	};

	const confirmDeleteIncident = (incidentId) => {
		const shouldDelete = window.confirm('Are you sure you want to delete this incident?');
		if (shouldDelete) {
			deleteIncident(incidentId);
			getIncidentsData();
		}
	};

	const clearTheForm = () => {
		setInputData({
			patientId: '',
			title: '',
			description: '',
			comments: '',
			appointmentDate: '',
			cost: '',
			treatment: '',
			status: 'Scheduled',
			nextDate: '',
			files: []
		});
		setCurrentIncidentEdit(null);
		setDisplayForm(false);
	};

	const handleFileUpload = (fileData) => {
		setInputData(prev => ({
			...prev,
			files: [...prev.files, fileData]
		}));
	};

	const removeFileFromList = (fileIndex) => {
		// remove file using manual method instead of filter
		const newFilesList = [];
		for (let i = 0; i < inputData.files.length; i++) {
			if (i !== fileIndex) {
				newFilesList.push(inputData.files[i]);
			}
		}
		
		setInputData(prev => ({
			...prev,
			files: newFilesList
		}));
	};

	const findPatientName = (patientId) => {
		// find patient name manually instead of using .find()
		let patientName = 'Unknown Patient';
		for (let i = 0; i < allPatients.length; i++) {
			if (allPatients[i].id === patientId) {
				patientName = allPatients[i].name;
				break;
			}
		}
		return patientName;
	};

	const formatDateTimeForDisplay = (dateTimeString) => {
		const dt = new Date(dateTimeString);
		return dt.toLocaleString();
	};

	// determine status color - could put this in a constants file
	const getStatusBadgeColor = (status) => {
		if (status === 'Scheduled') {
			return 'bg-yellow-100 text-yellow-800';
		} else if (status === 'Completed') {
			return 'bg-green-100 text-green-800';
		} else if (status === 'Cancelled') {
			return 'bg-red-100 text-red-800';
		} else if (status === 'In Progress') {
			return 'bg-blue-100 text-blue-800';
		} else {
			return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Incident Management</h1>
					<p className="text-gray-600">Manage patient dental appointments and incidents</p>
				</div>
				<button
					onClick={() => setDisplayForm(true)}
					className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
				>
					Add New Incident
				</button>
			</div>

			{/* Form Modal for adding/editing incidents */}
			{displayForm && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
						<div className="px-6 py-4 border-b">
							<h2 className="text-lg font-medium">
								{currentIncidentEdit ? 'Edit Incident' : 'Add New Incident'}
							</h2>
						</div>
						
						<form onSubmit={submitForm} className="px-6 py-4 space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Patient</label>
									<select
										required
										value={inputData.patientId}
										onChange={(e) => setInputData({...inputData, patientId: e.target.value})}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									>
										<option value="">Select a patient</option>
										{allPatients.map((patient) => (
											<option key={patient.id} value={patient.id}>
												{patient.name}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Status</label>
									<select
										value={inputData.status}
										onChange={(e) => setInputData({...inputData, status: e.target.value})}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									>
										<option value="Scheduled">Scheduled</option>
										<option value="In Progress">In Progress</option>
										<option value="Completed">Completed</option>
										<option value="Cancelled">Cancelled</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Title</label>
								<input
									type="text"
									required
									value={inputData.title}
									onChange={(e) => setInputData({...inputData, title: e.target.value})}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="e.g., Toothache, Routine Checkup"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Description</label>
								<textarea
									required
									value={inputData.description}
									onChange={(e) => setInputData({...inputData, description: e.target.value})}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									rows="3"
									placeholder="Detailed description of the patient's condition"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Comments</label>
								<textarea
									value={inputData.comments}
									onChange={(e) => setInputData({...inputData, comments: e.target.value})}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									rows="2"
									placeholder="Additional notes or observations"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Appointment Date & Time</label>
									<input
										type="datetime-local"
										required
										value={inputData.appointmentDate}
										onChange={(e) => setInputData({...inputData, appointmentDate: e.target.value})}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Next Appointment Date (Optional)</label>
									<input
										type="datetime-local"
										value={inputData.nextDate}
										onChange={(e) => setInputData({...inputData, nextDate: e.target.value})}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Cost</label>
									<input
										type="number"
										step="0.01"
										value={inputData.cost}
										onChange={(e) => setInputData({...inputData, cost: e.target.value})}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										placeholder="0.00"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Treatment</label>
									<input
										type="text"
										value={inputData.treatment}
										onChange={(e) => setInputData({...inputData, treatment: e.target.value})}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										placeholder="Treatment provided"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Files (Invoices, X-rays, etc.)</label>
								<FileUpload onFileUpload={handleFileUpload} />
								
								{inputData.files && inputData.files.length > 0 && (
									<div className="mt-2 space-y-2">
										<p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
										{inputData.files.map((file, index) => (
											<div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
												<span className="text-sm text-gray-700">{file.name}</span>
												<button
													type="button"
													onClick={() => removeFileFromList(index)}
													className="text-red-600 hover:text-red-800 text-sm"
												>
													Remove
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="flex justify-end space-x-3 pt-4">
								<button
									type="button"
									onClick={clearTheForm}
									className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
								>
									{currentIncidentEdit ? 'Update' : 'Add'} Incident
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* List of all incidents */}
			<div className="bg-white rounded-lg shadow">
				<div className="px-6 py-4 border-b">
					<h2 className="text-lg font-medium">Incidents & Appointments</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Patient & Title
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Appointment
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Cost & Treatment
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Files
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{incidentsList.map((incident) => (
								<tr key={incident.id}>
									<td className="px-6 py-4">
										<div className="text-sm font-medium text-gray-900">{findPatientName(incident.patientId)}</div>
										<div className="text-sm text-gray-600">{incident.title}</div>
										<div className="text-xs text-gray-500 mt-1">{incident.description}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{formatDateTimeForDisplay(incident.appointmentDate)}</div>
										{incident.nextDate && (
											<div className="text-xs text-gray-500">Next: {formatDateTimeForDisplay(incident.nextDate)}</div>
										)}
									</td>
									<td className="px-6 py-4">
										<div className="text-sm text-gray-900">
											{incident.cost ? `$${incident.cost}` : 'Not set'}
										</div>
										<div className="text-xs text-gray-500">{incident.treatment || 'No treatment recorded'}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(incident.status)}`}>
											{incident.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">
											{incident.files && incident.files.length > 0 ? `${incident.files.length} file(s)` : 'No files'}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button
											onClick={() => startEditingIncident(incident)}
											className="text-blue-600 hover:text-blue-900 mr-3"
										>
											Edit
										</button>
										<button
											onClick={() => confirmDeleteIncident(incident.id)}
											className="text-red-600 hover:text-red-900"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{incidentsList.length === 0 && (
						<div className="text-center py-4 text-gray-500">
							No incidents recorded. Add your first incident to get started.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default IncidentManagement;
