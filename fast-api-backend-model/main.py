from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from typing import List, Dict, Any, Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionInput(BaseModel):
    sqft: float
    bedrooms: int
    bathrooms: float
    location_rating: int  # 1-10
    property_age: int  # in years
    has_garage: bool
    has_pool: bool
    school_quality: int  # 1-10
    crime_rate: int  # 1-10 (lower is better)
    property_type: str  # apartment, townhouse, single_family, condo


class PredictionResult(BaseModel):
    predicted_price: float
    confidence: float
    potential_increase: float
    recommended_actions: List[str]
    historical_comparison: Dict[str, float]
    monthly_trends: List[Dict[str, Any]]


# Create or load the model
def create_model_if_not_exists():
    model_path = 'house_price_model.pkl'

    if not os.path.exists(model_path):
        print("Creating and saving model...")
        # Create synthetic training data
        np.random.seed(42)
        n_samples = 1000
        X_train = np.random.rand(n_samples, 10)  # 10 features

        # Base prices for different property types
        property_types = ['apartment', 'townhouse', 'single_family', 'condo']
        base_prices = {
            'apartment': 200000,
            'townhouse': 300000,
            'single_family': 400000,
            'condo': 250000
        }

        # Generate target values with realistic relationships
        y_train = []
        for i in range(n_samples):
            prop_idx = i % 4
            prop_type = property_types[prop_idx]

            # Features impact on price
            sqft_effect = X_train[i, 0] * 200000  # Square footage
            bedrooms_effect = X_train[i, 1] * 50000  # Bedrooms
            bathrooms_effect = X_train[i, 2] * 30000  # Bathrooms
            location_effect = X_train[i, 3] * 100000  # Location rating
            age_penalty = (1 - X_train[i, 4]) * 50000  # Age (newer is better)
            garage_effect = X_train[i, 5] * 30000  # Garage
            pool_effect = X_train[i, 6] * 40000  # Pool
            school_effect = X_train[i, 7] * 60000  # School quality
            crime_penalty = (1 - X_train[i, 8]) * 70000  # Crime rate (lower is better)

            # Calculate price with realistic factors
            price = (
                    base_prices[prop_type] +
                    sqft_effect +
                    bedrooms_effect +
                    bathrooms_effect +
                    location_effect -
                    age_penalty +
                    garage_effect +
                    pool_effect +
                    school_effect -
                    crime_penalty
            )

            # Add some random noise
            price *= (0.9 + np.random.rand() * 0.2)

            y_train.append(price)

        y_train = np.array(y_train)

        # Train Random Forest model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        # Save the model
        joblib.dump(model, model_path)
        return model
    else:
        print("Loading existing model...")
        return joblib.load(model_path)


# Initialize the model
model = create_model_if_not_exists()


# Helper functions for recommendations
def get_recommendations(input_data):
    recommendations = []

    # Define improvement opportunities based on input values
    if input_data.location_rating < 7:
        recommendations.append("Location is a challenge. Consider properties in better neighborhoods for higher value.")

    if input_data.property_age > 20:
        recommendations.append("Consider renovations to modernize the property and increase its value.")

    if not input_data.has_garage:
        recommendations.append("Adding a garage could increase property value by 5-10%.")

    if not input_data.has_pool and input_data.sqft > 2000:
        recommendations.append("For larger properties, adding a pool could be a worthwhile investment.")

    if input_data.school_quality < 7:
        recommendations.append(
            "Property value is affected by school ratings. Consider properties in better school districts.")

    if input_data.crime_rate > 5:
        recommendations.append("High crime rates significantly impact property values. Consider safer neighborhoods.")

    if len(recommendations) == 0:
        recommendations.append(
            "This property already has excellent features. Maintain the condition to preserve value.")

    return recommendations


@app.get("/")
def read_root():
    return {"message": "House Price Prediction API"}


