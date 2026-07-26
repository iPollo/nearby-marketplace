-- V1__init_schema.sql
-- Initial schema for Nearby Marketplace

-- ============================
-- Cities (fixed coordinates, used for lightweight geolocation search)
-- ============================
CREATE TABLE cities (
                        id BIGSERIAL PRIMARY KEY,
                        name VARCHAR(120) NOT NULL,
                        state VARCHAR(2) NOT NULL,
                        latitude DOUBLE PRECISION NOT NULL,
                        longitude DOUBLE PRECISION NOT NULL
);

CREATE UNIQUE INDEX idx_cities_name_state ON cities (name, state);

-- ============================
-- Users
-- ============================
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(150) NOT NULL,
                       email VARCHAR(180) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       city_id BIGINT NOT NULL REFERENCES cities(id),
                       created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_users_email ON users (email);

-- ============================
-- Categories
-- ============================
CREATE TABLE categories (
                            id BIGSERIAL PRIMARY KEY,
                            name VARCHAR(80) NOT NULL
);

CREATE UNIQUE INDEX idx_categories_name ON categories (name);

-- ============================
-- Listings (the actual items for sale)
-- ============================
CREATE TABLE listings (
                          id BIGSERIAL PRIMARY KEY,
                          title VARCHAR(150) NOT NULL,
                          description TEXT,
                          price NUMERIC(12, 2) NOT NULL,
                          status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                          category_id BIGINT NOT NULL REFERENCES categories(id),
                          city_id BIGINT NOT NULL REFERENCES cities(id),
                          seller_id BIGINT NOT NULL REFERENCES users(id),
                          created_at TIMESTAMP NOT NULL DEFAULT now(),
                          updated_at TIMESTAMP NOT NULL DEFAULT now(),

                          CONSTRAINT chk_listing_status CHECK (status IN ('ACTIVE', 'SOLD', 'INACTIVE')),
                          CONSTRAINT chk_listing_price CHECK (price >= 0)
);

CREATE INDEX idx_listings_city ON listings (city_id);
CREATE INDEX idx_listings_category ON listings (category_id);
CREATE INDEX idx_listings_seller ON listings (seller_id);
CREATE INDEX idx_listings_status ON listings (status);

-- ============================
-- Listing images (a listing can have multiple photos)
-- ============================
CREATE TABLE listing_images (
                                id BIGSERIAL PRIMARY KEY,
                                listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
                                image_url VARCHAR(500) NOT NULL,
                                is_main BOOLEAN NOT NULL DEFAULT false,
                                created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_listing_images_listing ON listing_images (listing_id);

-- ============================
-- Seed data: a starter set of Brazilian cities
-- ============================
INSERT INTO cities (name, state, latitude, longitude) VALUES
                                                          ('Porto Alegre', 'RS', -30.0346, -51.2177),
                                                          ('São Paulo', 'SP', -23.5505, -46.6333),
                                                          ('Rio de Janeiro', 'RJ', -22.9068, -43.1729),
                                                          ('Curitiba', 'PR', -25.4284, -49.2733),
                                                          ('Florianópolis', 'SC', -27.5954, -48.5480),
                                                          ('Belo Horizonte', 'MG', -19.9167, -43.9345);

-- ============================
-- Seed data: starter categories
-- ============================
INSERT INTO categories (name) VALUES
                                  ('Eletrônicos'),
                                  ('Móveis'),
                                  ('Roupas e Acessórios'),
                                  ('Veículos'),
                                  ('Esportes e Lazer'),
                                  ('Livros e Papelaria'),
                                  ('Outros');