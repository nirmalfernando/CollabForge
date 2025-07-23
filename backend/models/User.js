import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the User model
const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "User ID must be a valid UUID",
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "Name must be between 1 and 255 characters long",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 100],
          msg: "Username must be between 3 and 100 characters long",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email must be a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: "Password must be at least 8 characters long",
        },
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/,
          msg: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
      },
    },
    contactNo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^\+?[1-9]\d{7,14}$/,
          msg: "Contact number must be in international format (e.g., +1234567890)",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("influencer", "brand", "admin", "moderator"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["influencer", "brand", "admin", "moderator"]],
          msg: "Role must be either 'influencer', 'brand', 'admin', or 'moderator'",
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
    tableName: "users",
    underscored: true,
  }
);

export default User;
