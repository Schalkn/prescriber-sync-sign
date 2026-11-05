# Prescriber Sync & Sign

A web application prototype for managing digital prescription workflows, including doctor authentication, patient management, prescription creation, product selection, verification, signature capture and document generation.

The project was developed as a practical application prototype using a modern TypeScript/React stack.

---

## Overview

Prescriber Sync & Sign provides a browser-based workflow for healthcare practitioners to manage prescription-related activities digitally.

The application includes functionality for:

- doctor login and session handling
- patient management
- prescription creation and management
- product selection
- SMS OTP verification
- digital signature capture
- PDF generation
- email-related workflow integration
- supporting service/API integration

The project demonstrates how multiple front-end components and service layers can be combined into a coherent application workflow.

---

## Technology Stack

The application uses:

- TypeScript
- React
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack React Query
- React Router
- REST-style service integration
- client-side form and state management

The project was initially developed using Lovable as an AI-assisted development environment, with the resulting application maintained as a standard GitHub codebase.

---

## Application Structure

The solution is organised into separate presentation, service and supporting layers.

### User Interface

Key components include:

- practitioner login
- patient management
- prescription management
- product selection
- OTP verification
- signature capture
- reusable UI components

### Services

The application contains dedicated service modules for areas including:

- authentication
- patient data
- prescriptions
- products
- OTP processing
- email
- PDF generation
- API communication
- Xero-related integration

This separation keeps business and integration logic distinct from the user-interface components.

---

## Key Features

### Practitioner Access

The application provides a practitioner login workflow and maintains the authenticated practitioner context throughout the application session.

### Patient Management

Patient information can be managed through a dedicated patient-management interface and supporting service layer.

### Prescription Management

Practitioners can build and manage prescriptions through a structured workflow combining patient, practitioner and product information.

### Product Selection

A dedicated product-selection component supports the prescription creation process.

### Verification

The application includes an SMS OTP verification component to support identity or action verification within the workflow.

### Digital Signature Capture

Practitioner signatures can be captured digitally as part of the prescription workflow.

### PDF Generation

The application includes a dedicated PDF service for generating prescription-related documents.

### Integration Services

The architecture includes separate modules for API communication, email processing and Xero-related integration.

---

## Architecture

At a high level:

```text
User
 |
 v
React / TypeScript UI
 |
 +---- Authentication
 |
 +---- Patient Management
 |
 +---- Prescription Management
 |
 +---- Product Selection
 |
 +---- OTP Verification
 |
 +---- Signature Capture
 |
 v
Application Service Layer
 |
 +---- API Services
 +---- Patient Services
 +---- Prescription Services
 +---- Product Services
 +---- Email Services
 +---- PDF Services
 +---- External Integrations
```

The project uses a component-based front end with dedicated service modules to separate user-interface concerns from application and integration logic.

---

## What This Project Demonstrates

The project demonstrates practical experience with:

- modern React and TypeScript development
- component-based application design
- user authentication flows
- data-driven user interfaces
- service-layer architecture
- API integration
- workflow design
- OTP-based verification
- digital signature capture
- PDF document generation
- third-party integration
- AI-assisted software development

---

## Development Approach

The project was developed using **Lovable** as an AI-assisted development tool.

AI tooling was used to accelerate implementation while the application structure, requirements, workflow and resulting solution remained subject to human direction and review.

The repository therefore also reflects practical experience using modern AI-assisted development tools as part of a software-engineering workflow.

---

## Purpose of This Repository

This repository is retained as a technical portfolio project demonstrating hands-on development with a modern web stack and the integration of multiple application services into an end-to-end workflow.

It is not presented as a production healthcare system, and production deployment would require additional consideration of areas such as security, privacy, regulatory compliance, auditability and operational controls.

---

## About Me

I am a technology leader, solution architect and developer with experience spanning software development, cloud, APIs, databases, product management, cybersecurity and enterprise customer technology.

My technical background includes C#/.NET, ASP.NET, SQL Server, PostgreSQL, REST and GraphQL APIs, AWS, Microsoft Azure and solution/integration architecture.

I continue to work hands-on with software, databases and APIs alongside senior technology leadership.
