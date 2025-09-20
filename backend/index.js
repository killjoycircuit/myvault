require('dotenv').config();
const express = require("express");
const Jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { z } = require("zod");
const bcryptjs = require("bcryptjs");
const { userModel, contentModel, linkModel, tagModel } = require("./models/db");
const { randomString } = require("./utils");
const cors = require("cors");
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Validate environment variables at startup
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const MONGO_URL = process.env.MONGO_URL;

if (!JWT_SECRET_KEY) {
    console.error("CRITICAL ERROR: JWT_SECRET_KEY environment variable is not set!");
    console.error("Please add JWT_SECRET_KEY to your .env file");
    process.exit(1);
}

if (!MONGO_URL) {
    console.error("CRITICAL ERROR: MONGO_URL environment variable is not set!");
    console.error("Please add MONGO_URL to your .env file");
    process.exit(1);
}

console.log("Environment variables loaded successfully ✓");

// Import middleware after environment validation
const { userMiddleware } = require("./middleware");

async function main() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB successfully ✓");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

main();

app.use(cors());
app.use(express.json());

// Signup endpoint
app.post("/api/v1/signup", async function (req, res) {
    const { username, email, password, avatar } = req.body;
    
    const requireBody = z.object({
        username: z.string().min(3).max(20),
        email: z.string().email(),
        password: z.string().min(6).max(20),
        avatar: z.string().url().optional().or(z.literal(""))
    });

    try {
        const parseData = requireBody.safeParse(req.body);
        if (!parseData.success) {
            return res.status(400).json({
                message: "Invalid Data",
                error: parseData.error.issues
            });
        }

        const existingUser = await userModel.findOne({ 
            $or: [{ email: email }, { username: username }] 
        });
        
        if (existingUser) {
            return res.status(409).json({
                message: existingUser.email === email ? "Email already exists" : "Username already exists"
            });
        }

        const hashPassword = await bcryptjs.hash(password, 10);
        
        const newUser = await userModel.create({
            username: username,
            email: email,
            password: hashPassword,
            avatar: avatar || ""
        });

        console.log("New user created:", email);

        res.status(201).json({
            message: "You are signed up successfully"
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Error occurred during signup"
        });
    }
});

// Signin endpoint
app.post("/api/v1/signin", async function (req, res) {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required"
        });
    }
    
    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const tokenPayload = { UserId: user._id.toString() };
        const token = Jwt.sign(tokenPayload, JWT_SECRET_KEY, { expiresIn: "7d" });
        
        console.log("User signed in:", email);
        console.log("Token created with secret:", JWT_SECRET_KEY ? "✓" : "✗");
        
        res.json({
            message: "Signed in successfully",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({
            message: "Error occurred during signin"
        });
    }
});

// Get user profile endpoint
app.get("/api/v1/profile", userMiddleware, async function (req, res) {
    try {
        const user = await userModel.findById(req.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        console.log("Profile fetched for user:", req.userId);

        res.json({
            message: "Profile fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({
            message: "Error occurred while fetching profile"
        });
    }
});

// Update user profile endpoint
app.put("/api/v1/profile", userMiddleware, async function (req, res) {
    const { username, avatar } = req.body;
    
    const updateSchema = z.object({
        username: z.string().min(3).max(20).optional(),
        avatar: z.string().url().optional().or(z.literal(""))
    });

    try {
        const parseData = updateSchema.safeParse({ username, avatar });
        if (!parseData.success) {
            return res.status(400).json({
                message: "Invalid profile data",
                error: parseData.error.issues
            });
        }

        // Check if username is already taken by another user
        if (username) {
            const existingUser = await userModel.findOne({ 
                username: username,
                _id: { $ne: req.userId }
            });
            
            if (existingUser) {
                return res.status(409).json({
                    message: "Username already exists"
                });
            }
        }

        const updateData = {};
        if (username !== undefined) updateData.username = username;
        if (avatar !== undefined) updateData.avatar = avatar;

        const updatedUser = await userModel.findByIdAndUpdate(
            req.userId, 
            updateData,
            { new: true, select: '-password' }
        );

        console.log("Profile updated for user:", req.userId);

        res.json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar
            }
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({
            message: "Error occurred while updating profile"
        });
    }
});

