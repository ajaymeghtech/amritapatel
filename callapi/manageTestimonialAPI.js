/**
 * ============================================
 * TESTIMONIAL MODULE API DOCUMENTATION
 * ============================================
 * 
 * Base URL: http://localhost:5000/api
 * 
 * All data is stored in a single table (TestimonialCategory) 
 * with nested arrays for testimonials[] and videos[]
 * 
 * ============================================
 */

// ============================================
// 1. TESTIMONIAL CATEGORIES (Parent Table)
// ============================================

/**
 * API Name: Get All Categories
 * Method: GET
 * URL: /api/testimonial-categories
 * Headers: None
 * Body: None
 * 
 * Response:
 * {
 *   "status": true,
 *   "message": "Testimonial categories fetched successfully",
 *   "data": [
 *     {
 *       "_id": "...",
 *       "title": "Student",
 *       "description": "",
 *       "status": "active",
 *       "sortOrder": 0,
 *       "testimonials": [],
 *       "videos": [],
 *       "createdAt": "...",
 *       "updatedAt": "..."
 *     }
 *   ]
 * }
 */

/**
 * API Name: Get Category by ID
 * Method: GET
 * URL: /api/testimonial-categories/:id
 * Headers: None
 * Body: None
 * 
 * Example: /api/testimonial-categories/507f1f77bcf86cd799439011
 */

/**
 * API Name: Create Category
 * Method: POST
 * URL: /api/testimonial-categories
 * Headers: {
 *   "Content-Type": "application/json"
 * }
 * Body (JSON):
 * {
 *   "title": "Student",
 *   "description": "Student testimonials",
 *   "status": "active",
 *   "sortOrder": 0
 * }
 * 
 * Response:
 * {
 *   "status": true,
 *   "message": "Testimonial category created successfully",
 *   "data": { ... }
 * }
 */

/**
 * API Name: Update Category
 * Method: PUT
 * URL: /api/testimonial-categories/:id
 * Headers: {
 *   "Content-Type": "application/json"
 * }
 * Body (JSON):
 * {
 *   "title": "Student",
 *   "description": "Updated description",
 *   "status": "active",
 *   "sortOrder": 1
 * }
 * 
 * Example: /api/testimonial-categories/507f1f77bcf86cd799439011
 */

/**
 * API Name: Delete Category
 * Method: DELETE
 * URL: /api/testimonial-categories/:id
 * Headers: None
 * Body: None
 * 
 * Example: /api/testimonial-categories/507f1f77bcf86cd799439011
 */

// ============================================
// 2. TESTIMONIALS (Nested in Category)
// ============================================

/**
 * API Name: Get All Testimonials
 * Method: GET
 * URL: /api/testimonial-categories/testimonials/all
 * Query Params (Optional): ?category_id=CATEGORY_ID
 * Headers: None
 * Body: None
 * 
 * Examples:
 * - /api/testimonial-categories/testimonials/all
 * - /api/testimonial-categories/testimonials/all?category_id=507f1f77bcf86cd799439011
 * 
 * Response:
 * {
 *   "status": true,
 *   "message": "Testimonials fetched successfully",
 *   "data": [
 *     {
 *       "_id": "...",
 *       "name": "John Doe",
 *       "designation": "Third Year Student",
 *       "institute": "Amrita Patel Centre",
 *       "message": "Great experience!",
 *       "rating": 5,
 *       "photo": "/uploads/testimonials/...",
 *       "status": "active",
 *       "sortOrder": 0,
 *       "category_id": "...",
 *       "category_title": "Student",
 *       "createdAt": "...",
 *       "updatedAt": "..."
 *     }
 *   ]
 * }
 */

/**
 * API Name: Add Testimonial to Category
 * Method: POST
 * URL: /api/testimonial-categories/:categoryId/testimonials
 * Headers: {
 *   "Content-Type": "multipart/form-data"
 * }
 * Body (FormData):
 * - name: "John Doe" (required)
 * - designation: "Third Year Student" (optional)
 * - institute: "Amrita Patel Centre" (optional)
 * - message: "Great experience!" (required)
 * - rating: "5" (optional, 1-5)
 * - status: "active" (optional, default: "active")
 * - sortOrder: "0" (optional, default: 0)
 * - photo: [File] (optional - currently hidden in UI)
 * 
 * Example URL: /api/testimonial-categories/507f1f77bcf86cd799439011/testimonials
 * 
 * Postman Form-data Example:
 * Key: name | Value: John Doe
 * Key: designation | Value: Third Year Student
 * Key: institute | Value: Amrita Patel Centre
 * Key: message | Value: Great experience!
 * Key: rating | Value: 5
 * Key: status | Value: active
 * Key: sortOrder | Value: 0
 * Key: photo | Type: File | Value: [Select File]
 * 
 * Response:
 * {
 *   "status": true,
 *   "message": "Testimonial added successfully",
 *   "data": { ... }
 * }
 */

