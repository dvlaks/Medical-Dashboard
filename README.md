# ENTNT Dental Center Management Dashboard

A comprehensive frontend-only dental center management system built with React and Vite, featuring role-based access control, patient management, appointment scheduling, and file handling.

## 🚀 Features

### Core Functionality
- **Role-Based Access Control**: Admin (Dentist) and Patient roles with different access levels
- **Patient Management**: Full CRUD operations for patient records (Admin only)
- **Incident/Appointment Management**: Schedule, update, and track dental appointments
- **File Upload & Management**: Support for treatment files, invoices, and X-rays
- **Calendar View**: Monthly and weekly calendar views for appointment scheduling
- **Dashboard Analytics**: KPIs, revenue tracking, and patient statistics

### Admin Features
- **Patient Management**: Add, edit, delete, and view all patient records
- **Incident Management**: Manage all appointments and treatments
- **Dashboard KPIs**:
  - Total patients count
  - Next 10 upcoming appointments
  - Pending vs completed treatments
  - Total revenue from completed treatments
  - Top patients by visit frequency
  - Recent incidents overview
- **Calendar View**: Month/week views with clickable appointment scheduling
- **File Management**: Upload and manage patient files and documents

### Patient Features
- **Personal Dashboard**: View own appointments and treatment history
- **Appointment History**: See past and upcoming appointments
- **Treatment Details**: View costs, treatments, and status
- **File Access**: Download and view uploaded documents (invoices, X-rays, etc.)
- **Health Information**: Access to personal health records

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0 with JSX
- **Routing**: React Router DOM v7.6.3
- **Styling**: Tailwind CSS v4.1.11
- **Icons**: Lucide React v0.525.0
- **Build Tool**: Vite v7.0.0
- **Data Storage**: localStorage (simulated backend)
- **Date Handling**: date-fns v4.1.0

## 📋 Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main layout with navigation
│   └── FileUpload.jsx      # File upload component
├── context/
│   └── AuthContext.jsx     # Authentication context
├── pages/
│   ├── LoginPage.jsx       # Login/authentication page
│   ├── admin/
│   │   ├── AdminDashboard.jsx      # Admin dashboard with KPIs
│   │   ├── PatientManagement.jsx   # Patient CRUD operations
│   │   ├── IncidentManagement.jsx  # Appointment/incident management
│   │   └── CalendarView.jsx        # Calendar for appointment scheduling
│   └── patient/
│       └── PatientDashboard.jsx    # Patient personal dashboard
├── services/
│   └── storageService.js   # localStorage data management
├── App.jsx                 # Main app component with routing
├── main.jsx               # Entry point
└── index.css              # Tailwind CSS imports
```

## 🗃️ Data Structure

The application uses a structured JSON format stored in localStorage:

```json
{
  "users": [
    {
      "id": "1",
      "role": "Admin",
      "email": "admin@entnt.in",
      "password": "admin123"
    },
    {
      "id": "2", 
      "role": "Patient",
      "email": "john@entnt.in",
      "password": "patient123",
      "patientId": "p1"
    }
  ],
  "patients": [
    {
      "id": "p1",
      "name": "John Doe",
      "dob": "1990-05-10",
      "contact": "1234567890",
      "healthinfo": "No known allergies."
    }
  ],
  "incidents": [
    {
      "id": "i1",
      "patientId": "p1",
      "title": "Routine Checkup & Cleaning",
      "description": "Patient reported no issues. Standard biannual checkup.",
      "comments": "Performed scaling and polishing.",
      "appointmentDate": "2025-07-10T10:00:00",
      "cost": 150,
      "treatment": "Dental cleaning and fluoride treatment",
      "status": "Completed",
      "nextDate": "2025-12-10T10:00:00",
      "files": [
        {
          "name": "invoice.pdf",
          "url": "data:application/pdf;base64,..."
        }
      ]
    }
  ]
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd entnt-dental-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🔐 Default Login Credentials

### Admin Account
- **Email**: admin@entnt.in
- **Password**: admin123
- **Role**: Admin (Full access to all features)

### Patient Account
- **Email**: john@entnt.in
- **Password**: patient123
- **Role**: Patient (Limited to personal data)

## 💻 Usage

### For Admins
1. Login with admin credentials
2. Access the **Admin Dashboard** for KPIs and overview
3. Use **Patient Management** to add/edit/delete patients
4. Use **Incident Management** to schedule and manage appointments
5. Use **Calendar View** to see appointments in calendar format
6. Upload files and documents for patient records

### For Patients
1. Login with patient credentials
2. View personal dashboard with appointment history
3. Check upcoming and past appointments
4. View treatment costs and details
5. Download uploaded files (invoices, X-rays, etc.)

## 🎨 Design Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Clean UI**: Modern and intuitive interface
- **Role-Based Navigation**: Different navigation menus for different user roles
- **Interactive Calendar**: Clickable calendar with appointment visualization
- **File Preview**: Support for viewing and downloading various file types
- **Real-time Updates**: Instant updates when data changes

## 🔧 Configuration

### Customizing Data
- Modify `src/services/storageService.js` to change initial data
- Add new fields to the data structure as needed
- Update CRUD operations in the storage service

### Styling
- Tailwind CSS classes are used throughout
- Modify `src/index.css` for global styles
- Component-specific styles are inline with Tailwind

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with sidebar navigation
- **Tablet**: Optimized layout with responsive tables
- **Mobile**: Mobile-friendly interface with collapsed navigation

## 🚨 Important Notes

- **Data Persistence**: All data is stored in browser localStorage
- **File Storage**: Files are stored as base64 strings in localStorage
- **Security**: This is a frontend-only demo - passwords are stored in plain text
- **Browser Compatibility**: Requires modern browsers with localStorage support

## 🧪 Testing

To test the application:

1. **Admin Features**:
   - Login as admin
   - Add/edit/delete patients
   - Schedule appointments
   - Upload files
   - View dashboard analytics

2. **Patient Features**:
   - Login as patient
   - View personal dashboard
   - Check appointment history
   - Download files

3. **Data Persistence**:
   - Refresh the browser to verify data persistence
   - Clear localStorage to reset to initial state

## 🔄 Data Reset

To reset the application to initial state:
1. Open browser developer tools
2. Go to Application/Storage tab
3. Clear localStorage for the site
4. Refresh the page

## 📝 Future Enhancements

Potential improvements for production use:
- Integration with real backend API
- Proper authentication and security
- Email notifications for appointments
- Advanced calendar features (drag & drop)
- Report generation and printing
- Multi-language support
- Database integration
- Real-time chat/messaging

## 🤝 Contributing

This is a demonstration project for ENTNT. For any questions or improvements:
1. Follow the existing code structure
2. Maintain the localStorage data format
3. Ensure responsive design principles
4. Test on multiple screen sizes

## 📄 License

This project is created for ENTNT assessment purposes.

---

**Built with ❤️ for ENTNT Dental Center Management**
