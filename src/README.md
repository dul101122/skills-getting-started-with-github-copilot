# Mergington High School Activities API

A simple FastAPI application that allows students to view extracurricular activities, sign up, and unregister from activities.

## Features

- View all available extracurricular activities
- Sign up for activities
- Unregister participants from activities
- Run backend tests from a separate top-level `tests` directory

## Getting Started

1. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:

   ```bash
   python -m uvicorn src.app:app --reload
   ```

3. Open your browser and go to:
   - Application: http://localhost:8000/static/index.html
   - API documentation: http://localhost:8000/docs
   - Alternative documentation: http://localhost:8000/redoc

## Running Tests

Run the backend test suite from the repository root:

```bash
pytest tests -vv
```

To run all discovered tests:

```bash
pytest
```

## API Endpoints

| Method | Endpoint                                                                | Description                                                         |
| ------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| GET    | `/activities`                                                           | Get all activities with their details and current participant count |
| POST   | `/activities/{activity_name}/signup?email=student@mergington.edu`       | Sign up a student for an activity                                   |
| DELETE | `/activities/{activity_name}/participants?email=student@mergington.edu` | Remove a student from an activity                                   |

## Data Model

The application uses a simple data model with meaningful identifiers:

1. **Activities** - Uses activity name as identifier:

   - Description
   - Schedule
   - Maximum number of participants allowed
   - List of student emails who are signed up

2. **Students** - Uses email as identifier:
   - Name
   - Grade level

All data is stored in memory, which means data will be reset when the server restarts.