// Create tag endpoint
app.post("/api/v1/tags", userMiddleware, async function (req, res) {
    const { name, color } = req.body;
    
    const tagSchema = z.object({
        name: z.string().min(1).max(50),
        color: z.string().optional()
    });

    try {
        const parseData = tagSchema.safeParse({ name, color });
        if (!parseData.success) {
            return res.status(400).json({
                message: "Invalid tag data",
                error: parseData.error.issues
            });
        }

        const existingTag = await tagModel.findOne({ 
            name: name.trim(), 
            userId: req.userId 
        });
        
        if (existingTag) {
            return res.status(409).json({
                message: "Tag with this name already exists"
            });
        }

        const tag = await tagModel.create({
            name: name.trim(),
            color: color || "#3B82F6",
            userId: req.userId
        });

        console.log("Tag created for user:", req.userId);

        res.status(201).json({
            message: "Tag created successfully",
            data: tag
        });
    } catch (error) {
        console.error("Tag creation error:", error);
        res.status(500).json({
            message: "Error occurred while creating tag"
        });
    }
});

// Update tag endpoint
app.put("/api/v1/tags/:tagId", userMiddleware, async function (req, res) {
    const { tagId } = req.params;
    const { name, color } = req.body;
    
    const tagSchema = z.object({
        name: z.string().min(1).max(50),
        color: z.string().optional()
    });

    try {
        const parseData = tagSchema.safeParse({ name, color });
        if (!parseData.success) {
            return res.status(400).json({
                message: "Invalid tag data",
                error: parseData.error.issues
            });
        }

        // Check if another tag with the same name exists for this user
        const existingTag = await tagModel.findOne({ 
            name: name.trim(), 
            userId: req.userId,
            _id: { $ne: tagId }
        });
        
        if (existingTag) {
            return res.status(409).json({
                message: "Tag with this name already exists"
            });
        }

        const updatedTag = await tagModel.findOneAndUpdate(
            { _id: tagId, userId: req.userId },
            { 
                name: name.trim(),
                color: color || "#3B82F6"
            },
            { new: true }
        );

        if (!updatedTag) {
            return res.status(404).json({
                message: "Tag not found or unauthorized"
            });
        }

        console.log("Tag updated for user:", req.userId);

        res.json({
            message: "Tag updated successfully",
            data: updatedTag
        });
    } catch (error) {
        console.error("Tag update error:", error);
        res.status(500).json({
            message: "Error occurred while updating tag"
        });
    }
});

// Get user tags endpoint
app.get("/api/v1/tags", userMiddleware, async function (req, res) {
    try {
        const tags = await tagModel.find({ userId: req.userId }).sort({ name: 1 });
        
        console.log("Tags fetched for user:", req.userId, "Count:", tags.length);
        
        res.json({
            message: "Tags fetched successfully",
            data: tags
        });
    } catch (error) {
        console.error("Tags fetch error:", error);
        res.status(500).json({
            message: "Error occurred while fetching tags"
        });
    }
});

// Create content endpoint (updated with tags support)
app.post("/api/v1/content", userMiddleware, async function (req, res) {
    const { link, type, title, tags } = req.body;
    
    const contentSchema = z.object({
        link: z.string().url(),
        type: z.string().min(1),
        title: z.string().min(1),
        tags: z.array(z.string()).optional()
    });

    try {
        const parseData = contentSchema.safeParse({ link, type, title, tags });
        if (!parseData.success) {
            return res.status(400).json({
                message: "Invalid content data",
                error: parseData.error.issues
            });
        }

        // Validate that all provided tags belong to the user
        if (tags && tags.length > 0) {
            const userTags = await tagModel.find({ 
                _id: { $in: tags }, 
                userId: req.userId 
            });
            
            if (userTags.length !== tags.length) {
                return res.status(400).json({
                    message: "Some tags are invalid or don't belong to you"
                });
            }
        }

        const content = await contentModel.create({
            link: link,
            type: type,
            title: title,
            userId: req.userId,
            tags: tags || []
        });

        console.log("Content created for user:", req.userId);

        res.status(201).json({
            message: "Content created successfully",
            data: content
        });
    } catch (error) {
        console.error("Content creation error:", error);
        res.status(500).json({
            message: "Error occurred while saving content"
        });
    }
});

// Get user content endpoint (updated with tags population and sorting)
app.get("/api/v1/content", userMiddleware, async function (req, res) {
    try {
        const { sortBy, filterTag } = req.query;
        
        let query = { userId: req.userId };
        
        // Filter by tag if specified
        if (filterTag) {
            query.tags = filterTag;
        }
        
        let sortOption = { createdAt: -1 }; // Default: newest first
        
        // Determine sort option
        switch (sortBy) {
            case 'title':
                sortOption = { title: 1 };
                break;
            case 'type':
                sortOption = { type: 1, createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'newest':
            default:
                sortOption = { createdAt: -1 };
                break;
        }
        
        const content = await contentModel
            .find(query)
            .populate('tags', 'name color')
            .sort(sortOption);
        
        console.log("Content fetched for user:", req.userId, "Count:", content.length);
        
        res.json({
            message: "Content fetched successfully",
            data: content
        });
    } catch (error) {
        console.error("Content fetch error:", error);
        res.status(500).json({
            message: "Error occurred while fetching content"
        });
    }
});

// Delete content endpoint
app.delete("/api/v1/content", userMiddleware, async function (req, res) {
    const { contentId } = req.body;
    
    if (!contentId) {
        return res.status(400).json({
            message: "Content ID is required"
        });
    }

    try {
        const result = await contentModel.deleteOne({ 
            userId: req.userId, 
            _id: contentId 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Content not found or unauthorized"
            });
        }

        console.log("Content deleted for user:", req.userId);

        res.json({
            message: "Content deleted successfully"
        });
    } catch (error) {
        console.error("Content deletion error:", error);
        res.status(500).json({
            message: "Error occurred while deleting content"
        });
    }
});

