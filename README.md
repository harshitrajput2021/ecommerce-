# E-Commerce Application

A full-stack e-commerce web application built with Spring Boot and React.

## 🗄️ Database Schema

```mermaid
erDiagram
    users ||--|| carts : "has one"
    users ||--o{ orders : "places many"
    carts ||--o{ cart_items : "contains many"
    products ||--o{ cart_items : "in many carts"
    orders ||--o{ order_items : "contains many"
    products ||--o{ order_items : "in many orders"

    users {
        BIGINT id PK
        VARCHAR name
        VARCHAR email UK
        VARCHAR password_hash
    }

    products {
        BIGINT id PK
        VARCHAR name
        DECIMAL price
        INT stock_quantity
    }

    carts {
        BIGINT id PK
        BIGINT user_id FK
    }

    cart_items {
        BIGINT id PK
        BIGINT cart_id FK
        BIGINT product_id FK
        INT quantity
    }

    orders {
        BIGINT id PK
        BIGINT user_id FK
        DECIMAL total_price
    }

    order_items {
        BIGINT id PK
        BIGINT order_id FK
        BIGINT product_id FK
        INT quantity
        DECIMAL unit_price
    }
```
