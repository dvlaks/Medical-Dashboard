// Storage service for patient and incident data management
// Simple localStorage-based data management
const myInitialData = {
	users: [
		{ id: "1", role: "Admin", email: "admin@entnt.in", password: "admin123" },
		{ id: "2", role: "Patient", email: "john@entnt.in", password: "patient123", patientId: "p1" }
	],
	patients: [
		{
			id: "p1",
			name: "John Doe",
			dob: "1990-05-10",
			contact: "1234567890",
			healthinfo: "No known allergies."
		},
		{
			id: "p2", 
			name: "Jane Smith",
			dob: "1985-08-22",
			contact: "0987654321",
			healthinfo: "Allergic to penicillin."
		}
	],
	incidents: [
		{
			id: "i1",
			patientId: "p1",
			title: "Routine Checkup & Cleaning",
			description: "Patient reported no issues. Standard biannual checkup.",
			comments: "Performed scaling and polishing.",
			appointmentDate: "2025-07-10T10:00:00",
			cost: 150,
			treatment: "Dental cleaning and fluoride treatment", 
			status: "Completed",
			nextDate: "2025-12-10T10:00:00",
			files: [
				{"name": "invoice.pdf", "url": "data:application/pdf;base64,sample-invoice-data"},
				{"name": "before_cleaning.jpg", "url": "data:image/jpeg;base64,sample-image-data"}
			]
		},
		{
			id: "i2",
			patientId: "p2",
			title: "Wisdom Tooth Pain", 
			description: "Patient complains of severe pain in the lower right jaw.",
			comments: "Initial consultation. Recommended extraction.",
			appointmentDate: "2025-07-12T14:30:00",
			cost: null,
			treatment: null,
			status: "Scheduled",
			nextDate: null,
			files: []
		},
		{
			id: "i3",
			patientId: "p1", 
			title: "Toothache",
			description: "Upper molar pain",
			comments: "Sensitive to cold",
			appointmentDate: "2025-07-01T10:00:00",
			cost: 80,
			treatment: "Root canal therapy",
			status: "Completed", 
			nextDate: "2025-08-01T10:00:00",
			files: [
				{"name": "invoice.pdf", "url": "data:application/pdf;base64,sample-invoice-data"},
				{"name": "xray.png", "url": "data:image/png;base64,sample-xray-data"}
			]
		}
	]
};

// initialize the data if it's the first time
export const setupMyData = () => {
	const existingData = localStorage.getItem('myDentalApp');
	if (!existingData) {
		localStorage.setItem('myDentalApp', JSON.stringify(myInitialData));
	}
};

// grab the data from localStorage
export const getMyData = () => {
	const dataStr = localStorage.getItem('myDentalApp');
	return JSON.parse(dataStr);
};

// save the data back to localStorage
export const saveMyData = (data) => {
	localStorage.setItem('myDentalApp', JSON.stringify(data));
};

// get all patients
export const getPatients = () => {
	const allData = getMyData();
	return allData.patients || [];
};

export const addPatient = (patient) => {
	const data = getMyData();
	const newPatient = { ...patient, id: 'p' + Date.now() };
	data.patients.push(newPatient);
	saveMyData(data);
	return newPatient;
};

export const updatePatient = (id, patient) => {
	const data = getMyData();
	let foundIdx = -1;
	
	// find the patient manually instead of using findIndex
	for (let i = 0; i < data.patients.length; i++) {
		if (data.patients[i].id === id) {
			foundIdx = i;
			break;
		}
	}
	if (foundIdx >= 0) {
		data.patients[foundIdx] = { ...data.patients[foundIdx], ...patient };
		saveMyData(data);
		return data.patients[foundIdx];
	}
	return null;
};

export const deletePatient = (id) => {
	const data = getMyData();
	
	// remove patient using loop instead of filter
	const newPatients = [];
	for (let i = 0; i < data.patients.length; i++) {
		if (data.patients[i].id !== id) {
			newPatients.push(data.patients[i]);
		}
	}
	data.patients = newPatients;
	// also remove related incidents
	const newIncidents = [];
	for (let j = 0; j < data.incidents.length; j++) {
		if (data.incidents[j].patientId !== id) {
			newIncidents.push(data.incidents[j]);
		}
	}
	data.incidents = newIncidents;
	saveMyData(data);
};

// incident/appointment related functions
export const getIncidents = () => {
	const data = getMyData();
	return data.incidents || [];
};

export const addIncident = (incident) => {
	const data = getMyData();
	const newIncident = { 
		...incident, 
		id: 'i' + Date.now(), 
		files: incident.files || [] 
	};
	// old way: data.incidents = [...data.incidents, newIncident]
	data.incidents.push(newIncident);
	saveMyData(data);
	return newIncident;
};

export const updateIncident = (id, incident) => {
	const data = getMyData();
	let idx = -1;
	// manually find the incident (could use .findIndex but nah)
	for (let i = 0; i < data.incidents.length; i++) {
		if (data.incidents[i].id === id) {
			idx = i;
			break;
		}
	}
	if (idx >= 0) {
		data.incidents[idx] = { ...data.incidents[idx], ...incident };
		saveMyData(data);
		return data.incidents[idx];
	}
	return null;
};

export const deleteIncident = (id) => {
	const data = getMyData();
	// remove using manual loop (not filter)
	const filteredIncidents = [];
	for (let i = 0; i < data.incidents.length; i++) {
		if (data.incidents[i].id !== id) {
			filteredIncidents.push(data.incidents[i]);
		}
	}
	data.incidents = filteredIncidents;
	saveMyData(data);
};

