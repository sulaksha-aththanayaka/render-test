import dotenv from "dotenv";
dotenv.config();

import cors from "cors"
import dbConnection from "./db.js";
import express from "express";
const app = express();
import * as userService from "./auth.service.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./swagger-config.js";
const port = process.env.PORT || 8080;

app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:8080',  // Specify your frontend URL here
//   credentials: true,  // Allow cookies to be sent with requests
// }));

app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins for testing or specify the frontend domain
    callback(null, true);  // Allows any origin (use cautiously)
  },
  credentials: true,  // Allow cookies to be sent with requests
}));

// Initialize Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  // This adds the `credentials: 'include'` to Swagger's requests
  requestInterceptor: (req) => {
    req.credentials = 'include';  // Ensures cookies are included in the request
    return req;
  }
}));

dbConnection();

app.get("/", (req, res) => {
  res.send("7th commit");
});


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: API for user authentication with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: a
 *               password:
 *                 type: string
 *                 example: a
 *     responses:
 *       200:
 *         description: User login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User login successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64d1bda7e1b14675c41234a1"
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.loginUser({ email, password }, res);

    if(user){
      console.log(user);
      res.send("User logged in");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
});


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: API to register a new user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: User registered successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64d1bda7e1b14675c41234a1"
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  

  try {
    const user = await userService.registerUser({ email, password });
    if(user){
      console.log(user);
      res.send("User registered");
    }
  
  } catch (error) {
    res.send("Failed", error);
  }
});


app.listen(port, () => {
  console.log("Server started on port 8080");
});