/**
 * API Name: Update Testimonial
 * Method: PUT
 * URL: /api/testimonial-categories/:categoryId/testimonials/:testimonialId
 * Headers: {
 *   "Content-Type": "multipart/form-data"
 * }
 * Body (FormData):
 * - name: "John Doe" (required)
 * - designation: "Third Year Student" (optional)
 * - institute: "Amrita Patel Centre" (optional)
 * - message: "Updated message" (required)
 * - rating: "5" (optional)
 * - status: "active" (optional)
 * - sortOrder: "0" (optional)
 * - photo: [File] (optional - only if updating photo)
 * 
 * Example URL: /api/testimonial-categories/507f1f77bcf86cd799439011/testimonials/507f1f77bcf86cd799439012
 * 
 * Postman Form-data Example:
 * Key: name | Value: John Doe Updated
 * Key: designation | Value: Final Year Student
 * Key: message | Value: Updated testimonial message
 * Key: status | Value: active
 * Key: sortOrder | Value: 1
 */

/**
 * API Name: Delete Testimonial
 * Method: DELETE
 * URL: /api/testimonial-categories/:categoryId/testimonials/:testimonialId
 * Headers: None
 * Body: None
 * 
 * Example URL: /api/testimonial-categories/507f1f77bcf86cd799439011/testimonials/507f1f77bcf86cd799439012
 * 
 * Response:
 * {
 *   "status": true,
 *   "message": "Testimonial deleted successfully"
 * }
 */

// ============================================
// 3. TESTIMONIAL VIDEOS (Nested in Category)
// ============================================

/**
 * API Name: Get All Videos
 * Method: GET
 * URL: /api/testimonial-categories/videos/all
 * Query Params (Optional): ?category_id=CATEGORY_ID
 * Headers: None
 * Body: None
 * 
 * Examples:
 * - /api/testimonial-categories/videos/all
 * - /api/testimonial-categories/videos/all?category_id=507f1f77bcf86cd799439011
 * 
 * Response:
 * {
 *   "status": true,
 *   "message": "Videos fetched successfully",
 *   "data": [
 *     {
 *       "_id": "...",
 *       "title": "Student Testimonial Video",
 *       "video_url": "https://www.youtube.com/watch?v=...",
 *       "thumbnail": "/uploads/testimonial-videos/...",
 *       "description": "",
 *       "status": "active",
 *       "sortOrder": 0,
 *       "category_id": "...",
 *       "category_title": "Student",
 *       "createdAt": "...",
 *       "updatedAt": "..."
 *     }
 *   ]
 * }
 */

/**
 * API Name: Add Video to Category
 * Method: POST
 * URL: /api/testimonial-categories/:categoryId/videos
 * Headers: {
 *   "Content-Type": "multipart/form-data"
 * }
 * Body (FormData):
 * - title: "Student Testimonial Video" (required)
 * - video_url: "https://www.youtube.com/watch?v=..." (required)
 * - description: "Video description" (optional - currently hidden in UI)
 * - status: "active" (optional, default: "active")
 * - sortOrder: "0" (optional, default: 0)
 * - thumbnail: [File] (optional - currently hidden in UI)
 * 
 * Example URL: /api/testimonial-categories/507f1f77bcf86cd799439011/videos
 * 
 * Postman Form-data Example:
 * Key: title | Value: Student Testimonial Video
 * Key: video_url | Value: https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * Key: description | Value: This is a student testimonial
 * Key: status | Value: active
 * Key: sortOrder | Value: 0
 * Key: thumbnail | Type: File | Value: [Select File]
 * 
 * Response:
 * {
 *   "status": true,
 *   "message": "Video added successfully",
 *   "data": { ... }
 * }
 */

