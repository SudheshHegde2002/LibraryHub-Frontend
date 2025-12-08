# LibraryHub Frontend

Simple React app (CRA) for managing authors, books, users, and borrowing.

# Run locally (no Docker)
Prereqs: Node 18+, npm  
1) Install deps: `npm install`  
2) Start dev server: `npm start`  
3) Open http://localhost:3000

Backend: expected at http://localhost:4000 (see `src/api.ts`). Change `baseURL` there if your API is elsewhere.

# Run with Docker
Prereqs: Docker, docker-compose  
1) Build image: `docker build -t libraryhub-frontend .`  
2) Run container: `docker run -p 3000:80 libraryhub-frontend`  
3) Open http://localhost:3000
Or, the libraryhub-frontend.tar file can be used to run, to skip building the image.
1) Load the image :`docker load -i libraryhub-frontend.tar`
2) Run the image:  `docker run -d -p 3000:80 --name libraryhub-frontend libraryhub-frontend`


# Assumptions and design notes
- Auth: token in `localStorage` with `Authorization: Bearer <token>`. 401 responses clear the token and redirect to `/login`.
- Routing: React Router v6; `ProtectedRoute` guards private pages.
- Data: contexts per domain (authors, books, users, borrow) using axios. Cross-page freshness via custom events (`booksChanged`, `authorsChanged`, etc.) plus cache invalidation in contexts.
- Borrow cache: cleared on book/author changes so borrowed lists show updated titles/authors without manual refresh.
- UI: CRA + plain CSS. Headings share the purple underline accent used across pages. No heavy design system.

