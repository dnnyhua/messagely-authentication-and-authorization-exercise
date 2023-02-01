DROP DATABASE IF EXISTS messagely;
CREATE DATABASE messagely;

\c messagely;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);


-- INSERT INTO users
--     VALUES ('jellyfishking','spongebob','squarepants','408-777-7777', current_timestamp, current_timestamp),
--            ('johnnybravo','johnny','bravo','408-888-8888', current_timestamp, current_timestamp);


-- INSERT INTO messages
--     VALUES ('jellyfishking', 'johnnybravo', 'nickelodean is better', '2023-01-23 16:06:22', '2023-01-23 18:00:00' ),
--            ('johnnybravo', 'jellyfishking', 'my hair is better', '2023-01-23 18:00:02', '2023-01-23 19:00:00' )