CREATE DATABASE IF NOT EXISTS danka3d;

USE danka3d;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    color VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, stock, color, image_url) 
VALUES 
('3D Nyomtatott Egérpad', 'Kiváló minőségű 3D nyomtatott egérpad, ergonomikus kialakítással.', 15.99, 50, 'fekete', 'https://example.com/images/mousepad.jpg'),
('3D Nyomtatott Tárgytartó', 'Praktikus tároló mindenféle apróságoknak, stílusos 3D nyomtatott design.', 25.50, 30, 'fehér', 'https://example.com/images/storage.jpg'),
('3D Nyomtatott Kulcstartó', 'Egyedi, személyre szabható kulcstartó különböző színekben.', 5.99, 100, 'piros', 'https://example.com/images/keychain.jpg'),
('3D Nyomtatott Ékszer', 'Elegáns 3D nyomtatott ékszerek egyedi dizájnokkal.', 50.00, 10, 'arany', 'https://example.com/images/jewelry.jpg'),
('3D Nyomtatott USB Tartó', 'Praktikus USB tartó 3D nyomtatott változatban.', 12.99, 75, 'szürke', 'https://example.com/images/usb-holder.jpg');

ALTER TABLE Product ADD COLUMN CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP;


