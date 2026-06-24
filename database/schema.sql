-- Reference schema for the Store Rating Platform.
-- Note: the Node backend creates these tables automatically via Sequelize
-- (sequelize.sync()) when the server starts, or when you run `npm run seed`.
-- This file is provided for documentation / manual setup and to show the
-- schema design follows normalized, constraint-driven best practices.

CREATE TYPE user_role AS ENUM ('admin', 'user', 'owner');

CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(6)  NOT NULL CHECK (char_length(name) >= 2),
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    address     VARCHAR(40) NOT NULL,
    role        user_role    NOT NULL DEFAULT 'user',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE stores (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(6)  NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    address     VARCHAR(400) NOT NULL,
    owner_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE ratings (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id    INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- A user may only submit ONE rating per store (they can edit it afterwards)
    UNIQUE (user_id, store_id)
);

-- Helpful indexes for filtering / sorting / searching
CREATE INDEX idx_users_role     ON users (role);
CREATE INDEX idx_users_name     ON users (name);
CREATE INDEX idx_stores_name    ON stores (name);
CREATE INDEX idx_stores_address ON stores (address);
CREATE INDEX idx_ratings_store  ON ratings (store_id);
CREATE INDEX idx_ratings_user   ON ratings (user_id);