/**
 * API Name: Update Video
 * Method: PUT
 * URL: /api/testimonial-categories/:categoryId/videos/:videoId
 * Headers: {
 *   "Content-Type": "multipart/form-data"
 * }
 * Body (FormData):
 * - title: "Updated Video Title" (required)
 * - video_url: "https://www.youtube.com/watch?v=..." (required)
 * - description: "Updated description" (optional)
 * - status: "active" (optional)
 * - sortOrder: "0" (optional)
 * - thumbnail: [File] (optional - only if updating thumbnail)
 * 
 * Example URL: /api/testimonial-categories/507f1f77bcf86cd799439011/videos/507f1f77bcf86cd799439013
 * 
 * Postman Form-data Example:
 * Key: title | Value: Updated Video Title
 * Key: video_url | Value: https://www.youtube.com/watch?v=NEW_VIDEO_ID
 * Key: status | Value: active
 * Key: sortOrder | Value: 1
 */

/**
 * API Name: Delete Video
 * Method: DELETE
 * URL: /api/testimonial-categories/:categoryId/videos/:videoId
 * Headers: None
 * Body: None
 * 
 * Example URL: /api/testimonial-categories/507f1f77bcf86cd799439011/videos/507f1f77bcf86cd799439013
 * 
 * Response:
 * {
 *   "status": true,
 *   "message": "Video deleted successfully"
 * }
 */

// ============================================
// POSTMAN COLLECTION EXAMPLES
// ============================================

/**
 * ============================================
 * EXAMPLE 1: Create Category and Add Testimonial
 * ============================================
 * 
 * Step 1: Create Category
 * POST http://localhost:5000/api/testimonial-categories
 * Body (raw JSON):
 * {
 *   "title": "Student",
 *   "description": "Student testimonials",
 *   "status": "active",
 *   "sortOrder": 0
 * }
 * 
 * Response will give you category _id, e.g., "507f1f77bcf86cd799439011"
 * 
 * Step 2: Add Testimonial to Category
 * POST http://localhost:5000/api/testimonial-categories/507f1f77bcf86cd799439011/testimonials
 * Body (form-data):
 * name: "John Doe"
 * designation: "Third Year Student"
 * institute: "Amrita Patel Centre"
 * message: "Great experience at the university!"
 * rating: "5"
 * status: "active"
 * sortOrder: "0"
 * 
 * ============================================
 * EXAMPLE 2: Create Category and Add Video
 * ============================================
 * 
 * Step 1: Create Category (same as above)
 * 
 * Step 2: Add Video to Category
 * POST http://localhost:5000/api/testimonial-categories/507f1f77bcf86cd799439011/videos
 * Body (form-data):
 * title: "Student Testimonial Video"
 * video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 * status: "active"
 * sortOrder: "0"
 * 
 * ============================================
 * EXAMPLE 3: Get All Testimonials for a Category
 * ============================================
 * 
 * GET http://localhost:5000/api/testimonial-categories/testimonials/all?category_id=507f1f77bcf86cd799439011
 * 
 * ============================================
 * EXAMPLE 4: Get All Videos for a Category
 * ============================================
 * 
 * GET http://localhost:5000/api/testimonial-categories/videos/all?category_id=507f1f77bcf86cd799439011
 * 
 * ============================================
 */

// ============================================
// ERROR RESPONSES
// ============================================

/**
 * Common Error Responses:
 * 
 * 400 Bad Request:
 * {
 *   "status": false,
 *   "message": "Category not found"
 * }
 * 
 * 404 Not Found:
 * {
 *   "status": false,
 *   "message": "Not found"
 * }
 * 
 * 500 Server Error:
 * {
 *   "status": false,
 *   "message": "Error message here"
 * }
 */

// ============================================
// NOTES
// ============================================

/**
 * IMPORTANT NOTES:
 * 
 * 1. All testimonials and videos are stored as nested arrays within the category document
 * 2. When you delete a category, all nested testimonials and videos are also deleted
 * 3. Photo and thumbnail uploads are optional (currently hidden in UI but API accepts them)
 * 4. Description field for videos is optional (currently hidden in UI)
 * 5. Rating and photo fields for testimonials are optional (currently hidden in UI)
 * 6. Use multipart/form-data for POST/PUT requests that include file uploads
 * 7. Use application/json for category CRUD operations
 * 8. Category ID and Testimonial/Video IDs are MongoDB ObjectIds
 */

module.exports = {};

