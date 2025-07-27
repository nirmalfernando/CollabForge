// Use environment variable for the API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://collabforge.onrender.com/api";

// API utility functions
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any // Add details to capture more info from backend
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Include cookies for authentication
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Log the full response data for debugging
      console.error(`API Error for ${url}:`, response.status, data);
      throw new ApiError(
        response.status,
        data.message || "An error occurred",
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Catch network errors or other unexpected issues
    console.error(`Network or unexpected error for ${url}:`, error);
    throw new ApiError(500, "Network error occurred");
  }
}

// Auth API functions
export const authApi = {
  register: async (userData: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    contactNo: string;
    role: "influencer" | "brand";
  }) => {
    return apiRequest("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: {
    identifier: string; // username or email
    password: string;
  }) => {
    return apiRequest("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    return apiRequest("/users/logout", {
      method: "POST",
    });
  },

  getUserById: async (userId: string) => {
    return apiRequest(`/users/${userId}`);
  },
};

// Creator API functions
export const creatorApi = {
  createCreator: async (creatorData: {
    userId: string;
    firstName: string;
    lastName: string;
    nickName?: string;
    bio?: string;
    details?: Array<{ label: string; value: string }>;
    socialMedia?: Array<{
      platform: string;
      handle: string;
      url: string;
      followers?: number;
    }>;
    whatIDo?: Array<{ activity: string; experience?: string }>;
    myPeople?: Array<{ name: string; role: string; contact?: string }>;
    myContent?: Array<{ title: string; url?: string; views?: number }>;
    pastCollaborations?: Array<{
      brand: string;
      campaign: string;
      date?: string;
    }>;
    categoryId: string;
    profilePicUrl?: string;
    backgroundImgUrl?: string;
    accountNumber?: string;
    type: "Content Creator" | "Model" | "Live Streamer";
  }) => {
    return apiRequest("/creators", {
      method: "POST",
      body: JSON.stringify(creatorData),
    });
  },

  updateCreator: async (creatorId: string, creatorData: any) => {
    return apiRequest(`/creators/${creatorId}`, {
      method: "PUT",
      body: JSON.stringify(creatorData),
    });
  },

  getCreatorById: async (creatorId: string) => {
    return apiRequest(`/creators/${creatorId}`);
  },

  getCreatorByUserId: async (userId: string) => {
    return apiRequest(`/creators/by-user/${userId}`);
  },

  getAllCreators: async () => {
    return apiRequest("/creators");
  },

  getCreatorsByCategory: async (categoryId: string) => {
    return apiRequest(`/creators/by-category?categoryId=${categoryId}`);
  },

  getCreatorsByType: async (type: string) => {
    return apiRequest(`/creators/by-type?type=${encodeURIComponent(type)}`);
  },

  deleteCreator: async (creatorId: string) => {
    return apiRequest(`/creators/${creatorId}`, {
      method: "DELETE",
    });
  },
};

// Brand API functions
export const brandApi = {
  createBrand: async (brandData: {
    userId: string;
    companyName: string;
    bio?: string;
    description?: {
      mission?: string;
      vision?: string;
    };
    whatWeLookFor?: {
      targetAudience?: string;
      collaborationType?: string;
    };
    profilePicUrl?: string;
    backgroundImageUrl?: string;
    popularCampaigns?: Array<{
      campaignId?: string;
      campaignName: string;
      startDate?: string;
      endDate?: string;
    }>;
  }) => {
    return apiRequest("/brands", {
      method: "POST",
      body: JSON.stringify(brandData),
    });
  },

  updateBrand: async (brandId: string, brandData: any) => {
    return apiRequest(`/brands/${brandId}`, {
      method: "PUT",
      body: JSON.stringify(brandData),
    });
  },

  getBrandById: async (brandId: string) => {
    return apiRequest(`/brands/${brandId}`);
  },

  getBrandByUserId: async (userId: string) => {
    return apiRequest(`/brands/by-user/${userId}`);
  },

  getAllBrands: async () => {
    return apiRequest("/brands");
  },

  deleteBrand: async (brandId: string) => {
    return apiRequest(`/brands/${brandId}`, {
      method: "DELETE",
    });
  },
};

