# Research: Authentication System Backend

This document outlines the decisions made to resolve the open questions from the implementation plan.

## 1. Backend Framework and OAuth2 Library

**Decision**:
-   **Framework**: `FastAPI` (Python)
-   **OAuth2/OIDC Library**: `Authlib`

**Rationale**:
-   `FastAPI` is a modern, fast (high-performance) web framework for building APIs with Python, based on standard Python type hints. As requested by the user, its performance, automatic interactive API documentation, and asynchronous support make it an excellent choice for the authentication backend.
-   `Authlib` is a comprehensive authentication and OAuth library for Python. It provides a solid foundation for implementing the required OAuth2/OIDC flows and integrating with various identity providers.

**Alternatives considered**:
-   **Express.js (Node.js)**: A minimal and flexible Node.js framework. This was the initial suggestion but has been superseded by the user's choice of FastAPI.
-   **Django RF (Python)**: Another powerful Python framework for building APIs. FastAPI was chosen for its modern async capabilities and performance in this context.

## 2. Session and Token Storage

**Decision**:
-   **Storage**: `NeonDB` (Serverless PostgreSQL)
-   **ORM**: `SQLModel` (which combines SQLAlchemy and Pydantic)

**Rationale**:
-   Per user request, the project will use NeonDB. As a serverless PostgreSQL provider, it offers the benefits of a robust, relational database without the overhead of managing a traditional database server.
-   PostgreSQL is well-suited for storing user session data and related entities, providing strong consistency and the ability to perform complex queries if needed in the future.
-   `SQLModel` is the ideal ORM for this project. It is designed for FastAPI by the same creator and simplifies interaction with the SQL database by combining SQLAlchemy's power with Pydantic's data validation. This will allow us to define our database schema as simple Python objects.

**Alternatives considered**:
-   **Redis**: The previous choice. While excellent for performance, the user has opted for a relational, serverless solution with NeonDB.
-   **Direct SQLAlchemy**: Using SQLAlchemy directly is powerful but more verbose than SQLModel. SQLModel provides a more modern, type-hinted developer experience that perfectly complements FastAPI.