FROM node:20-slim

WORKDIR /app

# Copy pre-built dist folder
COPY dist/ ./dist/

# Install serve to run the app
RUN npm install -g serve

# Expose port
EXPOSE 80

# Serve the application
CMD ["serve", "-s", "dist", "-l", "80"]