// Campaign API functions
export const campaignApi = {
  createCampaign: async (campaignData: {
    campaignTitle: string;
    budget: number;
    campaignStatus: "draft" | "active" | "completed" | "cancelled";
    categoryId: string;
    description: string;
    brandId: string;
    requirements?: object;
    status: boolean;
  }) => {
    return apiRequest("/campaigns", {
      method: "POST",
      body: JSON.stringify(campaignData),
    });
  },

  updateCampaign: async (campaignId: string, campaignData: any) => {
    return apiRequest(`/campaigns/${campaignId}`, {
      method: "PUT",
      body: JSON.stringify(campaignData),
    });
  },

  getCampaignById: async (campaignId: string) => {
    return apiRequest(`/campaigns/${campaignId}`);
  },

  getAllCampaigns: async () => {
    return apiRequest("/campaigns");
  },

  getCampaignsByCategory: async (categoryId: string) => {
    return apiRequest(`/campaigns/by-category?categoryId=${categoryId}`);
  },

  getCampaignsByBrand: async (brandId: string) => {
    return apiRequest(`/campaigns/by-brand?brandId=${brandId}`);
  },

  getCampaignsByStatus: async (campaignStatus: string) => {
    return apiRequest(
      `/campaigns/by-status?campaignStatus=${encodeURIComponent(
        campaignStatus
      )}`
    );
  },

  getCampaignsByBudgetRange: async (minBudget: number, maxBudget: number) => {
    return apiRequest(
      `/campaigns/by-budget?minBudget=${minBudget}&maxBudget=${maxBudget}`
    );
  },

  deleteCampaign: async (campaignId: string) => {
    return apiRequest(`/campaigns/${campaignId}`, {
      method: "DELETE",
    });
  },
};

// Categories API functions
export const categoryApi = {
  getAllCategories: async () => {
    return apiRequest("/categories");
  },

  getCategoryById: async (categoryId: string) => {
    return apiRequest(`/categories/${categoryId}`);
  },
};

// User management functions
export const userApi = {
  updateUser: async (userId: string, userData: any) => {
    return apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  updatePassword: async (
    userId: string,
    passwordData: {
      oldPassword: string;
      newPassword: string;
    }
  ) => {
    return apiRequest(`/users/${userId}/password`, {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  },
};

// Image Upload API functions - Direct Cloudinary Upload
export const imageUploadApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new ApiError(500, "Cloudinary configuration is missing");
    }

    try {
      // Generate timestamp for signature
      const timestamp = Math.round(new Date().getTime() / 1000);

      // Create signature for secure upload
      const paramsToSign = `timestamp=${timestamp}`;
      const signature = await generateSignature(paramsToSign, apiSecret);

      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);

      // Upload directly to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary Upload Error:", response.status, data);
        throw new ApiError(
          response.status,
          data.error?.message || "Failed to upload image to Cloudinary",
          data
        );
      }

      return { url: data.secure_url };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error(
        "Network or unexpected error during Cloudinary upload:",
        error
      );
      throw new ApiError(500, "Network error occurred during image upload");
    }
  },
};

// Helper function to generate Cloudinary signature
async function generateSignature(
  paramsToSign: string,
  apiSecret: string
): Promise<string> {
  // Use Web Crypto API to generate SHA-1 signature
  const encoder = new TextEncoder();
  const data = encoder.encode(paramsToSign + apiSecret);

  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

// Helper function to get user role from token
export function getUserFromToken(token: string) {
  try {
    // JWT payload is base64 encoded
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

// Helper function to store auth data
export function setAuthData(token: string, user: any) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Helper function to get auth data
export function getAuthData() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;

  if (token && user) {
    return {
      token,
      user: JSON.parse(user),
    };
  }

  return null;
}

// Helper function to clear auth data
export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
