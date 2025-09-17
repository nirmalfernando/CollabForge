import User from "./User.js";
import Category from "./Category.js";
import Creator from "./Creator.js";
import Brand from "./Brand.js";
import Proposal from "./Proposal.js";
import Contract from "./Contract.js";
import Review from "./Review.js";
import BrandReview from "./BrandReview.js";
import Campaign from "./Campaign.js";
import CreatorWork from "./CreatorWork.js";
import Chat from "./Chat.js";
import Conversation from "./Conversation.js";
import TopCreator from "./TopCreator.js";

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

// Contract to Proposal (Many-to-One)
// A Contract belongs to one Proposal, and a Proposal can have many Contracts
Proposal.hasMany(Contract, {
  foreignKey: "proposalId",
  sourceKey: "proposalId",
});
Contract.belongsTo(Proposal, {
  foreignKey: "proposalId",
  targetKey: "proposalId",
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

// BrandReview to Creator (Many-to-One)
// A BrandReview belongs to one Creator, and a Creator can have many BrandReviews
Creator.hasMany(BrandReview, {
  foreignKey: "creatorId",
  sourceKey: "creatorId",
  as: "brandReviews", // Alias to distinguish from regular reviews
});
BrandReview.belongsTo(Creator, {
  foreignKey: "creatorId",
  targetKey: "creatorId",
  as: "creator",
});

// BrandReview to Brand (Many-to-One)
// A BrandReview belongs to one Brand, and a Brand can have many BrandReviews
Brand.hasMany(BrandReview, {
  foreignKey: "brandId",
  sourceKey: "brandId",
  as: "reviewsGiven", // Alias to indicate reviews given by this brand
});
BrandReview.belongsTo(Brand, {
  foreignKey: "brandId",
  targetKey: "brandId",
  as: "brand",
});

// A Creator can have many Works, and each Work belongs to one Creator
Creator.hasMany(CreatorWork, {
  foreignKey: "creatorId",
  sourceKey: "creatorId",
  as: "works",
});
CreatorWork.belongsTo(Creator, {
  foreignKey: "creatorId",
  targetKey: "creatorId",
  as: "creator",
});

// Chat associations
User.hasMany(Chat, { foreignKey: "senderId", as: "sentMessages" });
Chat.belongsTo(User, { foreignKey: "senderId", as: "sender" });

User.hasMany(Chat, { foreignKey: "receiverId", as: "receivedMessages" });
Chat.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

Conversation.hasMany(Chat, { foreignKey: "conversationId", as: "messages" });
Chat.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

// Conversation associations
User.hasMany(Conversation, {
  foreignKey: "participant1Id",
  as: "conversationsAsParticipant1",
});
Conversation.belongsTo(User, {
  foreignKey: "participant1Id",
  as: "participant1",
});

User.hasMany(Conversation, {
  foreignKey: "participant2Id",
  as: "conversationsAsParticipant2",
});
Conversation.belongsTo(User, {
  foreignKey: "participant2Id",
  as: "participant2",
});

// TopCreator to Creator (Many-to-One)
// A TopCreator belongs to one Creator, and a Creator can have many TopCreator entries
Creator.hasMany(TopCreator, {
  foreignKey: "creatorId",
  sourceKey: "creatorId",
  as: "topCreatorEntries"
});
TopCreator.belongsTo(Creator, {
  foreignKey: "creatorId",
  targetKey: "creatorId",
  as: "Creator"
});

// TopCreator to Category (Many-to-One)
// A TopCreator belongs to one Category, and a Category can have many TopCreator entries
Category.hasMany(TopCreator, {
  foreignKey: "categoryId",
  sourceKey: "categoryId",
  as: "topCreators"
});
TopCreator.belongsTo(Category, {
  foreignKey: "categoryId",
  targetKey: "categoryId",
  as: "Category"
});

export default {
  User,
  Category,
  Creator,
  TopCreator,
  Brand,
  Campaign,
  Proposal,
  Contract,
  Review,
  BrandReview,
  CreatorWork,
  Chat,
  Conversation,
};