@app.post("/predict", response_model=PredictionResult)
def predict(input_data: PredictionInput):
    try:
        # Map categorical values to numerical
        property_type_mapping = {
            'apartment': 0,
            'townhouse': 1,
            'single_family': 2,
            'condo': 3
        }

        # Normalize/scale data for the model
        normalized_sqft = min(input_data.sqft / 5000, 1)  # Cap at 5000 sqft
        normalized_bedrooms = min(input_data.bedrooms / 6, 1)  # Cap at 6 bedrooms
        normalized_bathrooms = min(input_data.bathrooms / 4, 1)  # Cap at 4 bathrooms
        normalized_location = input_data.location_rating / 10  # Scale to 0-1
        normalized_age = min(input_data.property_age / 50, 1)  # Cap at 50 years
        normalized_garage = 1 if input_data.has_garage else 0
        normalized_pool = 1 if input_data.has_pool else 0
        normalized_school = input_data.school_quality / 10  # Scale to 0-1
        normalized_crime = input_data.crime_rate / 10  # Scale to 0-1
        property_type_value = property_type_mapping.get(input_data.property_type, 0) / 3  # Scale to 0-1

        # Prepare features vector
        features = np.array([
            normalized_sqft,
            normalized_bedrooms,
            normalized_bathrooms,
            normalized_location,
            normalized_age,
            normalized_garage,
            normalized_pool,
            normalized_school,
            normalized_crime,
            property_type_value
        ]).reshape(1, -1)

        # Make prediction
        predicted_price = float(model.predict(features)[0])

        # Apply property type adjustment factor
        property_factors = {
            'apartment': 1.0,
            'townhouse': 1.05,
            'single_family': 1.1,
            'condo': 0.95
        }
        predicted_price *= property_factors.get(input_data.property_type, 1.0)

        # Create historical comparison data
        historical_avg = predicted_price * 0.9
        historical_min = predicted_price * 0.75
        historical_max = predicted_price * 1.15

        # Create monthly price trend data
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        price_trend = []

        # Generate a seasonality curve for real estate (typically higher in summer)
        seasonality_factors = [0.97, 0.98, 1.0, 1.02, 1.04, 1.05, 1.03, 1.02, 1.0, 0.99, 0.98, 0.96]

        for i, month in enumerate(months):
            # Add slight randomness to each month
            random_factor = 0.98 + (np.random.random() * 0.04)
            month_price = predicted_price * seasonality_factors[i] * random_factor
            price_trend.append({
                "month": month,
                "price": round(month_price, 2)
            })

        # Get recommendations
        recommendations = get_recommendations(input_data)

        # Calculate potential increase with optimal conditions
        optimal_price = predicted_price * 1.25  # 25% improvement with optimal conditions
        potential_increase = ((optimal_price - predicted_price) / predicted_price) * 100

        # Prepare response
        result = PredictionResult(
            predicted_price=round(predicted_price, 2),
            confidence=round(85 + np.random.random() * 10, 1),  # Random confidence between 85-95%
            potential_increase=round(potential_increase, 1),
            recommended_actions=recommendations,
            historical_comparison={
                "average": round(historical_avg, 2),
                "maximum": round(historical_max, 2),
                "minimum": round(historical_min, 2)
            },
            monthly_trends=price_trend
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


# API endpoint to get historical data (mock data for now)
@app.get("/historical-data")
def get_historical_data():
    # Generate mock historical data
    np.random.seed(42)
    property_types = ['apartment', 'townhouse', 'single_family', 'condo']
    data = []

    # Generate data for the past 10 entries
    for i in range(1, 11):
        # Create date strings for the past months/years
        date_str = f"2023-{i:02d}-01" if i <= 12 else f"2022-{i - 12:02d}-01"

        # Randomly select property type
        prop_type = property_types[i % 4]

        # Generate random, but sensible property attributes
        sqft = np.random.randint(1000, 4000)
        bedrooms = np.random.randint(1, 6)
        bathrooms = float(np.random.randint(1, 8)) / 2  # 1, 1.5, 2, 2.5, etc.
        location_rating = np.random.randint(3, 10)
        age = np.random.randint(1, 40)
        has_garage = np.random.choice([True, False])
        has_pool = np.random.choice([True, False])
        school_quality = np.random.randint(4, 10)
        crime_rate = np.random.randint(1, 8)

        # Calculate base price based on property type
        base_price = {
            'apartment': 200000,
            'townhouse': 300000,
            'single_family': 400000,
            'condo': 250000
        }[prop_type]

        # Adjust price based on features
        predicted_price = base_price + \
                          (sqft - 2000) * 100 + \
                          (bedrooms - 3) * 25000 + \
                          (bathrooms - 2) * 15000 + \
                          (location_rating - 5) * 30000 - \
                          age * 2000 + \
                          (30000 if has_garage else 0) + \
                          (40000 if has_pool else 0) + \
                          (school_quality - 5) * 15000 - \
                          (crime_rate - 3) * 20000

        # Add random noise to predicted price
        predicted_price *= (0.95 + np.random.random() * 0.1)

        # Generate "actual" price with slight variation from predicted
        actual_price = predicted_price * (0.9 + np.random.random() * 0.2)

        data.append({
            "id": i,
            "date": date_str,
            "property_type": prop_type,
            "sqft": sqft,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "location_rating": location_rating,
            "property_age": age,
            "has_garage": has_garage,
            "has_pool": has_pool,
            "school_quality": school_quality,
            "crime_rate": crime_rate,
            "predicted_price": round(predicted_price, 2),
            "actual_price": round(actual_price, 2),
            "sale_price": round(actual_price, 2)  # Using actual as sale price for simplicity
        })

    return data


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
