import User from "./User.js";
import Category from "./Category.js";
import Creator from "./Creator.js";
import Brand from "./Brand.js";
import Proposal from "./Proposal.js";
import Contract from "./Contract.js";
import Review from "./Review.js";
import Campaign from "./Campaign.js";

// Define associations between models

// User to Brand (One-to-One)
// A User can be a Brand, and a Brand references a User
User.hasOne(Brand, {
  foreignKey: "brandId",
  sourceKey: "userId",
});
Brand.belongsTo(User, {
  foreignKey: "brandId",
  targetKey: "userId",
});

// User to Creator (One-to-One)
// A User can be a Creator, and a Creator references a User
User.hasOne(Creator, {
  foreignKey: "creatorId",
  sourceKey: "userId",
});
Creator.belongsTo(User, {
  foreignKey: "creatorId",
  targetKey: "userId",
});

// Creator to Category (Many-to-One)
// A Creator belongs to one Category, and a Category can have many Creators
Category.hasMany(Creator, {
  foreignKey: "categoryId",
  sourceKey: "categoryId",
});
Creator.belongsTo(Category, {
  foreignKey: "categoryId",
  targetKey: "categoryId",
});

// Campaign to Category (Many-to-One)
// A Campaign belongs to one Category, and a Category can have many Campaigns
Category.hasMany(Campaign, {
  foreignKey: "categoryId",
  sourceKey: "categoryId",
});
Campaign.belongsTo(Category, {
  foreignKey: "categoryId",
  targetKey: "categoryId",
});

// Campaign to Brand (Many-to-One)
// A Campaign belongs to one Brand, and a Brand can have many Campaigns
Brand.hasMany(Campaign, {
  foreignKey: "brandId",
  sourceKey: "brandId",
});
Campaign.belongsTo(Brand, {
  foreignKey: "brandId",
  targetKey: "brandId",
});

// Proposal to Creator (Many-to-One)
// A Proposal belongs to one Creator, and a Creator can have many Proposals
Creator.hasMany(Proposal, {
  foreignKey: "creatorId",
  sourceKey: "creatorId",
});
Proposal.belongsTo(Creator, {
  foreignKey: "creatorId",
  targetKey: "creatorId",
});

// Proposal to Campaign (Many-to-One)
// A Proposal belongs to one Campaign, and a Campaign can have many Proposals
Campaign.hasMany(Proposal, {
  foreignKey: "campaignId",
  sourceKey: "campaignId",
});
Proposal.belongsTo(Campaign, {
  foreignKey: "campaignId",
  targetKey: "campaignId",
});

// Contract to Creator (Many-to-One)
// A Contract belongs to one Creator, and a Creator can have many Contracts
Creator.hasMany(Contract, {
  foreignKey: "creatorId",
  sourceKey: "creatorId",
});
Contract.belongsTo(Creator, {
  foreignKey: "creatorId",
  targetKey: "creatorId",
});

// Contract to Brand (Many-to-One)
// A Contract belongs to one Brand, and a Brand can have many Contracts
Brand.hasMany(Contract, {
  foreignKey: "brandId",
  sourceKey: "brandId",
});
Contract.belongsTo(Brand, {
  foreignKey: "brandId",
  targetKey: "brandId",
});

// Contract to Campaign (Many-to-One)
// A Contract belongs to one Campaign, and a Campaign can have many Contracts
Campaign.hasMany(Contract, {
  foreignKey: "campaignId",
  sourceKey: "campaignId",
});
Contract.belongsTo(Campaign, {
  foreignKey: "campaignId",
  targetKey: "campaignId",
});

// Review to Creator (Many-to-One)
// A Review belongs to one Creator, and a Creator can have many Reviews
Creator.hasMany(Review, {
  foreignKey: "creatorId",
  sourceKey: "creatorId",
});
Review.belongsTo(Creator, {
  foreignKey: "creatorId",
  targetKey: "creatorId",
});

// Review to Campaign (Many-to-One)
// A Review belongs to one Campaign, and a Campaign can have many Reviews
Campaign.hasMany(Review, {
  foreignKey: "campaignId",
  sourceKey: "campaignId",
});
Review.belongsTo(Campaign, {
  foreignKey: "campaignId",
  targetKey: "campaignId",
});

export default {
  User,
  Category,
  Creator,
  Brand,
  Campaign,
  Proposal,
  Contract,
  Review,
};
