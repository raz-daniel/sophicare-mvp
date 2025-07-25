.
├── .gitignore
├── client
│   ├── .DS_Store
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   └── SophieCare-logo.png
│   ├── README.md
│   ├── src
│   │   ├── .DS_Store
│   │   ├── assets
│   │   │   ├── .DS_Store
│   │   │   └── SophieCare-Full-Logo.png
│   │   ├── components
│   │   │   ├── admin
│   │   │   │   └── AdminDashboard.tsx
│   │   │   ├── App.tsx
│   │   │   ├── auth
│   │   │   │   ├── AuthPage.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── validations.ts
│   │   │   ├── layout
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── patient
│   │   │   │   └── PatientDashboard.tsx
│   │   │   ├── routing
│   │   │   │   ├── adminRoutes.tsx
│   │   │   │   ├── AppRoutes.tsx
│   │   │   │   ├── patientRoutes.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   ├── RoleChoice.tsx
│   │   │   │   └── TherapistRoutes.tsx
│   │   │   └── therapist
│   │   │       ├── calendar
│   │   │       │   ├── Calendar.tsx
│   │   │       │   └── CreateAppointmentModal.tsx
│   │   │       ├── dashboard
│   │   │       │   └── TherapistDashboard.tsx
│   │   │       ├── patients
│   │   │       │   ├── AddPatient.tsx
│   │   │       │   ├── PatientDetail.tsx
│   │   │       │   └── PatientsList.tsx
│   │   │       ├── shared
│   │   │       │   └── StarredItem.tsx
│   │   │       └── treatments
│   │   │           ├── AddTreatment.tsx
│   │   │           ├── DontForgetInsight.tsx
│   │   │           ├── sections
│   │   │           │   ├── DynamicHomeworkList.tsx
│   │   │           │   ├── DynamicInterventionsList.tsx
│   │   │           │   ├── DynamicKeyInsightsList.tsx
│   │   │           │   └── DynamicNotesList.tsx
│   │   │           └── SelectPatientForTreatment.tsx
│   │   ├── config
│   │   │   └── navigation.ts
│   │   ├── constants
│   │   │   ├── calendarDefaults.ts
│   │   │   └── routes.ts
│   │   ├── hooks
│   │   │   ├── useAppDispatch.ts
│   │   │   ├── useAppointmentForm.ts
│   │   │   ├── useAppSelector.ts
│   │   │   ├── usePatients.ts
│   │   │   ├── usePatientTreatments.ts
│   │   │   ├── useSearch.ts
│   │   │   └── useSubmitState.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── services
│   │   │   ├── auth
│   │   │   │   ├── authService.ts
│   │   │   │   ├── httpClient.ts
│   │   │   │   └── tokenService.ts
│   │   │   └── authAware
│   │   │       ├── appointmentService.ts
│   │   │       ├── openaiService.ts
│   │   │       ├── patientService.ts
│   │   │       └── treatmentService.ts
│   │   ├── store
│   │   │   ├── index.ts
│   │   │   └── slices
│   │   │       └── authSlice.ts
│   │   ├── types
│   │   │   ├── appointment.ts
│   │   │   ├── auth.ts
│   │   │   ├── patient.ts
│   │   │   └── treatment.ts
│   │   ├── utils
│   │   │   ├── patientUtils.ts
│   │   │   ├── starredItemsExtractor.ts
│   │   │   ├── stringUtils.ts
│   │   │   └── timeCalculator.ts
│   │   ├── validation
│   │   │   └── appointmentValidation.ts
│   │   └── vite-env.d.ts
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── PROJECT_TREE.md
├── README.md
└── server
    ├── .env
    ├── .env.example
    ├── .eslintrc.json
    ├── coverage
    │   ├── lcov-report
    │   │   ├── auth
    │   │   │   ├── index.html
    │   │   │   ├── loginUser.ts.html
    │   │   │   ├── refreshUserToken.ts.html
    │   │   │   └── registerUser.ts.html
    │   │   ├── base.css
    │   │   ├── block-navigation.js
    │   │   ├── config
    │   │   │   ├── config.ts.html
    │   │   │   ├── env-validator.ts.html
    │   │   │   └── index.html
    │   │   ├── controllers
    │   │   │   ├── authController.ts.html
    │   │   │   ├── index.html
    │   │   │   ├── patientController.ts.html
    │   │   │   └── treatmentController.ts.html
    │   │   ├── db
    │   │   │   ├── index.html
    │   │   │   └── mongoose.ts.html
    │   │   ├── errors
    │   │   │   ├── AppError.ts.html
    │   │   │   └── index.html
    │   │   ├── favicon.png
    │   │   ├── index.html
    │   │   ├── models
    │   │   │   ├── index.html
    │   │   │   ├── Patient.ts.html
    │   │   │   ├── Treatment.ts.html
    │   │   │   └── User.ts.html
    │   │   ├── prettify.css
    │   │   ├── prettify.js
    │   │   ├── sort-arrow-sprite.png
    │   │   ├── sorter.js
    │   │   ├── src
    │   │   │   ├── app.ts.html
    │   │   │   ├── auth
    │   │   │   │   ├── index.html
    │   │   │   │   ├── loginUser.ts.html
    │   │   │   │   ├── refreshUserToken.ts.html
    │   │   │   │   └── registerUser.ts.html
    │   │   │   ├── config
    │   │   │   │   ├── config.ts.html
    │   │   │   │   ├── env-validator.ts.html
    │   │   │   │   └── index.html
    │   │   │   ├── controllers
    │   │   │   │   ├── authController.ts.html
    │   │   │   │   └── index.html
    │   │   │   ├── db
    │   │   │   │   ├── index.html
    │   │   │   │   └── mongoose.ts.html
    │   │   │   ├── errors
    │   │   │   │   ├── AppError.ts.html
    │   │   │   │   └── index.html
    │   │   │   ├── index.html
    │   │   │   ├── middleware
    │   │   │   │   ├── auth.ts.html
    │   │   │   │   ├── error
    │   │   │   │   │   ├── error-logger.ts.html
    │   │   │   │   │   ├── error-responder.ts.html
    │   │   │   │   │   └── index.html
    │   │   │   │   ├── index.html
    │   │   │   │   ├── not-found.ts.html
    │   │   │   │   ├── rateLimiting.ts.html
    │   │   │   │   └── validation.ts.html
    │   │   │   ├── models
    │   │   │   │   ├── index.html
    │   │   │   │   └── User.ts.html
    │   │   │   ├── routes
    │   │   │   │   ├── auth.ts.html
    │   │   │   │   ├── health.ts.html
    │   │   │   │   └── index.html
    │   │   │   ├── utils
    │   │   │   │   ├── index.html
    │   │   │   │   ├── jwt.ts.html
    │   │   │   │   └── password.ts.html
    │   │   │   └── validators
    │   │   │       ├── authValidator.ts.html
    │   │   │       └── index.html
    │   │   ├── utils
    │   │   │   ├── index.html
    │   │   │   ├── jwt.ts.html
    │   │   │   └── password.ts.html
    │   │   └── validators
    │   │       ├── common.ts.html
    │   │       ├── index.html
    │   │       ├── passwordValidator.ts.html
    │   │       └── patientValidator.ts.html
    │   └── lcov.info
    ├── jest.config.js
    ├── package-lock.json
    ├── package.json
    ├── src
    │   ├── app.ts
    │   ├── auth
    │   │   ├── googleAuth.ts
    │   │   ├── loginUser.ts
    │   │   ├── refreshUserToken.ts
    │   │   ├── registerUser.ts
    │   │   └── types.ts
    │   ├── config
    │   │   ├── config.ts
    │   │   └── env-validator.ts
    │   ├── controllers
    │   │   ├── aiController.ts
    │   │   ├── appointmentController.ts
    │   │   ├── authController.ts
    │   │   ├── patientController.ts
    │   │   └── treatmentController.ts
    │   ├── db
    │   │   └── mongoose.ts
    │   ├── errors
    │   │   └── AppError.ts
    │   ├── middleware
    │   │   ├── auth.ts
    │   │   ├── error
    │   │   │   ├── error-logger.ts
    │   │   │   └── error-responder.ts
    │   │   ├── not-found.ts
    │   │   ├── rateLimiting.ts
    │   │   └── validation.ts
    │   ├── models
    │   │   ├── Appointment.ts
    │   │   ├── Patient.ts
    │   │   ├── Treatment.ts
    │   │   └── User.ts
    │   ├── routes
    │   │   ├── aiRoutes.ts
    │   │   ├── appointmentRoutes.ts
    │   │   ├── auth.ts
    │   │   ├── health.ts
    │   │   ├── nestedTreatmentRoutes.ts
    │   │   ├── patientRoutes.ts
    │   │   ├── therapistRoutes.ts
    │   │   └── treatmentRoutes.ts
    │   ├── server.ts
    │   ├── services
    │   │   └── openaiServices.ts
    │   ├── types
    │   │   ├── IConfig.ts
    │   │   ├── IError.ts
    │   │   ├── TokenPayload.ts
    │   │   └── ValidationError.ts
    │   ├── utils
    │   │   ├── googleAuth.ts
    │   │   ├── jwt.ts
    │   │   └── password.ts
    │   └── validators
    │       ├── aiValidator.ts
    │       ├── appointmentValidator.ts
    │       ├── authValidator.ts
    │       ├── common.ts
    │       ├── passwordValidator.ts
    │       ├── patientValidator.ts
    │       └── treatmentValidator.ts
    ├── test
    │   ├── app.test.ts
    │   ├── config
    │   │   └── config.test.ts
    │   ├── controllers
    │   │   ├── authController.test.ts
    │   │   ├── patientController.test.ts
    │   │   └── treatmentController.test.ts
    │   ├── middleware
    │   │   └── auth.test.ts
    │   ├── routes
    │   │   └── auth.test.ts
    │   ├── setup.ts
    │   └── utils
    │       ├── jwt.test.ts
    │       └── password.test.ts
    └── tsconfig.json

72 directories, 218 files
