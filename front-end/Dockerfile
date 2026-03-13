FROM node:alpine AS builder

WORKDIR /app

# Install back-end deps for TypeScript type resolution
COPY back-end/package*.json ./back-end/
RUN cd back-end && npm ci

# Install front-end deps
COPY front-end/package*.json ./front-end/
RUN cd front-end && npm ci

# Copy source
COPY back-end/ ./back-end/
COPY front-end/ ./front-end/

ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_CONVEX_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL

RUN cd front-end && npm run build

FROM nginx:alpine

COPY --from=builder /app/front-end/dist /usr/share/nginx/html
COPY front-end/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
