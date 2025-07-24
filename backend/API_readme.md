# CollabForge API Documentation

This document provides details about the CollabForge API, including endpoints, HTTP methods, request bodies, and response bodies.

**Base URL:** `https://collabforge.onrender.com/api`

## Table of Contents

- [User Endpoints](#user-endpoints)
- [Category Endpoints](#category-endpoints)
- [Creator Endpoints](#creator-endpoints)
- [Brand Endpoints](#brand-endpoints)
- [Campaign Endpoints](#campaign-endpoints)
- [Proposal Endpoints](#proposal-endpoints)
- [Contract Endpoints](#contract-endpoints)

---

## User Endpoints

### 1. Register a New User

**Description:** Registers a new user in the system.

- **URL:** `/users/register`
- **HTTP Method:** `POST`

**Request Body:**

```json
{
  "name": "John Doe",
  "username": "johndoe123",
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123",
  "contactNo": "+1234567890",
  "role": "influencer"
}
```

**Response Body:**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Login

**Description:** Authenticates a user and returns a JWT token.

- **URL:** `/users/login`
- **HTTP Method:** `POST`

**Request Body:**

```json
{
  "username": "johndoe123",
  "password": "securepassword123"
}
```

**Response Body:**

```json
{
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "username": "johndoe123",
    "email": "john.doe@example.com",
    "contactNo": "+1234567890",
    "role": "influencer",
    "status": true
  }
}
```

### 3. User Logout

**Description:** Logs out a user by clearing the JWT token cookie.

- **URL:** `/users/logout`
- **HTTP Method:** `POST`
- **Request Body:** None

**Response Body:**

```json
{
  "message": "User logged out successfully"
}
```

### 4. Get User by ID

**Description:** Retrieves details of a specific user by ID.

- **URL:** `/users/:id`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "username": "johndoe123",
  "email": "john.doe@example.com",
  "contactNo": "+1234567890",
  "role": "influencer",
  "status": true
}
```

### 5. Get All Users

**Description:** Retrieves a list of all active users.

- **URL:** `/users`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "username": "johndoe123",
    "email": "john.doe@example.com",
    "contactNo": "+1234567890",
    "role": "influencer",
    "status": true
  }
]
```

### 6. Update User

**Description:** Updates a user's details.

- **URL:** `/users/:id`
- **HTTP Method:** `PUT`

**Request Body:**

```json
{
  "name": "John Smith",
  "username": "johnsmith456",
  "email": "john.smith@example.com",
  "contactNo": "+1234567891",
  "role": "influencer",
  "status": true
}
```

**Response Body:**

```json
{
  "message": "User updated successfully"
}
```

### 7. Update User Password

**Description:** Updates a user's password.

- **URL:** `/users/:id/password`
- **HTTP Method:** `PUT`

**Request Body:**

```json
{
  "oldPassword": "securepassword123",
  "newPassword": "newsecurepassword456"
}
```

**Response Body:**

```json
{
  "message": "Password updated successfully"
}
```

### 8. Delete User

**Description:** Soft deletes a user by setting their status to false.

- **URL:** `/users/:id`
- **HTTP Method:** `DELETE`
- **Request Body:** None

**Response Body:**

```json
{
  "message": "User deleted successfully"
}
```

---

## Category Endpoints

### 1. Create a New Category

**Description:** Creates a new category.

- **URL:** `/categories`
- **HTTP Method:** `POST`

**Request Body:**

```json
{
  "categoryName": "Fashion"
}
```

**Response Body:**

```json
{
  "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
  "categoryName": "Fashion",
  "status": true
}
```

### 2. Update a Category

**Description:** Updates an existing category.

- **URL:** `/categories/:categoryId`
- **HTTP Method:** `PUT`

**Request Body:**

```json
{
  "categoryName": "Fashion & Lifestyle",
  "status": true
}
```

**Response Body:**

```json
{
  "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
  "categoryName": "Fashion & Lifestyle",
  "status": true
}
```

### 3. Get Category by ID

**Description:** Retrieves a category by its ID.

- **URL:** `/categories/:categoryId`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:**

```json
{
  "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
  "categoryName": "Fashion & Lifestyle",
  "status": true
}
```

### 4. Get All Categories

**Description:** Retrieves all categories.

- **URL:** `/categories`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:**

```json
[
  {
    "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
    "categoryName": "Fashion & Lifestyle",
    "status": true
  }
]
```

### 5. Delete a Category

**Description:** Soft deletes a category by setting its status to false.

- **URL:** `/categories/:categoryId`
- **HTTP Method:** `DELETE`
- **Request Body:** None

**Response Body:**

```json
{
  "message": "Category deleted successfully"
}
```

---

## Creator Endpoints

### 1. Create a New Creator

**Description:** Creates a new creator profile.

- **URL:** `/creators`
- **HTTP Method:** `POST`

**Request Body:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "nickName": "JohnnyStyle",
  "bio": "Fashion influencer sharing the latest trends.",
  "details": [
    {
      "label": "Age",
      "value": "28"
    },
    {
      "label": "Location",
      "value": "New York"
    }
  ],
  "socialMedia": [
    {
      "platform": "Instagram",
      "handle": "@johnnystyle",
      "url": "https://instagram.com/johnnystyle",
      "followers": 5000
    },
    {
      "platform": "TikTok",
      "handle": "@johnnystyle",
      "url": "https://tiktok.com/@johnnystyle",
      "followers": 3000
    }
  ],
  "whatIDo": [
    {
      "activity": "Fashion Modeling",
      "experience": "5 years"
    },
    {
      "activity": "Content Creation",
      "experience": "3 years"
    }
  ],
  "myPeople": [
    {
      "name": "Jane Smith",
      "role": "Photographer",
      "contact": "jane.smith@example.com"
    }
  ],
  "myContent": [
    {
      "title": "Summer Fashion Lookbook",
      "url": "https://youtube.com/watch?v=xyz123",
      "views": 10000
    }
  ],
  "pastCollaborations": [
    {
      "brand": "TrendyWear",
      "campaign": "Summer Collection 2024",
      "date": "2024-06-01"
    }
  ],
  "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
  "profilePicUrl": "https://example.com/john_profile.jpg",
  "backgroundImgUrl": "https://example.com/john_background.jpg",
  "accountNumber": "123456789012",
  "type": "Content Creator"
}
```

**Response Body:**

```json
{
  "message": "Creator created successfully",
  "creator": {
    "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
    "firstName": "John",
    "lastName": "Doe",
    "nickName": "JohnnyStyle",
    "bio": "Fashion influencer sharing the latest trends.",
    "details": [
      {
        "label": "Age",
        "value": "28"
      },
      {
        "label": "Location",
        "value": "New York"
      }
    ],
    "socialMedia": [
      {
        "platform": "Instagram",
        "handle": "@johnnystyle",
        "url": "https://instagram.com/johnnystyle",
        "followers": 5000
      },
      {
        "platform": "TikTok",
        "handle": "@johnnystyle",
        "url": "https://tiktok.com/@johnnystyle",
        "followers": 3000
      }
    ],
    "whatIDo": [
      {
        "activity": "Fashion Modeling",
        "experience": "5 years"
      },
      {
        "activity": "Content Creation",
        "experience": "3 years"
      }
    ],
    "myPeople": [
      {
        "name": "Jane Smith",
        "role": "Photographer",
        "contact": "jane.smith@example.com"
      }
    ],
    "myContent": [
      {
        "title": "Summer Fashion Lookbook",
        "url": "https://youtube.com/watch?v=xyz123",
        "views": 10000
      }
    ],
    "pastCollaborations": [
      {
        "brand": "TrendyWear",
        "campaign": "Summer Collection 2024",
        "date": "2024-06-01"
      }
    ],
    "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
    "profilePicUrl": "https://example.com/john_profile.jpg",
    "backgroundImgUrl": "https://example.com/john_background.jpg",
    "accountNumber": "123456789012",
    "type": "Content Creator",
    "status": true
  }
}
```

### 2. Update a Creator

**Description:** Updates a creator's profile.

- **URL:** `/creators/:id`
- **HTTP Method:** `PUT`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "nickName": "JohnnyStyle",
  "bio": "Fashion influencer sharing the latest trends and tips.",
  "details": [
    {
      "label": "Age",
      "value": "28"
    },
    {
      "label": "Location",
      "value": "New York"
    }
  ],
  "socialMedia": [
    {
      "platform": "Instagram",
      "handle": "@johnnystyle",
      "url": "https://instagram.com/johnnystyle",
      "followers": 5100
    },
    {
      "platform": "TikTok",
      "handle": "@johnnystyle",
      "url": "https://tiktok.com/@johnnystyle",
      "followers": 3100
    }
  ],
  "whatIDo": [
    {
      "activity": "Fashion Modeling",
      "experience": "5 years"
    },
    {
      "activity": "Content Creation",
      "experience": "3 years"
    }
  ],
  "myPeople": [
    {
      "name": "Jane Smith",
      "role": "Photographer",
      "contact": "jane.smith@example.com"
    }
  ],
  "myContent": [
    {
      "title": "Summer Fashion Lookbook",
      "url": "https://youtube.com/watch?v=xyz123",
      "views": 10500
    }
  ],
  "pastCollaborations": [
    {
      "brand": "TrendyWear",
      "campaign": "Summer Collection 2024",
      "date": "2024-06-01"
    }
  ],
  "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
  "profilePicUrl": "https://example.com/john_profile.jpg",
  "backgroundImgUrl": "https://example.com/john_background.jpg",
  "accountNumber": "123456789012",
  "type": "Content Creator"
}
```

**Response Body:**

```json
{
  "message": "Creator updated successfully",
  "creator": {
    "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
    "firstName": "John",
    "lastName": "Doe",
    "nickName": "JohnnyStyle",
    "bio": "Fashion influencer sharing the latest trends and tips.",
    "details": [
      {
        "label": "Age",
        "value": "28"
      },
      {
        "label": "Location",
        "value": "New York"
      }
    ],
    "socialMedia": [
      {
        "platform": "Instagram",
        "handle": "@johnnystyle",
        "url": "https://instagram.com/johnnystyle",
        "followers": 5100
      },
      {
        "platform": "TikTok",
        "handle": "@johnnystyle",
        "url": "https://tiktok.com/@johnnystyle",
        "followers": 3100
      }
    ],
    "whatIDo": [
      {
        "activity": "Fashion Modeling",
        "experience": "5 years"
      },
      {
        "activity": "Content Creation",
        "experience": "3 years"
      }
    ],
    "myPeople": [
      {
        "name": "Jane Smith",
        "role": "Photographer",
        "contact": "jane.smith@example.com"
      }
    ],
    "myContent": [
      {
        "title": "Summer Fashion Lookbook",
        "url": "https://youtube.com/watch?v=xyz123",
        "views": 10500
      }
    ],
    "pastCollaborations": [
      {
        "brand": "TrendyWear",
        "campaign": "Summer Collection 2024",
        "date": "2024-06-01"
      }
    ],
    "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
    "profilePicUrl": "https://example.com/john_profile.jpg",
    "backgroundImgUrl": "https://example.com/john_background.jpg",
    "accountNumber": "123456789012",
    "type": "Content Creator",
    "status": true
  }
}
```

### 3. Get Creator by ID

**Description:** Retrieves a creator by their ID.

- **URL:** `/creators/:id`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:**

```json
{
  "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
  "firstName": "John",
  "lastName": "Doe",
  "nickName": "JohnnyStyle",
  "bio": "Fashion influencer sharing the latest trends and tips.",
  "details": [
    {
      "label": "Age",
      "value": "28"
    },
    {
      "label": "Location",
      "value": "New York"
    }
  ],
  "socialMedia": [
    {
      "platform": "Instagram",
      "handle": "@johnnystyle",
      "url": "https://instagram.com/johnnystyle",
      "followers": 5100
    },
    {
      "platform": "TikTok",
      "handle": "@johnnystyle",
      "url": "https://tiktok.com/@johnnystyle",
      "followers": 3100
    }
  ],
  "whatIDo": [
    {
      "activity": "Fashion Modeling",
      "experience": "5 years"
    },
    {
      "activity": "Content Creation",
      "experience": "3 years"
    }
  ],
  "myPeople": [
    {
      "name": "Jane Smith",
      "role": "Photographer",
      "contact": "jane.smith@example.com"
    }
  ],
  "myContent": [
    {
      "title": "Summer Fashion Lookbook",
      "url": "https://youtube.com/watch?v=xyz123",
      "views": 10500
    }
  ],
  "pastCollaborations": [
    {
      "brand": "TrendyWear",
      "campaign": "Summer Collection 2024",
      "date": "2024-06-01"
    }
  ],
  "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
  "profilePicUrl": "https://example.com/john_profile.jpg",
  "backgroundImgUrl": "https://example.com/john_background.jpg",
  "accountNumber": "123456789012",
  "type": "Content Creator",
  "status": true
}
```

### 4. Get Creator by User ID

**Description:** Retrieves a creator by their associated user ID.

- **URL:** `/creators/by-user/:userId`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** (Same as Get Creator by ID)

### 5. Get All Creators

**Description:** Retrieves all active creators.

- **URL:** `/creators`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of creator objects (same structure as individual creator)

### 6. Get Creators by Category

**Description:** Retrieves creators by category ID.

- **URL:** `/creators/by-category?categoryId=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of creator objects filtered by category

### 7. Get Creators by Type

**Description:** Retrieves creators by type.

- **URL:** `/creators/by-type?type=Content Creator | Model | Live Streamer`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of creator objects filtered by type

### 8. Delete a Creator

**Description:** Soft deletes a creator by setting their status to false.

- **URL:** `/creators/:id`
- **HTTP Method:** `DELETE`
- **Request Body:** None

**Response Body:**

```json
{
  "message": "Creator deleted successfully"
}
```

---

## Brand Endpoints

### 1. Create a New Brand

**Description:** Creates a new brand profile.

- **URL:** `/brands`
- **HTTP Method:** `POST`

**Request Body:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "companyName": "TrendyWear",
  "bio": "Leading fashion brand for modern trends.",
  "description": {
    "mission": "To inspire fashion-forward lifestyles.",
    "vision": "Global fashion leadership by 2030."
  },
  "whatWeLookFor": {
    "targetAudience": "Young adults aged 18-35",
    "collaborationType": "Social media campaigns"
  },
  "profilePicUrl": "https://example.com/trendywear_profile.jpg",
  "backgroundImageUrl": "https://example.com/trendywear_background.jpg",
  "popularCampaigns": [
    {
      "campaignName": "Summer Collection 2024",
      "startDate": "2024-06-01",
      "endDate": "2024-08-31"
    },
    {
      "campaignName": "Winter Fest 2024",
      "startDate": "2024-12-01",
      "endDate": "2025-02-28"
    }
  ]
}
```

**Response Body:**

```json
{
  "message": "Brand created successfully",
  "brand": {
    "brandId": "28f69273-7825-4ce5-af65-034dd404ca6c",
    "companyName": "TrendyWear",
    "bio": "Leading fashion brand for modern trends.",
    "description": {
      "mission": "To inspire fashion-forward lifestyles.",
      "vision": "Global fashion leadership by 2030."
    },
    "whatWeLookFor": {
      "targetAudience": "Young adults aged 18-35",
      "collaborationType": "Social media campaigns"
    },
    "profilePicUrl": "https://example.com/trendywear_profile.jpg",
    "backgroundImageUrl": "https://example.com/trendywear_background.jpg",
    "popularCampaigns": [
      {
        "campaignName": "Summer Collection 2024",
        "startDate": "2024-06-01",
        "endDate": "2024-08-31"
      },
      {
        "campaignName": "Winter Fest 2024",
        "startDate": "2024-12-01",
        "endDate": "2025-02-28"
      }
    ],
    "status": true
  }
}
```

### 2. Update a Brand

**Description:** Updates a brand's profile.

- **URL:** `/brands/:id`
- **HTTP Method:** `PUT`

**Request Body:**

```json
{
  "companyName": "TrendyWear",
  "bio": "Leading fashion brand for modern trends and sustainability.",
  "description": {
    "mission": "To inspire fashion-forward lifestyles with sustainability.",
    "vision": "Global fashion leadership by 2030 with eco-friendly practices."
  },
  "whatWeLookFor": {
    "targetAudience": "Young adults aged 18-35",
    "collaborationType": "Social media and eco-campaigns"
  },
  "profilePicUrl": "https://example.com/trendywear_profile.jpg",
  "backgroundImageUrl": "https://example.com/trendywear_background.jpg",
  "popularCampaigns": [
    {
      "campaignName": "Summer Collection 2024",
      "startDate": "2024-06-01",
      "endDate": "2024-08-31"
    },
    {
      "campaignName": "Winter Fest 2024",
      "startDate": "2024-12-01",
      "endDate": "2025-02-28"
    }
  ]
}
```

**Response Body:**

```json
{
  "message": "Brand updated successfully",
  "brand": {
    "brandId": "28f69273-7825-4ce5-af65-034dd404ca6c",
    "companyName": "TrendyWear",
    "bio": "Leading fashion brand for modern trends and sustainability.",
    "description": {
      "mission": "To inspire fashion-forward lifestyles with sustainability.",
      "vision": "Global fashion leadership by 2030 with eco-friendly practices."
    },
    "whatWeLookFor": {
      "targetAudience": "Young adults aged 18-35",
      "collaborationType": "Social media and eco-campaigns"
    },
    "profilePicUrl": "https://example.com/trendywear_profile.jpg",
    "backgroundImageUrl": "https://example.com/trendywear_background.jpg",
    "popularCampaigns": [
      {
        "campaignName": "Summer Collection 2024",
        "startDate": "2024-06-01",
        "endDate": "2024-08-31"
      },
      {
        "campaignName": "Winter Fest 2024",
        "startDate": "2024-12-01",
        "endDate": "2025-02-28"
      }
    ],
    "status": true
  }
}
```

### 3. Get Brand by ID

**Description:** Retrieves a brand by their ID.

- **URL:** `/brands/:id`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** (Same structure as brand creation response)

### 4. Get Brand by User ID

**Description:** Retrieves a brand by their associated user ID.

- **URL:** `/brands/by-user/:userId`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** (Same structure as brand creation response)

### 5. Get All Brands

**Description:** Retrieves all active brands.

- **URL:** `/brands`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of brand objects

### 6. Delete a Brand

**Description:** Soft deletes a brand by setting their status to false.

- **URL:** `/brands/:id`
- **HTTP Method:** `DELETE`
- **Request Body:** None

**Response Body:**

```json
{
  "message": "Brand deleted successfully"
}
```

---

## Campaign Endpoints

### 1. Create a New Campaign

**Description:** Creates a new campaign.

- **URL:** `/campaigns`
- **HTTP Method:** `POST`

**Request Body:**

```json
{
  "campaignTitle": "Summer Collection 2024",
  "budget": 5000,
  "campaignStatus": "active",
  "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
  "requirements": {
    "minFollowers": 1000,
    "contentType": "Video"
  },
  "description": "Promoting our latest summer collection.",
  "brandId": "28f69273-7825-4ce5-af65-034dd404ca6c",
  "status": true
}
```

**Response Body:**

```json
{
  "message": "Campaign created successfully",
  "campaign": {
    "campaignId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "campaignTitle": "Summer Collection 2024",
    "budget": 5000,
    "campaignStatus": "active",
    "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
    "requirements": {
      "minFollowers": 1000,
      "contentType": "Video"
    },
    "description": "Promoting our latest summer collection.",
    "brandId": "28f69273-7825-4ce5-af65-034dd404ca6c",
    "status": true
  }
}
```

### 2. Update a Campaign

**Description:** Updates a campaign's details.

- **URL:** `/campaigns/:id`
- **HTTP Method:** `PUT`

**Request Body:**

```json
{
  "campaignTitle": "Summer Collection 2024",
  "budget": 5500,
  "campaignStatus": "active",
  "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
  "requirements": {
    "minFollowers": 1000,
    "contentType": "Video"
  },
  "description": "Promoting our latest summer collection with new styles.",
  "brandId": "28f69273-7825-4ce5-af65-034dd404ca6c",
  "status": true
}
```

**Response Body:**

```json
{
  "message": "Campaign updated successfully",
  "campaign": {
    "campaignId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "campaignTitle": "Summer Collection 2024",
    "budget": 5500,
    "campaignStatus": "active",
    "categoryId": "d3d09d59-7b6d-4ba2-b4de-7cbc28a8b12b",
    "requirements": {
      "minFollowers": 1000,
      "contentType": "Video"
    },
    "description": "Promoting our latest summer collection with new styles.",
    "brandId": "28f69273-7825-4ce5-af65-034dd404ca6c",
    "status": true
  }
}
```

### 3. Get Campaign by ID

**Description:** Retrieves a campaign by its ID.

- **URL:** `/campaigns/:id`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** (Same structure as campaign creation response)

### 4. Get All Campaigns

**Description:** Retrieves all active campaigns.

- **URL:** `/campaigns`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of campaign objects

### 5. Get Campaigns by Category

**Description:** Retrieves campaigns by category ID.

- **URL:** `/campaigns/by-category?categoryId=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of campaign objects filtered by category

### 6. Get Campaigns by Brand

**Description:** Retrieves campaigns by brand ID.

- **URL:** `/campaigns/by-brand?brandId=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of campaign objects filtered by brand

### 7. Get Campaigns by Status

**Description:** Retrieves campaigns by status.

- **URL:** `/campaigns/by-status?campaignStatus=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of campaign objects filtered by status

### 8. Get Campaigns by Budget Range

**Description:** Retrieves campaigns by budget range.

- **URL:** `/campaigns/by-budget?minBudget=number&maxBudget=number`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of campaign objects filtered by budget range

### 9. Delete a Campaign

**Description:** Soft deletes a campaign by setting its status to false.

- **URL:** `/campaigns/:id`
- **HTTP Method:** `DELETE`
- **Request Body:** None

**Response Body:**

```json
{
  "message": "Campaign deleted successfully"
}
```

---

## Proposal Endpoints

### 1. Create a New Proposal

**Description:** Creates a new proposal for a campaign.

- **URL:** `/proposals`
- **HTTP Method:** `POST`

**Request Body:**

```json
{
  "campaignId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "proposalTitle": "Summer Video Series",
  "proposalPitch": "A series of engaging video content for the campaign.",
  "contentPlan": {
    "videos": 3,
    "duration": "1-2 minutes each"
  },
  "startDate": "2024-07-01",
  "endDate": "2024-08-15",
  "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
  "status": true
}
```

**Response Body:**

```json
{
  "message": "Proposal created successfully",
  "proposal": {
    "proposalId": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p",
    "campaignId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "proposalTitle": "Summer Video Series",
    "proposalPitch": "A series of engaging video content for the campaign.",
    "contentPlan": {
      "videos": 3,
      "duration": "1-2 minutes each"
    },
    "startDate": "2024-07-01",
    "endDate": "2024-08-15",
    "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
    "status": true
  }
}
```

### 2. Update a Proposal

**Description:** Updates a proposal's details.

- **URL:** `/proposals/:id`
- **HTTP Method:** `PUT`

**Request Body:**

```json
{
  "campaignId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "proposalTitle": "Summer Video Series",
  "proposalPitch": "A series of engaging video content with added behind-the-scenes.",
  "contentPlan": {
    "videos": 4,
    "duration": "1-2 minutes each"
  },
  "startDate": "2024-07-01",
  "endDate": "2024-08-15",
  "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
  "status": true
}
```

**Response Body:**

```json
{
  "message": "Proposal updated successfully",
  "proposal": {
    "proposalId": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p",
    "campaignId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "proposalTitle": "Summer Video Series",
    "proposalPitch": "A series of engaging video content with added behind-the-scenes.",
    "contentPlan": {
      "videos": 4,
      "duration": "1-2 minutes each"
    },
    "startDate": "2024-07-01",
    "endDate": "2024-08-15",
    "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
    "status": true
  }
}
```

### 3. Get Proposal by ID

**Description:** Retrieves a proposal by its ID.

- **URL:** `/proposals/:id`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:**

```json
{
  "proposalId": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p",
  "campaignId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "proposalTitle": "Summer Video Series",
  "proposalPitch": "A series of engaging video content with added behind-the-scenes.",
  "contentPlan": {
    "videos": 4,
    "duration": "1-2 minutes each"
  },
  "startDate": "2024-07-01",
  "endDate": "2024-08-15",
  "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
  "status": true
}
```

### 4. Get All Proposals

**Description:** Retrieves all active proposals.

- **URL:** `/proposals`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of proposal objects

### 5. Get Proposals by Campaign

**Description:** Retrieves proposals by campaign ID.

- **URL:** `/proposals/by-campaign?campaignId=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of proposal objects filtered by campaign

### 6. Get Proposals by Creator

**Description:** Retrieves proposals by creator ID.

- **URL:** `/proposals/by-creator?creatorId=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of proposal objects filtered by creator

### 7. Get Proposals by Date Range

**Description:** Retrieves proposals within a specified date range.

- **URL:** `/proposals/by-date-range?startDate=string&endDate=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of proposal objects filtered by date range

### 8. Delete a Proposal

**Description:** Soft deletes a proposal by setting its status to false.

- **URL:** `/proposals/:id`
- **HTTP Method:** `DELETE`
- **Request Body:** None

**Response Body:**

```json
{
  "message": "Proposal deleted successfully"
}
```

---

## Contract Endpoints

### 1. Create a New Contract

**Description:** Creates a new contract.

- **URL:** `/contracts`
- **HTTP Method:** `POST`

**Request Body:**

```json
{
  "campaignId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "brandId": "28f69273-7825-4ce5-af65-034dd404ca6c",
  "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
  "contractTitle": "Summer Campaign Contract",
  "contractDetails": "Agreement for video content creation.",
  "contractSuggestions": {
    "additionalTerms": "Include behind-the-scenes footage."
  },
  "creatorSignature": "John Doe",
  "contractStatus": "Pending",
  "status": true
}
```

**Response Body:**

```json
{
  "message": "Contract created successfully",
  "contract": {
    "contractId": "b9c8d7e6-f5a4-3b2c-1d0e-9f8g7h6i5j4k",
    "campaignId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "brandId": "28f69273-7825-4ce5-af65-034dd404ca6c",
    "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
    "contractTitle": "Summer Campaign Contract",
    "contractDetails": "Agreement for video content creation.",
    "contractSuggestions": {
      "additionalTerms": "Include behind-the-scenes footage."
    },
    "creatorSignature": "John Doe",
    "signedDate": "2024-07-01",
    "contractStatus": "Pending",
    "status": true
  }
}
```

### 2. Update a Contract

**Description:** Updates a contract's details.

- **URL:** `/contracts/:id`
- **HTTP Method:** `PUT`

**Request Body:**

```json
{
  "contractTitle": "Summer Campaign Contract",
  "contractDetails": "Agreement for video content creation with revised terms.",
  "contractSuggestions": {
    "additionalTerms": "Include behind-the-scenes and live Q&A."
  },
  "creatorSignature": "John Doe",
  "contractStatus": "Pending",
  "status": true
}
```

**Response Body:**

```json
{
  "message": "Contract updated successfully",
  "contract": {
    "contractId": "b9c8d7e6-f5a4-3b2c-1d0e-9f8g7h6i5j4k",
    "campaignId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "brandId": "28f69273-7825-4ce5-af65-034dd404ca6c",
    "creatorId": "e8e616e0-d894-4936-a3f5-391682ee794c",
    "contractTitle": "Summer Campaign Contract",
    "contractDetails": "Agreement for video content creation with revised terms.",
    "contractSuggestions": {
      "additionalTerms": "Include behind-the-scenes and live Q&A."
    },
    "creatorSignature": "John Doe",
    "signedDate": "2024-07-01",
    "contractStatus": "Pending",
    "status": true
  }
}
```

### 3. Get Contract by ID

**Description:** Retrieves a contract by its ID.

- **URL:** `/contracts/:id`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** (Same structure as contract creation response)

### 4. Get All Contracts

**Description:** Retrieves all active contracts.

- **URL:** `/contracts`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of contract objects

### 5. Get Contracts by Campaign

**Description:** Retrieves contracts by campaign ID.

- **URL:** `/contracts/by-campaign?campaignId=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of contract objects filtered by campaign

### 6. Get Contracts by Brand

**Description:** Retrieves contracts by brand ID.

- **URL:** `/contracts/by-brand?brandId=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of contract objects filtered by brand

### 7. Get Contracts by Creator

**Description:** Retrieves contracts by creator ID.

- **URL:** `/contracts/by-creator?creatorId=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of contract objects filtered by creator

### 8. Get Contracts by Status

**Description:** Retrieves contracts by status.

- **URL:** `/contracts/by-status?contractStatus=string`
- **HTTP Method:** `GET`
- **Request Body:** None

**Response Body:** Array of contract objects filtered by status

### 9. Delete a Contract

**Description:** Soft deletes a contract by setting its status to false.

- **URL:** `/contracts/:id`
- **HTTP Method:** `DELETE`
- **Request Body:** None

**Response Body:**

```json
{
  "message": "Contract deleted successfully"
}
```

---

## Notes

- **Authentication:** All endpoints require authentication via a JWT token in the Authorization header or a cookie named `token`.
- **Authorization:** Some endpoints require specific roles (e.g., admin, owner, creator, brand) as specified in the middleware.
- **Soft Deletes:** Soft deletes are implemented by setting the `status` field to `false` instead of removing the record from the database.
- **JSON Fields:** JSON fields (e.g., `details`, `requirements`) must be valid JSON strings or objects.
- **UUIDs:** UUIDs must be version 4 format.
- **Dates:** Dates must be in ISO 8601 format (e.g., `2023-10-01T12:00:00Z`).
