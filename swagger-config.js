import { join } from "path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for your application",
    },
    servers: [
      {
        url: "https://render-test-zr2d.onrender.com", // Replace with your server URL
        description: "Development Server",
      },
    ],
  },
  apis: [join(process.cwd(), "server.js")], // Include your route file for Swagger annotations
};

export default swaggerOptions;
