import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the Creator model
const Creator = sequelize.define(
  "Creator",
  {
    creatorId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "Creator ID must be a valid UUID",
        },
      },
      references: {
        model: "users", // Reference to the User model
        key: "user_id",
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: "First name must be between 1 and 100 characters long",
        },
      },
    },
    nickName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: "Nickname must be up to 100 characters long",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: "Last name must be between 1 and 100 characters long",
        },
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Bio must be up to 500 characters long",
        },
      },
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isJSON: {
          msg: "Details must be a valid JSON object",
        },
        // isValidDetails(value) {
        //   if (!Array.isArray(value)) {
        //     throw new Error("Details must be an array of objects");
        //   }
        //   value.forEach((item) => {
        //     if (typeof item !== "object" || Array.isArray(item)) {
        //       throw new Error("Each detail must be an object");
        //     }
        //   });
        // },
      },
    },
    socialMedia: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isJSON: {
          msg: "Social media must be a valid JSON object",
        },
        // isValidSocialMedia(value) {
        //   if (!Array.isArray(value)) {
        //     throw new Error("Social media must be an array of objects");
        //   }
        //   value.forEach((item) => {
        //     if (typeof item !== "object" || Array.isArray(item)) {
        //       throw new Error("Each social media entry must be an object");
        //     }
        //   });
        // },
      },
    },
    whatIDo: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isJSON: {
          msg: "What I do must be a valid JSON object",
        },
        // isValidWhatIDo(value) {
        //   if (!Array.isArray(value)) {
        //     throw new Error("What I do must be an array of objects");
        //   }
        //   value.forEach((item) => {
        //     if (typeof item !== "object" || Array.isArray(item)) {
        //       throw new Error("Each entry in 'What I do' must be an object");
        //     }
        //   });
        // },
      },
    },
    myPeople: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isJSON: {
          msg: "My people must be a valid JSON object",
        },
        // isValidMyPeople(value) {
        //   if (!Array.isArray(value)) {
        //     throw new Error("My people must be an array of objects");
        //   }
        //   value.forEach((item) => {
        //     if (typeof item !== "object" || Array.isArray(item)) {
        //       throw new Error("Each entry in 'My people' must be an object");
        //     }
        //   });
        // },
      },
    },
    myContent: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isJSON: {
          msg: "My content must be a valid JSON object",
        },
        // isValidMyContent(value) {
        //   if (!Array.isArray(value)) {
        //     throw new Error("My content must be an array of objects");
        //   }
        //   value.forEach((item) => {
        //     if (typeof item !== "object" || Array.isArray(item)) {
        //       throw new Error("Each entry in 'My content' must be an object");
        //     }
        //   });
        // },
      },
    },
    pastCollaborations: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      validate: {
        isJSON: {
          msg: "Past collaborations must be a valid JSON object",
        },
        // isValidPastCollaborations(value) {
        //   if (!Array.isArray(value)) {
        //     throw new Error("Past collaborations must be an array of objects");
        //   }
        //   value.forEach((item) => {
        //     if (typeof item !== "object" || Array.isArray(item)) {
        //       throw new Error("Each past collaboration must be an object");
        //     }
        //   });
        // },
      },
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "categories", // Reference to the Category model
        key: "category_id", // Reference to the primary key of the Category model
      },
    },
    profilePicUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Profile picture URL must be a valid URL",
        },
      },
    },
    backgroundImgUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Background image URL must be a valid URL",
        },
      },
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isAlphanumeric: {
          msg: "Account number must be alphanumeric",
        },
        len: {
          args: [1, 50],
          msg: "Account number must be between 1 and 50 characters long",
        },
      },
    },
    type: {
      type: DataTypes.ENUM("Content Creator", "Model", "Live Streamer"),
      allowNull: false,
      defaultValue: "Content Creator",
      validate: {
        isIn: {
          args: [["Content Creator", "Model", "Live Streamer"]],
          msg: "Type must be one of 'Content Creator', 'Model', or 'Live Streamer'",
        },
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "creators",
    underscored: true,
  }
);

export default Creator;
