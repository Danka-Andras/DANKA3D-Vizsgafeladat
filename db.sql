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


INSERT INTO products (name, description, price, stock, color, image_url) 
VALUES 
('3D Nyomtatott Egérpad', 'Kiváló minőségű 3D nyomtatott egérpad, ergonomikus kialakítással.', 5832.35, 50, 'fekete', 'https://th.bing.com/th/id/R.3bc85f732f7580d342ce5c86648f4187?rik=WG41pOsX%2b1c7oQ&riu=http%3a%2f%2fwww.aniel-wallpapers.hu%2fcicak1%2fcica_kutya_04.jpg&ehk=uNbGIKtyJJc8Nzs1E0%2bbOMcVa4EP4p2426p4%2f6aqkDo%3d&risl=&pid=ImgRaw&r=0'),
('3D Nyomtatott Tárgytartó', 'Praktikus tároló mindenféle apróságoknak, stílusos 3D nyomtatott design.', 9307.50, 30, 'fehér', 'https://th.bing.com/th/id/R.3bc85f732f7580d342ce5c86648f4187?rik=WG41pOsX%2b1c7oQ&riu=http%3a%2f%2fwww.aniel-wallpapers.hu%2fcicak1%2fcica_kutya_04.jpg&ehk=uNbGIKtyJJc8Nzs1E0%2bbOMcVa4EP4p2426p4%2f6aqkDo%3d&risl=&pid=ImgRaw&r=0'),
('3D Nyomtatott Kulcstartó', 'Egyedi, személyre szabható kulcstartó különböző színekben.', 2186.35, 100, 'piros', 'https://th.bing.com/th/id/R.3bc85f732f7580d342ce5c86648f4187?rik=WG41pOsX%2b1c7oQ&riu=http%3a%2f%2fwww.aniel-wallpapers.hu%2fcicak1%2fcica_kutya_04.jpg&ehk=uNbGIKtyJJc8Nzs1E0%2bbOMcVa4EP4p2426p4%2f6aqkDo%3d&risl=&pid=ImgRaw&r=0'),
('3D Nyomtatott Ékszer', 'Elegáns 3D nyomtatott ékszerek egyedi dizájnokkal.', 18250.00, 10, 'arany', 'https://th.bing.com/th/id/R.3bc85f732f7580d342ce5c86648f4187?rik=WG41pOsX%2b1c7oQ&riu=http%3a%2f%2fwww.aniel-wallpapers.hu%2fcicak1%2fcica_kutya_04.jpg&ehk=uNbGIKtyJJc8Nzs1E0%2bbOMcVa4EP4p2426p4%2f6aqkDo%3d&risl=&pid=ImgRaw&r=0'),
('3D Nyomtatott USB Tartó', 'Praktikus USB tartó 3D nyomtatott változatban.', 4743.35, 75, 'szürke', 'https://th.bing.com/th/id/R.3bc85f732f7580d342ce5c86648f4187?rik=WG41pOsX%2b1c7oQ&riu=http%3a%2f%2fwww.aniel-wallpapers.hu%2fcicak1%2fcica_kutya_04.jpg&ehk=uNbGIKtyJJc8Nzs1E0%2bbOMcVa4EP4p2426p4%2f6aqkDo%3d&risl=&pid=ImgRaw&r=0');



