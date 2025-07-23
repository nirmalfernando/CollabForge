import { DataTypes } from "sequelize";
import sequelize from "../connect.js";

// Define the Category model
const Category = sequelize.define(
  "Category",
  {
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: "Category ID must be a valid UUID",
        },
      },
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "Category name must be between 1 and 255 characters long",
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
    tableName: "categories",
    underscored: true,
  }
);

export default Category;