// Delete tag endpoint
app.delete("/api/v1/tags", userMiddleware, async function (req, res) {
    const { tagId } = req.body;
    
    if (!tagId) {
        return res.status(400).json({
            message: "Tag ID is required"
        });
    }

    try {
        // Remove tag from all content first
        await contentModel.updateMany(
            { userId: req.userId },
            { $pull: { tags: tagId } }
        );

        // Delete the tag
        const result = await tagModel.deleteOne({ 
            userId: req.userId, 
            _id: tagId 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Tag not found or unauthorized"
            });
        }

        console.log("Tag deleted for user:", req.userId);

        res.json({
            message: "Tag deleted successfully"
        });
    } catch (error) {
        console.error("Tag deletion error:", error);
        res.status(500).json({
            message: "Error occurred while deleting tag"
        });
    }
});

// Share brain endpoint
app.post("/api/v1/brain/share", userMiddleware, async function (req, res) {
    try {
        const { shareLink } = req.body;
        const enableShare = shareLink === "true" || shareLink === true;
        const existingLink = await linkModel.findOne({ userId: req.userId });

        if (enableShare) {
            let hash;
            if (existingLink) {
                hash = existingLink.hash;
            } else {
                const newLink = await linkModel.create({
                    hash: randomString(10),
                    userId: req.userId
                });
                hash = newLink.hash;
            }
            
            console.log("Share link created/retrieved for user:", req.userId);
            
            res.json({
                message: "Shareable link created successfully",
                hash: hash
            });
        } else {
            if (existingLink) {
                await linkModel.deleteOne({ userId: req.userId });
            }
            
            console.log("Share link removed for user:", req.userId);
            
            res.json({
                message: "Shareable link removed successfully"
            });
        }
    } catch (error) {
        console.error("Share link error:", error);
        res.status(500).json({
            message: "Error occurred while updating shareable link"
        });
    }
});

// Get shared brain content endpoint (updated with tags)
app.get("/api/v1/brain/:shareLink", async function (req, res) {
    try {
        const link = await linkModel.findOne({ hash: req.params.shareLink });
        if (!link) {
            return res.status(404).json({
                message: "No content available for this link"
            });
        }

        const content = await contentModel
            .find({ userId: link.userId })
            .populate('tags', 'name color')
            .sort({ createdAt: -1 });
        
        console.log("Shared content accessed:", req.params.shareLink);
        
        res.json({
            message: "Shared content fetched successfully",
            data: content
        });
    } catch (error) {
        console.error("Shared content fetch error:", error);
        res.status(500).json({
            message: "Error occurred while fetching shared content"
        });
    }
});

// Link preview endpoint
app.get('/api/v1/preview', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ message: "URL is required" });
    }

    try {
        const response = await axios.get(url, {
            headers: {
                // Add headers to mimic a real browser request
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            // Set a timeout to prevent hanging requests
            timeout: 5000 
        });

        const $ = cheerio.load(response.data);

        // Helper function to get meta content
        const getMetaContent = (selectors) => {
            for (const selector of selectors) {
                const content = $(selector).attr('content') || $(selector).attr('href');
                if (content) {
                    return content.trim();
                }
            }
            return null;
        };

        const title = getMetaContent(['meta[property="og:title"]', 'meta[name="twitter:title"]']) || $('title').text().trim();
        const description = getMetaContent(['meta[property="og:description"]', 'meta[name="description"]', 'meta[name="twitter:description"]']);
        let image = getMetaContent(['meta[property="og:image"]', 'meta[name="twitter:image"]']);
        const siteName = getMetaContent(['meta[property="og:site_name"]']) || new URL(url).hostname;
        const favicon = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`;

        // Handle relative image URLs
        if (image && !image.startsWith('http')) {
            try {
                image = new URL(image, url).href;
            } catch (e) {
                image = null;
            }
        }

        res.json({ title, description, image, siteName, favicon });

    } catch (error) {
        console.error(`Failed to fetch preview for ${url}:`, error.message);
        res.status(500).json({ message: "Failed to fetch link preview." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});