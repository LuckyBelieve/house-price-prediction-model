# House Price Prediction API

This FastAPI application provides a machine learning model to predict house prices based on various property features.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

## API Endpoints

- `GET /`: Basic info endpoint
- `POST /predict`: Make a house price prediction
- `GET /historical-data`: Get historical property data

## Example request to /predict
```json
{
  "sqft": 2500,
  "bedrooms": 3,
  "bathrooms": 2.5,
  "location_rating": 8,
  "property_age": 5,
  "has_garage": true,
  "has_pool": false,
  "school_quality": 7,
  "crime_rate": 3,
  "property_type": "single_family"
}
```