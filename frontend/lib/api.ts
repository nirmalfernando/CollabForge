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

// Helper function to clear auth data
export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) return false;

  // Optionally check if token is expired
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      clearAuthData();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking token validity:", error);
    clearAuthData();
    return false;
  }
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include",
    redirect: "manual", // Prevent browser from following redirects
    ...options,
  };

  try {
    const response = await fetch(url, config);

    const contentType = response.headers.get("content-type");
    const rawText = await response.text();
    let data: any;

    if (contentType?.includes("application/json")) {
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (e) {
        data = { message: "Invalid JSON response", rawResponse: rawText };
      }
    } else {
      data = { message: rawText || "No response body", rawResponse: rawText };
    }

    if (!response.ok) {
      // Only clear auth data and redirect on 401 if NOT during login
      const isLoginEndpoint = endpoint.includes("/login");

      if (response.status === 401 && !isLoginEndpoint) {
        clearAuthData();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      throw new ApiError(
        response.status,
        data.message || `HTTP ${response.status} error`,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error(`🌐 Network or unexpected error for ${url}:`, error);
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

// Proposal API functions
export const proposalApi = {
  createProposal: async (proposalData: {
    campaignId: string;
    proposalTitle: string;
    proposalPitch: string;
    contentPlan?: string | object;
    startDate: string;
    endDate: string;
    creatorId: string;
    proposalStatus?: "pending" | "accepted" | "rejected";
    status?: boolean;
  }) => {
    return apiRequest("/proposals", {
      method: "POST",
      body: JSON.stringify(proposalData),
    });
  },

  updateProposal: async (proposalId: string, proposalData: any) => {
    return apiRequest(`/proposals/${proposalId}`, {
      method: "PUT",
      body: JSON.stringify(proposalData),
    });
  },

  getProposalById: async (proposalId: string) => {
    return apiRequest(`/proposals/${proposalId}`);
  },

  getAllProposals: async () => {
    return apiRequest("/proposals");
  },

  getProposalsByCampaign: async (campaignId: string) => {
    return apiRequest(`/proposals/by-campaign?campaignId=${campaignId}`);
  },

  getProposalsByCreator: async (creatorId: string) => {
    return apiRequest(`/proposals/by-creator?creatorId=${creatorId}`);
  },

  getProposalsByStatus: async (proposalStatus: string) => {
    return apiRequest(
      `/proposals/by-status?proposalStatus=${encodeURIComponent(
        proposalStatus
      )}`
    );
  },

  getProposalsByDateRange: async (startDate: string, endDate: string) => {
    return apiRequest(
      `/proposals/by-date-range?startDate=${startDate}&endDate=${endDate}`
    );
  },

  updateProposalStatus: async (
    proposalId: string,
    proposalStatus: "pending" | "accepted" | "rejected"
  ) => {
    return apiRequest(`/proposals/${proposalId}/status`, {
      method: "PUT",
      body: JSON.stringify({ proposalStatus }),
    });
  },

  deleteProposal: async (proposalId: string) => {
    return apiRequest(`/proposals/${proposalId}`, {
      method: "DELETE",
    });
  },
};

// Contract API functions with improved error handling
export const contractApi = {
  createContract: async (contractData: {
    campaignId: string;
    proposalId: string;
    brandId: string;
    creatorId: string;
    contractTitle: string;
    contractDetails: string;
    contractSuggestions?: object | string;
    creatorSignature?: string;
    contractStatus?:
      | "Pending"
      | "Active"
      | "Awaiting Payment"
      | "Completed"
      | "Cancelled";
    status?: boolean;
  }) => {
    console.log("Contract API: Creating contract with data:", contractData);

    // Validate required fields before sending
    if (
      !contractData.campaignId ||
      !contractData.proposalId ||
      !contractData.brandId ||
      !contractData.creatorId
    ) {
      throw new Error("Missing required IDs for contract creation");
    }

    if (
      !contractData.contractTitle?.trim() ||
      !contractData.contractDetails?.trim()
    ) {
      throw new Error("Contract title and details are required");
    }

    try {
      const response = await apiRequest("/contracts", {
        method: "POST",
        body: JSON.stringify(contractData),
      });
      console.log("Contract API: Successfully created contract:", response);
      return response;
    } catch (error) {
      console.error("Contract API: Error creating contract:", error);

      // Enhanced error handling for validation errors
      if (error instanceof ApiError && error.status === 400 && error.details) {
        const details = error.details;
        if (details.errors && Array.isArray(details.errors)) {
          const validationMessages = details.errors
            .map((err: any) => err.msg || err.message)
            .join("; ");
          throw new ApiError(
            400,
            `Validation failed: ${validationMessages}`,
            details
          );
        }
      }

      throw error;
    }
  },

  updateContract: async (
    contractId: string,
    contractData: {
      contractTitle?: string;
      contractDetails?: string;
      contractSuggestions?: object | string;
      creatorSignature?: string;
      contractStatus?:
        | "Pending"
        | "Active"
        | "Awaiting Payment"
        | "Completed"
        | "Cancelled";
      status?: boolean;
    }
  ) => {
    return apiRequest(`/contracts/${contractId}`, {
      method: "PUT",
      body: JSON.stringify(contractData),
    });
  },

  getContractById: async (contractId: string) => {
    return apiRequest(`/contracts/${contractId}`);
  },

  getAllContracts: async () => {
    return apiRequest("/contracts");
  },

  getContractsByCampaign: async (campaignId: string) => {
    return apiRequest(`/contracts/by-campaign?campaignId=${campaignId}`);
  },

  getContractsByProposal: async (proposalId: string) => {
    return apiRequest(`/contracts/by-proposal?proposalId=${proposalId}`);
  },

  getContractsByBrand: async (brandId: string) => {
    return apiRequest(`/contracts/by-brand?brandId=${brandId}`);
  },

  getContractsByCreator: async (creatorId: string) => {
    return apiRequest(`/contracts/by-creator?creatorId=${creatorId}`);
  },

  getContractsByStatus: async (
    contractStatus:
      | "Pending"
      | "Active"
      | "Awaiting Payment"
      | "Completed"
      | "Cancelled"
  ) => {
    return apiRequest(
      `/contracts/by-status?contractStatus=${encodeURIComponent(
        contractStatus
      )}`
    );
  },

  deleteContract: async (contractId: string) => {
    return apiRequest(`/contracts/${contractId}`, {
      method: "DELETE",
    });
  },
};

// Creator Work API functions
export const creatorWorkApi = {
  createWork: async (workData: {
    creatorId: string;
    title: string;
    content?: string;
    contentType: "image" | "text" | "grid" | "video" | "embed";
    thumbnailUrl?: string;
    mediaUrls?: string[];
    metrics?: {
      views?: number | string;
      likes?: number | string;
      comments?: number | string;
      shares?: number | string;
    };
    publishedDate?: string;
    collaborationBrand?: string;
    campaignName?: string;
    tags?: string[];
    isVisible?: boolean;
  }) => {
    console.log("Creator Work API: Creating work with data:", workData);

    try {
      const response = await apiRequest("/creator-works", {
        method: "POST",
        body: JSON.stringify(workData),
      });
      console.log("Creator Work API: Successfully created work:", response);
      return response;
    } catch (error) {
      console.error("Creator Work API: Error creating work:", error);
      throw error;
    }
  },

  updateWork: async (workId: string, workData: any) => {
    return apiRequest(`/creator-works/${workId}`, {
      method: "PUT",
      body: JSON.stringify(workData),
    });
  },

  getWorkById: async (workId: string) => {
    console.log("Creator Work API: Fetching work by ID:", workId);

    try {
      const response = await apiRequest(`/creator-works/${workId}`);
      console.log("Creator Work API: Successfully fetched work:", response);
      return response;
    } catch (error) {
      console.error("Creator Work API: Error fetching work:", error);
      throw error;
    }
  },

  getWorksByCreatorId: async (
    creatorId: string,
    options?: {
      isVisible?: boolean;
      contentType?: string;
      page?: number;
      limit?: number;
    }
  ) => {
    const params = new URLSearchParams();

    if (options?.isVisible !== undefined) {
      params.append("isVisible", options.isVisible.toString());
    }
    if (options?.contentType) {
      params.append("contentType", options.contentType);
    }
    if (options?.page) {
      params.append("page", options.page.toString());
    }
    if (options?.limit) {
      params.append("limit", options.limit.toString());
    }

    const queryString = params.toString();
    const url = `/creator-works/creator/${creatorId}${
      queryString ? `?${queryString}` : ""
    }`;

    return apiRequest(url);
  },

  getAllWorks: async (options?: {
    contentType?: string;
    isVisible?: boolean;
    creatorId?: string;
    collaborationBrand?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();

    if (options?.contentType) {
      params.append("contentType", options.contentType);
    }
    if (options?.isVisible !== undefined) {
      params.append("isVisible", options.isVisible.toString());
    }
    if (options?.creatorId) {
      params.append("creatorId", options.creatorId);
    }
    if (options?.collaborationBrand) {
      params.append("collaborationBrand", options.collaborationBrand);
    }
    if (options?.search) {
      params.append("search", options.search);
    }
    if (options?.page) {
      params.append("page", options.page.toString());
    }
    if (options?.limit) {
      params.append("limit", options.limit.toString());
    }

    const queryString = params.toString();
    const url = `/creator-works${queryString ? `?${queryString}` : ""}`;

    return apiRequest(url);
  },

  toggleWorkVisibility: async (workId: string, isVisible: boolean) => {
    return apiRequest(`/creator-works/${workId}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ isVisible }),
    });
  },

  deleteWork: async (workId: string) => {
    return apiRequest(`/creator-works/${workId}`, {
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

  // Batch upload multiple images
  uploadImages: async (files: File[]): Promise<{ urls: string[] }> => {
    try {
      const uploadPromises = files.map((file) =>
        imageUploadApi.uploadImage(file)
      );
      const results = await Promise.all(uploadPromises);
      const urls = results.map((result) => result.url);
      return { urls };
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      throw error;
    }
  },
};

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

// Review API functions (Creator reviews Brand/Campaign)
export const reviewApi = {
  createReview: async (reviewData: {
    campaignId: string;
    creatorId: string;
    rating: number;
    comment?: string;
  }) => {
    console.log("Review API: Creating review with data:", reviewData);

    try {
      const response = await apiRequest("/reviews", {
        method: "POST",
        body: JSON.stringify(reviewData),
      });
      console.log("Review API: Successfully created review:", response);
      return response;
    } catch (error) {
      console.error("Review API: Error creating review:", error);
      throw error;
    }
  },

  getReviewById: async (reviewId: string) => {
    return apiRequest(`/reviews/${reviewId}`);
  },

  getAllReviews: async () => {
    return apiRequest("/reviews");
  },

  getReviewsByCampaign: async (campaignId: string) => {
    return apiRequest(`/reviews/campaign/${campaignId}`);
  },

  getReviewsByCreator: async (creatorId: string) => {
    return apiRequest(`/reviews/creator/${creatorId}`);
  },

  updateReview: async (
    reviewId: string,
    reviewData: {
      rating?: number;
      comment?: string;
    }
  ) => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
  },

  deleteReview: async (reviewId: string) => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

  getReviewsByVisibility: async (isShown: boolean) => {
    return apiRequest(`/reviews/visibility?isShown=${isShown}`);
  },

  updateReviewVisibility: async (reviewId: string, isShown: boolean) => {
    return apiRequest(`/reviews/${reviewId}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ isShown }),
    });
  },
};

// Brand Review API functions (Brand reviews Creator)
export const brandReviewApi = {
  createBrandReview: async (reviewData: {
    creatorId: string;
    brandId: string;
    rating: number;
    comment?: string;
  }) => {
    console.log(
      "Brand Review API: Creating brand review with data:",
      reviewData
    );

    try {
      const response = await apiRequest("/brand-reviews", {
        method: "POST",
        body: JSON.stringify(reviewData),
      });
      console.log(
        "Brand Review API: Successfully created brand review:",
        response
      );
      return response;
    } catch (error) {
      console.error("Brand Review API: Error creating brand review:", error);
      throw error;
    }
  },

  getBrandReviewById: async (reviewId: string) => {
    return apiRequest(`/brand-reviews/${reviewId}`);
  },

  getAllBrandReviews: async () => {
    return apiRequest("/brand-reviews");
  },

  getBrandReviewsByCreator: async (creatorId: string) => {
    return apiRequest(`/brand-reviews/creator/${creatorId}`);
  },

  getBrandReviewsByBrand: async (brandId: string) => {
    return apiRequest(`/brand-reviews/brand/${brandId}`);
  },

  updateBrandReview: async (
    reviewId: string,
    reviewData: {
      rating?: number;
      comment?: string;
    }
  ) => {
    return apiRequest(`/brand-reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
  },

  deleteBrandReview: async (reviewId: string) => {
    return apiRequest(`/brand-reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

   getBrandReviewsByVisibility: async (isShown: boolean) => {
    return apiRequest(`/brand-reviews/visibility?isShown=${isShown}`);
  },

  updateBrandReviewVisibility: async (reviewId: string, isShown: boolean) => {
    return apiRequest(`/brand-reviews/${reviewId}/visibility`, {
      method: "PATCH",
      body: JSON.stringify({ isShown }),
    });
  },
};

export const chatApi = {
  // Send a message - maps to sendMessage controller function
  sendMessage: async (messageData: {
    receiverId: string;
    message: string;
    messageType?: "text" | "image" | "file" | "audio" | "video";
  }) => {
    console.log("Chat API: Sending message:", messageData);
    return apiRequest("/chat/send", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  },

  // Get user conversations - maps to getUserConversations controller function
  getUserConversations: async (page: number = 1, limit: number = 20) => {
    console.log("Chat API: Getting user conversations");
    return apiRequest(`/chat/conversations?page=${page}&limit=${limit}`);
  },

  // Get conversation messages - maps to getConversationMessages controller function  
  getConversationMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ) => {
    console.log("Chat API: Getting conversation messages for:", conversationId);
    return apiRequest(
      `/chat/conversation/${conversationId}/messages?page=${page}&limit=${limit}`
    );
  },

  // Mark messages as read - maps to markMessagesAsRead controller function
  markMessagesAsRead: async (conversationId: string) => {
    console.log("Chat API: Marking messages as read for:", conversationId);
    return apiRequest(`/chat/conversation/${conversationId}/read`, {
      method: "PUT",
    });
  },

  // Delete a message - maps to deleteMessage controller function
  deleteMessage: async (messageId: string) => {
    console.log("Chat API: Deleting message:", messageId);
    return apiRequest(`/chat/message/${messageId}`, {
      method: "DELETE",
    });
  },

  // Edit a message - maps to editMessage controller function
  editMessage: async (messageId: string, message: string) => {
    console.log("Chat API: Editing message:", messageId);
    return apiRequest(`/chat/message/${messageId}`, {
      method: "PUT",
      body: JSON.stringify({ message }),
    });
  },
};

// DEBUG: Let's also add a test function to check if the chat routes are working
export const debugChatApi = {
  testConnection: async () => {
    try {
      console.log("Testing chat API connection...");
      const response = await apiRequest("/chat/test", {
        method: "GET",
      });
      console.log("Chat API test response:", response);
      return response;
    } catch (error) {
      console.error("Chat API test failed:", error);
      throw error;
    }
  },
};

// TEMPORARY: Let's create a version that tries different endpoint patterns
export const experimentalChatApi = {
  getUserConversations: async (page: number = 1, limit: number = 20) => {
    const possibleEndpoints = [
      `/chat/conversations?page=${page}&limit=${limit}`,
      `/chats/conversations?page=${page}&limit=${limit}`,
      `/chat/user/conversations?page=${page}&limit=${limit}`,
    ];
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await apiRequest(endpoint);
        console.log(`Success with endpoint: ${endpoint}`, response);
        return response;
      } catch (error) {
        console.log(`Failed with endpoint: ${endpoint}`, error);
        if (endpoint === possibleEndpoints[possibleEndpoints.length - 1]) {
          throw error; // Throw error on last attempt
        }
      }
    }
  },
};
