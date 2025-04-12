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

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);



INSERT INTO products (name, description, price, stock, color, image_url) 
VALUES 
('Macska', 'Szőrős', 100000, 1, 'fekete', 'https://th.bing.com/th/id/R.3bc85f732f7580d342ce5c86648f4187?rik=WG41pOsX%2b1c7oQ&riu=http%3a%2f%2fwww.aniel-wallpapers.hu%2fcicak1%2fcica_kutya_04.jpg&ehk=uNbGIKtyJJc8Nzs1E0%2bbOMcVa4EP4p2426p4%2f6aqkDo%3d&risl=&pid=ImgRaw&r=0'),
('Húsvéti ajtódísz (jobb oldal)', 'Kiváló minőségű 3D nyomtatott ajtódísz.', 2000, 100, 'fehér', 'http://localhost:5277/images/husvetiajtodisz.jpg'),
('Húsvéti ajtódísz (bal oldal)', 'Kiváló minőségű 3D nyomtatott ajtódísz.', 2500, 80, 'fehér', 'http://localhost:5277/images/husvetiajtodisz2.jpg'),
('Húsvéti kosár', 'Kiváló minőségű 3D nyomtatott kosár.', 3000, 50, 'kék', 'http://localhost:5277/images/husvetikosar.jpg'),
('Húsvéti nyulak', 'Kiváló minőségű 3D húsvéti nyulak.', 1500, 50, 'fehér, barna', 'http://localhost:5277/images/husvetinyulak.jpg'),
('Húsvéti meglepetés tojás', 'Kiváló minőségű 3D nyomtatott meglepetés tojás.', 1500, 100, 'fehér', 'http://localhost:5277/images/meglepetestojas.jpg'),
('Húsvéti kép kirakó', 'Kiváló minőségű 3D nyomtatott kép kirakó.', 2500, 80, 'fekete', 'http://localhost:5277/images/nyulaskirako.jpg'),
('Húsvéti nyúl dísz', 'Kiváló minőségű 3D nyomtatott dísz.', 1000, 100, 'piros', 'http://localhost:5277/images/nyuldisz.jpg'),
('Húsvéti tojás tartó', 'Kiváló minőségű 3D nyomtatott tojás tartó.', 800, 100, 'rózsaszín', 'http://localhost:5277/images/nyultojas.jpg'),
('Húsvéti répatartó dísz (2 darab)', 'Kiváló minőségű 3D nyomtatott répatartó dísz.', 2000, 50, 'barna', 'http://localhost:5277/images/repatarto2.jpg'),
('Húsvéti répatartó dísz (4 darab)', 'Kiváló minőségű 3D répatartó dísz.', 3500, 50, 'barna', 'http://localhost:5277/images/repatarto4.jpg'),
('Húsvéti birka dísz', 'Kiváló minőségű 3D nyomtatott birka dísz.', 1500, 40, 'fehér', 'http://localhost:5277/images/szerelmesbirkak.jpg');

